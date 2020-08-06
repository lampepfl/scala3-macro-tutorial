# Scala 3 macros

## Inline and macros

Let us start simple, we will define a macro that will compute `xⁿ` for a known values `x` and `n`.

```scala
import scala.quoted._

inline def power(inline x: Double, inline n: Int) = 
  ${ evalPowerCode('x, 'n)  }

def evalPowerCode(x: Expr[Double], n: Expr[Int])(using QuoteContext): Expr[Double] = ...
```
All macros are defined with an `inline def` and their bodies contain a splice `${ ... }` in their implementation.
Then the macros have a single call to a method that will generate the code that will replace the call to the macro.
This method will receive the parameters with a quote `'` and a contextual `QuoteContext`.
The `scala.quoted.Expr[T]` represents the code of some expression.
We will dig deeper into these concepts later.

If the macro has type parameters, the implementation will also need to know about them.
This is done with a contextual `scala.quoted.Type[T]`.

```scala
inline def logged[T](inline x: T): T = 
  ${ loggedCode('x)  }

def loggedCode[T](x: Expr[T])(using Type[T])(using QuoteContext): Expr[T] = ...
```

### Compilation vs interpretation
A key difference between inlining and macros is the way they are evaluated.
Inlining works by replacing code and then optimizing based on rules the compiler knows; on the other hand, a macro will execute user-written code that will generate the code that the macro expands to.
The inlined code `${ evalPowerCode('x, 'n)  }` is interpreted and will call through Java reflection the method `evalPowerCode`, then the method will execute as normal code.

### Macro compilation and suspension
As we need to execute `evalPowerCode` we need to compile its code first.
Therefore we cannot define and use a macro in the same class/file.
It is possible to have the macro definition and its call in the same project as long as the implementation of the macro can be compiled first.
This is made possible by only expanding macros when the macro has been compiled, otherwise, the compilation of the file is suspended.
Suspended files are compiled once all non suspended files are compiled.
In some cases, you will have cyclic dependencies that will block the completion of the compilation.
To get more information on which files are suspended you can use the `-Xprint-suspension` compiler flag.

## Simple Expressions

A `scala.quoted.Expr[T]` contains the code of an expression of type `T`.

We could implement `evalPowerCode` as follows:
```scala
def evalPowerCode(x: Expr[Double], n: Expr[Int])(using QuoteContext): Expr[Double] =
  def pow(x: Double, n: Int): Double =
    if n == 0 then 1 else pow(x, n - 1)
  val value: Double = pow(n.unliftOrError, n.unliftOrError)
  Expr(value)
```

The `pow` operation simply computes the value of `xⁿ`.
The interesting part is how we create and look into the `Expr`s.

Lets first look at `Expr(value)`.
This will return an expression containing the code representing that value.
This will work for all primitive types, tuples of any arity, `Class`, `Array`, `Seq`, `Set`, `List`, `Map`, `Option`, `Either`, `BigInt`, `BigDecimal`.
Other types can also work if a `Liftable` is implemented for it, we will [see this later](#Liftables).

The second operation we used if the `unliftOrError` on and `Expr[T]` which will do the opposite operation.
If the expression contains the code of value it will return this value, otherwise, it will throw a special exception that will stop the macro expansion and report an error saying that the code did not correspond to value.

We could also use the `unlift` operation which will return an `Option`.
This way we can report the error with a custom error message.

```scala
  ...
  (x.unlift, n.unlift) match
    case (Some(base), Some(exponent)) => pow(base, exponent)
    case (Some(_), _) => report.error("Exprected a know value for the exponent, but was " + n.show, n)
    case _ => report.error("Exprected a know value for the base, but was " + x.show, x)
```

Alternatively, we can also use the `Unlifted` extractor

```scala
  ...
  (x, n) match
    case (Unlifted(base), Unlifted(exponent)) => pow(base, exponent)
    case (Unlifted(_), _) => ...
    case _ => ...
```

`unlift`, `unliftOrError`, and `Unlifted` will work for all primitive types, tuples of any arity, `StringContext`, `Seq`, and `Option`.
Other types can also work if an `Unliftable` is implemented for it, we will [see this later](#Unliftables).


### Const

### Lambda

### VarArgs

## Simple quotes

## Simple patterns

## Quotes and splices
<!-- teaser / ref to other doc -->

### Liftables

### Unliftables

## Types

## Reporting

## The QuoteContext

## Utils

### ExprMap
### Var


⮕ [Continue to Quoted Code][quotes]


[best-practices]: /docs/best-practices.md
[compiletime]: /docs/compiletime.md
[cross-compilation]: /docs/cross-compilation.md
[faq]: /docs/faq.md
[inline]: /docs/inline.md
[macros]: /docs/macros.md
[migration-status]: /docs/migration-status.md
[quotes]: /docs/quotes.md
[references]: /docs/references.md
[tasty]: /docs/tasty-reflection.md
