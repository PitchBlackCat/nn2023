import {Destructable} from "../../util/destructable";
import {ISerializable} from "../../util/serializable";
import {constructorToType} from "../../util/constructorToType";

export abstract class AbstractBrain<C extends BrainConfig = BrainConfig> implements Destructable, ISerializable {
  fitness = 0;

  config: C;

  constructor(config: C) {
    this.config = config;
  }

  abstract think(senses: number[]): number[];

  abstract destroy(): void;

  mutate(rate: number): this {
    console.warn(`${this.constructor.name} can't mutate`)
    return this;
  }

  async serialize() {
    return {
      type: constructorToType(this, 'Brain'),
      config: this.config
    };
  }
}

export interface BrainConfig {

}
