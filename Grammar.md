# Language grammar

```
Program = Stmt*
Stmt = Expr // Later on will have more types
Expr = Term (OpAdd | OpSub) Term
Term = Factor (OpMul | OpDiv) Factor
Factor = BraOp Expr BraCl | Number
Number = Integer | Float
```
