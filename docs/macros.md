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

### Creating expression with `Expr.apply`

Lets first look at `Expr(value)`.
This will return an expression containing the code representing that value.
Here the value is computed at compile-time, at runtime we only need to instasiate this value.

This will work for all _primitive types_, _tuples_ of any arity, `Class`, `Array`, `Seq`, `Set`, `List`, `Map`, `Option`, `Either`, `BigInt`, `BigDecimal`, `StringContext`.
Other types can also work if a `Liftable` is implemented for it, we will [see this later](#Liftables).

### Extracting vaues out of expressions

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

`unlift`, `unliftOrError`, and `Unlifted` will work for all _primitive types_, _tuples_ of any arity, , `Option` `Seq`, `Set`, `Map`, `Either` and `StringContext`.
Other types can also work if an `Unliftable` is implemented for it, we will [see this later](#Unliftables).


### Showing expressions

Expression `Expr` can be converted to a string representation of the source using `.show` method.
This might be useful for example to debug some code:
```scala
def debugEvalPowerCode(x: Expr[Double], n: Expr[Int])(using QuoteContext): Expr[Double] =
  println(
    s"""evalPowerCode
       |  x := ${x.show}
       |  n := ${n.show}""".stripMargin)
  val code = evalPowerCode(x, n)
  println(s"  code := ${code.show}")
  code
```


### Working with varargs

Varargs in are represented with `Seq`, hence when we write a macro with a _vararg_ we will pass it as an `Expr[Seq[T]]`.
It is possible to recover each individual argument using the `scala.quoted.Varargs` extractor.

```scala
import scala.quoted._

inline def sumNow(inline numbers: Int*): Int =
  ${ evalSumCode('numbers)  }

def evalSumCode(numbersExpr: Expr[Seq[Int]])(using QuoteContext): Expr[Int] =
  numbersExpr match
    case  Varargs(numberExprs) => // numberExprs: Seq[Expr[Int]]
      val numbers: Seq[Int] = numberExprs.map(_.unliftOrError)
      Expr(numbers.sum)
    case _ => report.error("Expected explicit agument. Notation `agrs: _*` is not supported.", numbersExpr)
```

The extractor will match a call to `sumNow(1, 2, 3)` and extract a `Seq[Expr[Int]]` containing the code of each parameter.
But, if we try to match the argument of the call `sumNow(nums: _*)`, the extractor will not match.

`Varargs` can also be used as a constructor, `Varargs(Expr(1), Expr(2), Expr(3))` will return a `Expr[Seq[Int]]`.
We will see how this can be useful later.


## Constucting complex expressions

### Collections

We have seen how to convert a `List[Int]` into an `Expr[List[Int]]` using `Expr.apply`.
How about converting a `List[Expr[Int]]` into `Expr[List[Int]]`?
We mentioned that `Varargs.apply` can do this for sequences, but other methods are available.

* `Expr.ofList`: Transform a `List[Expr[T]]` into `Expr[List[T]]`
* `Expr.ofSeq`: Transform a `List[Expr[T]]` into `Expr[List[T]]` (just like `Varargs`)
* `Expr.ofTupleFromSeq`: Transform a `Seq[Expr[T]]` into `Expr[Tuple]`
* `Expr.ofTuple`: Transform a `(Expr[T1], ..., Expr[Tn])` into `Expr[(T1, ..., Tn)]`

### Simple Blocks

`Expr.block` provides a simple way to create a block of code `{ stat1; ...; statn; expr }`.
Its first arguments is a list with all the statements and the second argument is the expession at the ind of the block.

```scala
inline def test(inline ignore: Boolean, computation: => Unit): Boolean =
  ${ testCode('ignore, 'computation) }

def testCode(ignore: Expr[Boolean], computation: Expr[Unit]): Expr[Boolean] =
  if ignore.unliftOrError then Expr(false)
  else Expr.block(List(computation), Expr(true))
```

This is useful when we whant to generate code contatining several side effects.

### Arbitrary expresions

Last but not least, it is possible to create an `Expr[T]` arbirtary code in it using quotes.
The quote syntax `'{ ... }`  provides a way to write an arbirtaty `Expr[T]`.
For exmaple `'{ doSomething(); getIntResult() }` will generate an `Expr[Int]` that will contain the code that is with the quoted block.


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
