import { CellStates } from "src/app/enums/cell-states";
import Random from "src/app/utils/random";
import Cell from "../automaton/cell";
import { ModelProfile } from "./model-profile";

export class SIRIntercropping extends ModelProfile {
    public profileName = "SIR: Intercropping";
    public states = [CellStates.Susceptible, CellStates.Infected, CellStates.Removed];

    private infectionRate = (rowIndex: number, columnIndex: number) => {return (rowIndex + 8) % 8 < 4 ? 0.5 : 0.025};
    private removalRate = 0.2;

    public initializeGrid(gridRowCount: number, gridColumnCount: number): Cell[][] {
        const grid: Cell[][] = [];
        Array.from({ length: gridRowCount }, (_, rowIndex) => {
            const row: Cell[] = [];
            Array.from({ length: gridColumnCount }, (_, columnIndex) => {
                row.push(new Cell(rowIndex, columnIndex, CellStates.Susceptible));
            });
            grid.push(row);
        });

        Array.from({ length: 2 }, () => {
            this.initInfection(grid);
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
        if (currentCell.state === CellStates.Removed) {
            return currentCell.nextGen(CellStates.Removed);
        }

        const neighborhoodInfectedCount = neighborhood.filter(x => x.state === CellStates.Infected).length;
        const randomProb = Math.random();
        const currentCellInfectionRate = this.infectionRate(currentCell.rowIndex, currentCell.columnIndex);

        if (currentCell.state === CellStates.Susceptible &&
            ((randomProb <= currentCellInfectionRate) && (neighborhoodInfectedCount > 0))) {
            return currentCell.nextGen(CellStates.Infected);
        }
        if ((currentCell.state === CellStates.Infected) && (randomProb <= this.removalRate)) {
            return currentCell.nextGen(CellStates.Removed);
        }
        return currentCell.nextGen(currentCell.state);
    }

    private initInfection(grid: Cell[][]) {
        grid[Random.getRandomInt(grid.length - 1)][Random.getRandomInt(grid[0].length - 1)].state = CellStates.Infected;
    }
}