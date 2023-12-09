import {BoidOrganism, BoidOrganismConfig} from "./organisms/boid/boid.organism";
import {PlantOrganism, PlantOrganismConfig} from "./organisms/plant/plant.organism";
import {AbstractBody, BodyConfig} from "./organism/abstract-body";
import {OrganismConfig} from "./organism/organism";
import {AbstractSensor, ISensorConfig} from "./organism/abstract-sensor";
import {NoopBrain} from "./organism/brains/NoopBrain";
import {ManualBrain, ManualBrainCallback, ManualBrainConfig} from "./organism/brains/manual-brain";
import {SequentialBrain, SequentialBrainConfig} from "./organism/brains/sequential-brain";
import {BoidBody} from "./organisms/boid/boid.body";
import {PlantBody} from "./organisms/plant/plant.body";
import {EcoSystemV1} from "./eco-system-v1";
import {SineSensor, SineSensorConfig} from "./sensors/sine-sensor";
import {BoidSensor, BoidSensorConfig} from "./sensors/boid.sensor";
import {RaycastSensor, RayCastSensorConfig} from "./sensors/raycast-sensor";
import {BrainConfig} from "./organism/abstract-brain";
import {BiasSensor, BiasSensorConfig} from "./sensors/bias-sensor";

export class OrganismFactory {
  engine: EcoSystemV1;

  constructor(engine: EcoSystemV1) {
    this.engine = engine;
  }

  async createOrganism(config: Serialized<OrganismConfig>) {
    const body = await this.createBody(config.config.body);
    const sensors = await Promise.all(config.config.sensors.map(s => this.createSensor(s, body)));
    const brain = await this.createBrain(body, sensors, config.config.brain);

    switch (config.type) {
      case "boid":
        return new BoidOrganism(this.engine, body as BoidBody, brain, sensors, config.config as BoidOrganismConfig);
      case "plant":
        return new PlantOrganism(body, brain, sensors, config.config as PlantOrganismConfig);
      default:
        throw Error('unknown organism ' + config.type);
    }
  }

  private async createBrain(body: AbstractBody<any>, sensors: AbstractSensor[], config: Serialized<BrainConfig>) {
    switch (config.type) {
      case "noop":
        return new NoopBrain(config.config);
      case "manual":
        return new ManualBrain(this.engine.scene, config.config as ManualBrainConfig);
      case "sequential":
        const inputs = sensors.map(s => s.sense()).flat().length;
        (config.config as SequentialBrainConfig).inputNode = {units: inputs};
        return await SequentialBrain.create(config.config as SequentialBrainConfig);
      default:
        throw Error('unknown brain ' + config.type)
    }
  }

  private async createSensor(config: Serialized<ISensorConfig>, body: AbstractBody<any>) {
    switch (config.type as SensorType) {
      case "sine":
        return new SineSensor(config.config as SineSensorConfig);
      case "bias":
        return new BiasSensor(config.config as BiasSensorConfig);
      case "boid":
        return new BoidSensor(this.engine, body as BoidBody, config.config as BoidSensorConfig);
      case "raycast":
        return new RaycastSensor(this.engine, body, config.config as RayCastSensorConfig);
      default:
        throw Error('unknown body ' + config.type)
    }
  }
  private async createBody(config: Serialized<BodyConfig>) {
    switch (config.type) {
      case "boid":
        return new BoidBody(this.engine.scene, config.config);
      case "plant":
        return new PlantBody(this.engine.scene, config.config);
      default:
        throw Error('unknown body ' + config.type)
    }
  }
}

export type SensorType = 'boid' | 'raycast' | 'sine' | 'bias';
export type OrganismType = 'boid' | 'plant';
export type BrainType = 'noop' | 'manual' | 'sequential';

export interface Serialized<T = any> {
  type: string,
  config: T
}
