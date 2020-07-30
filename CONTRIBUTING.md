# Contributing

We are starting to write the initial draft of the macro tutorial. 
Help improving text that has been written so far would be helpful at this point.
Another extreamely valuable addition would be to update the [migration status][migration-status].

This tutorial will cover all that is needed to start writing macros. 
The first part (M-1) will cover `inline`, the second part (M-2) will cover macros and quoted expressions and the third part (M-3) will cover how to use the TASTy reflection API.
Additionally, we will include a cross-compilation/migration guide (M-A).

* M-A Cross-compilation (in progress)
  * Update/complete [migration status][migration-status] (help needed)
  * Write [cross-compilation][cross-compilation]
  * Create simple example projects in SBT and Mill
* M-1 Inline tutorial
  * Write [inline turorial][inline] (in progress)
  * Write [scala.compiletime tutorial][compiletime]: Each feature or group of featurs will need a section
* M-2 Macro turorial (not started)
  * Write [macros turorial][macros]: Understanding relation between inline and quoted expressions
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
[reflection-api]: https://github.com/lampepfl/dotty/blob/master/library/src/scala/tasty/Reflection.scala
