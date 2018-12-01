import React, { Component } from 'react';
import './character-select.css';

class CharacterSelect extends Component {
    constructor(props){
        super(props)

    }

    handleClick = (e) => {
        console.log(e.target.getAttribute('name'))
    }

    render() {
        return (
            <div className = 'character-select-cont'>
                <div className = 'character-avatars-cont'>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'luigi'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'mario'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'donkeyKong'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'link'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'samus'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'captainFalcon'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'ness'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'yoshi'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'kirby'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'fox'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'pikachu'> </div>
                    <div className = 'character-select-avatar ' onClick = {this.handleClick} name = 'jigglypuff'> </div>
                </div>
                <div className = "character-select-boxes-cont">
                    <div className = "box box1"></div>
                    <div className = "box box2"></div>
                    <div className = "box box3"></div>
                    <div className = "box box4"></div>
                </div>
            </div>
        )
    }
}

export default CharacterSelect;
