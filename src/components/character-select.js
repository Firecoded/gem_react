import React, { Component } from 'react';
import IndividualCharacter from './individual-character';
import './character-select.css';

class CharacterSelect extends Component {
    constructor(props){
        super(props)
        this.state = {
            team0: []
        }
        
    }

    handleClick = (e) => {
        let team0Copy = this.state.team0;
        if(team0Copy.length < 4){
            team0Copy.push(e.target.getAttribute('name'))
        }
        this.setState({
            team0: team0Copy
        })
    }

    updateTeamToParent = (teamArray) => {
        this.props.updateTeamCallback(teamArray)
    }
    hideCharSelect = () => {
        if(this.state.team0.length === 4){
            this.updateTeamToParent(this.state.team0);
            this.props.showHideCallback();
        }
        
    }

    render() {
        return (
            <div className = 'character-select-cont'>
                <div className = "close-character-select-btn" onClick = {this.hideCharSelect}></div>
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
                    <div className = "box box1"><IndividualCharacter playerDB = {this.props.playerDB} playerName = {this.state.team0[0]}/></div>
                    <div className = "box box2"><IndividualCharacter playerDB = {this.props.playerDB} playerName = {this.state.team0[1]}/></div>
                    <div className = "box box3"><IndividualCharacter playerDB = {this.props.playerDB} playerName = {this.state.team0[2]}/></div>
                    <div className = "box box4"><IndividualCharacter playerDB = {this.props.playerDB} playerName = {this.state.team0[3]}/></div>
                </div>
            </div>
        )
    }
}

export default CharacterSelect;
