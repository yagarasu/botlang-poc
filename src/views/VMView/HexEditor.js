import React, { Component } from 'react'

const formatHex = num => {
  const str = ('00000000' + num.toString(16)).substr(-8).toUpperCase()
  return str.substr(0, 4) + ' ' + str.substr(4)
}

const formatByte = num => ('00' + num.toString(16)).substr(-2).toUpperCase()

const pos2Idx = (col, row) => (row * 16) + col

export default class HexEditor extends Component {
  state = {
    selected: null,
    hovered: null
  }
  handleClick = idx => e => {
    const { selected } = this.state
    if (selected === null) {
      this.setState({ selected: idx })
    }
  }
  handleHover = idx => e => {
    this.setState({ hovered: idx })
  }
  handleInputKey = idx => e => {
    if (e.which === 13) {
      if (this.props.onChange)
        this.props.onChange(idx, e.target.value)
      this.setState({ selected: null })
    }
  }
  render () {
    const { data } = this.props
    const { selected,
      hovered } = this.state
    const rowCount = Math.ceil(data.length / 16)
    const rows = []
    for (let row = 0; row < rowCount; row++) {
      const cols = []
      const chars = []
      for (let col = 0; col <= 15; col++) {
        const idx = pos2Idx(col, row)
        const byte = data[idx]
        if (byte === undefined) {
          cols.push(<td key={`${col}-${row}`}>-</td>)
          chars.push (<span key={`${col}-${row}`}>·</span>)
          continue
        }
        cols.push(
          <td
            key={`${col}-${row}`}
            style={idx === hovered ? { background: 'yellow' } : (idx === selected) ? { background: 'cyan' } : null}
            onClick={this.handleClick(idx)}
            onMouseEnter={this.handleHover(idx)}
          >
            {
              (idx === selected)
              ? (<input
                  autoFocus
                  defaultValue={formatByte(byte)}
                  onKeyUp={this.handleInputKey(idx)}
                  style={{ border: 0, background: 'transparent', fontFamily: 'monospace', width: '32px' }}
                />)
              : formatByte(byte)
            }
          </td>
        )
        const strChar = byte >= 32 ? String.fromCharCode(byte) : '·'
        chars.push (
          <span
            key={`${col}-${row}`}
            style={idx === hovered ? { background: 'yellow' } : (idx === selected) ? { background: 'cyan' } : null}
            onClick={this.handleClick(idx)}
            onMouseEnter={this.handleHover(idx)}
          >{strChar}</span>
        )
      }
      rows.push(
        <tr key={row}>
          <th>{formatHex(row * 16)}</th>
          {cols}
          <td>{chars}</td>
        </tr>
      )
    }
    return (
      <div>
        <table style={{ fontFamily: 'monospace', fontSize: '18px' }}>
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
    )
  }
}
