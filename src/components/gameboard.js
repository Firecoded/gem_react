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
        this.oppDirectionref = {
            'up': 'down',
            'right': 'left',
            'down' : 'up',
            'left' : 'right'
        }
        this.tShapedMatchRef = {
            'up': ['left', 'right'],
            'down': ['left', 'right'],
            'left': ['up', 'down'],
            'right': ['up', 'down']
        }
        this.boardSize = 8;
        this.matchesArray = [];
        this.clickTracker = {}
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
                if(j > 1){
                    var lastLeft = array[i][j-1]
                    var lastLeft2 = array[i][j-2]
                }
                if(i > 1){
                    var lastUp = array[i-1][j]
                    var lastUp2 = array[i-2][j]
                }
                let temp = this.decideGem(lastLeft, lastLeft2, lastUp, lastUp2);
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
        this.renderTiles();
        this.checkForPossibleMatches();
    }
    checkOffBoard = (y, x) => {
        if(y < 0 || y > this.boardSize-1 || x < 0 || x > this.boardSize-1){
            return true;
        }
        return false;
    }
    decideGem = (left, left2, up, up2) => {
        let randomNum = Math.floor(Math.random() * 7);
        let gemArray = Object.keys(this.gemColorRef);
        let gem = gemArray[randomNum];
        if((gem === left && gem === left2) || (gem === up && gem === up2)){
            gem = this.decideGem(left, left2, up, up2);
        }
        return gem;
    }

    
    checkForPossibleMatches = () => {
        const {gameboardArray} = this.state;
        for(let i = 0; i<this.boardSize; i++){
            for(let j = 0; j<this.boardSize; j ++){
                let dirArr = Object.keys(this.directionCheck);
                let color = gameboardArray[i][j];
                for(let dirI = 0; dirI < dirArr.length; dirI++){
                    let direction = dirArr[dirI]
                    let adjY = i + this.directionCheck[direction].y;
                    let adjX = j + this.directionCheck[direction].x;
                    if(this.checkOffBoard(adjY, adjX)){
                        continue;
                    }
                    this.checkNearbyMatches({start: {y: i, x: j}, 
                                            nearStart: {y: adjY, x: adjX}, 
                                            gemStartMatchDir: direction, 
                                            color: color, 
                                            matches: {}})
                }
            }
        }
    }

    checkNearbyMatches = (dataObj) => {
        const {gameboardArray} = this.state;
        const {nearStart, gemStartMatchDir, color, matches} = dataObj;
        let dirArr = Object.keys(this.directionCheck);
        for(let dirI = 0; dirI < dirArr.length; dirI++){
            let addMatchDirection = dirArr[dirI]
            let adjY = nearStart.y + this.directionCheck[addMatchDirection].y;
            let adjX = nearStart.x + this.directionCheck[addMatchDirection].x;
            if(this.checkOffBoard(adjY, adjX)){
                continue;
            }
            if(addMatchDirection === this.oppDirectionref[gemStartMatchDir]){
                continue;
            }
            if(gameboardArray[adjY][adjX] === color){
                matches[addMatchDirection] = [{y: adjY, x: adjX}]
                this.checkFurther(matches, addMatchDirection, color);
            }
        }
        let matchArr = Object.keys(matches);
        if(matchArr.length > 0){ // goes through matches, check for tshape match
            let tShape1 = this.tShapedMatchRef[gemStartMatchDir][0];
            let tShape2 = this.tShapedMatchRef[gemStartMatchDir][1];
            if(matches[tShape1] !== undefined && matches[tShape2] !== undefined){
                this.matchesArray.push(dataObj);
            } else { // if no tshape check for other match variations
                let wasPushed = false;
                for(let i = 0; i < matchArr.length; i++){
                    let dir = matchArr[i];
                    if(matches[dir].length > 1){
                        if(!wasPushed){
                            if(matches[gemStartMatchDir] !== undefined && matches[gemStartMatchDir] < 2){
                                delete matches[gemStartMatchDir]
                            }
                            this.matchesArray.push(dataObj);
                            wasPushed = true;
                        }
                    }
                }
            }   
        }
    }
    
    checkFurther = (matches, addMatchDirection, color) => {
        const {gameboardArray} = this.state;
        let currentCord = matches[addMatchDirection][matches[addMatchDirection].length-1]
        let adjY = currentCord.y + this.directionCheck[addMatchDirection].y;
        let adjX = currentCord.x + this.directionCheck[addMatchDirection].x;
        if(this.checkOffBoard(adjY, adjX)){
            return;
        }
        if(gameboardArray[adjY][adjX] === color){
            matches[addMatchDirection].push({y: adjY, x: adjX});
            this.checkFurther(matches, addMatchDirection, color)
        }
    }
    handleTileClick = (cordObj) => {
        if(this.clickTracker.click1 !== undefined && this.clickTracker.click2 !== undefined){
            return;
        }
        if(this.clickTracker.click1 === undefined){
            this.clickTracker.click1 = cordObj;
            console.log('click1', this.clickTracker.click1)
            this.renderTiles();
        } else {
            this.clickTracker.click2 = cordObj;
            console.log('click2', this.clickTracker.click2)
            this.renderTiles();
        }
        
    }
    renderTiles = () => { 
        const {gameboardArray} = this.state;
        const {click1, click2} = this.clickTracker;
        let array = [];
        for(let i = 0; i<this.boardSize; i++){
            for(let j = 0; j<this.boardSize; j++){
                let isHighlighted = false;
                if(click1 && click1.y === i && click1.x === j){
                    isHighlighted = true;   
                }
                if(click2 && click2.y === i && click2.x === j){
                    isHighlighted = true;
                }
                let domElement = <GameboardTile color = {gameboardArray[i][j]} 
                                                row = {i} col = {j} 
                                                key = {i+''+j}
                                                highlight = {isHighlighted}
                                                callBack = {this.handleTileClick}/>
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
        console.log(this.state.gameboardArray, this.matchesArray)
        return (
            <div className = 'game-cont'>
                {this.state.domElementsArray}
            </div>
        )
    }
}

export default Gameboard;


// preventMatchesOnBuild = () => {
//     const {gameboardArray} = this.state;
//     for(let i = 0; i<this.boardSize; i++){
//         for(let j = 0; j<this.boardSize; j ++){
//             let dirArr = Object.keys(this.directionCheck);
//             let color = gameboardArray[i][j];
//             for(let dirI = 0; dirI < dirArr.length; dirI++){
//                 let direction = dirArr[dirI]
//                 let adjY = i + this.directionCheck[direction].y;
//                 let adjX = i + this.directionCheck[direction].x;
//                 if(this.checkOffBoard(adjY, adjX)){
//                     continue;
//                 }
//                 if(gameboardArray[adjY][adjX] === color){
//                     this.checkFurther({y: adjY, x: adjX}, [{y: i, x: j}, {y: adjY, x: adjX}], direction, 2, color)
//                 }
//             }
//         }
//     }
//     this.setState({
//         gameboardArray: this.gameboardArrayCopy
//     }, this.renderTiles())    
// }
// checkFurther = (toCheckCords, matchesArr, direction, count, color) => {
//     const {gameboardArray} = this.state;
//     let adjY = toCheckCords.y + this.directionCheck[direction].y;
//     let adjX = toCheckCords.x + this.directionCheck[direction].x;
//     if(this.checkOffBoard(adjY, adjX)){
//         if (count > 2){
//             for(let i = 0; i < matchesArr.length; i++){
//                 this.gameboardArrayCopy[matchesArr[i].y][matchesArr[i].x] = this.decideGem(color);
//             }
//         }  
//         return;
//     }
//     if(gameboardArray[adjY][adjX] === color){
//         matchesArr.push({y: adjY, x: adjX});
//         this.checkFurther({y: adjY, x: adjX}, matchesArr, direction, ++count, color)
//     } else {
//         if (count < 3){
//             return;
//         }       
//         for(let i = 0; i < matchesArr.length; i++){
//             this.gameboardArrayCopy[matchesArr[i].y][matchesArr[i].x] = this.decideGem(color);
//         }
//     }
// }