import { CellStates } from "src/app/enums/cell-states";

export default class Cell {
    public state: CellStates;
    public rowIndex: number;
    public columnIndex: number;

    constructor(rowIndex: number, columnIndex: number, initialState: CellStates) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.state = initialState;
    }

    public nextGen(nextGenState: CellStates) {
        return new Cell(this.rowIndex, this.columnIndex, nextGenState);
    }
}