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
        for (let i = 0; i < this.columnNumber; i++) {
            this.squares[i] = Array(rowNumber).fill(null);
        }
        for(let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                this.setSquare( Math.floor(this.columnNumber/2) - 1 + i
                    , Math.floor(rowNumber/2) - 1 + j
                    , (i === j));
            }
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
    public setSquare(x: number, y: number, isFirst: boolean): void {
        this.squares[x][y] = Board.getNextPiece(isFirst);
    }

    /**
     * 次の駒の値を取得します
     * @param firstIsNext 次の駒は先手の駒か
     * @return 駒の文字列
     * @private
     */
    public static getNextPiece(firstIsNext: boolean):string {
        return firstIsNext ? '○' : '●';
    }

    /**
     * 相手の駒を反転できるか判定します。
     * @param x
     * @param y
     * @param isFirst
     * @return 反転できるか
     */
    public checkReverse(x:number,y:number,isFirst:boolean):boolean {
        for (let vectorX = -1; vectorX <= 1; vectorX++) {
            for (let vectorY = -1; vectorY <= 1; vectorY++) {
                if (vectorX === 0 && vectorY === 0) { continue; }
                if (this.checkReverseInternal(x, y, isFirst, vectorX, vectorY)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 相手の駒を反転できるか判定する内部処理です。
     * @param startX
     * @param startY
     * @param isFirst
     * @param proceedX
     * @param proceedY
     * @private
     */
    private checkReverseInternal(startX: number, startY: number, isFirst: boolean, proceedX: number, proceedY: number):boolean {
        // まず隣が違う駒でないとNG
        let neighbourX = startX + proceedX;
        let neighbourY = startY + proceedY;
        if (!this.inBoard(neighbourX,neighbourY)) {
            return false;
        }
        let nextPiece = Board.getNextPiece(isFirst);
        let neighbourPiece = this.getSquare(neighbourX,neighbourY);
        if (!neighbourPiece || neighbourPiece === nextPiece) {
            return false;
        }

        let x = neighbourX + proceedX;
        let y = neighbourY + proceedY;
        while (this.inBoard(x,y)) {
            let seekPiece = this.getSquare(x, y);
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
     * 反転処理を実行します。
     * @param x
     * @param y
     * @param isFirst
     */
    public executeReverse(x:number,y:number,isFirst:boolean):void {
        for (let vectorX = -1; vectorX <= 1; vectorX++) {
            for (let vectorY = -1; vectorY <= 1; vectorY++) {
                if (vectorX === 0 && vectorY === 0) { continue; }
                if (this.checkReverseInternal(x, y, isFirst, vectorX, vectorY)) {
                    this.executeReverseInternal(x,y,isFirst, vectorX, vectorY);
                }
            }
        }
    }

    private executeReverseInternal(startX: number, startY: number, isFirst: boolean, vectorX: number, vectorY: number) {
        let x = startX + vectorX;
        let y = startY + vectorY;
        let nextPiece = Board.getNextPiece(isFirst);
        while (this.inBoard(x,y)) {
            let seekPiece = this.getSquare(x, y);
            if (!seekPiece) {
                return;
            }
            if (seekPiece === nextPiece) {
                return;
            }
            this.setSquare(x,y, isFirst);
            x += vectorX;
            y += vectorY;
        }
    }
}