# Bytecode

## Header

```
char * 3      Version         Each char is minor, major, patch
char          null            NOOP
unsigned int  CodeOffset      Code section start offset
unsigned int  CodeSize        Code section size
unsigned int  DataOffset      Data section start offset
unsigned int  DataSize        Data section size
```

## Example

```
00 01 00
00
18 00
03 00
0C 00
0C 00

48 65 6C 6C 6F 20 57 6F 72 6C 64 00

01 0B
00
```
