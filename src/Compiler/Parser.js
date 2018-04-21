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
    console.log('Program')
    const ast = { type: 'Program', body: [] }
    while(this.pointer < this.tokens.length) {
      const current = this.Stmt()
      ast.body.push(current)
    }
    return ast
  }

  Stmt () {
    console.log('Stmt')
    if (this.currentIs('T_VAR')) {
      return this.VarDeclaration()
    } else if (this.currentIs('T_FUNC')) {
      return this.FuncDeclaration()
    } else {
      return this.Expr()
    }
  }

  VarDeclaration () {
    console.log('VarDeclaration')
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
    this.match('T_TERM')
    return ast
  }

  FuncDeclaration () {
    console.log('FuncDeclaration')
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
    console.log('ArgList')
    if (!this.currentIs('T_IDENT')) return []
    const args = [this.match('T_IDENT').value]
    while (this.currentIs('T_COMMA')) {
      this.match('T_COMMA')
      args.push(this.match('T_IDENT').value)
    }
    return args
  }

  Block () {
    console.log('Block')
    const body = []
    while (!this.currentIs('T_BRA_CL')) {
      body.push(this.Stmt())
    }
    return body
  }

  VarType () {
    console.log('VarType')
    return this.matchOneOf([
      'T_TYPE_INT',
      'T_TYPE_FLOAT',
      'T_TYPE_BOOL',
      'T_TYPE_STR'
    ])
  }

  Expr () {
    console.log('Expr')
    return this.AssignmentOperation()
  }

  AssignmentOperation () {
    console.log('AssignmentOperation')
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
    console.log('LogicalOrOperation')
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
    console.log('LogicalAndOperation')
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
    console.log('CompOperation')
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
    console.log('SumOperation')
    const ast = { type: 'SumatoryOperation', left: null, op: null, right: null }
    ast.left = this.MultOperation()
    if (!this.currentIs('T_OP_ADD') && !this.currentIs('T_OP_SUB')) return ast.left
    ast.op = this.matchOneOf(['T_OP_ADD', 'T_OP_SUB']).value
    ast.right = this.MultOperation()
    if (this.currentIs('T_OP_ADD') || this.currentIs('T_OP_SUB')) {
      this.backtrack()
      ast.right = this.SumOperation()
    }
    return ast
  }

  MultOperation () {
    console.log('SumOperation')
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
    console.log('Factor')
    if (this.currentIs('T_PAR_OP')) {
      this.match('T_PAR_OP')
      const value = this.Expr()
      this.match('T_PAR_CL')
      return value
    } else {
      return this.Number()
    }
  }

  Number () {
    console.log('Number')
    if (this.currentIs('T_INT')) return this.Integer()
    if (this.currentIs('T_FLOAT')) return this.Float()
    this.matchOneOf(['T_INT', 'T_FLOAT'])
  }

  Integer () {
    console.log('Integer')
    const ast = { type: 'Integer', value: null }
    ast.value = parseInt(this.match('T_INT').value)
    return ast
  }

  Float () {
    console.log('Float')
    const ast = { type: 'Float', value: null }
    ast.value = parseFloat(this.match('T_FLOAT').value)
    return ast
  }
}

export default Parser
