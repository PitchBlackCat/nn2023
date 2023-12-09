import {Scene} from "phaser";
import {AbstractBody, BodyConfig} from "../../organism/abstract-body";

export class PlantBody extends AbstractBody<PlantControls> {
  constructor(scene: Scene, config: PlantConfig) {
    super(scene, config, {})
    this.sprite.setSensor(true);
  }

  update() {
  }
}

export interface PlantConfig extends BodyConfig {
}

export type PlantControls = {}
