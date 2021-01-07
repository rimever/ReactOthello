import {Component} from 'react';
import {Board} from "./Board";
import {BoardComponent} from "./BoardComponent";

interface GameState {
    firstIsNext: boolean;
}

export default class GameComponent extends Component<{}, GameState> {
    board: Board;
    state: GameState = {
        firstIsNext: true
    };

    constructor(props: {}) {
        super(props);
        this.board = new Board(8, 8);
    }

    render() {
        const winner = this.judgeWinner(this.board);
        let status: string;
        if (winner) {
            status = winner;
        } else {
            status = 'Next player: ' + Board.getNextPiece(this.state.firstIsNext);
        }
        return (
            <div className="game">
                <div className="game-board">
                    <BoardComponent board={this.board} onClick={(x, y) => this.handleClick(x, y)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                </div>
            </div>
        );
    }

    /**
     * 勝者を判定します。
     * @param board
     * @return 勝者が決定しない場合はnull,勝者が決定した場合は結果を文字列で返します。
     * @private
     */
    private judgeWinner(board: Board): string | null {
        let sumDictionary:{ [piece: string]: number } = {};
        for (let x = 0; x < board.columnNumber; x++) {
            for (let y = 0; y < board.rowNumber; y++) {
                const value = board.getSquare(x, y);
                if (value) {
                    if (sumDictionary[value]) {
                        sumDictionary[value] = sumDictionary[value] + 1;
                    }else {
                        sumDictionary[value] = 1;
                    }
                }
            }
        }
        let keys = Object.keys(sumDictionary);
        let isEnd = (sumDictionary[keys[0]] + sumDictionary[keys[1]] === board.rowNumber * board.columnNumber
        || (!this.canPlacePiece(true) && !this.canPlacePiece(false)));
        if (!isEnd) {
            return null;
        }
        if (sumDictionary[keys[0]] === sumDictionary[keys[1]]) {
            return "Draw";
        }
        let result = "";
        let isWinnerIndex0 = sumDictionary[keys[0]] > sumDictionary[keys[1]];
        if (isWinnerIndex0) {
            result += `Winner:${keys[0]}`;
        }else {
            result += `Winner:${keys[1]}`;
        }
        let winnerKey = keys[isWinnerIndex0 ? 0 : 1];
        let loserKey = keys[isWinnerIndex0 ? 1 : 0];

        result += ` [ ${winnerKey} ${sumDictionary[winnerKey]} - ${sumDictionary[loserKey]} ${loserKey} ] `;
        return result;
    }

    /**
     * クリックした時の処理です
     * @param x X座標
     * @param y Y座標
     * @private
     */
    private handleClick(x: number, y: number) {
        if (this.board.getSquare(x, y)) {
            alert('既に駒が置かれています');
            return;
        }
        if (this.judgeWinner(this.board)) {
            return;
        }
        if (!this.canPlacePiece(this.state.firstIsNext)) {
            alert('置ける場所がないので、手番をスキップします');
            this.setState({
                firstIsNext: !this.state.firstIsNext
            });
            return;
        }
        if (!this.board.checkReverse(x,y,this.state.firstIsNext)) {
            alert('相手の駒を返せる位置に駒を置いてください');
            return;
        }
        this.board.executeReverse(x,y,this.state.firstIsNext);
        this.board.setSquare(x, y, this.state.firstIsNext);
        this.setState({
            firstIsNext: !this.state.firstIsNext
        });

    }

    private canPlacePiece(firstIsNext: boolean):boolean {
        for (let i = 0; i < this.board.rowNumber; i++) {
            for (let j = 0; j < this.board.columnNumber; j++) {
                if (this.board.getSquare(i, j)) {
continue;
                }
                if (this.board.checkReverse(i,j,firstIsNext)) {
                    return true;
                }
            }
        }
            return false;
    }
}