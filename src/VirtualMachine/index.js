import opcodes, { op2mne, mne2op } from './opcodes'

export default class VirtualMachine {
  static stringToBytes (string) {
    const bytes = string.split(/[\s\r\n]+/)
    const bytearray = new ArrayBuffer(bytes.length)
    const uint = new Uint8Array(bytearray)
    bytes.forEach((byte, i) => {
      uint[i] = parseInt(byte, 16)
    })
    return bytearray
  }

  constructor (bytecode) {
    const bc = bytecode || new ArrayBuffer(0)
    this.loadBytecode(bc)
  }

  loadBytecode (bytecode) {
    this.bytecode = bytecode
    this.header = this.readHeader(bytecode)
    const { codeOffset, codeSize, dataOffset, dataSize } = this.header
    this.code = new Uint8Array(this.bytecode, codeOffset, codeSize)
    this.data = new Uint8Array(this.bytecode, dataOffset, dataSize)
    this.ptr = 0
    this.len = bytecode.length
  }

  readHeader (bytecode) {
    const header = {}
    const headerBytes = new Uint8Array(bytecode, 0)
    header.Version = {
      major: headerBytes[0],
      minor: headerBytes[1],
      patch: headerBytes[2]
    }
    const sizes = new Uint16Array(bytecode, 4, 4)
    header.codeOffset = sizes[0]
    header.codeSize  = sizes[1]
    header.dataOffset  = sizes[2]
    header.dataSize  = sizes[3]
    return header
  }

  run () {
    console.log(this.header)
    console.log(this.code)
    console.log(this.data)
  }

  step () {

  }

  exec (opcode, args) {

  }
}
