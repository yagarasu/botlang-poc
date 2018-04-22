# Language grammar

```
Program = Stmt*

Stmt = VarDeclaration
     | FuncDeclaration
     | IfStmt
     | ForStmt
     | WhileStmt
     | ContinueStmt
     | Expr T_TERM // Later on will have more types

VarDeclaration = T_VAR VarType T_IDENT T_ASSIGN SumOperation T_TERM

FuncDeclaration = T_FUNC VarType T_IDENT T_PAR_OP ArgList T_PAR_CL T_BRA_OP Block T_BRA_CL
ArgList = [T_IDENT (T_COMMA T_IDENT)*]

IfStmt =  T_IF T_PAR_OP Expr T_PAR_CL T_BRA_OP Block T_BRA_CL
       [T_ELSE (T_BRA_OP Block T_BRA_CL | IfStmt)]

ForStmt = T_FOR T_PAR_OP Expr T_TERM Expr T_TERM Expr T_PAR_CL T_BRA_OP Block T_BRA_CL
WhileStmt = T_WHILE T_PAR_OP Expr T_PAR_CL T_BRA_OP Block T_BRA_CL
ContinueStmt = T_CONTINUE [T_INT] T_TERM

Block = Stmt*

VarType = T_TYPE_INT
        | T_TYPE_FLOAT
        | T_TYPE_BOOL
        | T_TYPE_STR

Expr = AssignmentOperation

AssignmentOperation = LogicalOrOperation
                      ( OpAssign | OpAssignSum | OpAssignSub | OpAssignMul | OpAssignDiv )
                      LogicalOrOperation
LogicalOrOperation = CompOperation (OpOr CompOperation)*
LogicalAndOperation = CompOperation (OpAnd CompOperation)*
CompOperation = SumOperation
                (OpEq | OpNeq | OpGT | OpGE | OpLT | OpLE )
                SumOperation
SumOperation = MultOperation ((OpAdd | OpSub) MultOperation)*
MultOperation = Factor ((OpMul | OpDiv | OpMod) Factor)*
Factor = BraOp Expr BraCl | Variable | Number
FuncCall = T_IDENT T_PAR_OP [Expr (T_COMMA Expr)*] T_PAR_CL
Variable = T_IDENT
Literal = Number | String | Boolean
Number = Integer | Float
String = T_STR_DBL | T_STR_SING
Boolean = T_BOOL
Integer = T_INT
Float = T_FLOAT
```
