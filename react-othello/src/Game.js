import React from 'react';
import Board from './Board';

/**
 * 勝者を判定します
 * @param squares
 * @returns {string|null} 判定が出れば結果を文字列で返します。勝者が決まらない場合は、nullを返します
 */
function calculateWinner(squares) {
    var sumDictionary = {};
    for (let i = 0; i < squares.length; i++) {
        var value = squares[i];
        if (value) {
            if (sumDictionary[value]) {
                sumDictionary[value] = sumDictionary[value] + 1;
            }else {
                sumDictionary[value] = 1;
            }
        }else {
            return null;
        }
    }
    var result = "";
    var keys = Object.keys(sumDictionary);
    if (sumDictionary[keys[0]] > sumDictionary[keys[1]]) {
        result += `Winner:${keys[0]}`;
    }else {
        result += `Winner:${keys[1]}`;
    }
    result += " - ";
    for(var key of keys) {
        result += ` ${key}:${sumDictionary[key]}`;
    }
    return result;
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            history: [{
                squares: Array(Board.ColumnNumber * Board.RowNumber).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    /**
     * マスをクリックした時の処理です
     * @param i
     */
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1)
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // 決着がついた時、クリックした場所が既に駒が置かれている場合はスキップ
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if(winner){
            status = winner;
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        const moves = history.map((step, move) => {
            const desc = move ? 'Move #' + move : 'Game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}
export default Game;