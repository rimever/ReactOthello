import React from 'react';

import Square from './Square';

class Board extends React.Component {
    /**
     * 行の数
     * @type {number}
     */
    static RowNumber = 3;
    /**
     * 列の数
     * @type {number}
     */
    static ColumnNumber = 3;

    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
    }
    render() {
        const rows = [];
        for (let i = 0; i < Board.RowNumber; i++) {
            var columns = [];
            for (let j = 0; j < Board.ColumnNumber; j++) {
                columns.push(
                    <span>
                        {this.renderSquare(j + Board.ColumnNumber * i)}
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
export default Board;