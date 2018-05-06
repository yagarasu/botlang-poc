import React, { Component } from 'react';
import Assembler from '../../Assembler'
import ConstantPool from '../../VirtualMachine/ConstantPool'

export default class AssemblerView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      source: '',
      error: '',
      bytes: [],
      ast: {}
    }
  }
  onCodeKeyUp = e => {
    if (e.ctrlKey && e.which == 13 ) {
      this.onAsmClick()
    }
  }
  onCodeChange = e => {
    this.setState({ error:'', source: e.target.value })
  }
  onAsmClick = e => {
    try {
      //const bytes = Assembler.assemble(this.state.source)
      const cp = new ConstantPool()
      cp.add('string', 'Lorem ipsum dolor sit amet')
      cp.add('float', Math.PI)
      cp.add('func', { address: 10, numArgs: 1, numLocs: 0 })
      const bytes = cp.encode()
      this.setState({ bytes })
      // .-..
      const cp2 = new ConstantPool()
      cp2.load(Uint8Array.from([3, 0, 0, 13, 26, 1, 1, 39, 8, 2, 2, 47, 3, 76, 111, 114, 101, 109, 32, 105, 112,
      115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116, 24, 45, 68,
      84, 251, 33, 9, 64, 10, 1, 0]))
      console.log('Reloaded', cp2.all())
    } catch (err) {
      this.setState({ error: err.message })
    }
  }
  render() {
    return (
      <div>
        <h2>Assembler</h2>
        {this.state.error !== '' ? (
          <div style={{ color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb', padding: '10px' }}>
            {this.state.error}
          </div>
        ) : null}
        <div>
          <textarea
            onKeyUp={this.onCodeKeyUp}
            onChange={this.onCodeChange}
            value={this.state.source}
            style={{ width: '100%', height: '300px' }}
          />
        </div>
        <div>
          <button onClick={this.onAsmClick}>Assemble!</button>
        </div>
        <div style={{ display: 'flex' }}>
          <pre>{JSON.stringify(this.state.bytes,null,2)}</pre>
        </div>
      </div>
    );
  }
}
