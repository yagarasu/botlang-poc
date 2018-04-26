# Bytecode

## Header

```
uint32        Version
  |
  |-- char    Version.major
  |-- char    Version.minor
  |-- char    Version.parch
  |-- char    null            NOOP
uint32        CodeOffset      Code section start offset
uint32        CodeSize        Code section size
uint32        DataOffset      Data section start offset
uint32        DataSize        Data section size
```

## Data

## Code
