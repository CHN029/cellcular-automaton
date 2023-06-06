import { CellStates } from "src/app/enums/cell-states";
import Cell from "../automaton/cell";

export class InfectionSimulationCell extends Cell {
    public infectionLatency: number = 0;
    public latencyCounter: number = 0;
    public infectionCounter: number = 0;

    constructor(rowIndex: number, columnIndex: number, initialState: CellStates, infectionLatency: number, initialLatencyCounter: number = 0, initialInfectionCounter: number = 0) {
        super(rowIndex, columnIndex, initialState);
        this.infectionLatency = infectionLatency;
        this.latencyCounter = initialLatencyCounter;
        this.infectionCounter = initialInfectionCounter;
    }

    public override nextGen(nextGenState: CellStates) {
        if (nextGenState === CellStates.Latent) {
            this.latencyCounter += 1;
        }
        if (nextGenState === CellStates.Infected) {
            this.infectionCounter += 1;
        }
        return new InfectionSimulationCell(
            this.rowIndex,
            this.columnIndex,
            nextGenState,
            this.infectionLatency,
            this.latencyCounter,
            this.infectionCounter);
    }
}