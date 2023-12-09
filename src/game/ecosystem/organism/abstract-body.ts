import {Scene} from "phaser";
import {Updateable} from "../../util/updateable";
import {Destructable} from "../../util/destructable";
import {ISerializable} from "../../util/serializable";
import {constructorToType} from "../../util/constructorToType";
import {randomString} from "../../util/random";
import Image = Phaser.Physics.Matter.Image;
import Text = Phaser.GameObjects.Text;
import MatterBodyConfig = Phaser.Types.Physics.Matter.MatterBodyConfig;

export abstract class AbstractBody<C extends AbstractControls> implements Updateable, Destructable, ISerializable {

  config: BodyConfig;
  scene: Scene;
  sprite: Image;
  body: MatterJS.BodyType;
  controls: C;
  sensesText: Text;
  outputText: Text;



  constructor(scene: Phaser.Scene, config: BodyConfig, controls: C) {
    this.scene = scene;
    this.controls = controls;
    this.config = config;

    this.sensesText = this.scene.add.text(0,0,'', {color: '#000000'})
    this.outputText = this.scene.add.text(0,0,'', {color: '#000000'})

    this.sprite = scene.matter.add.image(
      config.x ?? Math.random() * scene.scale.width,
      config.y ?? Math.random() * scene.scale.height,
      config.sprite
    );

    this.sprite.setBody({
      type: 'circle',
      width: this.sprite.width,
      height: this.sprite.height,
      ...config,
    });

    if (config.collisionGroup)
      this.sprite.setCollisionGroup(config.collisionGroup)

    this.body = this.sprite.body as MatterJS.BodyType;
    this.body.label = randomString();
  }

  destroy(): void {
    this.sprite.destroy(true);
  }

  abstract update(): void;

  async serialize() {
    return {
      type: constructorToType(this, 'Body'),
      config: this.config
    };
  }
}

export type AbstractControls = { [k: string]: boolean };

export interface BodyConfig extends MatterBodyConfig {
  x?: number,
  y?: number,
  sprite: string,
  collisionGroup?: number
}
