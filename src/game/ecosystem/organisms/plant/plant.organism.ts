import {Organism, OrganismConfig} from "../../organism/organism";
import {PlantBody} from "./plant.body";
import {AbstractSensor} from "../../organism/abstract-sensor";

export class PlantOrganism extends Organism<PlantOrganismConfig, PlantBody> {
  energy: number;

  constructor(body: PlantBody, brain: any, sensors: AbstractSensor<any>[], config: PlantOrganismConfig) {
    super(body, brain, sensors, config);
    this.energy = config.energy;
  }

  control(thoughts: number[]): void {
  }
}

export interface PlantOrganismConfig extends OrganismConfig {
  energy: number;
}
