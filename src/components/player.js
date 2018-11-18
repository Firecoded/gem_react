import React, { Component } from 'react';
import './player.css';

class Player extends Component {
    constructor(props){
        super(props)
        this.state = {
            styleObj:{}
        }
        this.test = {'backgroundColor': 'color: rgba(244, 248, 3, 0.6)'}
    }
    // componentDidMount = () => {
    //     if(this.props.playerInfo.gemsFull){
    //         let style = {'backgroundColor': 'color: rgba(244, 248, 3, 0.6)'};
    //         this.setState({
    //             styleObj: style
    //         })
    //     }
    // }
    // renderParent = () => {
    //     this.props.renderDomCallback();
    // }
  
  
  
    render() {
        const {currentPowerGemCount, powerGemCountMax, gemColor, gemsFull} = this.props.playerInfo;
        //console.log(this.props.playerInfo)
        
        return (
            <div className = {`player-cont ${gemsFull ? 'super-full': ''}`}>
                <div className = {`power-gem-indicator ${gemColor}`}>
                    <span className = 'power-gem-text'>{currentPowerGemCount + '/'+ powerGemCountMax}</span>
                </div>
            </div>
        )
  }
}

export default Player;
