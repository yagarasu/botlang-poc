import ConstantPoolEntry, { CONSTANT_POOL_ENTRY_TYPE_FUNC } from './ConstantPoolEntry'

class FuncConstantPoolEntry extends ConstantPoolEntry {
  getType () {
    return CONSTANT_POOL_ENTRY_TYPE_FUNC
  }
  encode () {
    if (!this.data) throw new TypeError('Call setData before encoding.')
    this.bytes = new Uint8Array(3)
    this.bytes[0] = this.data.address
    this.bytes[1] = this.data.numArgs
    this.bytes[2] = this.data.numLocs
  }
  decode () {
    if (!this.bytes) throw new TypeError('Call setBytes before encoding.')
    this.data = {
      address: this.bytes[0],
      numArgs: this.bytes[1],
      numLocs: this.bytes[2]
    }
  }
}

export default FuncConstantPoolEntry
