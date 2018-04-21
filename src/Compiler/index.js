import Tokenizer from './Tokenizer'
import Parser from './Parser'

class Compiler {
  static tokenize (source) {
    const tokens = Tokenizer.tokenize(source)
    return tokens
  }
  static parse (tokens) {
    const ast = Parser.parse(tokens)
    return ast
  }
}

export default Compiler
