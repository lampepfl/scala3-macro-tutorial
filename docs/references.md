# References

## Dotty documentation

- [Dotty Documentation](https://dotty.epfl.ch/docs/reference/metaprogramming/toc.html)
- [Macros: The Plan For Scala 3](https://www.scala-lang.org/blog/2018/04/30/in-a-nutshell.html)
- [Examples](https://github.com/lampepfl/dotty-macro-examples) - a repository with small, self-contained examples of various tasks done with Dotty macros.

## Talks
* [Scala Days - Metaprogramming in Dotty](https://www.youtube.com/watch?v=ZfDS_gJyPTc)

## Projects and examples
* [dotty-macro-examples](https://github.com/lampepfl/
* *More Coming soon*
dotty-macro-examples)
* [XML Interpolator](https://github.com/dotty-staging/xml-interpolator/tree/master)
* [Shapeless 3](https://github.com/dotty-staging/shapeless/tree/shapeless-3)
* *More Coming soon*

## Migration status

Here is an incomplete list of libraries that use Scala 2 macros and their migration status:

<!-- TODO use a table -->
* [sourcecode](https://github.com/lihaoyi/sourcecode) – cross-compiles to Scala 2 and Scala 3
* [utest](https://github.com/lihaoyi/utest) – cross-compiles to Scala 2 and Scala 3
* [intent](https://github.com/factor10/intent) - compiles to Scala 3
* [xml-interpolator](https://github.com/lampepfl/xml-interpolator) - compiles to Scala 3
* [Shapeless 3](https://github.com/dotty-staging/shapeless/tree/shapeless-3) compiles to Scala 3
* [expression-evaluator](https://github.com/plokhotnyuk/expression-evaluator) - not migrated, no replacement for `Evals.eval` 
* [jsoniter-scala](https://github.com/plokhotnyuk/jsoniter-scala) - not migrated, no replacement for `Evals.eval`
* [minitest](https://github.com/dotty-staging/minitest) - ported to Scala 3 in the Dotty community build but not merged to upstream
* [munit](https://github.com/dotty-staging/munit) - ported to Scala 3 in the Dotty community build but not merged to upstream
* [scalatest](https://github.com/dotty-staging/scalatest) - ported to Scala 3 in the Dotty community build but not merged to upstream
* [scodec-bits](https://github.com/dotty-staging/scodec) - ported to Scala 3 in the Dotty community build but not merged to upstream
* *More coming soon*