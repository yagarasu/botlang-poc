import ConstantPoolEntry, { CONSTANT_POOL_ENTRY_TYPE_FLOAT } from './ConstantPoolEntry'

class FloatConstantPoolEntry extends ConstantPoolEntry {
  getType () {
    return CONSTANT_POOL_ENTRY_TYPE_FLOAT
  }
  encode () {
    if (!this.data) throw new TypeError('Call setData before encoding.')
    const farr = new Float64Array(1)
    farr[0] = this.data
    this.bytes = new Uint8Array(farr.buffer)
  }
  decode () {
    if (!this.bytes) throw new TypeError('Call setBytes before encoding.')
    const cloned = Uint8Array.from(this.bytes)
    const farr = new Float64Array(cloned.buffer)
    this.data = farr[0]
  }
}

export default FloatConstantPoolEntry
