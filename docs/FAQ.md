# FAQ

## How do I ...?
**Coming soon**

## Which should I use `Expr(...)` or `'{...}`?
If you can write your code using `Expr(...)`, you will evaluate more at compile time.
Only use `'{...}` if you really need to evaluate the code later at runtime, usually because it depends on runtime values.

## Which is better between `Expr(true)` or `'{true}`?
All quotes containg a value of a primitive type is optimized to an `Expr.apply`.
Choose one in your project and stick with a single notation to avoid confusion.




