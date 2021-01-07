/**
 * 盤面の情報を扱うクラスです
 */
export class Board {
    columnNumber: number;
    rowNumber: number;
    squares: string[][];

    constructor(columnNumber: number, rowNumber: number) {
        this.columnNumber = columnNumber;
        this.rowNumber = rowNumber;
        this.squares = [];
        for (var i = 0; i < this.columnNumber; i++) {
            this.squares[i] = Array(rowNumber).fill(null);
        }
    }

    /**
     * 座標が盤面内にあるかを判定します。
     * @param x
     * @param y
     */
    public inBoard(x: number, y: number): boolean {
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
    public getSquare(x: number, y: number): string {
        return this.squares[x][y];
    }

    /**
     * 指定した座標に駒を設定します。
     * @param x
     * @param y
     * @param square
     */
    public setSquare(x: number, y: number, square: string): void {
        this.squares[x][y] = square;
    }
}