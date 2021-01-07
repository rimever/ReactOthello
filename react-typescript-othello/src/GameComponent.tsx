import {Component} from 'react';

class Board {
    columnNumber:number;
    rowNumber:number;
    squares:string[][];

    constructor(columnNumber:number,rowNumber:number) {
        this.columnNumber = columnNumber;
        this.rowNumber = rowNumber;
        this.squares = new Array();
        for(var i = 0; i< this.columnNumber; i++) {
            this.squares[i] = Array(rowNumber).fill(null);
        }
    }

    /**
     * 座標が盤面内にあるかを判定します。
     * @param x
     * @param y
     */
    public inBoard(x:number, y:number):boolean {
        return this.inBoardX(x)
            && this.inBoardY(y);
    }

    /**
     * Y座標が盤面内にあるかを判定します。
     * @param y
     * @private
     */
    private inBoardY(y: number) {
        return 0 <= y
            && y < this.rowNumber;
    }

    /**
     * X座標が盤面内にあるかを判定します。
     * @param x
     * @private
     */
    private inBoardX(x: number) {
        return 0 <= x
            && x < this.columnNumber;
    }

    /**
     * X,Y座標で駒を取得します。
     * @param x
     * @param y
     */
    public getSquare(x:number, y:number):string {
        return this.squares[x][y];
    }

    /**
     * 指定した座標に駒を設定します。
     * @param x
     * @param y
     * @param square
     */
    public setSquare(x:number, y:number, square:string):void {
        this.squares[x][y] = square;
    }
}

interface IBoardComponentProps {
    board:Board;
    onClick(x:number,y:number):void;
}

class BoardComponent extends Component<IBoardComponentProps,{}> {
    renderSquare(x:number, y:number) {
        return <SquareComponent value={this.props.board.getSquare(x,y)} onClick={() => this.props.onClick(x,y)}/>;
    }

    render() {
        const rows = [];
        for (let i = 0; i < this.props.board.rowNumber; i++) {
            var columns = [];
            for (let j = 0; j < this.props.board.columnNumber; j++) {
                columns.push(
                    <span>
                        {this.renderSquare(j, i)}
                    </span>
                )
            }
            rows.push(
                <div className="board-row">
                    {columns}
                </div>
            )
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

interface ISquareComponentProps {
    onClick():void;
    value:string;
}

class SquareComponent extends Component<ISquareComponentProps, {}> {
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        )    }
}

interface GameState {
    firstIsNext: boolean;
}

export default class GameComponent extends Component<{},GameState> {
    board: Board;
    state: GameState = {
        firstIsNext:true
    };

    constructor(props:{}) {
        super(props);
        this.board = new Board(8,8);
    }

    render() {
        const winner = this.judgeWinner(this.board.squares);
        let status: string;
        if (winner) {
            status = winner;
        }else {
            status = 'Next player: ' + this.getNextPiece(this.state.firstIsNext);
        }
        return(
            <div className="game">
                <div className="game-board">
                    <BoardComponent board={this.board} onClick={(x,y) => this.handleClick(x,y)}/>
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                </div>
            </div>
        );
    }

    private judgeWinner(squares: string[][]):any {
        return null
    }

    private handleClick(x: number, y: number) {
        if (this.board.getSquare(x,y)) {
            return;
        }
        this.board.setSquare(x,y, this.getNextPiece(this.state.firstIsNext));
        this.setState({
            firstIsNext:!this.state.firstIsNext
        });
    }

    private getNextPiece(firstIsNext: boolean) {
        return firstIsNext ? 'X' : 'O';
    }
}