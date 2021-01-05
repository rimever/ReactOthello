import React from 'react';
import Board from './Board';

/**
 * 勝者を判定します
 * @param squares
 * @returns {string|null} 判定が出れば結果を文字列で返します。勝者が決まらない場合は、nullを返します
 */
function calculateWinner(squares) {
    let sumDictionary = {};
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
    let keys = Object.keys(sumDictionary);
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
        console.log("reverse:" + (this.checkReverse(squares, i, this.getNextPiece()) ? "yes" : "no"));
        squares[i] = this.getNextPiece();
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    checkReverse(squares, i, nextPiece) {
        let baseX = this.getXFromIndex(i);
        let baseY = this.getYFromIndex(i);
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) { continue; }
                console.log(`${squares}, ${baseX}, ${baseY}, ${nextPiece}, ${x}, ${y}`);
                if (this.checkReverseInternal(squares, baseX, baseY, nextPiece, x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    checkReverseInternal(squares, baseX, baseY, nextPiece, proceedX, proceedY) {
        // まず隣が違う駒でないとNG
        let neighbourX = baseX + proceedX;
        let neighbourY = baseY + proceedY;
        if (!this.inBoard(neighbourX,neighbourY)) {
            return false;
        }
        let neighbourPiece = this.getPieceByXY(squares, neighbourX, neighbourY);
        if (!neighbourPiece || neighbourPiece === nextPiece) {
            return false;
        }

        let x = neighbourX + proceedX;
        let y = neighbourY + proceedY;
        while (this.inBoard(x,y)) {
            console.log(`${x} ${y}`);
            let seekPiece = this.getPieceByXY(squares, x, y);
            if (!seekPiece) {
                return false;
            }
            if (seekPiece === nextPiece) {
                return true;
            }

            x += proceedX;
            y += proceedY;
        }
        return false;
    }

    /**
     * X,Y座標で駒を取得します
     * @param square : 駒の一次元配列
     * @param x
     * @param y
     */
    getPieceByXY(square, x, y) {
        return square[this.getIndexFromXY(x, y)];
    }

    /**
     * 座標が盤面内にあるかを判定します。
     * @param x
     * @param y
     * @returns {boolean}
     */
    inBoard(x, y) {
        return this.inBoardX(x)
            && this.inBoardY(y);
    }

    /**
     * Y座標が盤面内にあるかを判定します。
     * @param y
     * @returns {boolean}
     */
    inBoardY(y) {
        return 0 <= y
            && y < Board.RowNumber;
    }

    /**
     * X座標が盤面内にあるかを判定します。
     * @param x
     * @returns {boolean}
     */
    inBoardX(x) {
        return 0 <= x
            && x < Board.ColumnNumber;
    }

    /**
     * 次の駒を取得します。
     * @returns {string}
     */
    getNextPiece() {
        return this.state.xIsNext ? 'X' : 'O';
    }

    /**
     * インデックスからX座標を取得します。
     * @param i
     * @returns {number}
     */
    getXFromIndex(i) {
        return i % Board.ColumnNumber;
    }

    /**
     * インデックスからY座標を取得します。
     * @param i
     * @returns {number}
     */
    getYFromIndex(i) {
        return parseInt(i / Board.ColumnNumber);
    }

    /**
     * x,y座標からインデックスに変換します。
     * @param x
     * @param y
     * @returns {number}
     */
    getIndexFromXY(x,y) {
        return y * Board.ColumnNumber + x;
    }


    /**
     * 描画処理です
     * @returns {JSX.Element}
     */
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if(winner){
            status = winner;
        }else{
            status = 'Next player: ' + this.getNextPiece();
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