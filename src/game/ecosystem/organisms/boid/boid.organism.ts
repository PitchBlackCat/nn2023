import {Organism, OrganismConfig} from "../../organism/organism";
import {BoidBody} from "./boid.body";
import {EcoSystemV1} from "../../eco-system-v1";
import {AbstractSensor} from "../../organism/abstract-sensor";
import {AbstractBrain} from "../../organism/abstract-brain";

export class BoidOrganism extends Organism<BoidOrganismConfig, BoidBody> {

  engine: EcoSystemV1;
  energy;

  constructor(engine: EcoSystemV1, body: BoidBody, brain: AbstractBrain, sensors: AbstractSensor<any>[], config: BoidOrganismConfig) {
    super(body, brain, sensors, config);
    this.engine = engine;
    this.energy = config.energy;
  }

  override update() {
    if (this.isDestroyed) return;
    super.update();

    if (this.isDead) return;
    //this.brain.fitness++;


    if (this.senses[3] == 1) {
      this.brain.fitness += Math.abs(this.senses[1]) < 1 ? (1 - Math.abs(this.senses[1])) * Math.max(0, this.thoughts[0]) : 0
    }
    //this.body.text.setText(JSON.stringify(this.energy))

    this.energy--;
    if (this.energy < 0) this.kill();
  }

  override kill() {
    this.body.sprite.setTexture('boid_dead');
    super.kill();
  }

  control(thoughts: number[]): void {
    // this.body.sensesText.setText(JSON.stringify(this.senses.map(t => Math.round(t*10)/10), null, ' '))
    this.body.sensesText.setText(JSON.stringify(this.brain.fitness, null, ' '))
    this.body.outputText.setText(JSON.stringify(thoughts.map(t => Math.round(t*10)/10)))

    this.body.controls.up = thoughts[0] > 0;
    this.body.controls.left = thoughts[1] < 0;
    this.body.controls.right = thoughts[1] > 0;
  }

  override destroy() {
    this.engine.raycaster.removeMappedObjects(this.body.body);
    super.destroy();
  }
}

export interface BoidOrganismConfig extends OrganismConfig {
  energy: number
}
