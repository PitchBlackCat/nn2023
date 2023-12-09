import {Scene} from "phaser";
import {AbstractBody, BodyConfig} from "../../organism/abstract-body";

export class BoidBody extends AbstractBody<BoidControls> {
  speed: number = 0;
  maxSpeed: number = 2;

  constructor(scene: Scene, config: BoidConfig) {
    super(scene, config, {
      up: false,
      left: false,
      right: false
    })
    this.sprite.setBounce(0.2);
  }

  update() {
    this.outputText.x = this.sprite.x - (this.outputText.width / 2)
    this.outputText.y = this.sprite.y - 30

    this.sensesText.x = this.sprite.x - (this.sensesText.width / 2)
    this.sensesText.y = this.sprite.y + 15

    if (this.controls.left) {
      this.sprite.rotation -= .05;
    }

    if (this.controls.right) {
      this.sprite.rotation += .05;
    }

    if (this.controls.up) {
      this.speed = Math.min(this.maxSpeed, this.speed + .04);
    } else {
      this.speed = Math.max(0, this.speed - .04);
    }

    this.sprite.setAngularVelocity(0);
    this.sprite.setVelocityX(Math.sin(this.sprite.rotation - this.body.angularVelocity / 0.1) * this.speed);
    this.sprite.setVelocityY(-Math.cos(this.sprite.rotation - this.body.angularVelocity / 0.1) * this.speed);
  }
}

export interface BoidConfig extends BodyConfig {
}

export type BoidControls = {
  up: boolean,
  left: boolean,
  right: boolean
}
