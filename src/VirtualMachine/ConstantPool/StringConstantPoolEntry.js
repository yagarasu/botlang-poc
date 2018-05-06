import ConstantPoolEntry, { CONSTANT_POOL_ENTRY_TYPE_STRING } from './ConstantPoolEntry'

class StringConstantPoolEntry extends ConstantPoolEntry {
  getType () {
    return CONSTANT_POOL_ENTRY_TYPE_STRING
  }
  encode () {
    if (!this.data) throw new TypeError('Call setData before encoding.')
    const encoded = new TextEncoder('utf-8').encode(this.data)
    this.bytes = encoded
  }
  decode () {
    if (!this.bytes) throw new TypeError('Call setBytes before encoding.')
    const decoded = new TextDecoder('utf-8').decode(this.bytes)
    this.data = decoded
  }
}

export default StringConstantPoolEntry
