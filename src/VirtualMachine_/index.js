import * as optypes from './optypes'
import opcodeImplementation from './opcodeImplementation'

const MEMORY_SIZE = 0xFFFF
const STACK_ADDR = 0xFEFF

export default class VirtualMachine {
  constructor() {
    this.pc = 0
    this.sp = 0
    this.regs = new Uint16Array(4)
    this.raw = new ArrayBuffer(MEMORY_SIZE)
    this.mem = new Uint8Array(this.raw)
    this.stack = new Uint16Array(this.raw, STACK_ADDR)
    this.running = false
  }

  setReg (reg, value) {
    if (reg < 0 && reg > 3) throw new Error('Invalid register ' + reg)
    this.regs[reg] = (0xFFFF & value)
  }

  getReg (reg) {
    if (reg < 0 && reg > 3) throw new Error('Invalid register ' + reg)
    return this.regs[reg]
  }

  getMem (addr) {
    const idx = addr / 8
    return this.mem[idx]
  }

  setMem (addr, val) {
    const idx = addr / 8
    const lsb = (0x00FF & val)
    const msb = (0xFF00 & val)
    this.mem[idx] = msb
    this.mem[idx + 1] = lsb
  }

  load (code) {
    for (let i = 0; i < code.length; i++) {
      this.mem[i] = code[i]
    }
  }

  fetch () {
    return this.mem[this.pc++]
  }

  fetch16b () {
    return this.fetch() + (this.fetch() << 8)
  }

  run () {
    this.running = true
    while (this.running && this.pc < this.mem.length) {
      this.execute()
    }
  }

  execute () {
    const ops = this.fetch()
    const opcode = this.fetch()
    const [opA, opB] = this.decodeOps(ops)
    opcodeImplementation[opcode](this, opA, opB)
  }

  decodeOps (ops) {
    const a = (0xF0 & ops) >> 4
    const b = (0xF & ops)
    const opA = { type: a }
    const opB = { type: b }
    const fetchReg = (op) => (0x3 & op)
    const fetchAll = (op) => {
      if (op.type >= optypes.OP_REG_A && op.type <= optypes.OP_REGPTROFF_D) {
        op.reg = fetchReg(op)
      }
      if (op.type >= optypes.OP_REGPTROFF_A && op.type <= optypes.OP_REGPTROFF_D) {
        op.offset = this.fetch16b()
      } else if (op.type === optypes.OP_ADDR) {
        op.address = this.fetch16b()
      } else if (op.type === optypes.OP_CONST) {
        op.value = this.fetch16b()
      }
    }
    fetchAll(opA)
    fetchAll(opB)
    return [opA, opB]
  }

  push (val) {
    this.stack[++this.sp] = val & 0xFF
  }

  push16b (val) {
    const msb = (0xFF00 & val) >> 8
    const lsb = 0x00FF & val
    this.push(lsb)
    this.push(msb)
  }

  pop () {
    return this.stack[this.sp--]
  }

  pop16b () {
    const msb = this.pop() << 8
    const lsb = this.pop()
    return msb + lsb
  }

  halt () {
    this.running = false
  }
}
