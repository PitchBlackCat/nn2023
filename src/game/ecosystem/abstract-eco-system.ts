import {Destructable} from "../util/destructable";

export abstract class AbstractEcoSystem<C extends EcoSystemConfig> implements Destructable {
  protected config: C;
  constructor(settings: C) {
    this.config = settings;
  }
  abstract popuplate(): void
  abstract exterminate(): void

  abstract update(): void

  abstract destroy(): void

}

export interface EcoSystemConfig {}
