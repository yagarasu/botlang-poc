import React, { Component } from 'react';
import Compiler from '../../Compiler'

export default class ParserView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      source: '',
      error: '',
      tokens: [],
      ast: {}
    }
  }
  onCodeKeyUp = e => {
    if (e.ctrlKey && e.which == 13 ) {
      this.onParseClick()
    }
  }
  onCodeChange = e => {
    this.setState({ error:'', source: e.target.value })
  }
  onParseClick = e => {
    try {
      const tokens = Compiler.tokenize(this.state.source)
      this.setState({ tokens })
      const ast = Compiler.parse(tokens)
      this.setState({ ast })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }
  render() {
    return (
      <div>
        <h2>Parser</h2>
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
          <button onClick={this.onParseClick}>Parse!</button>
        </div>
        <div style={{ display: 'flex' }}>
          <pre>{JSON.stringify(this.state.tokens,null,2)}</pre>
          <pre>{JSON.stringify(this.state.ast,null,2)}</pre>
        </div>
      </div>
    );
  }
}
