type Matrix = number[][];
interface IPosition2D {
    x: number;
    y: number;
}
class Position2D implements IPosition2D {
    x: number = 0;
    y: number = 0;
    constructor(x: number, y: number) {
        x = x;
        y = y;
    }
}

class BoxParts {
    size: number;
    area: number[][] = [];
    private solution: number[] = [];
    // private randomizer = new Randomizer2D();
    constructor(size = 4) {
        if (size < 2) throw new Error("need at leats 2x2 matrix size");
        this.size = size;
    }
    build() {
        // create a flatten array first
        const flattenLength = (this.size * this.size);
        // generate the flatten list from 1 to size * size, eg 4x4 = 16 length
        const flattlenList = Array.from({ length: flattenLength }, (_, i) => i + 1);
        // set the last one as 0 to simulate the space in the 15 puzzle
        flattlenList[flattenLength - 1] = 0;
        // save the solution order to be used latter
        this.solution = flattlenList.map(row => row);

        // now convert this array into a 2D array
        let itemIdx = 0;
        this.area = Array.from({ length: this.size }, () => {
            return Array.from({ length: this.size }, () => {
                const part = flattlenList[itemIdx];
                itemIdx++;
                return part;
            });
        });
        this.shuffleArray(this.area);
    }
    getProgress(): number {
        // convert the 2D array into a flatten one
        const flattenList = this.area.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
        // now we can filter that and check the coincidence
        const intersection = flattenList.filter((item, idx) => this.solution[idx] === item);
        // then return the percentage
        return intersection.length / this.solution.length;
    }

    private isInBounds(matrix: Matrix, pos: IPosition2D): boolean {
        // check if we can move to up, down, left, right
        return pos.x >= 0 && pos.x < matrix.length && pos.y >= 0 && pos.y < matrix[0].length;
    }
    private getRandomMove(matrix: Matrix, zeroPos: IPosition2D): IPosition2D {
        // set move list
        const moves: IPosition2D[] = [
            { x: -1, y: 0 }, // up
            { x: 1, y: 0 },  // down
            { x: 0, y: -1 }, // left
            { x: 0, y: 1 }   // right
        ];
        // here we will save all moves we can do
        const validMoves: IPosition2D[] = [];
        // then find the valid moves based on the zero value position
        for (const move of moves) {
            const newPos: IPosition2D = { x: zeroPos.x + move.x, y: zeroPos.y + move.y };
            if (this.isInBounds(matrix, newPos)) {
                validMoves.push(newPos);
            }
        }
        // then take randomly one of this options
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        return validMoves[randomIndex];
    }
    private switchParts(matrix: Matrix, pos1: IPosition2D, pos2: IPosition2D): void {
        // Swap the values at the two positions
        const temp = matrix[pos1.x][pos1.y];
        matrix[pos1.x][pos1.y] = matrix[pos2.x][pos2.y];
        matrix[pos2.x][pos2.y] = temp;
    }
    private shuffleArray(matrix: Matrix): void {
        // just create an amout of moves/loops to shuffle the matrix
        const numMoves = matrix.length * matrix[0].length * 10;
        // set the zero value position, must be the down right corner
        let zeroPos = { x: this.size - 1, y: this.size - 1 };
        let i = 0;
        while (i < numMoves) {
            // generate the random move and also check the validation
            const newMove = this.getRandomMove(matrix, zeroPos);
            // then do the switch/move
            this.switchParts(matrix, zeroPos, newMove);
            // update the zero value position base on the new position
            zeroPos = newMove;
            i++;
        }
    }
}

class MoveSystem {
    private moves: number = 0;
    private boxParts: BoxParts;
    private selectedPart: Position2D | any = new Position2D(0, 0); // used to now the pice/part we want the move (Selected one)
    // Inject the PicesBox and manipulate it using the move mechanics
    constructor(boxParts: BoxParts) {
        this.boxParts = boxParts;
    }
    getSelected(): Position2D | any {
        return this.selectedPart;
    }
    getMoves(): number {
        return this.moves;
    }
    setSelected(newPos: Position2D | any): void {
        this.selectedPart = newPos;
    }
    setMoves(value: number): void {
        // in case we need to reset this value
        this.moves = value;
    }
    move(newPos: Position2D): boolean {
        // check if we want to move the pice to the empty place or not (empty place equals to 0)
        if (this.boxParts.area[newPos.y][newPos.x] > 0) return false // in case is not empty that means is not valid move.
        /* this is a formula I remember use one time in a game I did in python, and I am using it to validate if the move is 
        Non-Diagonal as well as one space move and not more.*/
        const checkMove = Math.abs((this.selectedPart.x - newPos.x)) + Math.abs((this.selectedPart.y - newPos.y));
        if (checkMove !== 1) return false; // can not move
        // otherwise we can move
        let temp = this.boxParts.area[this.selectedPart.y][this.selectedPart.x];
        // switch 
        this.boxParts.area[this.selectedPart.y][this.selectedPart.x] = this.boxParts.area[newPos.y][newPos.x];
        this.boxParts.area[newPos.y][newPos.x] = temp;
        this.moves++;
        return true; // means the move is done.
    }
}

type HistoryStore = {}[];
class HistoryGame {
    private maxRecords = 10;
    private history: HistoryStore[] | any = [];
    private storageKey = "puzzleHistory";
    constructor() {
        try {
            const storage: string | any = localStorage.getItem(this.storageKey);
            this.history = JSON.parse(storage);
        } catch (error) {
            this.history = [];
        }
    }
    addNewRecord(record: HistoryStore[]): void {
        if (this.history.length >= this.maxRecords) {
            this.history.shift();
        }
        this.history.push(record);
        localStorage.setItem(this.storageKey, this.history);
    }
    getHistory(): HistoryStore[] {
        return this.history;
    }
}

export {
    BoxParts,
    MoveSystem,
    Position2D,
    HistoryGame
};
export type { IPosition2D, HistoryStore };
