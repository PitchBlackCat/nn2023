import {AbstractBody, BodyConfig} from "./abstract-body";
import {AbstractSensor, ISensorConfig} from "./abstract-sensor";
import {Updateable} from "../../util/updateable";
import {Destructable} from "../../util/destructable";
import {AbstractBrain, BrainConfig} from "./abstract-brain";
import {ISerializable} from "../../util/serializable";
import {Serialized} from "../organism-factory";
import {constructorToType} from "../../util/constructorToType";
import {Timer} from "../../util/timer";

export abstract class Organism<C extends OrganismConfig = any, Body extends AbstractBody<any> = any, Brain extends AbstractBrain<any> = any> implements Updateable, Destructable, ISerializable<OrganismConfig> {

  isDead: boolean = false;
  body: Body;
  config: C;
  brain: Brain;

  timer: Timer;

  sensors: AbstractSensor<any>[];
  isDestroyed: boolean = false;
  senses: number[] = [];
  thoughts: number[] = [];

  get type(): string {
    return constructorToType(this, 'Organism')
  }

  get label(): string {
    return this.body.body.label;
  }

  set label(l: string) {
    this.body.body.label = l;
  }


  constructor(body: Body, brain: Brain, sensors: AbstractSensor<any>[], config: C) {
    this.body = body;
    this.brain = brain;
    this.sensors = sensors ?? [];
    this.config = config;
    this.timer = new Timer(3);
  }

  update() {
    if (!this.isDead && this.timer.update()) {
      this.senses = this.sensors.map(s => s.sense()).flat();
      this.thoughts = this.brain.think(this.senses);
      this.control(this.thoughts);
    }

    this.body.update();
  }

  kill() {
    this.isDead = true;

    Object.keys(this.body.controls).forEach(k => {
      this.body.controls[k] = 0;
    })
  }

  destroy(): void {
    this.isDestroyed = true;
    this.body.destroy();
    this.brain.destroy();
    this.sensors.forEach(s => s.destroy());
  };

  abstract control(thoughts: number[]): void;

  async serialize() {
    return {
      type: this.constructor.name.split('Organism')[0].toLowerCase(),
      config: {
        ...this.config,
        body: await this.body.serialize(),
        sensors: await Promise.all(this.sensors.map(s => s.serialize())),
        brain: await this.brain.serialize()
      }
    };
  }
}

export interface OrganismConfig {
  body: Serialized<BodyConfig>,
  sensors: Serialized<ISensorConfig>[],
  brain: Serialized<BrainConfig>
}
