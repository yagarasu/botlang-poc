import StringConstantPoolEntry from './StringConstantPoolEntry'
import FloatConstantPoolEntry from './FloatConstantPoolEntry'
import FuncConstantPoolEntry from './FuncConstantPoolEntry'

export default class ConstantPool {
  static entryFactory (type) {
    const factories = {
      'string': () => new StringConstantPoolEntry(),
      'float': () => new FloatConstantPoolEntry(),
      'func': () => new FuncConstantPoolEntry()
    }
    if (!factories[type]) throw new TypeError('Unknown type: ' + type)
    return factories[type]()
  }

  constructor () {
    this.constants = []
  }

  add (type, data) {
    const entry = ConstantPool.entryFactory(type)
    entry.setData(data)
    this.constants.push(entry)
  }

  get (index) {
    return this.constants[index]
  }

  all () {
    return this.constants
  }

  encode () {
    const table = []
    const data = []
    let curSize = 0
    const constantsCount = this.constants.length
    this.constants.forEach((constant, i) => {
      const curPos = curSize + (constantsCount * 4) + 1
      data.push(...constant.bytes)
      table.push(i, constant.getType(), curPos, constant.bytes.length)
      curSize += constant.bytes.length
    })
    const finalArray = [table.length / 4].concat(table, data)
    const bytes = Uint8Array.from(finalArray)
    return bytes
  }

  load (bytes) {
    this.constants = []
    const hexTypeToSting = {
      0x0: 'string',
      0x1: 'float',
      0x2: 'func'
    }
    const constantsCount = bytes[0]
    for (let i = 0; i < constantsCount; i++) {
      const curPos = 1 + (i * 4)
      const idx = bytes[curPos]
      const type = bytes[curPos + 1]
      const addr = bytes[curPos + 2]
      const size = bytes[curPos + 3]
      const entry = ConstantPool.entryFactory(hexTypeToSting[type])
      const entryContent = bytes.subarray(addr, addr + size)
      entry.setBytes(entryContent)
      this.constants.push(entry)
    }
  }
}
