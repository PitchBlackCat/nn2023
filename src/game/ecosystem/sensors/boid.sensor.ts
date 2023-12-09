import {AbstractSensor, ISensorConfig} from "../organism/abstract-sensor";
import {BoidBody} from "../organisms/boid/boid.body";
import {EcoSystemV1} from "../eco-system-v1";

export class BoidSensor extends AbstractSensor<BoidSensorConfig> {
  body: BoidBody;
  private engine: EcoSystemV1;

  constructor(engine: EcoSystemV1, body: BoidBody, config: BoidSensorConfig) {
    super(config);
    this.body = body;
    this.engine = engine;
  }

  sense(): number | number[] {
    return [
      this.body.speed / this.body.maxSpeed,
      this.body.body.angle / Math.PI,
      // this.body.body.position.x / this.engine.scene.scale.width,
      // this.body.body.position.y / this.engine.scene.scale.height
    ];
  }

  destroy(): void {
    this.body = null!;
  }
  deserialize(str: string): this {
    return this;
  }
}

export interface BoidSensorConfig extends ISensorConfig{

}
