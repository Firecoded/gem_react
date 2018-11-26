import React, { Component } from 'react';
import Gameboard from './gameboard';
import Player from './player';
import playerDB from './playerDB';
import './gameui.css';

 class GameUI extends Component {
   constructor(props){
    super(props)
    this.state ={
        team0: [],
        team1: [],
        team0DomElements: [],
        team1DomElements: [],
        playerTurn: 0
    }
    //this.playerRef = {team0: 'team0DomElements', team1: 'team1DomElements'}
    this.playerDB = require('./playerDB.js')
    this.playerDBCopy = Object.assign({}, this.playerDB)
   }
  
    componentDidMount = () => {
        //character selection process

        this.setState({
            team0: ['pikachu', 'ness', 'fox', 'samus'],
            team1: ['mario', 'luigi', 'kirby', 'jigglypuff']
        }, this.addPlayersToDom)
   }
    returnRandNum = () => Math.floor(Math.random() * 10000)
    switchTurns = () => {
        let switcher = this.state.playerTurn;
        switcher = 1 - switcher;
        this.setState({
            playerTurn: switcher
        })
    }
    
    addPlayersToDom = () => {
        let arr1 = [];
        let arr2 = [];
        this.state.team0.map((item, index)=>{
            arr1.push(<Player key = {this.returnRandNum()} playerInfo= {this.playerDB.data[item]}/>)
        })
        this.state.team1.map((item, index)=>{
            arr2.push(<Player key = {this.returnRandNum()} playerInfo= {this.playerDBCopy.data[item]}/>)
        })
        this.setState({
            team0DomElements: arr1,
            team1DomElements: arr2
        })
    }
    updateGemCount = (colorCountObj) =>{
        console.log('colorcountobj', colorCountObj)
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
    
    render() {
        console.log(this.state)
        
        return (
        <div className="main-cont">
            <div className="gameboard-cont">
                <div className="header-cont"></div>
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
