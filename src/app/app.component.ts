import { Component, OnInit } from '@angular/core';
import { CellStates } from './enums/cell-states';
import Automaton from './models/automaton/automaton';
import { ForestFire } from './models/profiles/forest-fire';
import { GameOfLife } from './models/profiles/game-of-life';
import { ModelProfile } from './models/profiles/model-profile';
import { SIRHumidity } from './models/profiles/sir-humidity';
import { SIRIntercropping } from './models/profiles/sir-intercropping';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public automaton: Automaton;
  public started: boolean = false;

  public gridDimension = 72;
  public generationInterval = 70;
  public modelProfile: ModelProfile = new SIRIntercropping();
  public profiles = [new GameOfLife(), new ForestFire(), new SIRIntercropping, new SIRHumidity()];

  public dropdownPopoverShow = false;
  public cellState = CellStates;
  constructor() {
    this.automaton = new Automaton(
      this.gridDimension, this.gridDimension, this.modelProfile);
    this.automaton.simulate(this.generationInterval);
  }

  setModel() {
    this.started = false;
    this.automaton.stop;
    this.automaton = new Automaton(
      this.gridDimension, this.gridDimension, this.modelProfile);
    this.automaton.simulate(this.generationInterval);
  }

  toggleStart() {
    if (this.started) {
      this.automaton.stop();
    } else {
      this.automaton.start();
    }
    this.started = !this.started;
  }
}
