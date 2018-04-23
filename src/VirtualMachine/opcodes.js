const mnemonics = [
  'PUSH',
  'PULL',
  'MOV'
]

export const op2mne = (opcode) => mnemonics[opcode]
export const mne2op = (mnemonic) => mnemonics.indexOf(mnemonic)

export default mnemonics
