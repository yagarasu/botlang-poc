import React, { Component } from 'react';
import {
  ParserView,
  AssemblerView,
  VMView
} from './views'

const views = {
  parser: (<ParserView />),
  assembler: (<AssemblerView />),
  vm: (<VMView />),
  default: (<p>Not found</p>)
}

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentView: 'parser'
    }
  }
  hndNavChange = newView => e => {
    this.setState({ currentView: newView })
  }
  getView = () => {
    const { currentView } = this.state
    if (!views[currentView]) return views.default
    return views[currentView]
  }
  render() {
    const view = this.getView()
    return (
      <div>
        <header>
          <h1>Botlang</h1>
          <nav>
            <button onClick={this.hndNavChange('parser')}>Parser</button>
            <button onClick={this.hndNavChange('assembler')}>Assembler</button>
            <button onClick={this.hndNavChange('vm')}>VirtualMachine</button>
          </nav>
        </header>
        <main>
          {view}
        </main>
      </div>
    );
  }
}
