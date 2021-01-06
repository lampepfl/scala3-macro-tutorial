---
id: reflection
title: Reflection API
---
> The macro tutorial has been moved to [docs.scala-lang.org][scala-lang] and this page is no longer updated.

The reflection API provides a more complex and comprehensive view on the structure of the code.
It provides a view on the *Typed Abstract Syntax Trees* **TASTy** and their properties such as types, symbols, positions and comments.

## How to use the API

Accessing this API need and import that depends the current `Quotes`.
We can use `scala.quoted.quotes` to import it.

```scala
def pow(x: Expr[Int])(using Quotes): Expr[Int] = {
  import quotes.reflect._ // Import Tree, Type, Symbol, Position, .....
  val term: Term = x.asTerm
  val pos = term.pos
  ...
}
```

This will import all the types and modules (with extension methods) of the API.

The full imported API can be found here: [Reflection](http://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule.html)

For example to find what is a `Term`, we can see in the hierarchy that it is a subtype of `Statement` which is a subtype of `Tree`.
If we look into the [`TermMethods`](https://dotty.epfl.ch/api/scala/tasty/Reflection/TermMethods.html) we will find all the extension methods that are defined for `Term` such as `Term.tpe` which returns a `Type`.
As it is a subtype of `Tree` we can also look into the [`TreeMethods`](http://dotty.epfl.ch/api/scala/tasty/Reflection/TreeMethods.html) to find more methods such as `Tree.pos`.
Each type also a module with some _static-ish_ methods, for example in the [TypeModule](http://dotty.epfl.ch/api/scala/tasty/Reflection/TypeModule.html) we can find the method `Type.of[T]` with will create an instance of `Type` containing `T`.


## Relation with expressions
<!-- Term vs Expr -->
<!-- Safty -->
*Coming soon*


## Examples
*Coming soon*

[scala-lang]: https://docs.scala-lang.org/scala3/guides/macros/
