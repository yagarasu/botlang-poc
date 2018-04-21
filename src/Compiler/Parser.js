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
    if (this.currentIs('T_VAR')) {
      return this.VarDeclaration()
    } else if (this.currentIs('T_FUNC')) {
      return this.FuncDeclaration()
    } else {
      return this.SumOperation()
    }
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
    ast.value = this.SumOperation()
    this.match('T_TERM')
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

  Block () {
    const body = []
    while (!this.currentIs('T_BRA_CL')) {
      body.push(this.Stmt())
    }
    return body
  }

  VarType () {
    return this.matchOneOf([
      'T_TYPE_INT',
      'T_TYPE_FLOAT',
      'T_TYPE_BOOL',
      'T_TYPE_STR'
    ])
  }

  // @TODO: There's a bug here. 2 + 2 + 2 fails
  SumOperation () {
    const ast = { type: 'SumatoryOperation', left: null, op: null, right: null }
    ast.left = this.MultOperation()
    if (!this.currentIs('T_OP_ADD') && !this.currentIs('T_OP_SUB')) return ast.left
    ast.op = this.matchOneOf(['T_OP_ADD', 'T_OP_SUB']).value
    ast.right = this.MultOperation()
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
    return ast
  }

  Factor () {
    if (this.currentIs('T_PAR_OP')) {
      this.match('T_PAR_OP')
      const value = this.SumOperation()
      this.match('T_PAR_CL')
      return value
    } else {
      return this.Number()
    }
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
