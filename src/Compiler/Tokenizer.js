import Token from './Token'

class Tokenizer {
  static tokenTypes = {
    T_NL: '[\\n\\r]',
    T_WS: '\\s+',
    T_TERM: ';',
    T_COMMA: ',',

    T_PAR_OP: '\\(',
    T_PAR_CL: '\\)',
    T_BRA_OP: '\\{',
    T_BRA_CL: '\\}',

    T_OP_EQ: '==',
    T_OP_NEQ: '!=',
    T_OP_GT: '>',
    T_OP_GE: '>=',
    T_OP_LT: '<',
    T_OP_LE: '<=',

    T_OP_AND: '&&',
    T_OP_OR: '\\|\\|',
    T_OP_NOT: '!',

    T_ASSIGN_ADD: '\\+=',
    T_ASSIGN_SUB: '-=',
    T_ASSIGN_MUL: '\\*=',
    T_ASSIGN_DIV: '\\/=',
    T_ASSIGN: '=',

    T_OP_ADD: '\\+',
    T_OP_SUB: '-',
    T_OP_MUL: '\\*',
    T_OP_DIV: '\\/',
    T_OP_MOD: '%',
    T_OP_POW: '\\^',

    T_FLOAT: '\\d+\\.\\d+',
    T_INT: '\\d+',
    T_BOOL: '(TRUE|FALSE)',
    T_STR_DBL: '"[^"]*"',
    T_STR_SING: '\'[^\']*\'',

    T_FUNC: 'func',
    T_VAR: 'var',
    T_RET: 'return',

    T_FOR: 'for',
    T_WHILE: 'while',
    T_CONTINUE: 'continue',
    T_IF: 'if',
    T_ELSE: 'else',

    T_TYPE_VOID: 'void',
    T_TYPE_INT: 'int',
    T_TYPE_FLOAT: 'float',
    T_TYPE_BOOL: 'bool',
    T_TYPE_STR: 'str',

    T_IDENT: '[_a-z][_a-z0-9]*'
  }
  static removeComments (src) {
    return src.replace(/\/\/[^\r\n]*/g, '')
  }
  static tokenize (src) {
    let charQueue = Tokenizer.removeComments(src)
    let column = 1
    let line = 1
    const tokenQueue = []
    while (charQueue.length > 0) {
      let found = false
      for (let tokenType in Tokenizer.tokenTypes) {
        const re = new RegExp('^' + Tokenizer.tokenTypes[tokenType], 'i')
        const m = re.exec(charQueue)
        if (m !== null) {
          found = true
          const str = m[0]
          const len = str.length
          if (tokenType === 'T_NL') {
            line += 1
            column = 0
          }
          if (tokenType !== 'T_WS' && tokenType !== 'T_NL') {
            tokenQueue.push(new Token(tokenType, str, { line, column }))
          }
          charQueue = charQueue.substr(len)
          column += len
        }
      }
      if (!found) {
        const substr = charQueue.substr(0, 10)
        throw new Error('Tokenization error. No token found on line ' + line + ' column ' + column + ': ' + substr)
      }
      found = false
    }
    return tokenQueue
  }
}

export default Tokenizer
