import {AbstractSensor, ISensorConfig} from "../organism/abstract-sensor";

export class BiasSensor extends AbstractSensor<BiasSensorConfig> {
  sense(): number | number[] {
    return 1
  }

  destroy(): void {
  }
}

export interface BiasSensorConfig extends ISensorConfig {
  frequency: number;
}
