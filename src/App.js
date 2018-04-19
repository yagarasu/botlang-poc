import React, { Component } from 'react';

import Compiler from './Compiler'

const src = `
// Comment
`

export default class App extends Component {
  constructor (props) {
    super(props)
    Compiler.parse(src)
  }
  render() {
    return (
      <div>
        <h1>Hello, World!</h1>
      </div>
    );
  }
}
