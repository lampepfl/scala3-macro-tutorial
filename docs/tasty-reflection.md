# TASTy Reflection

The reflection API provides a more complex and comprehensive view on the structure of the code.
It provides a view on the *Typed Abstract Syntax Trees* **TASTy** and their properties such as types, symbols, positions and comments.

## How to use the API

Accessing this API need and import that depends the current `QuoteContext`.
We can use `scala.quoted.qctx` to import it.

```scala
def pow(x: Expr[Int])(using QuoteContext): Expr[Int] = {
  import qctx.tasty._ // Import Tree, Type, Symbol, Position, .....
  ...
}
```

This will import all the types and modules (with extension methods) of the API.

The full imported API can be found here:
* [Types hierarchy definitions](https://dotty.epfl.ch/api/scala/tasty/reflect/Types.html)
* [Modules and other useful methods](https://dotty.epfl.ch/api/scala/tasty/Reflection.html)

For example to find what is a `Term`, we can see in the hireachy that it is a subtype of `Statement` which is a subtype of `Tree`.
If we look into the [module of `Term`](http://dotty.epfl.ch/api/scala/tasty/Reflection/Term$.html) we will find all the extension methods that are defined for `Term` such as `Term.tpe` which returns a `Type`.
As it is a subtype of `Tree` we can also look into the [module of `Tree`](http://dotty.epfl.ch/api/scala/tasty/Reflection/Tree$.html) to find more methods such as `Tree.pos`.

## Relation with expressions
<!-- Term vs Expr -->
<!-- Safty -->
*Coming soon*


## Examples
*Coming soon*
