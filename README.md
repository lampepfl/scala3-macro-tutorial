# Scala 3 Macro Tutorial

This tutorial covers all the features involved in writing macros in Scala 3.
Visit [the website](https://lampepfl.github.io/scala3-macro-tutorial/) to learn more about it.
We will start with the new `inline` feature which is the entry point of all macros.
We also cover some meetaprogramming features that can be used with `inline`.
Then we learn how to create a macro using `inline` and quoted expressions.
We will have a look at the _quoted expressions_ API and how to use them.
Finally, for those macros that need a bit more than expression, we will learn how to access thier typed AST.

🚧 We are still in the process of writing the turorial. You can [help us improve it](/CONTRIBUTING.md) 🚧

⮕ [Start tutorial][inline]

## Chapters
 * [Inline Tutorial][inline]
 * [Macros][macros]
 * [Quoted expressions Tutorial][quotes]
 * [TASTy Reflection Tutorial][tasty]
 
## Other
 * [Best practices][best-practices]
 * [FAQ][faq]
 * [`scala.compiletime`][compiletime]

# Other resources

## Scala 2 migration
 * [Scala 2 migration and cross-compilation][migration]
 * [Migration status][migration-status]

## Dotty documentation
- [Dotty Documentation](https://dotty.epfl.ch/docs/reference/metaprogramming/toc.html)
- [Macros: The Plan For Scala 3](https://www.scala-lang.org/blog/2018/04/30/in-a-nutshell.html)
- [Examples](https://github.com/lampepfl/dotty-macro-examples) - a repository with small, self-contained examples of various tasks done with Dotty macros.

## Talks
* [Scala Days - Metaprogramming in Dotty](https://www.youtube.com/watch?v=ZfDS_gJyPTc)

## Projects and examples
* [dotty-macro-examples](https://github.com/lampepfl/dotty-macro-examples)
* [XML Interpolator](https://github.com/dotty-staging/xml-interpolator/tree/master)
* [Shapeless 3](https://github.com/dotty-staging/shapeless/tree/shapeless-3)
* *More Coming soon*


 
[best-practices]: /docs/best-practices.md
[compiletime]: /docs/compiletime.md
[migration]: https://github.com/scalacenter/scala-3-migration-guide/blob/master/docs/macros.md#how-to
[faq]: /docs/faq.md
[inline]: /docs/inline.md
[macros]: /docs/macros.md
[migration-status]: https://github.com/scalacenter/scala-3-migration-guide/blob/master/docs/macros.md#migration-status
[quotes]: /docs/quotes.md
[references]: /docs/references.md
[tasty]: /docs/tasty-reflection.md
