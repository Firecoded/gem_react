import React, { Component } from 'react'


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
  
    render() {
        const {color} = this.props;
        return (
            <div className = {`gameboard-tile ${this.gemColorRef[color]}`}>
                
            </div>
        )
  }
}

export default GameboardTile
