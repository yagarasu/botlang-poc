import * as ops from './opcodes'
import * as optypes from './optypes'

const opReg = (vm, op) => (op.type >= optypes.OP_REG_A && op.type <= optypes.OP_REG_D)
  ? vm.getReg(op.reg)
  : null

const opRegPtr = (vm, op) => (op.type >= optypes.OP_REGPTR_A && op.type <= optypes.OP_REGPTR_D)
  ? vm.getMem(vm.getReg(op.reg))
  : null

const opRegPtrOff = (vm, op) => (op.type >= optypes.OP_REGPTROFF_A && op.type <= optypes.OP_REGPTROFF_D)
  ? vm.getMem(vm.getReg(op.reg) + op.offset)
  : null

const opAddr = (vm, op) => (opB.type === optypes.OP_ADDR)
  ? vm.getMem(opB.address)
  : null

const opConst = (vm, op) => (opB.type === optypes.OP_CONST)
  ? opB.value
  : null

const or = (vm, op, fns) => {
  for (fn in fns) {
    const res = fn(vm, op)
    if (res !== null) return res
  }
  return null
}

export default {
  // HLT
  [ops.OPC_HLT]: (vm) => {
    vm.halt()
  },

  // IADD <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_IADD]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA + valB)
  },

  // FADD <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_FADD]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = parseFloat(vm.getReg(opA.reg))
    const valB = parseFloat(or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst]))
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA + valB)
  },

  // ISUB <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_ISUB]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA - valB)
  },

  // FSUB <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_FSUB]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = parseFloat(vm.getReg(opA.reg))
    const valB = parseFloat(or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst]))
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA - valB)
  },

  // IMUL <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_IMUL]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA * valB)
  },

  // FMUL <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_FMUL]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = parseFloat(vm.getReg(opA.reg))
    const valB = parseFloat(or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst]))
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA * valB)
  },

  // IDIV <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_IDIV]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, Math.round(valA / valB))
  },

  // FDIV <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_FDIV]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = parseFloat(vm.getReg(opA.reg))
    const valB = parseFloat(or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst]))
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA / valB)
  },

  // IMOD <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_IMOD]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, Math.round(valA % valB))
  },

  // IPOW <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_IPOW]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, Math.pow(valA, valB))
  },

  // INC ( <reg> | <mem> )
  [ops.OPC_INC]: (vm, opA) => {
    const val = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr]) + 1
    if (opA.type >= optypes.OP_REG_A && opA.type <= optypes.OP_REG_D) {
      vm.setReg(opA.reg, val)
    } else if (opA.type >= optypes.OP_REGPTR_A && opA.type <= optypes.OP_REGPTR_D) {
      vm.setMem(vm.getReg(opA.reg), val)
    } else if (opA.type >= optypes.OP_REGPTROFF_A && opA.type <= optypes.OP_REGPTROFF_D) {
      vm.setMem(vm.getReg(opA.reg) + opA.offset, val)
    } else if (opA.type === optypes.OP_ADDR) {
      vm.setMem(opA.address, val)
    }
  },

  // DEC ( <reg> | <mem> )
  [ops.OPC_DEC]: (vm, opA) => {
    const val = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr]) - 1
    if (opA.type >= optypes.OP_REG_A && opA.type <= optypes.OP_REG_D) {
      vm.setReg(opA.reg, val)
    } else if (opA.type >= optypes.OP_REGPTR_A && opA.type <= optypes.OP_REGPTR_D) {
      vm.setMem(vm.getReg(opA.reg), val)
    } else if (opA.type >= optypes.OP_REGPTROFF_A && opA.type <= optypes.OP_REGPTROFF_D) {
      vm.setMem(vm.getReg(opA.reg) + opA.offset, val)
    } else if (opA.type === optypes.OP_ADDR) {
      vm.setMem(opA.address, val)
    }
  },

  // AND <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_AND]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA & valB)
  },

  // OR <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_OR]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA | valB)
  },

  // XOR <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_XOR]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA ^ valB)
  },

  // SHR <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_SHR]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA >> valB)
  },

  // SHL <reg>, ( <reg> | <mem> | <const> )
  [ops.OPC_SHL]: (vm, opA, opB) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    const valB = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (valB === null) throw new Error('Unexpected operator')
    vm.setReg(opA.reg, valA << valB)
  },

  // NEG <reg>
  [ops.OPC_NEG]: (vm, opA) => {
    if (opA.type <= optypes.OP_REG_A && opA.type >= optypes.OP_REG_D) throw new Error('Expecting a register')
    const valA = vm.getReg(opA.reg)
    vm.setReg(opA.reg, ~valA)
  },

  // MOV ( <reg> | <mem> ), ( <reg> | <mem> | <const> )
  [ops.OPC_MOV]: (vm, opA, opB) => {
    const val = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    if (opA.type >= optypes.OP_REG_A && opA.type <= optypes.OP_REG_D) {
      vm.setReg(opA.reg, val)
    } else if (opA.type >= optypes.OP_REGPTR_A && opA.type <= optypes.OP_REGPTR_D) {
      vm.setMem(vm.getReg(opA.reg), val)
    } else if (opA.type >= optypes.OP_REGPTROFF_A && opA.type <= optypes.OP_REGPTROFF_D) {
      vm.setMem(vm.getReg(opA.reg) + opA.offset, val)
    } else if (opA.type === optypes.OP_ADDR) {
      vm.setMem(opA.address, val)
    }
  },

  // PUSH ( <reg> | <mem> | <const> )
  [ops.OPC_PUSH]: (vm, opA, opB) => {
    const val = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    vm.push(val)
  },

  // PUSH16 ( <reg> | <mem> | <const> )
  [ops.OPC_PUSH16]: (vm, opA, opB) => {
    const val = or(vm, opB, [opReg, opRegPtr, opRegPtrOff, opAddr, opConst])
    vm.push16b(val)
  },

  // POP ( <reg> | <mem> | <const> )
  [ops.OPC_POP]: (vm, opA, opB) => {
    const val = vm.pop()
    if (opA.type >= optypes.OP_REG_A && opA.type <= optypes.OP_REG_D) {
      vm.setReg(opA.reg, val)
    } else if (opA.type >= optypes.OP_REGPTR_A && opA.type <= optypes.OP_REGPTR_D) {
      vm.setMem(vm.getReg(opA.reg), val)
    } else if (opA.type >= optypes.OP_REGPTROFF_A && opA.type <= optypes.OP_REGPTROFF_D) {
      vm.setMem(vm.getReg(opA.reg) + opA.offset, val)
    } else if (opA.type === optypes.OP_ADDR) {
      vm.setMem(opA.address, val)
    }
  },

  // POP16 ( <reg> | <mem> | <const> )
  [ops.OPC_POP16]: (vm, opA, opB) => {
    const val = vm.pop16b()
    if (opA.type >= optypes.OP_REG_A && opA.type <= optypes.OP_REG_D) {
      vm.setReg(opA.reg, val)
    } else if (opA.type >= optypes.OP_REGPTR_A && opA.type <= optypes.OP_REGPTR_D) {
      vm.setMem(vm.getReg(opA.reg), val)
    } else if (opA.type >= optypes.OP_REGPTROFF_A && opA.type <= optypes.OP_REGPTROFF_D) {
      vm.setMem(vm.getReg(opA.reg) + opA.offset, val)
    } else if (opA.type === optypes.OP_ADDR) {
      vm.setMem(opA.address, val)
    }
  },
}
