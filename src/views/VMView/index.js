import React, { Component } from 'react';
import VirtualMachine from '../../VirtualMachine'

export default class VMView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      source: '',
      error: '',
      inMem: [],
      ctx: {}
    }
  }
  onCodeKeyUp = e => {
    if (e.ctrlKey && e.which == 13 ) {
      this.onRunClick()
    }
  }
  onCodeChange = e => {
    this.setState({ error:'', source: e.target.value })
  }
  onRunClick = e => {
    const { source } = this.state
    const inMem = VirtualMachine.stringToBytes(source)
    const vm = new VirtualMachine(inMem)
    vm.run()
    this.setState({ inMem })
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
          <textarea
            onKeyUp={this.onCodeKeyUp}
            onChange={this.onCodeChange}
            value={this.state.source}
            style={{ width: '100%', height: '100px' }}
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
