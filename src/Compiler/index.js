import Tokenizer from './Tokenizer'
import Parser from './Parser'

class Compiler {
  static tokenize (source) {
    const tokens = Tokenizer.tokenize(source)
    const ast = Parser.parse(tokens)
    return { tokens, ast }
  }
}

export default Compiler
