export default class Assembler {
  static assemble (code) {
    const tokens = Assembler.tokenize(code)
    console.log(tokens)
    const bytes = Assembler.parse(tokens)
    return bytes
  }

  static tokenize (code) {
    let buffer = code
    const tokenList = []
    const tokens = {
      'WS': '[\\s\\n\\r]+',
      'cmd': '(HLT|ADD|ICONST|SCONST)',
      'ICONST': 'ICONST',
      'opBra': '\\[',
      'clBra': '\\]',
      'label': '[a-zA-Z_.][a-zA-Z0-9_\\-.]*:',
      'labelRef': '[a-zA-Z_.][a-zA-Z0-9_\\-.]*',
      'str': '(\'|")([^\'"]+)(\\1)',
      'binInt': '0b\\[0-1]+',
      'hexInt': '0x\\d+',
      'decInt': '-?\\d+'
    }
    const createToken = (type, raw) => ({ type, raw })
    let found = false
    while (buffer.length > 0) {
      found = false
      for (let tokenType in tokens) {
        const re = new RegExp('^' + tokens[tokenType])
        const m = buffer.match(re)
        console.log(re, m, buffer.substr(0, 10))
        if (m === null) continue
        console.log('len', m[0].length)
        buffer = buffer.substr(m[0].length)
        if (tokenType === 'WS') continue
        const newToken = createToken(tokenType, m[0])
        tokenList.push(newToken)
        found = true
        break
      }
      if (!found) throw new TypeError('Unknown token for ' + buffer.substr(0, 10))
    }
    return tokenList
  }

  static parse (tokens) {
    const context = {
      globals: {},
      constants: {}
    }
    const strings = []
    const funcs = {}
    const code = []
    let ptr = 0
    let f = 0
    const is = (type) => tokens[ptr].type === type
    const isOneOf = (types) => types.includes(tokens[ptr].type)
    const match = (type) => {
      const token = tokens[ptr++]
      if (token.type !== type) throw new TypeError('Unexpected ' + token.type + '. Expecting ' + type)
      return token
    }
    const parseLabel = () => {
      const token = match('label')
      const name = token.raw.substr(0,token.raw.length - 1)
      funcs[name] = { type: 'func', ptr }
    }
    const parseParam = () => {
      if (is('decInt')) {
        const val = parseInt(match('decInt').raw, 10)
        code.push(val)
      } else if (is('hexInt')) {
        const val = parseInt(match('hexInt').raw.substr(2), 16)
        code.push(val)
      } else if (is('binInt')) {
        const val = parseInt(match('binInt').raw.substr(2), 2)
        code.push(val)
      } else if (is('str')) {
        const token = match('str')
        const val = token.raw.substr(1, token.raw.length - 2)
        const poolIdx = strings.push(val) - 1
        // 0b01000000000000000000000000000000
        const ref = 0x40000000 | poolIdx
        code.push(ref)
      } else if (is('labelRef')) {
        code.push(match('labelRef').raw)
      }
    }
    const parseCmd = () => {
      const token = match('cmd')
      const cmds = [
        'HLT',
        'ADD',
        'ICONST',
        'SCONST'
      ]
      const operandCount = {
        'SCONST': 1,
        'ICONST': 1
      }
      const bytecode = cmds.indexOf(token.raw)
      code.push(bytecode)
      const opCount = operandCount[token.raw] || 0
      for (let i = 0; i < opCount; i++) {
        parseParam()
      }
    }
    while (ptr < tokens.length && f < 100) {
      f++
      if (is('label')) {
        parseLabel()
      } else {
        parseCmd()
      }
    }
    // Replace label refs
    for (let i = 0; i < code.length; i++) {
      if (typeof code[i] === 'string') {
        const func = funcs[code[i]]
        if (!func) throw new TypeError('Label ' + code[i] + ' not defined')
        code[i] = func.ptr
      }
    }
    // Strings
    let stringBytes = []
    for (let s = 0; s < strings.length; s++) {
      const str = strings[s]
      const bytes = []
      for (let ss = 0; ss < str.length; ss++) {
        bytes.push(str.charCodeAt(ss))
      }
      stringBytes = stringBytes.concat(bytes)
    }
    code.push(...stringBytes)
    return code
  }
}
