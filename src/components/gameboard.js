import React, { Component } from 'react';
import GameboardTile from './gameboard-tile';
import "./gameboard.css";

class Gameboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            gameboardArray: [],
            domElementsArray: []
        }
        this.gameboardArrayCopy = [];
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
        this.directionCheck = {
            'up': {'y': -1, 'x': 0},
            'right': {'y': 0, 'x': 1},
            'down' : {'y': 1, 'x': 0},
            'left' : {'y': 0, 'x': -1}
        }
        this.boardSize = 8;
        this.runCheckMatch = false;
    }
    componentDidMount = () => {
      this.buildGameboardArray(this.boardSize);
    }  
    buildGameboardArray = (size) => {
        let array = [];
        for(let i = 0; i<size; i++){
            let iArr = []
            array.push(iArr);
            for(let j = 0; j<size; j++){
                let temp = this.decideGem();
                array[i].push(temp);
            }
        }
        this.setState({
            gameboardArray : array
        }, ()=>{
            this.gameboardArrayCopy = array;
            this.initGameboard();
        })
    }
    initGameboard = () => {
        this.preventMatchesOnBuild();  
    }
    preventMatchesOnBuild = () => {
        const {gameboardArray} = this.state;
        for(let i = 0; i<this.boardSize; i++){
            for(let j = 0; j<this.boardSize; j ++){
                let dirArr = Object.keys(this.directionCheck);
                let color = gameboardArray[i][j];
                for(let dirI = 0; dirI < dirArr.length; dirI++){
                    let direction = dirArr[dirI]
                    let adjY = i + this.directionCheck[direction].y;
                    let adjX = i + this.directionCheck[direction].x;
                    if(this.checkOffBoard(adjY, adjX)){
                        continue;
                    }
                    if(gameboardArray[adjY][adjX] === color){
                        this.checkFurther({y: adjY, x: adjX}, [{y: i, x: j}, {y: adjY, x: adjX}], direction, 2, color)
                    }
                }
            }
        }
        this.setState({
            gameboardArray: this.gameboardArrayCopy
        }, this.renderTiles())    
    }
    checkFurther = (toCheckCords, matchesArr, direction, count, color) => {
        const {gameboardArray} = this.state;
        let adjY = toCheckCords.y + this.directionCheck[direction].y;
        let adjX = toCheckCords.x + this.directionCheck[direction].x;
        if(this.checkOffBoard(adjY, adjX)){
            if (count > 2){
                for(let i = 0; i < matchesArr.length; i++){
                    this.gameboardArrayCopy[matchesArr[i].y][matchesArr[i].x] = this.decideGem(color);
                }
            }  
            return;
        }
        if(gameboardArray[adjY][adjX] === color){
            matchesArr.push({y: adjY, x: adjX});
            this.checkFurther({y: adjY, x: adjX}, matchesArr, direction, ++count, color)
        } else {
            if (count < 3){
                return;
            }       
            for(let i = 0; i < matchesArr.length; i++){
                this.gameboardArrayCopy[matchesArr[i].y][matchesArr[i].x] = this.decideGem(color);
            }
        }
    }

    checkOffBoard = (y, x) => {
        if(y < 0 || y > this.boardSize-1 || x < 0 || x > this.boardSize-1){
            return true;
        }
        return false;
    }

    decideGem = (color) => {
        let randomNum = Math.floor(Math.random() * 7);
        let gemArray = Object.keys(this.gemColorRef);

        return gemArray[randomNum];
    }

    renderTiles = () => { 
        const {gameboardArray} = this.state;
        let array = [];
        for(let i = 0; i<this.boardSize; i++){
            for(let j = 0; j<this.boardSize; j++){
                let domElement = <GameboardTile color = {gameboardArray[i][j]}key = {i+''+j}/>
                array.push(domElement);
            }
        }
        this.setState({
            domElementsArray: array
        }, ()=>{
            this.gameboardArrayCopy = gameboardArray;
        })
    }
    

    render() {
        console.log(this.state.gameboardArray)
        return (
            <div className = 'game-cont'>
                {this.state.domElementsArray}
            </div>
        )
    }
}

export default Gameboard;
