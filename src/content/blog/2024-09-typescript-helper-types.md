---
slug: 5-simple-typescript-utility-types-for-safer-code
title: 5 Simple TypeScript Utility Types for Safer Code, with Use Cases and Examples
date: 2024-09-07 22:30 +0800
authors:
  - Richard Dominick
---

[_Back to blog_](/blog)

## Introduction

TypeScript's type system is very powerful, allowing developers to build very complex types. At the same time, it is very flexible, allowing for incremental adoption. One of its main features is [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html) to help you write safer code. While TypeScript comes with many utility types out of the box, sometimes you need to create your own. Doing this can be a bit tricky to get right, but fortunately, a lot of utility types can actually be quite simple while still being very useful.

Here are some of my favorite simple utility types that I have used in my projects.

> _**Note:** This list is not in any particular order of importance. Depending on your use case, you may find some of the more useful than others._

&nbsp;

## 1. `SafeOmit`

<details class="px-3 py-1 rounded bg-blue-100 [&>*:last-child]:!mb-2 space-y-2 [&_*]:my-0">
<summary class="cursor-pointer hover:underline underline-offset-4 marker:pr-4"><b class="pl-1">TL;DR: Type Definition</b></summary>

```ts
type SafeOmit<T, K extends keyof T> = Omit<T, K>;
```

</details>

You may be familiar with TypeScript's built-in `Pick` and `Omit` types. If you are, then you'll likely feel that `Omit` can be a bit dangerous. It will remove the specified keys from the type, but it will not check if the keys actually exist on the type.

The default `Omit` behavior is actually quite useful in many cases. For example, when doing a set difference of types:

```ts
type X = {
  a: string;
  b: string;
};

type Y = {
  b: string;
  c: string;
}

type Z = Omit<X, keyof Y>; // { a: string }
```

In this case, while the key `c` is not present in `X`, because of the definition of `Omit`, TypeScript will not complain.

### The Problem

However, in some cases, you may want to ensure that the keys you are omitting actually exist on the type. This is especially useful when you are defining the keys to exclude manually using a string union, instead of `keyof`.

For example, let's say you are building an API with a `User` type. You may also want to create a `UserInput` type that is the same as `User`, but without the `id` and `createdAt` fields:

```ts
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date
};

// Fields that should be editable
type UserInput = Omit<User, 'id' | 'createdAt'>;
```

Being a string union, TypeScript will not complain if you accidentally misspell a key. Moreover, there is no autocomplete while you are typing out the string union:

```ts
// Oops!
type WrongUserInput = Omit<User, 'idd' | 'createdAt'>; // still contains the `id` field
```

Using `SafeOmit`, both problems are solved:

```ts
type SafeOmit<T, K extends keyof T> = Omit<T, K>;

type WrongUserInput = Omit<User, 'idd' | 'createdAt'>; // Compile Error! // [!code error]
```

It is a simple type that extends `Omit` but adds a constraint to ensure that the keys you are omitting actually exist on the type.

## 2. `DeepPartial`

<details open class="px-3 py-1 rounded bg-blue-100 [&>*:last-child]:!mb-2 space-y-2 [&_*]:my-0">
<summary class="cursor-pointer hover:underline underline-offset-4 marker:pr-4"><b class="pl-1">Type Definition</b></summary>

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, any> ? DeepPartial<T[K]> : T[K];
};
```

</details>

Not much needs to be said about `DeepPartial`. It is arguable one of the most-used utility types that did not come built into TypeScript. Sometimes, you just need to recursively apply the `Partial` utility type to a type and its nested properties. Most notably, this is used in [Redux](https://redux.js.org/) when defining application state and actions.

## 3. `Remove`

<details class="px-3 py-1 rounded bg-blue-100 [&>*:last-child]:!mb-2 space-y-2 [&_*]:my-0">
<summary class="cursor-pointer hover:underline underline-offset-4 marker:pr-4"><b class="pl-1">TL;DR: Type Definition</b></summary>

```ts
type Remove<T, K extends keyof any> = {
  [key in keyof T as key extends K ? never : key]: T[key];
};
```

</details>

The `Remove` type is similar to `Omit` in that it removes keys from a type. However, it differs from `Omit` as follows when the object belongs to a union type:

* `Omit<T, K>` applies the key removal operation on type `T`
* `Remove<T, K>` distributes over each element of `T`

What does this mean? Let's say you are creating a table. Naturally, there are many different cell types, such as `BooleanCell` and `NumericCell`:

```ts
type Cell = {
  id: string;
};

type BooleanCell = Cell & {
  data: boolean;
  canEnable: boolean;
  canDisable: boolean;
};

type NumericCell = Cell & {
  data: number;
  canIncrement: boolean;
  canDecrement: boolean;
};

type CellTypes = BooleanCell | NumericCell;
```

Depending on the cell type and where this cell is used, you may want to enable or disable certain actions. For example, a `BooleanCell` can have both `canEnable` and `canDisable` set to `true` (in the case of a toggle switch), or only have `canEnable` set to `true` (in the case of a one-time trigger).

It makes sense to predefine the needed configurations beforehand, and inject the data into the cell later. This is where `Remove` comes in:

```ts
type Remove<T, K extends keyof any> = {
  [key in keyof T as key extends K ? never : key]: T[key];
};

type UsingOmit = Omit<CellTypes, 'data'>; // { id: string; }
type UsingRemove = Remove<CellTypes, 'data'>; // Remove<BooleanCell, "data"> | Remove<NumericCell, "data">

