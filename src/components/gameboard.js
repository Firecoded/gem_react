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
        this.afterFallMatchArray = [];
        this.clickTracker = {};
        this.canIClick = true;
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
        this.filterForMultiMatch(this.matchesArray);
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
        this.matchesArray = [];
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
                                            matches: {},
                                            multiMatch: false,
                                            ref: null})
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
                    if(!matches[dir]){
                        continue;
                    }
                    if(matches[dir].length > 1){
                        if(!wasPushed){
                            if(matches[gemStartMatchDir] !== undefined && matches[gemStartMatchDir].length < 2){
                                delete matches[gemStartMatchDir];
                            }
                            if(matches[tShape1] !== undefined && matches[tShape1].length < 2){
                                delete matches[tShape1];
                            } else if (matches[tShape2] !== undefined && matches[tShape2].length < 2){
                                delete matches[tShape2];
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
    filterForMultiMatch = (matchArr) => {
        for(let i = 0; i<matchArr.length-1; i++){
            for(let j = i+1; j < matchArr.length; j++){
                let startIY = matchArr[i].start.y;
                let startIX = matchArr[i].start.x
                let startJY = matchArr[j].start.y;
                let startJX = matchArr[j].start.x;
                let nearStartIY = matchArr[i].nearStart.y;
                let nearStartIX = matchArr[i].nearStart.x
                let nearStartJY = matchArr[j].nearStart.y;
                let nearStartJX = matchArr[j].nearStart.x;
                if(startIY === nearStartJY && startIX === nearStartJX && startJY === nearStartIY && startJX === nearStartIX){
                    matchArr[i].multiMatch = true;
                    matchArr[i].ref = matchArr[j];
                    matchArr.splice(j, 1);
                    console.log('multiMatch')
                }     
            }
        }
        this.addMatchCount(matchArr);
        this.canIClick = true;
    }
    addMatchCount = (matchArr) => { //creating match count to be passed to parent later
        matchArr.map((item, index)=>{
            let gemCount = 1;
            let matchDirArr = Object.keys(item.matches);
            for(let i = 0; i< matchDirArr.length; i++){
                gemCount += item.matches[matchDirArr[i]].length;
            }
            matchArr[index]['matchCount'] = [{color: this.gemColorRef[item.color], count: gemCount}]
            if(item.multiMatch){
                let gemCount2 = 1;
                let matchDirArr2 = Object.keys(item.ref.matches);
                for(let i = 0; i< matchDirArr2.length; i++){
                    gemCount2 += item.ref.matches[matchDirArr2[i]].length;
                }
                matchArr[index]['matchCount'].push({color: this.gemColorRef[item.ref.color], count: gemCount2})
            }    
        })
    }
    handleTileClick = (cordObj) => {
        if(!this.canIClick){
            return;
        }
        if(this.clickTracker.click1 !== undefined && this.clickTracker.click2 !== undefined){
            return;
        }
        if(this.clickTracker.click1 === undefined){
            this.clickTracker.click1 = cordObj;
            this.renderTiles();
        } else {
            this.clickTracker.click2 = cordObj;
            this.renderTiles();
            this.checkIfValidClick(this.clickTracker)
        }    
    }
    checkIfValidClick(clickTracker){
        const {click1, click2} = clickTracker;
        this.clickTracker['match'] = {};
        for(let i = 0; i < this.matchesArray.length; i++){
            let current = this.matchesArray[i];
            if(click1.y === current.start.y && click1.x === current.start.x && click2.y === current.nearStart.y && click2.x === current.nearStart.x){
                this.clickTracker.match[i] = current;
            } else if (click1.y === current.nearStart.y && click1.x === current.nearStart.x && click2.y === current.start.y && click2.x === current.start.x){
                this.clickTracker.match[i] = current;
            }
        }
        const matchIndexArr = Object.keys(this.clickTracker.match);
        if(matchIndexArr.length > 0){
            this.canIClick = false;
            this.assignValuesToMatch(this.clickTracker.match, matchIndexArr);
            this.passGemCountToParent(this.clickTracker.match[matchIndexArr])
        } else {
            this.resetClickTrackAndHighlight();
        }
    }
    resetClickTrackAndHighlight = () =>{
        setTimeout(()=>{
            this.clickTracker = {};
            this.canIClick = true;
            this.renderTiles();
        }, 300)
    }
    passGemCountToParent = (match) => {
        console.log('passedtoparent', match.matchCount)
        for(let i = 0; i < match.matchCount.length; i++){
            this.props.gemCountCallback(match.matchCount[i]);
        }
    }
    assignValuesToMatch = (matchTracker, matchIndexArr) => { //gemstofall array not needed, clean up later
        let gemsToFallArr = [];
        for(let i = 0; i < matchIndexArr.length; i++){
            let current = matchTracker[matchIndexArr[i]];
            if(current.multiMatch){
                this.gameboardArrayCopy[current.start.y][current.start.x] = 'match';
                this.gameboardArrayCopy[current.nearStart.y][current.nearStart.x] = 'match';
                gemsToFallArr.push(current.start, current.nearStart);
            } else {
                this.gameboardArrayCopy[current.start.y][current.start.x] = this.gameboardArrayCopy[current.nearStart.y][current.nearStart.x];
                this.gameboardArrayCopy[current.nearStart.y][current.nearStart.x] = 'match';
                gemsToFallArr.push(current.nearStart);
            }
            for(let key in current.matches){
                current.matches[key].map((item)=>{
                    this.gameboardArrayCopy[item.y][item.x] = 'match';
                    gemsToFallArr.push(item);
                })
            }
            if(current.ref){
                for(let key in current.ref.matches){
                    current.ref.matches[key].map((item)=>{
                        this.gameboardArrayCopy[item.y][item.x] = 'match';
                        gemsToFallArr.push(item);
                    })
                }
            }
            setTimeout(()=>{
                this.renderTiles(true)
            }, 450)
        }
    }
    makeGemsFall = () => {   
        let noMore = true;
        for(let i = this.boardSize-1; i > -1; i--){
            for(let j = this.boardSize-1; j > -1; j--){
                if(this.gameboardArrayCopy[i][j] === 'match'){
                    noMore = false;
                    let upCordY = i + this.directionCheck.up.y;
                    let upCordX = j + this.directionCheck.up.x;
                    if(this.checkOffBoard(upCordY, upCordX)){
                        this.gameboardArrayCopy[i][j] = this.decideGem(1, 2, 3, 4);
                    } else {
                        this.gameboardArrayCopy[i][j] = this.gameboardArrayCopy[upCordY][upCordX];
                        this.gameboardArrayCopy[upCordY][upCordX] = 'match';
                    }
                }
            }    
        }
        if(noMore){
            this.setState({
                gameboardArray: this.gameboardArrayCopy
            }, ()=>{
                this.renderTiles();
                this.checkForMatchesAfterFall();
            })
        } else {
            setTimeout(()=>{
                this.renderTiles(true)
            }, 450)
        }    
    }
    checkForMatchesAfterFall = () => {
        let matchesFound = false;
        const {gameboardArray} = this.state;
        let dirArr = Object.keys(this.directionCheck);
        for(let i = 0; i< this.boardSize; i++){
            for(let j = 0; j< this.boardSize; j++){
                for(let dirI = 0; dirI < dirArr.length; dirI++){
                    let direction = dirArr[dirI];
                    let color = gameboardArray[i][j];
                    let nextY = i + this.directionCheck[direction].y;
                    let nextX = j + this.directionCheck[direction].x;
                    if(this.checkOffBoard(nextY, nextX)){
                        continue;
                    }
                    if(gameboardArray[nextY][nextX] === color){
                        let matches = {};
                        matches[direction] = [{y: i, x: j, color: color}, {y: nextY, x: nextX, color: color}]
                        this.checkFurtherAfterFall(matches, direction, color);
                        if(matches[direction] !== undefined){
                            matchesFound = true;
                            this.afterFallMatchArray.push(matches)
                            console.log('checkForMatchesAfterFall', matches, matches.length, color)
                        }
                    }
                } 
            }
        }
        if(matchesFound){
            this.assignValuesAfterMatch(this.afterFallMatchArray);
        } else {
            this.afterFallMatchArray = [];
            this.checkForPossibleMatches();
            this.filterForMultiMatch(this.matchesArray);
            this.clickTracker = {};
        }
    }
    checkFurtherAfterFall = (matches, direction, color) => {
        const {gameboardArray} = this.state;
        let current = matches[direction][matches[direction].length-1];
        let nextY = current.y + this.directionCheck[direction].y;
        let nextX = current.x + this.directionCheck[direction].x;
        if(this.checkOffBoard(nextY, nextX)){
            if(matches[direction].length < 3){
                delete matches[direction]
            }
            return;
        }
        if(gameboardArray[nextY][nextX] === color){
            matches[direction].push({y: nextY, x: nextX, color: color})
            this.checkFurtherAfterFall(matches, direction, color)
        } else {
            if(matches[direction].length < 3){
                delete matches[direction]
            }
            return;
        }
    }
    assignValuesAfterMatch = (matchArray) => {
        matchArray.map((item, index) => {
            let directionArr = Object.keys(item)
            for(let dirI = 0; dirI < directionArr.length; dirI++){
                let dir = directionArr[dirI]
                for(let matchI = 0; matchI < item[dir].length; matchI++){
                    let current = item[dir][matchI];
                    this.gameboardArrayCopy[current.y][current.x] = 'match';
                }
            }
        })
        this.filterFallArrayPassToParent(this.afterFallMatchArray);
        this.afterFallMatchArray = [];
        this.renderTiles(true);
    }
    //{color: "bomb", count: 4}

    // 0:
    // down: (3) [{…}, {…}, {…}]
   
    // 1:
    // up: (3) [{…}, {…}, {…}]
    

    filterFallArrayPassToParent = (fallArray) => {
        console.log('filterFallArrayPassToParent', fallArray)
    }
    renderTiles = (boolean) => { // if boolean is true rebuild dom based off array copy, then set copy to state
        const {gameboardArray} = this.state;
        const {click1, click2} = this.clickTracker;
        let array = [];
        for(let i = 0; i<this.boardSize; i++){
            for(let j = 0; j<this.boardSize; j++){
                let isHighlighted = false;
                if(click1 && click1.y === i && click1.x === j && this.canIClick){
                    isHighlighted = true;   
                }
                if(click2 && click2.y === i && click2.x === j && this.canIClick){
                    isHighlighted = true;
                }
                let color;
                boolean ? color = this.gameboardArrayCopy[i][j] : color = gameboardArray[i][j];
                let domElement = <GameboardTile color = {color} 
                                                row = {i} col = {j} 
                                                key = {i+''+j}
                                                highlight = {isHighlighted}
                                                callBack = {this.handleTileClick}/>
                array.push(domElement);
            }
        }
        if(boolean){
            this.setState({
                domElementsArray: array,
                gameboardArray: this.gameboardArrayCopy
            }, ()=>{
                setTimeout(this.makeGemsFall, 450)
            })
        } else {
            this.setState({
                domElementsArray: array
            }, ()=>{
                this.gameboardArrayCopy = gameboardArray;
            })
        }
        
    }
    render() {
        return (
            <div className = 'game-cont'>
                {this.state.domElementsArray}
            </div>
        )
    }
}

export default Gameboard;
