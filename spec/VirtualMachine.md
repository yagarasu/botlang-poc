# Virtual Machine

## Constant pool

Created at compile time.

Accessed via index, which is looked on a table.

### Constant table

| Index | Type | Address | Size |
| :- | :- | :- | :- |
| < int > | < Types > | < byte address > | < byte size > |

### Types

| Hex | Dec | Type |
| :- | :- | :- |
| 0x00 | 0 | String |
| 0x01 | 1 | Float |
| 0x02 | 2 | Func signature |

### Pool

#### String

**Size:** Variable

Saved allways as UTF-8

Eg:

"Lorem ipsum" = 0x4C 0x6F 0x72 0x65 0x6D 0x20 0x69 0x70 0x73 0x75 0x6D

#### Float

**Size:** 64 bits / 8 bytes

#### Function signature

**Size:** 3 bytes

3 Fields: address, num. of arguments, num. of locals

Eg:

```
func foo (baz) {
  var int bar = 10
  return
}

Address   Arguments   Locals
0x0F      0x01        0x01
```

Global data
Code
Start addr
Constant pool
