export default class VirtualMachine {
  constructor () {
    this.pc = 0
    this.sp = -1
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
      this.execute()
      this.peek()
    }
  }

  fetch () {
    return this.mem[this.pc++]
  }

  decode (instr) {
    const map = {
      0: 'HLT',
      1: 'ICONST',
      2: 'IADD'
    }
    return map[instr]
  }

  execute () {
    const instrSet = {
      'HLT': this.doHLT.bind(this),
      'ICONST': this.doICONST.bind(this),
      'IADD': this.doIADD.bind(this)
    }
    const instr = this.decode(this.fetch())
    instrSet[instr]()
  }

  peek () {
    const { pc, sp } = this
    const cmd = this.mem[this.pc]
    const stack = sp > -1 ? this.stack.slice(0, sp + 1) : []
    console.log(`${pc}\tCMD ${cmd}\tSTACK [${stack.join(' ')}]`)
  }

  push (val) {
    this.stack[++this.sp] = val
  }

  pop () {
    return this.stack[this.sp--]
  }

  doHLT () {
    this.running = false
    console.log('halted')
  }

  doICONST () {
    const val = this.mem[this.pc++]
    this.push(val)
  }

  doIADD () {
    const b = this.pop()
    const a = this.pop()
    const r = a + b
    this.push(r)
  }
}
