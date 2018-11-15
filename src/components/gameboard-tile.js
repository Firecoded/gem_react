import React, { Component } from 'react'
import './gameboard-tile.css';

class GameboardTile extends Component {
    constructor(props){
        super(props)

        this.gemColorRef = {
                'r' : 'red',
                'b' : 'blue',
                'g' : 'green',
                'y' : 'yellow',
                'br': 'brown',
                'p' : 'purple',
                'x' : 'bomb',
                'match': 'match'
            }
    }

    tileClick = () => {
        const {callBack, row, col} = this.props;
        callBack({y: row, x: col})
    }
  
    render() {
        const {color, row, col, highlight} = this.props;
        return (
            <div y = {row} x = {col} 
                 className = {`gameboard-tile ${this.gemColorRef[color]} ${highlight ? 'highlight' : ''}`} 
                 onClick = {this.tileClick}>
                
            </div>
        )
  }
}

export default GameboardTile
