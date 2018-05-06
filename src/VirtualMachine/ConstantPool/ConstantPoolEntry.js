export const CONSTANT_POOL_ENTRY_TYPE_UNKNOWN = -1
export const CONSTANT_POOL_ENTRY_TYPE_STRING = 0x0
export const CONSTANT_POOL_ENTRY_TYPE_FLOAT = 0x1
export const CONSTANT_POOL_ENTRY_TYPE_FUNC = 0x2

class ConstantPoolEntry {
  constructor () {
    this.bytes = null
    this.data = null
  }

  setBytes (byteArray) {
    this.bytes = byteArray
    this.data = null
    this.decode()
  }

  setData (data) {
    this.data = data
    this.bytes = null
    this.encode()
  }

  getType () {
    return CONSTANT_POOL_ENTRY_TYPE_UNKNOWN
  }

  encode () {
    throw new Error('encode method must be implemented on subclasses')
  }

  decode () {
    throw new Error('encode method must be implemented on subclasses')
  }
}

export default ConstantPoolEntry
