---
id: introduction
title: Introduction
---
> The macro tutorial has been moved to [docs.scala-lang.org][scala-lang] and this page is no longer updated.

This tutorial covers all the features involved in writing macros in Scala 3.

The metaprogramming API of Scala 3 is designed in layers to gradually
support different levels of use-cases. Each successive layer exposes additional
abstractions and offers more fine-grained control.

- As a starting point, the new [`inline` feature](inline.md) allows some abstractions (values and methods) to be marked as statically reducible. 
  It provides the entry point for macros and other metaprogramming utilities.

- [Compile-time operations](compiletime.md) offer additional metaprogramming utilities that can be used within `inline` methods (for example to improve error reporting), without having to define a macro.

- Starting from `inline`-methods, [macros](macros.md) are programs that explicitly operate on programs.

  - Macros can be defined in terms of a _high-level_ API of [quoted expressions](quotes.md), that admits simple construction and deconstruction of programs expressions.

  - Macros can also be defined in terms of a more _low-level_ API of [TASTy Reflection](reflection.md), that allows detailed inspection of programs.



> The tutorial uses the API of Scala 3.0.0-M3. The API had many small changes in this revision.

[inline]: tutorial/inline.md
[contributing]: contributing.md
[compiletime]: tutorial/compiletime.md
[scala-lang]: https://docs.scala-lang.org/scala3/guides/macros/
