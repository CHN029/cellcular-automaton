import { interval } from "rxjs";
import { ModelProfile } from "../profiles/model-profile";
import Cell from "./cell";

export default class Automaton {
    public modelProfile: ModelProfile;

    public displayedGrid: Cell[][] = [];
    private grid: Cell[][] = [];
    private gridAlt: Cell[][] = [];
    private gridRowCount: number;
    private gridColumnCount: number;

    public generationCount = 0;
    public started = false;

    constructor(gridWidth: number, gridHeight: number, modelProfile: ModelProfile) {
        this.gridColumnCount = gridWidth;
        this.gridRowCount = gridHeight;
        this.modelProfile = modelProfile;
        this.grid = modelProfile.initializeGrid(this.gridRowCount, this.gridColumnCount);
        this.displayedGrid = this.grid;
    }

    public reset() {
        this.generationCount = 0;
        this.started = false;
        this.grid = this.modelProfile.initializeGrid(this.gridRowCount, this.gridColumnCount);
        this.displayedGrid = this.grid;
    }

    public stop() {
        this.started = false;
    }

    public start() {
        this.started = true;
    }

    public simulate(timeout:number = 1000) {
        interval(timeout).subscribe(() => {
            if (!this.started) {
                return;
            }

            let gridCurrent: Cell[][];
            let gridNext: Cell[][];
            if (this.generationCount % 2 === 0) {
                gridCurrent = this.grid;
                gridNext = this.gridAlt;
            } else {
                gridCurrent = this.gridAlt;
                gridNext = this.grid;           
            }

            gridNext.length = 0;
            Array.from({ length: this.gridColumnCount }, (_, rowIndex) => {
                const nextGenRow: Cell[] = [];
                Array.from({ length: this.gridRowCount }, (_, columnIndex) => {
                    const currentCell = (gridCurrent[rowIndex])[columnIndex];
                    const neighborhood = this.modelProfile.getNeighborhood(currentCell, gridCurrent);
                    nextGenRow.push(this.modelProfile.getNextGenCell(currentCell, neighborhood));
                });
                gridNext.push(nextGenRow);
            });

            this.displayedGrid = gridNext;
            this.generationCount += 1;
        })
    }
}
