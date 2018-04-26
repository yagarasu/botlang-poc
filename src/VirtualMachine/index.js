import * as ops from './opcodes'

const STACK_SIZE = 1024

export default class VirtualMachine {
  constructor () {
    this.raw = null
    this.header = null
    this.code = null
    this.data = null
    this.stack = null

    this.ip = 0
    this.sp = -1
    this.fp = 0
  }

  load (bytes) {
    this.raw = bytes
    this.header = this.parseHeader(bytes)
    this.code = new Uint32Array(bytes, this.header.codeOffset, this.header.codeSize)
    this.data = new Uint32Array(bytes, this.header.dataOffset, this.header.dataSize)
    this.stack = new Uint32Array(STACK_SIZE)
    this.ip = 0
    this.sp = -1
    this.fp = 0
  }

  parseHeader (bytes) {
    const version = new Uint8Array(bytes, 0, 3)
    const sizes = new Uint32Array(bytes, 4, 4)
    return {
      version: {
        major: version[0],
        minor: version[1],
        patch: version[2]
      },
      codeOffset: sizes[0],
      codeSize: sizes[1],
      dataOffset: sizes[2],
      dataSize: sizes[3]
    }
  }

  peek () {
    return {
      raw: this.raw,
      header: this.header,
      code: this.code,
      data: this.data,
      stack: this.stack,
      registers: {
        ip: this.ip,
        sp: this.sp,
        fp: this.fp
      }
    }
  }
}
