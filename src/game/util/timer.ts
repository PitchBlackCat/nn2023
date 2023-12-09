import {randomIntRange} from "./random";

export class Timer {
  time: number;
  maxTime: number;

  constructor(maxTime: number) {
    this.maxTime = maxTime;
    this.time = randomIntRange(0, this.maxTime)
  }

  update(): boolean {
    this.time = ++this.time >= this.maxTime ? 0 : this.time;
    return this.time === 0;
  }
}
