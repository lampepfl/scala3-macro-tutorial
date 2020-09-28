---
id: inline
title: Inline
---

Inlining is a common compile-time meta-programming technique for performance optimisations.
Scala 3 makes several improvements related to inlining:

1. It introduces inline as a [soft keyword][soft-modifier].
2. It guarantees that inlining actually happens instead of being best-effort.
3. It introduces operations that are guaranteed to evaluate at compile-time.

## Inline constants

The simplest form of inlining is to inline constants in programs:


```scala
inline val pi = 3.141592653589793
inline val pie = "🥧"
```

The usage of the keyword `inline` above *guarantees* that all references to `pi` and `pie` are inlined:

```scala
val pi2 = pi + pi // val pi2 = 6.283185307179586
val pie2 = pie + pie // val pie2 = "🥧🥧"
```

In the code above, the references `pi` and `pie` are inlined.
Then constant folding optimisation in the compiler will compute the resulting value `pi2` and `pie2` at _compile-time_.

In Scala 2, we would have used the modifier `final` in the definition that is without a return type:

```scala
final val pi = 3.141592653589793
final val pie = "🥧"
```

The `final` modifier will ensure that `pi` and `pie` will take a _literal type_.
Then the constant propagation optimisation in the compiler can perform inlining for such definitions.
However, inlining based constant propagation is _best-effort_ and not guaranteed.
The `final val` inlining is also supported by Scala 3.0 as _best-effort_ inlining for migration purposes.

Currently, only constant expression may appear on the right-hand side of an inline value definition.
Therefore, the following code is invalid, though the compiler knows that the right-hand side is a compile-time constant value:

```Scala
val pi = 3.141592653589793
inline val pi2 = pi + pi // error
```


## Inline Methods

We can use the modifier `inline` to define a method that should be inlined at call-site:

```scala
inline def logged[T](level: Int, message: => String)(inline op: T): Unit =
  println(s"[$level]Computing $message")
  val res = op
  println(s"[$level]Result of $message: $res")
  res
```

When this method is called, its body will be applied at compile-time over its passed arguments!
This results in the replacement of the call by the body of the method with all parameters substituted correspondingly.
Therefore, the following code 

```scala
logged(logLevel, getMessage()) {
  computeSomthing()
}
```

would be inlined and becomes

```Scala
val level   = logLevel
def message = getMessage()

println(s"[$level]Computing $message")
val res = computeSomthing()
println(s"[$level]Result of $tag: $res")
res
```

Method inlining handles three kinds of parameters differently:

1. __By-value parameters__. The compiler generates a `val` binding for *by-value* parameters.

    This can be seen in the parameter `level` from the example.
    In some cases, when the arguments are pure constant values, the binding is omitted and the value is inlined directly.

2. __By-Name parameters__. The compiler generates a `def` binding for *by-name* parameters. 

    This can be seen in the parameter `message` from the example.

3. __Inline parameters__. Inline parameters do not create bindings and their code is duplicated everywhere they are used.

    This can be seen in the parameter `op` from the example.

It is important to understand that when a call is inlined it **will not change** its semantics.
This implies that the initial elaboration (overloading resolution, implicit search, ...), performed while typing the body of the inline method, will not change when inlined.

For example, consider the following code: 

```scala
class Logger:
  def log(x: Any): Unit = println(x)

class RefinedLogger extends Logger:
  override def log(x: Any): Unit = println("Any: " + x)
  def log(x: String): Unit = println("String: " + x)

inline def logged[T](logger: Logger, x: T): Unit =
  logger.log(x)
```

The separate type checking of `logger.log(x)` will resolve the call to the method `Log.log` which takes an argument of the type `Any`.
Now, given the following code:

```scala
logged(new RefinedLogger, "✔️")
```

It expands to:

```
val loggeer = new RefinedLogger
val x = "✔️"
logger.log(x)
```
Even though now we know that `x` is a `String`, the call `logger.log(x)` still resolves to the method `Log.log` which takes an argument of the type `Any`.

Another way to interpret this is that if `logged` is a `def` or `inline def` they would perform the same operations with some differences in performance.

### Inline parameters

One important application of inlining is to enable constant folding optimisation across method boundaries.
Inline parameters do not create bindings and their code is duplicated everywhere they are used.

```scala
inline def perimeter(inline radius: Double): Double = 
  2. * pi * radius
```
In this case, we expect that if the `radius` is known then the whole computation can be done at compile-time.
We use an `inline` parameter to enforce the requirement.
The following code

```scala
perimeter(5.)
```

is inlined as 

```Scala
2. * pi * 5.
```

Then `pi` is inlined (we assume the `inline val` definition from the start):

