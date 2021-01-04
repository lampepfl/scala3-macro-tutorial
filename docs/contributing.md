---
id: contributing
title: Contributing
---

We are starting to write the initial draft of the macro tutorial. 
Help improving text that has been written so far would be helpful at this point.
Another extremely valuable addition would be to update the [migration status][migration-status].

This tutorial will cover all that is needed to start writing macros. 
The first part (M-1) will cover `inline`, the second part (M-2) will cover macros and quoted expressions and the third part (M-3) will cover how to use the TASTy reflection API.
Additionally, we will include a cross-compilation/migration guide (M-A).

* M-A Cross-compilation (in progress)
  * Update/complete [migration status][migration-status] (help needed)
  * Write [cross-compilation][cross-compilation]
  * Create simple example projects in SBT and Mill
* M-1 Inline tutorial
  * Write [inline tutorial][inline] (in progress)
  * Write [scala.compiletime tutorial][compiletime]: Each feature or group of featurs will need a section
* M-2 Macro tutorial (not started)
  * Write [macros tutorial][macros]: Understanding relation between inline and quoted expressions
  * Write [quoted expressions tutorial][quotes]: Dive deep into all quoted expression features
* M-3 TASTy reflect API (not started)
  * Write [TASTy reflection tutorial][tasty] (not started): How to access it and the relation with quoted expressions
  * Complete [TASTy reflect API][reflection-api] docs (help needed)

## How can I contribute?

* Confused about something in the tutorial: Open an issue
* Update migration guide: Create a PR
* Typos and other text enhancements: Create a PR
* What to add something new or a change in scope: Open an issue
* Update migration guide: Create a PR


[best-practices]: best-practices.md
[compiletime]: tutorial/compiletime.md
[cross-compilation]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/migrating-macros.html#defining-a-project-that-cross-compiles-macros
[faq]: faq.md
[inline]: tutorial/inline.md
[macros]: tutorial/macros.md
[migration-status]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html
[quotes]: tutorial/quotes.md
[references]: references.md
[tasty]: tutorial/reflection.md
[reflection-api]: https://github.com/lampepfl/dotty/blob/master/library/src/scala/tasty/Reflection.scala
