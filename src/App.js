import React, { Component } from 'react';
import Compiler from './Compiler'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      source: '',
      tokens: [],
      ast: {}
    }
  }
  onCodeChange = e => {
    this.setState({ source: e.target.value })
  }
  onParseClick = e => {
    const { tokens, ast } = Compiler.tokenize(this.state.source)
    this.setState({ tokens, ast })
  }
  render() {
    return (
      <div>
        <h1>Parser</h1>
        <div>
          <textarea
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
