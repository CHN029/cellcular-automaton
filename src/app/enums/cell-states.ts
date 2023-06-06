export enum CellStates {
    // Game of Life
    Live = 0,
    Dead = 1,

    // Forest fire
    Tree = 2,
    Burning = 3,
    Empty = 4,

    // Grape SEIR
    Susceptible = 5,
    Exposed = 6,
    Infected = 7,
    Removed = 8,
    Latent = 9,
    Resist = 10,
}