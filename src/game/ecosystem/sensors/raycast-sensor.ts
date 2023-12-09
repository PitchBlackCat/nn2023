import {AbstractSensor, ISensorConfig} from "../organism/abstract-sensor";
import {AbstractBody} from "../organism/abstract-body";
import {MatterCollisionInfo, RaycasterLabel} from "../../util/matter-collision-info";
import {getCollidingOrganism} from "../../util/getCollidingOrganism";
import {PlantOrganism} from "../organisms/plant/plant.organism";
import {Organism} from "../organism/organism";
import {VMath} from "../../util/transform";
import {EcoSystemV1} from "../eco-system-v1";
import {Timer} from "../../util/timer";
import Ray = Raycaster.Ray;
import Dict = NodeJS.Dict;

export class RaycastSensor extends AbstractSensor<RayCastSensorConfig> {
  raycaster: Raycaster;
  body: AbstractBody<any>;
  ray: Ray;
  overlap: Dict<Organism<any, any>> = {};
  timer: Timer;
  senses: number[] = [0, 0, 0];

  get angle(): number {
    return this.body.body.angle - this.HalfPI;
  }

  readonly HalfPI = Math.PI / 2;

  constructor(engine: EcoSystemV1, body: AbstractBody<any>, config: RayCastSensorConfig) {
    super(config);
    this.raycaster = engine.raycaster;
    this.body = body;
    this.timer = new Timer(config.frequency);

    this.ray = this.raycaster.createRay({
      origin: {
        x: this.body.body.position.x,
        y: this.body.body.position.y
      },
      angle: this.angle,
      detectionRange: config.range,
      collisionRange: config.range
    });

    this.ray.autoSlice = true;
    this.ray.enablePhysics('matter');
    this.ray.setCone(config.cone);

    this.ray.setOnCollide((info: MatterCollisionInfo) => {
      const target = getCollidingOrganism(info, engine.organismStore, RaycasterLabel);
      if (target) this.overlap[target.label] = target;
    })

    this.ray.setOnCollideEnd((info: MatterCollisionInfo) => {
      const target = getCollidingOrganism(info, engine.organismStore, RaycasterLabel);
      if (target) delete this.overlap[target.label];
    })
  }

  destroy(): void {
    this.ray.setDetectionRange()
    this.ray.destroy();
    this.ray = null!;
    this.raycaster = null!;
  }

  sense(): number[] {
    let distance = 0;
    let angle = 0;
    let type = 0;

    if (!this.ray) {
      return this.updateSenses(0, 0, 0);
    }

    const t = this.timer.update();
    if (!t) {
      return this.senses;
    }

    // update ray position
    this.ray.setOrigin(this.body.body.position.x, this.body.body.position.y);
    this.ray.setAngle(this.angle);

    // cast
    const intersections = this.ray.castCone();

    // determine view distance
    distance = intersections
      .map(v1 => VMath.sub(v1, this.body.body.position))
      .map(v1 => VMath.magnitude(v1))
      .reduce((acc, curr) => Math.min(acc, curr), this.config.range);

    // cleanup
    delete this.overlap[this.body.body.label];
    for (const overlapKey in this.overlap) {
      if (this.overlap[overlapKey]?.isDestroyed)
        delete this.overlap[overlapKey];
    }

    const plant = Object.values(this.overlap).find(o => o instanceof PlantOrganism);
    if (plant) {
      type = 1;
      angle = VMath.angleBetween(
        this.body.body.position,
        VMath.moveAtAngle(this.body.body.position, this.angle, 1),
        plant!.body.body.position
      );
      distance = this.config.range;
    }

    if (distance < this.config.range && type != 1) type = -1;

    return this.updateSenses(angle, distance, type);
  }

  private updateSenses(angle: number, distance: number, type: number): number[] {
    this.senses = [angle, distance / this.config.range, type];
    return this.senses;
  }
}

export interface RayCastSensorConfig extends ISensorConfig {
  range: number,
  cone: number,
  frequency: number
}
