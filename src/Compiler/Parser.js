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
    const ast = { type: 'Statement', body: null }
    ast.body = this.Expr() // This will expand
    return ast
  }

  Expr () {
    const ast = { type: 'Expr', left: null, op: null, right: null }
    ast.left = this.Term()
    if (!this.currentIs('T_OP_ADD') && !this.currentIs('T_OP_SUB')) return ast.left
    ast.op = this.matchOneOf(['T_OP_ADD', 'T_OP_SUB']).value
    ast.right = this.Term()
    return ast
  }

  Term () {
    const ast = { type: 'Term', left: null, op: null, right: null }
    ast.left = this.Factor()
    if (!this.currentIs('T_OP_MUL') && !this.currentIs('T_OP_DIV')) return ast.left
    ast.op = this.matchOneOf(['T_OP_MUL', 'T_OP_DIV']).value
    ast.right = this.Factor()
    return ast
  }

  Factor () {
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
    return this.matchOneOf(['T_INT', 'T_FLOAT'])
  }

  Integer () {
    const ast = { type: 'Integer', value: null }
    ast.value = parseInt(this.match('T_INT').value)
    return ast
  }
}

export default Parser