```Scala
2. * 3.141592653589793 * 5.
```

Finally, it is constant folded to

```
31.4159265359
```

Be careful when using an inline parameter more than once.
Consider the following code:

```scala
inline def printPerimeter(inline radius: Double): Double =
  println(s"Perimeter (r = $radius) = ${perimeter(radius)}")
```
It works perfectly fine when a constant or reference to a val is passed to it.
```scala
printPerimeter(5.) 
// inlined as
println(s"Perimeter (r = ${5.}) = ${31.4159265359}")
```

But if something larger, possibly with side-effects is passed, then we might accidentally duplicate some work.


```scala
printPerimeter(longComputation()) 
// inlined as
println(s"Perimeter (r = ${longComputation()}) = ${6.283185307179586 * longComputation()}")
```

A useful application of inline parameters is to avoid the creation of closures of by-name parameters.

```scala
def assert1(cond: Boolean, msg: =>String) =
  if !cond then 
    throw new Exception(msg)

assert1(x, "error1")
// is inlined as
val cond = x
def msg = "error1"
if !cond then 
    throw new Exception("error1")
```
In this case, we can see that the closure for `msg` is created before the condition is checked.

If we use an inline parameter instead, we can guarantee that the condition is checked before any of the code that handles the exception is reached.
In the case of an assertion, this code should never be reached.
```scala
inline def assert2(cond: Boolean, inline msg: String) =
  if !cond then 
    throw new Exception(msg)

assert2(x, "error2")
// is inlined as
val cond = x
if !cond then 
    throw new Exception("error2")
```

### Inline Conditionals
If the condition of the inline is a known constant (`true` or `false`), possibly after inlining, then the `if` or `else`-branch is partially evaluated away and only one branch will be kept.

For example, the following power method contains some `if` that will unroll the recursion and remove all method calls.

```scala
inline def power(x: Double, inline n: Int): Double =
  if (n == 0) 1.0
  else if (n % 2 == 1) x * power(x, n - 1)
  else power(x * x, n / 2)
```

  ```scala
  power(2, 2)
  // first inlines as
  val x = 2
  if (2 == 0) 1.0 // dead branch
  else if (2 % 2 == 1) x * power(x, 2 - 1) // dead branch
  else power(x * x, 2 / 2)
  // partially evaluated to
  val x = 2
  power(x * x, 1)
  ```
<details>
  <summary> See rest of inlining steps</summary>

```scala
// then inlined as
val x = 2
val x2 = x * x
if (1 == 0) 1.0 // dead branch
else if (1 % 2 == 1) x2 * power(x2, 1 - 1)
else power(x2 * x2, 1 / 2) // dead branch
// partially evaluated to
val x = 2
val x2 = x * x
x2 * power(x2, 0)
// then inlined as
val x = 2
val x2 = x * x
x2 * {
  if (0 == 0) 1.0
  else if (0 % 2 == 1) x * power(x, 0 - 1) // dead branch
  else power(x * x, 0 / 2) // dead branch
}
// partially evaluated to
val x = 2
val x2 = x * x
x2 * 1.0
```
</details>


Now imagine if we do not know the value of `n`

```scala
power(2, unkownNumber)
```
<details>
  <summary>See inlining steps</summary>

```scala
// first inlines as
val x = 2
if (unkownNumber == 0) 1.0
else if (unkownNumber % 2 == 1) x * power(x, unkownNumber - 1)
else power(x * x, unkownNumber / 2)
// then inlined as
val x = 2
if (unkownNumber == 0) 1.0
else if (unkownNumber % 2 == 1) x * {
  if (unkownNumber - 1 == 0) 1.0
  else if ((unkownNumber - 1) % 2 == 1) x2 * power(x2, unkownNumber - 1 - 1)
  else power(x2 * x2, (unkownNumber - 1) / 2)
}
else {
  val x2 = x * x
  if (unkownNumber / 2 == 0) 1.0
  else if ((unkownNumber / 2) % 2 == 1) x2 * power(x2, unkownNumber / 2 - 1)
  else power(x2 * x2, unkownNumber / 2 / 2)
}
// Oops this will never finish compiling
...
```
</details>

Instead, we can use the `inline if` variant of `if` that ensures that the branching decision is performed at compile-time.
It will always remove them if after inlining and keep a single branch before inlining the contents of the branch.
If it does not have a constant condition it will emit an error and stop inlining.

```scala
inline def power(x: Double, inline n: Int): Double =
  inline if (n == 0) 1.0
  else inline if (n % 2 == 1) x * power(x, n - 1)
  else power(x * x, n / 2)
```

```scala
power(2, 2) // Ok
power(2, unkownNumber) // error
```

We will come back to this example later and see how we can get more control on how code is generated.

