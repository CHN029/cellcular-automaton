import { CellStates } from "src/app/enums/cell-states";
import Random from "src/app/utils/random";
import Cell from "../automaton/cell";
import { ModelProfile } from "./model-profile";

export class GameOfLife extends ModelProfile {
    public profileName = "Game Of Life";
    public states = [CellStates.Live, CellStates.Dead];

    public initializeGrid(gridRowCount: number, gridColumnCount: number): Cell[][] {
        const grid: Cell[][] = [];
        Array.from({ length: gridRowCount }, (_, rowIndex) => {
            const row: Cell[] = [];
            Array.from({ length: gridColumnCount }, (_, columnIndex) => {
                row.push(new Cell(rowIndex, columnIndex, 
                    Random.getRandomInt(2) >= 1 ? CellStates.Live : CellStates.Dead));
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
        const neighborhoodLiveCount = neighborhood.filter(x => x.state === CellStates.Live).length;
        if (currentCell.state === CellStates.Live && 
            ((neighborhoodLiveCount <= 1) || (neighborhoodLiveCount >= 4))) {
                return currentCell.nextGen(CellStates.Dead);
        }
        if ((currentCell.state === CellStates.Dead) && 
            (neighborhoodLiveCount === 3)) {
                return currentCell.nextGen(CellStates.Live);
        }
        return currentCell.nextGen(currentCell.state);
    }
}