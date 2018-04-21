# Language grammar

```
Program = Stmt*

Stmt = VarDeclaration
     | FuncDeclaration
     | SumOperation // Later on will have more types

VarDeclaration = T_VAR VarType T_IDENT T_ASSIGN SumOperation T_TERM

FuncDeclaration = T_FUNC VarType T_IDENT T_PAR_OP ArgList T_PAR_CL T_BRA_OP Block T_BRA_CL
ArgList = [T_IDENT (T_COMMA T_IDENT)*]

Block = Stmt*

VarType = T_TYPE_INT
        | T_TYPE_FLOAT
        | T_TYPE_BOOL
        | T_TYPE_STR

SumOperation = MultOperation (OpAdd | OpSub) MultOperation
MultOperation = Factor (OpMul | OpDiv | OpMod) Factor
Factor = BraOp SumOperation BraCl | Number
Number = Integer | Float
```
