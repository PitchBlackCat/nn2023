import {AbstractSensor, ISensorConfig} from "../organism/abstract-sensor";
import {randomIntRange} from "../../util/random";

export class SineSensor extends AbstractSensor<SineSensorConfig> {

  time: number;
  private frequency: number;
  private amplitude: number = 1;

  constructor(config: SineSensorConfig) {
    super(config);
    this.frequency = config.frequency;
    this.time = randomIntRange(0, this.frequency);
  }

  destroy(): void {
  }

  sense(): number | number[] {
    if (this.time++ == this.frequency) this.time = 0;
    return this.amplitude * Math.sin(this.time / this.frequency);
  }
}

export interface SineSensorConfig extends ISensorConfig{
  frequency: number;
}
