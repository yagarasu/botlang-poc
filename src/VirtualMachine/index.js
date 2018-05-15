import ConstantPool from './ConstantPool'

const opcodes = [
  'HLT',
  'ICONST',
  'FCONST',
  'SCONST',
  'BCONSTFALSE',
  'BCONSTTRUE',
  'CALL',
  'RET',
  'JMP',
  'JMPIFFALSE'
]

export default class VirtualMachine {
  constructor () {
    this.pc = 0
    this.sp = -1
    this.constantPool = new ConstantPool()
    this.mem = new Uint32Array(1000)
    this.stack = new Uint32Array(100)
    this.callstack = []
    this.running = false
  }

  load (code) {
    for (let i = 0; i < code.length; i++) {
      this.mem[i] = code[i]
    }
  }

  run () {
    console.log('running')
    this.running = true
    while (this.running && this.pc < this.mem.length) {
      this.peek()
      this.execute()
    }
  }

  fetch () {
    return this.mem[this.pc++]
  }

  decode (instr) {
    return opcodes[instr]
  }

  execute () {
    const op = this.fetch()
    const paramType = (op & 0x0F00) >> 8
    const stackType = (op & 0xF000) >> 12
    const instr = this.decode(op & 0xFF)
    if (instr === 'HLT') this.doHLT()
    if (instr === 'ICONST') {
      if (paramType === 1) {
        this.push((op & 0xFF0000) >> 16)
      } else if (paramType === 2) {
        this.push((op & 0xFFFF0000) >> 16)
      } else if (paramType === 3) {
        this.push(this.fetch())
      }
    }
    if (instr === 'FCONST' || instr === 'SCONST') {
      this.push(this.constantPool.get(this.fetch()))
    }
    if (instr === 'BCONSTFALSE') {
      this.push(0)
    }
    if (instr === 'BCONSTTRUE') {
      this.push(1)
    }
    if (instr === 'JMP') {
      if (paramType === 1) {
        this.pc = (op & 0xFF0000) >> 16
      } else if (paramType === 2) {
        this.pc = (op & 0xFFFF0000) >> 16
      } else if (paramType === 3) {
        this.pc = this.fetch()
      }
    }
    if (instr === 'JMPIFFALSE') {
      const test = !!this.pop()
      if (test) {
        if (paramType === 3) this.fetch()
        return
      }
      if (paramType === 1) {
        this.pc = (op & 0xFF0000) >> 16
      } else if (paramType === 2) {
        this.pc = (op & 0xFFFF0000) >> 16
      } else if (paramType === 3) {
        this.pc = this.fetch()
      }
    }
  }

  peek () {
    const { pc, sp } = this
    const cmd = this.mem[this.pc]
    const instr = this.decode(cmd & 0xFF)
    const stack = sp > -1 ? this.stack.slice(0, sp + 1) : []
    console.log(`${pc}\tCMD (${instr})${cmd}\tSTACK [${stack.join(' ')}]`)
  }

  push (val) {
    this.stack[++this.sp] = val
  }

  pop () {
    return this.stack[this.sp--]
  }

  doHLT () {
    this.running = false
  }
}