## Inline Method Overloading

When combining `inline def` with overriding and interfaces we will have some restrictions to ensure the correct behaviour of the methods.

The first restriction is that all inline methods are effectively final.
This ensures that the overload resolution at compile-time behaves the same as the one at runtime.

Inline overrides must have the same signature as the overridden method including the inline parameters.
This ensures that the call semantics is the same for both methods.

A new concern appears when we implement or override a normal method with an inline method.

Consider the following example:

```scala
trait Logger:
  def log(x: Any): Unit

class PrintLogger extends Logger:
  inline def log(x: Any): Unit = println(x)
```
Now it is possible to call the `log` method directly on `PrintLogger` which will inline the code but we could also call it on `Logger`.
This implies that the code of log must exist at runtime, we call this a _retained inline_ method.

For any non-retained inline `def` or `val` the code can always be fully inlined at all call sites.
Hence the methods will not be needed at runtime and can be erased from the bytecode.

Retained inline methods must contain code that works when it is not inlined.
An `inline if` as in the `power` example will not work as the `if` cannot be constant folded inside the definition `power`.
Other cases involve metaprogramming constructs that only have meaning when inlined.

It is also possible to create abstract inline definitions.

```scala
trait InlineLogger:
  inline def log(inline x: Any): Unit

class PrintLogger inline InlineLogger:
  inline def log(inline x: Any): Unit = println(x)
```

This forces the implementation of `log` to be an inline method and also allows `inline` parameters.
Counterintuitively, the `log` in `Logger` cannot be called, this would result in an error as we do not know what to inline.
Its usefulness becomes apparent when we use it in another inline method

```scala
inline def logged(logger: Logger, x: Any) =
  logger.log(x)
```

```scala
logged(new PrintLogger, "🥧")
// inlined as
val logger: PrintLogger = new PrintLogger
logger.log(x)
```

In this case, when inlined, the call to `log` is de-virtualized and known to be on `PrintLogger`.
Therefore the code can bee inlined.

#### Summary of inline methods
* All `inline` methods are final.
* Abstract `inline` methods can only be implemented by inline methods.
* If an inline method overrides/implements a normal method then it must be retained.
* Retained methods cannot have inline parameters.


## Transparent Inline
This is a simple yet powerful extension to `inline` methods that unlocks many metaprogramming uses cases.
These inline calls allow for an inline piece of code to refine the type based on the precise type of the inlined expression.
In Scala 2 parlance, these capture the essence of _whitebox macros_.

```scala
transparent def default(inline name: String): Any =
  inline if name == "Int" then 0
  else inline if name == "String" then ""
  else ...
```

```scala
val n0: Int = default("Int")
val s0: String = default("String")
```

Note that even if the return type of `default` in `Any`, the first call is typed as an `Int` and the second as a `String`.
The return type represents the upper bound of the type within the inlined term.
We could also have been more precise and have written instead
```scala
transparent def default(inline name: String): 0 | "" = ...
```

The return type is also important when the inline method is recursive.
There it should be precise enough for the recursion to type but will get more precise after inlining.


It is important to note that changing the body of a `transparent inline def` will change how the call site is typed.
This implies that the body plays a part in the binary and source compatibility of this interface.


### Inline Matches

Inline matches behave differently than normal matches.
This variant provides a way to match on the static type of some expression.
It ensures that only one branch is kept.
In the following example, the scrutinee, x, is an inline parameter that we can pattern match on at compile time.

```scala
transparent inline def half(x: Any): Any =
  inline x match
    case x: Int => x / 2
    case x: String => x.substring(0, x.length / 2)

half(6)
// expands to:
// val x = 6
// x / 2

half("hello world")
// expands to:
// val x = "hello world"
// x.substring(0, x.length / 2)
```

As we match on the static type of an expression, the following would fail to compile because at compile time there is not enough information to decide which branch to take.

```scala
val n: Any = 3
half(n) // error: n is not statically known to be an Int or a Double
```


## scala.compiletime
The package `scala.compiletime` provides useful metaprogramming abstractions that can be used within `inline` methods to provide custom semantics.

## Macros
Inlining is also the core mechanism used to write macros.
Macros provide a way to control the code generation and analysis after the call is inlined.


```scala
inline def power(x: Double, inline n: Int) = 
  ${ powerCode('x, 'n)  }

def powerCode(x: Expr[Double], n: Expr[Int])(using QuoteContext): Expr[Double] = ...
```

[best-practices]: best-practices.md
[compiletime]: tutorial/compiletime.md
[macros]: tutorial/macros.md
[references]: references.md
[soft-modifier]: https://dotty.epfl.ch/docs/reference/soft-modifier.html
