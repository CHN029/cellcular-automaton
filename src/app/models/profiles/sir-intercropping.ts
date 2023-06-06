import { CellStates } from "src/app/enums/cell-states";
import Random from "src/app/utils/random";
import { ModelProfile } from "./model-profile";
import {InfectionSimulationCell as Cell} from "../specific-models/infection-simulation-cell";

export class SIRIntercropping extends ModelProfile {
    public profileName = "SIR: Intercropping";
    public states = [CellStates.Susceptible, CellStates.Infected, CellStates.Removed];

    private defaultInfectivity = 10;
    private defaultInfectionRateOffset = 10;
    private resistantInfectionRateOffset = 400;
    private latencyIterationThreshold = 6;
    private removalIterationThreshold = 6;

    public initializeGrid(gridRowCount: number, gridColumnCount: number): Cell[][] {
        const grid: Cell[][] = [];
        Array.from({ length: gridRowCount }, (_, rowIndex) => {
            const row: Cell[] = [];
            Array.from({ length: gridColumnCount }, (_, columnIndex) => {
                row.push(new Cell(rowIndex, columnIndex, CellStates.Susceptible, Random.getGaussianRandom(this.latencyIterationThreshold)));
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
        if ((currentCell.state === CellStates.Susceptible) &&
            (Math.random() <= this.getInfectionRate(currentCell, neighborhood))) {
            return currentCell.nextGen(CellStates.Latent);
        }
        if ((currentCell.state === CellStates.Latent) &&
            (currentCell.latencyCounter >= currentCell.infectionLatency)) {
            return currentCell.nextGen(CellStates.Infected);
        }
        if ((currentCell.state === CellStates.Infected) &&
            (currentCell.infectionCounter >= this.removalIterationThreshold)) {
            return currentCell.nextGen(CellStates.Removed);
        }
        return currentCell.nextGen(currentCell.state);
    }

    private initInfection(grid: Cell[][]) {
        grid[Random.getRandomInt(grid.length - 1)][Random.getRandomInt(grid[0].length - 1)].state = CellStates.Infected;
    }

    private getInfectionRate(currentCell: Cell, neighborhood: Cell[]) {
        const getCellInfectivity = (cell: Cell, isResistantCultivar: boolean) => {
            return (cell.infectionCounter * this.defaultInfectivity);
        }
        const isIntercroppedCultivar = this.isIntercroppedCultivar(currentCell);
        const neighborhoodInfectivity = neighborhood
            .filter(x => x.state === CellStates.Infected)
            .map(x => getCellInfectivity(x, isIntercroppedCultivar))
            .reduce((sum, x) => sum + x, 0);
        return (neighborhoodInfectivity) / (neighborhoodInfectivity + 
            (isIntercroppedCultivar ? this.resistantInfectionRateOffset : this.defaultInfectionRateOffset));
    }

    private isIntercroppedCultivar(cell: Cell) {
        const regularCultivarRowCount = 8;
        const resistantCultivarRowCount = 4;
        return cell.rowIndex % (regularCultivarRowCount + resistantCultivarRowCount)
            >= regularCultivarRowCount;
    }
}