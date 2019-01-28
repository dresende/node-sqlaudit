## NodeJS SQL Audit

This is a module that accepts a specific language that you can use to simplify
auditing of SQL data.

## Language

### Query

A query is the most important component of the language. It is strongly based on CSS
query syntax.

```js
table[prop1 > value1, prop2 != value2].sum(value3)
```

This basically selects from table `table` based on those 2 conditions (`prop1` and
`prop2`) and agregates using `SUM()` based on `value3`.

In this specific case, we're selecting a single value. You can also select a row.

```js
table[prop1 = value]:order(-prop2):first()
```

This selects from table `table` order descending (that's what the minus sign is for)
by `prop2` and returns the first row (this is the same as `:limit(1)`).

You can also use this query and then select a specific property:

```js
table[prop1 = value]:order(-prop2):first().prop2
```

### COMMENT

```js
// comment
```

### FOR (loop)

```js
for <expression> {
	...
}
```

### IF (condition)

```js
if <statement> {
	...
}
```
