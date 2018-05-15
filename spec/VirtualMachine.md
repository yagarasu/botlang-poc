# Virtual Machine

## Instruction decoding

32 bits decoded:

```
0000 0000 0000 0000 SSSS PPPP CCCC CCCC

CCCC = Opcode
PPPP = Param type
SSSS = Stack type
0000 = Reserved
```

### Param decoding

| Hex | Meaning |
| :- | :- |
| 0x0 | No parameters |
| 0x1 | Char |
| 0x2 | 16 Bit |
| 0x3 | 32 Bit |
| 0x4 | Constant Pool Index |
| 0x5 | Bool |

When Char or 16 bits command, we can use the op itself.

### Opcodes

| Mnemonic | Params | Stack
| :- | :- | :- | :- |
| HLT | 0 Params | 0|
| ICONST | 1 Param: Char, 16b, 32b | 0 |
| FCONST | 1 Param: Pool<Float> | 0 |
| SCONST | 1 Param: Pool<String> | 0 |
| BCONSTFALSE | 0 Params | 0 |
| BCONSTTRUE | 0 Params | 0 |
| CALL | 1 Param: Pool<Func> | 0 |
| RET | 0 Params | 0 |
| JMP | 1 Param: Char, 16b, 32b | 0 |
| JMPIFFALSE | 1 Param: Char, 16b, 32b | 0 |

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
