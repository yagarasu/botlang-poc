import React, { Component } from 'react'
import VirtualMachine from '../../VirtualMachine'
import HexEditor from './HexEditor'

export default class VMView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: '',
      highlight: null,
      source: [
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
      ]
    }
  }
  onSourceChange = (idx, val) => {
    const { source } = this.state
    const newSource = source.slice(0, idx)
    newSource.push(parseInt(val, 16))
    newSource.push(...source.slice(idx + 1))
    this.setState({ source: newSource })
  }
  onRunClick = e => {
    const { source } = this.state
    const byteTo32Byte = []
    for (let i = 0; i < source.length; i += 4) {
      const a = (source[i] || 0) << 24
      const b = (source[i + 1] || 0) << 16
      const c = (source[i + 2] || 0) << 8
      const d = (source[i + 3] || 0)
      byteTo32Byte.push(a + b + c + d)
    }
    const bytecode = Uint32Array.from(byteTo32Byte)
    const vm = new VirtualMachine()
    console.log('buffer', bytecode.buffer)
    vm.load(bytecode.buffer)
    vm.step()
    vm.step()
    console.log(bytecode)
    console.log(vm.peek())
  }
  render() {
    return (
      <div>
        <h2>VirtualMachine</h2>
        {this.state.error !== '' ? (
          <div style={{ color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb', padding: '10px' }}>
            {this.state.error}
          </div>
        ) : null}
        <div>
          <HexEditor
            onChange={this.onSourceChange}
            data={this.state.source}
            highlight={this.state.highlight}
          />
        </div>
        <div>
          <button onClick={this.onRunClick}>Run!</button>
        </div>
        <div style={{ display: 'flex' }}>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </div>
      </div>
    )
  }
}
