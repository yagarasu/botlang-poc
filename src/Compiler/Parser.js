class Parser {
  constructor (tokens) {
    this.tokens = tokens
    this.pointer = 0
  }
  static parse (tokens) {
    const parser = new Parser(tokens)
    const ast = parser.integer()
    return {}
  }

  syntaxError (type) {
    const { type: curType , position } = this.current()
    throw new Error('Unexpected ' + curType + ' on ' + position.row + ', line ' + position.position + '. Expecting ' + type)
  }

  current () {
    if (!this.tokens.length) return undefined
    if (this.pointer >= this.pointer.length) return undefined
    return this.tokens[this.pointer]
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

  /**
   * Rules
   */
  integer () {
    const token = this.match('T_INT')
    return {
      type: 'Integer',
      value: parseInt(token.value)
    }
  }
}

export default Parser
