import {Destructable} from "../../util/destructable";
import {ISerializable} from "../../util/serializable";
import {constructorToType} from "../../util/constructorToType";

export abstract class AbstractSensor<C extends ISensorConfig = ISensorConfig> implements Destructable, ISerializable<ISensorConfig> {
  config: C;

  constructor(config: C) {
    this.config = config;
  }

  abstract sense(): number | number[];

  abstract destroy(): void;

  async serialize() {
    return {
      type: constructorToType(this, 'Sensor'),
      config: this.config
    };
  }
}

export interface ISensorConfig {

}