// This gives a compile error, which may be unexpected
const wrongWithoutData: UsingOmit = {
  id: '1',
  canEnable: true, // Object literal may only specify known properties, and 'canEnable' does not exist in type 'UsingOmit'.ts(2353) // [!code error]
  canDisable: true,  // Object literal may only specify known properties, and 'canDisable' does not exist in type 'UsingOmit'.ts(2353) // [!code error]
};

// Has autocompletion and type-checking;
// without any property, it will throw an error
const correctWithoutDataBoolean: UsingRemove = {
  id: '1',
  canEnable: true,
  canDisable: true,
};

// Has autocompletion and type-checking;
// without any property, it will throw an error
const correctWithoutDataNumeric: UsingRemove = {
  id: '1',
  canIncrement: true,
  canDecrement: true,
};
```

When using `Omit`, TypeScript first calculates the union of `BooleanCell | NumericCell`, which only leaves the `id` and `data` fields. Then, it removes the `data` field, leaving only the `id` field.

Using `Remove`, TypeScript distributes the operation over each element of the union type. This means that it first removes the `data` field from `BooleanCell` and `NumericCell` individually, and then computes the union of the results. This allows us to still retain autocompletion and static type checking for the remaining properties, to ensure that we don't accidentally violate a constraint of the discriminated union.

In this sense, another possible name for `Remove` could be `DistributedOmit`.

## 4. `SizedArray`

<details class="px-3 py-1 rounded bg-blue-100 [&>*:last-child]:!mb-2 space-y-2 [&_*]:my-0">
<summary class="cursor-pointer hover:underline underline-offset-4 marker:pr-4"><b class="pl-1">TL;DR: Type Definition</b></summary>

```ts
type SizedArray<
  T,
  N extends number,
  Carry extends T[] = []
> = Carry["length"] extends N ? Carry : SizedArray<T, N, [...Carry, T]>;
```

</details>

`SizedArray` works on top of TypeScript [tuple types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types). Simply put, it is a shorthand for creating an array of a specific length with a specific type for each element.

For example, let's say you are building a tic-tac-toe game. To represent the game board, you can use a 3x3 grid:

```ts
type SizedArray<
  T,
  N extends number,
  Carry extends T[] = []
> = Carry["length"] extends N ? Carry : SizedArray<T, N, [...Carry, T]>;

type Cell = null | 'X' | 'O';
type Grid = SizedArray<SizedArray<Cell, 3>, 3>;
```

It is equivalent to the following:

```ts
type Grid = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];
```

If you're working with fixed-size vectors (e.g. 3D coordinates, quaternions) or matrices, you'll find this shorthand very handy.

Here's a simple functional abstraction for RGB values using `SizedArray`:

```ts
type RGB = SizedArray<number, 3>;

const rgb_of = (r: number, g: number, b: number): RGB => [r, g, b];
const get_r = (rgb: RGB) => rgb[0];
const get_g = (rgb: RGB) => rgb[1];
const get_b = (rgb: RGB) => rgb[2];
```

Depending on your use case, it may be simpler to implement abstractions as functions, as opposed to instantiating classes and objects. For one, iterating through elements is much easier:

```ts
type Vector3 = SizedArray<number, 3>;

// Notice that we are leveraging array methods to simplify "immutability"
const add = (a: Vector3, b: Vector3): Vector3 => a.map((v, i) => v + b[i]) as Vector3;

// This is a simple way to calculate the sum of a vector
const sum1 = (v: Vector3): number => v.reduce((acc, cur) => acc + cur, 0);

// Or using a for loop
const sum2 = (v: Vector3): number => {
  let sum = 0;
  for (const elem of v) {
    sum += elem;
  }
  return sum;
};
```

Be warned though, due to the recursive nature of this type, make sure to set reasonable sizes for `N` (e.g. &leq;1000) to avoid "type instantiation is excessively deep and possibly infinite" errors.

## 5. `Equals`

<details class="px-3 py-1 rounded bg-blue-100 [&>*:last-child]:!mb-2 space-y-2 [&_*]:my-0">
<summary class="cursor-pointer hover:underline underline-offset-4 marker:pr-4"><b class="pl-1">TL;DR: Type Definition</b></summary>

```ts
type Equals<S, T> = S extends T ? (T extends S ? true : false) : false;
```

</details>

Lastly, when working in the type world, sometimes, we need to check if two types are equal. Perhaps you are refactoring a type and want to make sure you didn't break anything. This is where you can use the `Equals` type:

```ts
type Equals<S, T> = S extends T
                    ? (T extends S ? true : false)
                    : false;

type A = { a: string };
type B = { a: string };
type C = { a: number };

type Test1 = Equals<A, B>; // true
type Test2 = Equals<A, C>; // false
```

Personally, I feel that the use cases for equals `Equals` is not so common in functional code. Thus, it may not always be committed to version control. However, it is still a great aid when writing type helpers and utilities, and I would say it is a must-know if you often find yourself writing types.

## Conclusion

These are just a few simple utility types that I have found useful in my projects. They are simple to understand and implement, yet they can greatly improve the safety and maintainability of your code.

<!-- TODO: Use comment feature -->
I hope you find them useful in your projects as well, and let me know if you have any other use cases for the abovementioned types!

---

_Stay tuned for part 2 where I will cover tuple-manipulation types!_
