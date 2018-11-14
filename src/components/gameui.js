import React, { Component } from 'react';
import Gameboard from './gameboard';
import './gameui.css';

 class GameUI extends Component {
  
  
  
  
  
    render() {
        return (
        <div className="main-cont">
            <div className="gameboard-cont">
                <div className="header-cont"></div>
                <div className="player1-cont">
                    <div className="team"></div>
                    <div className="team"></div>
                    <div className="team"></div>
                    <div className="team"></div>
                </div>
                <div className="gameboard">
                    <Gameboard/>
                </div>
                <div className="player2-cont">
                    <div className="team"></div>
                    <div className="team"></div>
                    <div className="team"></div>
                    <div className="team"></div>
                </div>
            </div>
        </div>
        )
  }
}

export default GameUI;
