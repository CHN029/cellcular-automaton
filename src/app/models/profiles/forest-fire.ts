import { CellStates } from "src/app/enums/cell-states";
import Cell from "../automaton/cell";
import { ModelProfile } from "./model-profile";

export class ForestFire extends ModelProfile {
    public profileName = "Forest Fire";
    public states = [CellStates.Tree, CellStates.Burning, CellStates.Empty];

    public probabilityOfCatchingFireNaturally = 0.001;
    public probabilityOfNewGrowth = 0.05;

    public initializeGrid(gridRowCount: number, gridColumnCount: number): Cell[][] {
        const grid: Cell[][] = [];
        Array.from({ length: gridRowCount }, (_, rowIndex) => {
            const row: Cell[] = [];
            Array.from({ length: gridColumnCount }, (_, columnIndex) => {
                row.push(new Cell(rowIndex, columnIndex, CellStates.Tree));
            });
            grid.push(row);
        });
        return grid;
    }

    public getNeighborhood(targetCell: Cell, grid: Cell[][]): Cell[] {
        const neighborhood = [];
        const gridRowCount = grid.length;
        const gridColumnCount = grid[0].length;
        for (var rowIndex = (targetCell.rowIndex - 1); rowIndex <= (targetCell.rowIndex + 1); rowIndex ++) {
            if ((rowIndex < 0)  || (rowIndex >= gridRowCount)) {
                continue;
            }

            for (var columnIndex = (targetCell.columnIndex - 1); columnIndex <= (targetCell.columnIndex + 1); columnIndex ++) {
                if ((columnIndex < 0) || (columnIndex >= gridColumnCount)) {
                    continue;
                }
                if ((targetCell.rowIndex === rowIndex) && (targetCell.columnIndex === columnIndex)) {
                    continue;
                }
                neighborhood.push(grid[rowIndex][columnIndex]);
            }
        }
        return neighborhood;
    }

    public getNextGenCell(currentCell: Cell, neighborhood: Cell[]): Cell {
        if (currentCell.state === CellStates.Burning) {
            return currentCell.nextGen(CellStates.Empty);
        }

        const neighborhoodBurningCount = neighborhood.filter(x => x.state === CellStates.Burning).length;
        const randomProb = Math.random();
        if (currentCell.state === CellStates.Tree && 
            ((randomProb <= this.probabilityOfCatchingFireNaturally) || (neighborhoodBurningCount > 0))) {
            return currentCell.nextGen(CellStates.Burning);
        }
        if ((currentCell.state === CellStates.Empty) && (randomProb <= this.probabilityOfNewGrowth)) {
            return currentCell.nextGen(CellStates.Tree);
        }
        return currentCell.nextGen(currentCell.state);
    }
}