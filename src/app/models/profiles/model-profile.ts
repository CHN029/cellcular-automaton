import { CellStates } from "src/app/enums/cell-states";
import Cell from "../automaton/cell";

export abstract class ModelProfile {
    public abstract profileName: string;
    public abstract states: CellStates[];

    public abstract initializeGrid(gridRowCount: number, gridColumnCount: number): Cell[][];
    public abstract getNeighborhood(targetCell: Cell, grid: Cell[][]): Cell[];
    public abstract getNextGenCell(currentCell: Cell, neighborhood: Cell[]): Cell;
}