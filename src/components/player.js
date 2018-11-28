import React, { Component } from 'react';
import './player.css';
import captainFalcon from '../assets/images/characters/avatars/captainfalcon.png';
import donkeyKong from '../assets/images/characters/avatars/donkeykong.png';
import fox from '../assets/images/characters/avatars/fox.png';
import jigglypuff from '../assets/images/characters/avatars/jigglypuff.png';
import kirby from '../assets/images/characters/avatars/kirby.png';
import link from '../assets/images/characters/avatars/link.png';
import luigi from '../assets/images/characters/avatars/luigi.png';
import mario from '../assets/images/characters/avatars/mario.png';
import ness from '../assets/images/characters/avatars/ness.png';
import pikachu from '../assets/images/characters/avatars/pikachu.png';
import samus from '../assets/images/characters/avatars/samus.png';
import yoshi from '../assets/images/characters/avatars/yoshi.png';


class Player extends Component {
    constructor(props){
        super(props)
        this.state = {
            styleObj:{}
        }
    }
    
    componentDidMount = () => {
        this.playerImg = this.assignPlayerAvatar(this.props.playerInfo.avatar);
        this.setState({
                styleObj: {
            'backgroundImage': `url(${this.playerImg})`,
            'position': 'relative',
            'backgroundPosition': 'center',
            'height': '100%'
            }
        })
    }
    assignPlayerAvatar = (avatar) => {
        const avatarObjRef = {
            'captainFalcon': captainFalcon,
            'donkeyKong': donkeyKong,
            'fox': fox,
            'jigglypuff': jigglypuff,
            'kirby': kirby,
            'link': link,
            'luigi': luigi,
            'mario': mario,
            'ness': ness,
            'pikachu': pikachu,
            'samus': samus,
            'yoshi': yoshi
        }
        return avatarObjRef[avatar];
    }
  
  
    render() {
        const {currentPowerGemCount, powerGemCountMax, gemColor, gemsFull} = this.props.playerInfo;
        console.log(this.props.playerInfo)
        return (
            <div className = {`player-cont ${gemsFull ? 'super-full': ''}`}>
                <div style = {this.state.styleObj}></div>
                <div className = {`power-gem-indicator ${gemColor}`}>
                    <span className = 'power-gem-text'>{currentPowerGemCount + '/'+ powerGemCountMax}</span>
                </div>
            </div>
        )
  }
}

export default Player;
