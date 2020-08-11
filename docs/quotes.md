# Quoted Code

A quoted code block `'{ ... }` is syntactacaly similar to a string quote `" ... "` with the diffecence that the fist contains typed code.
To insert a code into other code we use the `$expr` or `${ expr }` where `expr` is of type `Expr[T]`.
Intuitively, the code directly within the quote is not excecuted now, while the code within the splices is evaluated and their results are then spliced int the sourounding expression.

```scala
val msg = Expr("Hello")
val printHello = '{ print($hello) }
println(printHello.show) // print("Hello")
```

In general, the quote delays the excecution while the splice makes it happen before the sourounding code.
This generalization allows us to also give meeining to a `${ .. }` that is not within a quote, this evaluate the code within the splice at compile-time and place the result in the generated code.
Due to some thechincal considerations we only allow it directly within `inline` definitions that we call a [macro][macros].

It is possible to write a quote within a quote, but usually when we write macros we do not encounter such code.

## Level consitency
One cannot simple write any arbitrary code within quotes and within splices.
A part of the program will live at compile-time and the other will live at runtime.
Consider the folllowing ill-consturucted code.

```scala
def myBadCounter1(using QuoteContext): Expr[Int] = {
  var x = 0
  '{ x += 1; x }
}
```
The problem with this code is that `x` exists durring compilation, but then we try to use it after the compiler has finished (maybe even in another machine).
Clearly it would be impossible to access its value and update it.

Now consider the dual version, where we define the variable at runtime and try to access it at compile-time.
```scala
def myBadCounter2(using QuoteContext): Expr[Int] = '{
  var x = 0
  ${ x += 1; 'x }
}
```
Clearly, this should work as the variable does not exist yet.
To make sure you can only write programs that do not contain these kinds of probems we restrict the set of references to variable and other definitions.

We introduce _levels_ as a count of the number of quotes minus the number of splices surrounding an expression or definition.

```scala
// level 0
'{ // level 1
  var x = 0
  ${ // level 0
    x += 1 
    'x // level 1 
  }
}
```

The system will allow at any level references to global definitions such as `println`, but will restrict refrences to local definitions.
A local definition can only be accessed if it is defined a the same level as its reference.
This will catch the errors in `myBadCounter1` and `myBadCounter2`.

Eventhoug we cannot rever to variable inside of a quote, we can still pass its current value to it by lifting the value to an expression using `Expr.apply`.

## Generics
*Coming soon*

## Liftables
The `Expr.apply` method uses intances of `Liftable` to perform the lifting.
```scala
object Expr:
  def apply[T](x: T)(using qctx: QuoteContext, lift: Liftable[T]): Expr[T] = lift.toExpr(x)
```

`Liftable` is defined as follows:
```scala
trait Liftable[T]:
  def toExpr(x: T): QuoteContext ?=> Expr[T]
```

The `toExpr` method will take a value `T` and generate code that will construct a copy of this value at runtime.

We can define our own `Liftable`s like:
```scala
given Liftable[Boolean] = new Liftable[Boolean] {
  def toExpr(x: Boolean) =
    if x then '{true}
    else '{false}
}

given Liftable[StringContext] = new Liftable[StringContext] {
  def toExpr(x: StringContext) =
    val parts = Varargs(stringContext.parts.map(Expr(_)))
    '{ StringContext($parts: _*) }
}
```


## Quoted patterns
*Coming soon*

## Unliftables
*Coming soon*

## The QuoteContext
*Coming soon*

## Beta-reduction
*Coming soon*

## Expr.summon
*Coming soon*

⮕ [Continue to TASTy Reflection][tasty]

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
