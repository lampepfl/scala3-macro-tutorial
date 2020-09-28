---
id: introduction
title: Introduction
---

This tutorial covers all the features involved in writing macros in Scala 3.
The metaprogramming API of Scala 3 is designed in layers to gradually
support different levels of use-cases. Each successive layer exposes additional
abstractions and offers more fine-grained control.

- As a starting point, the new [`inline` feature](inline) allows some abstractions
  (values and methods) to be marked as statically reducible. It can be used to
  optimize performance by specializing code and also provides the entry point
  for macros.

- [Compile-time operations](compile-time-operations) offer additional metaprogramming
  utilities that can be used within `inline` methods (for example to improve error reporting),
  without having to define a macro.

- Starting from `inline`-methods, [macros](scala-3-macros) are programs that
  explicitly operate on trees of programs.

- Macros can be defined in terms of a _high-level_ API of [quoted expressions](quoted-code),
  that admits simple construction and deconstruction of programs.

- Macros can also be defined in terms of a more _low-level_ API of [TASTy Reflection](tasty-reflection),
  that allows detailed inspection of programs.


> 🚧 We are still in the process of writing the tutorial. You can [help us improve it][contributing] 🚧

[inline]: tutorial/inline.md
[contributing]: contributing.md
