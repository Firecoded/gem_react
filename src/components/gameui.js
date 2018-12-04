import React, { Component } from 'react';
import Gameboard from './gameboard';
import Player from './player';
import CharacterSelect from './character-select';
import playerDB from './playerDB';
import './gameui.css';
import {FaAngleDown} from 'react-icons/fa';

 class GameUI extends Component {
   constructor(props){
    super(props)
    this.state ={
        team0: [],
        team1: [],
        team0DomElements: [],
        team1DomElements: [],
        playerTurn: 0,
        characterSelectScreen: false
    }
    //this.playerRef = {team0: 'team0DomElements', team1: 'team1DomElements'}
    this.playerDB = require('./playerDB.js')
    this.playerDBCopy = Object.assign({}, this.playerDB)
    this.moreThen3Match = false;
   }
  
    componentDidMount = () => {
        //character selection process
        this.setState({
            characterSelectScreen : true
        })
        
   }

    updateTeam0 = (teamArray) => {
        this.setState({
            team0: teamArray,
            team1: ['mario', 'luigi', 'kirby', 'jigglypuff']
        }, this.addPlayersToDom)
    }
    returnRandNum = () => Math.floor(Math.random() * 10000)
    switchTurns = () => {
        if(this.moreThen3Match){
            this.moreThen3Match = false;
            return;
        }
        let switcher = this.state.playerTurn;
        switcher = 1 - switcher;
        this.setState({
            playerTurn: switcher
        })
    }
    
    addPlayersToDom = () => {
        let arr1 = [];
        let arr2 = [];
        this.state.team0.map((item)=>{
            arr1.push(<Player key = {this.returnRandNum()} playerInfo= {this.playerDB.data[item]}/>)
        })
        this.state.team1.map((item)=>{
            arr2.push(<Player key = {this.returnRandNum()} playerInfo= {this.playerDBCopy.data[item]}/>)
        })
        this.setState({
            team0DomElements: arr1,
            team1DomElements: arr2
        })
    }
    updateGemCount = (colorCountObj) =>{
        console.log('colorcountobj', colorCountObj)
        if(colorCountObj.count > 3){
            this.moreThen3Match = true;
        }
        let currentTeam;
        let currentDomEl;
        if(this.state.playerTurn === 0){
            currentTeam = this.state.team0;
            currentDomEl = this.state.team0DomElements;
        } else {
            currentTeam = this.state.team1;
            currentDomEl = this.state.team1DomElements;
        }
        currentTeam.map((item, index)=>{
            if(this.playerDBCopy.data[item].gemsFull){
                return;
            }
            if(this.playerDBCopy.data[item].gemColor === colorCountObj.color){
                if((this.playerDBCopy.data[item].currentPowerGemCount + colorCountObj.count) >= this.playerDBCopy.data[item].powerGemCountMax){
                    this.playerDBCopy.data[item].gemsFull = true;
                    this.playerDBCopy.data[item].currentPowerGemCount = this.playerDBCopy.data[item].powerGemCountMax;
                } else {
                    this.playerDBCopy.data[item].currentPowerGemCount += colorCountObj.count;
                }    
            }
        })
        this.addPlayersToDom();
    }
    showHideCharSelect = () => {
        this.setState({
            characterSelectScreen: !this.state.characterSelectScreen
        })
    }
    
    render() {
        console.log(this.state)
        
        return (
        <div className="main-cont">
            <div className="gameboard-cont">
            {this.state.characterSelectScreen ? <CharacterSelect 
                    playerDB = {this.playerDBCopy}
                    updateTeamCallback = {this.updateTeam0} 
                    showHideCallback = {this.showHideCharSelect}/> : ''}
                <div className="header-cont">
                    <div className = {`left-icon ${this.state.playerTurn === 0 ? 'appear' : 'hidden'}`}>
                        <FaAngleDown  large='true'/>
                    </div>
                    <div className = {`right-icon ${this.state.playerTurn === 1 ? 'appear' : 'hidden'}`}>
                        <FaAngleDown  large='true'/>
                    </div>
                </div>
                <div className="player1-cont">
                    {this.state.team0DomElements}
                </div>
                <div className="gameboard">
                    <Gameboard switchTurnsCallback = {this.switchTurns} gemCountCallback = {this.updateGemCount}/>
                </div>
                <div className="player2-cont">
                    {this.state.team1DomElements}
                </div>
            </div>
        </div>
        )
  }
}

export default GameUI;
