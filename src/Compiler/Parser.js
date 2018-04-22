class Parser {
  constructor (tokens) {
    this.tokens = tokens
    this.pointer = 0
  }
  static parse (tokens) {
    const parser = new Parser(tokens)
    const ast = parser.Program()
    return ast
  }

  syntaxError (type) {
    const current = this.current()
    if (!current) throw new Error('Unexpected End of file.')
    const { type: curType , position } = current
    throw new Error('Unexpected ' + curType + ' on line ' + position.line + ', column ' + position.column + '. Expecting ' + type)
  }

  backtrack () {
    this.pointer--
  }

  current () {
    return this.tokens[this.pointer]
  }

  consume () {
    return this.tokens[this.pointer++]
  }

  match (type) {
    const current = this.current()
    if (current && current.type === type) {
      this.pointer++
      return current
    } else {
      this.syntaxError(type)
    }
  }

  matchOneOf (types) {
    const current = this.current()
    if (current && types.includes(current.type)) {
      this.pointer++
      return current
    } else {
      this.syntaxError(types.join (' or '))
    }
  }

  currentIs(type) {
    const current = this.current()
    return current && current.type === type
  }

  currentIsOneOf(types) {
    const current = this.current()
    return current && types.includes(current.type)
  }

  /**
   * Rules
   */
  Program () {
    const ast = { type: 'Program', body: [] }
    while(this.pointer < this.tokens.length) {
      const current = this.Stmt()
      ast.body.push(current)
    }
    return ast
  }

  Stmt () {
    if (this.currentIs('T_IF')) {
      return this.IfStmt()
    } else if (this.currentIs('T_FOR')) {
      return this.ForStmt()
    } else if (this.currentIs('T_WHILE')) {
      return this.WhileStmt()
    } else if (this.currentIs('T_FUNC')) {
      return this.FuncDeclaration()
    } else if (this.currentIs('T_CONTINUE')) {
      return this.ContinueStmt()
    }

    let ast = null
    if (this.currentIs('T_VAR')) {
      ast = this.VarDeclaration()
    } else {
      ast = this.Expr()
    }
    this.match('T_TERM')
    return ast
  }

  ContinueStmt () {
    const ast = { type: 'ContinueStatement', depth: 0 }
    this.match('T_CONTINUE')
    if (this.currentIs('T_INT')) {
      ast.depth = parseInt(this.match('T_INT').value)
    }
    this.match('T_TERM')
    return ast
  }

  VarDeclaration () {
    const ast = {
      type: 'VariableDeclaration',
      identifier: null,
      varType: null,
      value: null
    }
    this.match('T_VAR')
    ast.varType = this.VarType().value
    ast.identifier = this.match('T_IDENT').value
    this.match('T_ASSIGN')
    ast.value = this.Expr()
    return ast
  }

  FuncDeclaration () {
    const ast = {
      type: 'FuncDeclaration',
      identifier: null,
      returnType: null,
      arguments: [],
      body: []
    }
    this.match('T_FUNC')
    ast.returnType = this.VarType().value
    ast.identifier = this.match('T_IDENT').value
    this.match('T_PAR_OP')
    ast.arguments = this.ArgList()
    this.match('T_PAR_CL')
    this.match('T_BRA_OP')
    ast.body = this.Block()
    this.match('T_BRA_CL')
    return ast
  }

  ArgList () {
    if (!this.currentIs('T_IDENT')) return []
    const args = [this.match('T_IDENT').value]
    while (this.currentIs('T_COMMA')) {
      this.match('T_COMMA')
      args.push(this.match('T_IDENT').value)
    }
    return args
  }

  IfStmt () {
    const ast = {
      type: 'IfStatement',
      test: null,
      consequent: null,
      alternate: null
    }
    this.match('T_IF')
    this.match('T_PAR_OP')
    ast.test = this.Expr()
    this.match('T_PAR_CL')
    this.match('T_BRA_OP')
    ast.consequent = this.Block()
    this.match('T_BRA_CL')
    if (this.currentIs('T_ELSE')) {
      this.match('T_ELSE')
      if (this.currentIs('T_BRA_OP')) {
        this.match('T_BRA_OP')
        ast.alternate = this.Block()
        this.match('T_BRA_CL')
      } else {
        ast.alternate = this.IfStmt()
      }
    }
    return ast
  }

  ForStmt () {
    const ast = {
      type: 'ForStatement',
      initial: null,
      test: null,
      update: null,
      body: null
    }
    this.match('T_FOR')
    this.match('T_PAR_OP')
    if (this.currentIs('T_VAR')) {
      ast.initial = this.VarDeclaration()
    } else {
      ast.initial = this.Expr()
    }
    this.match('T_TERM')
    ast.test = this.Expr()
    this.match('T_TERM')
    ast.update = this.Expr()
    this.match('T_PAR_CL')
    this.match('T_BRA_OP')
    ast.body = this.Block()
    this.match('T_BRA_CL')
    return ast
  }

  WhileStmt () {
    const ast = {
      type: 'WhileStatement',
      test: null,
      body: null
    }
    this.match('T_WHILE')
    this.match('T_PAR_OP')
    if (this.currentIs('T_VAR')) {
      ast.test = this.VarDeclaration()
    } else {
      ast.test = this.Expr()
    }
    this.match('T_PAR_CL')
    this.match('T_BRA_OP')
    ast.body = this.Block()
    this.match('T_BRA_CL')
    return ast
  }

  Block () {
    const body = []
    while (!this.currentIs('T_BRA_CL')) {
      body.push(this.Stmt())
    }
    return body
  }

  VarType () {
    return this.matchOneOf([
      'T_TYPE_VOID',
      'T_TYPE_INT',
      'T_TYPE_FLOAT',
      'T_TYPE_BOOL',
      'T_TYPE_STR'
    ])
  }

  Expr () {
    return this.AssignmentOperation()
  }

  AssignmentOperation () {
    const ast = { type: 'AssignmentOperation', left: null, op: null, right: null }
    const allowedOps = [
      'T_ASSIGN_ADD',
      'T_ASSIGN_SUB',
      'T_ASSIGN_MUL',
      'T_ASSIGN_DIV',
      'T_ASSIGN'
    ]
    ast.left = this.LogicalOrOperation()
    if (!this.currentIsOneOf(allowedOps)) return ast.left
    ast.op = this.matchOneOf(allowedOps).value
    ast.right = this.LogicalOrOperation()
    return ast
  }

  LogicalOrOperation () {
    const ast = { type: 'LogicalOrOperation', left: null, op: null, right: null }
    ast.left = this.LogicalAndOperation()
    if (!this.currentIs('T_OP_OR')) return ast.left
    ast.op = this.match('T_OP_OR').value
    ast.right = this.LogicalAndOperation()
    if (this.currentIs('T_OP_OR')) {
      this.backtrack()
      ast.right = this.LogicalOrOperation()
    }
    return ast
  }

  LogicalAndOperation () {
    const ast = { type: 'LogicalAndOperation', left: null, op: null, right: null }
    ast.left = this.CompOperation()
    if (!this.currentIs('T_OP_AND')) return ast.left
    ast.op = this.match('T_OP_AND').value
    ast.right = this.CompOperation()
    if (this.currentIs('T_OP_AND')) {
      this.backtrack()
      ast.right = this.LogicalAndOperation()
    }
    return ast
  }

  CompOperation () {
    const ast = { type: 'ComparisonOperation', left: null, op: null, right: null }
    const allowedOps = [
      'T_OP_EQ',
      'T_OP_NEQ',
      'T_OP_GT',
      'T_OP_GE',
      'T_OP_LT',
      'T_OP_LE',
    ]
    ast.left = this.SumOperation()
    if (!this.currentIsOneOf(allowedOps)) return ast.left
    ast.op = this.matchOneOf(allowedOps).value
    ast.right = this.SumOperation()
    return ast
  }

  SumOperation () {
    const ast = { type: 'SumatoryOperation', left: null, op: null, right: null }
    ast.left = this.MultOperation()
    if (!this.currentIsOneOf(['T_OP_ADD', 'T_OP_SUB'])) return ast.left
    ast.op = this.matchOneOf(['T_OP_ADD', 'T_OP_SUB']).value
    ast.right = this.MultOperation()
    if (this.currentIsOneOf(['T_OP_ADD', 'T_OP_SUB'])) {
      this.backtrack()
      ast.right = this.SumOperation()
    }
    return ast
  }

  MultOperation () {
    const ast = { type: 'MultiplicativeOperation', left: null, op: null, right: null }
    ast.left = this.Factor()
    if (
      !this.currentIs('T_OP_MUL') &&
      !this.currentIs('T_OP_DIV') &&
      !this.currentIs('T_OP_MOD')
    ) return ast.left
    ast.op = this.matchOneOf([
      'T_OP_MUL',
      'T_OP_DIV',
      'T_OP_MOD'
    ]).value
    ast.right = this.Factor()
    if (
      this.currentIs('T_OP_MUL') ||
      this.currentIs('T_OP_DIV') ||
      this.currentIs('T_OP_MOD')
    ) {
      this.backtrack()
      ast.right = this.MultOperation()
    }
    return ast
  }

  Factor () {
    if (this.currentIs('T_PAR_OP')) {
      this.match('T_PAR_OP')
      const value = this.Expr()
      this.match('T_PAR_CL')
      return value
    } else if (this.currentIs('T_IDENT')) {
      const variable = this.Variable()
      if (this.currentIs('T_PAR_OP')) {
        this.backtrack()
        return this.FuncCall()
      }
      return variable
    } else {
      return this.Literal()
    }
  }

  FuncCall () {
    const ast = { type: 'FuncCall', identifier: null, arguments: [] }
    ast.identifier = this.match('T_IDENT').value
    this.match('T_PAR_OP')
    while (!this.currentIs('T_PAR_CL')) {
      ast.arguments.push(this.Expr())
      if (this.currentIs('T_COMMA')) this.match('T_COMMA')
    }
    this.match('T_PAR_CL')
    return ast
  }

  Variable () {
    const ast = { type: 'Variable', identifier: null }
    ast.identifier = this.match('T_IDENT').value
    return ast
  }

  Literal () {
    if (this.currentIs('T_BOOL')) return this.Boolean()
    if (this.currentIsOneOf(['T_STR_DBL', 'T_STR_SING'])) return this.String()
    if (this.currentIsOneOf(['T_INT', 'T_FLOAT'])) return this.Number()
  }

  String () {
    const ast = { type: 'String', value: '' }
    const value = this.matchOneOf(['T_STR_DBL', 'T_STR_SING']).value
    ast.value = value.substr(1, value.length - 2)
    return ast
  }

  Boolean () {
    const ast = { type: 'Boolean', value: null }
    ast.value = this.match('T_BOOL').value.toUpperCase() === 'TRUE'
    return ast
  }

  Number () {
    if (this.currentIs('T_INT')) return this.Integer()
    if (this.currentIs('T_FLOAT')) return this.Float()
    this.matchOneOf(['T_INT', 'T_FLOAT'])
  }

  Integer () {
    const ast = { type: 'Integer', value: null }
    ast.value = parseInt(this.match('T_INT').value)
    return ast
  }

  Float () {
    const ast = { type: 'Float', value: null }
    ast.value = parseFloat(this.match('T_FLOAT').value)
    return ast
  }
}

export default Parser
