import {Scene} from "phaser";
import {EcoSystemV1} from "../ecosystem/eco-system-v1";
import * as tf from "@tensorflow/tfjs";


export class GameScene extends Scene {
  private raycasterPlugin!: PhaserRaycaster;
  private ecosystem!: EcoSystemV1;

  private fpsMeter!: Phaser.GameObjects.Text;

  constructor() {
    super({key: 'GameScene'});
  }

  preload() {
    this.load.image('boid', 'assets/boid.png');
    this.load.image('boid_dead', 'assets/boid_dead.png');
    this.load.image('boid_sleeping', 'assets/boid_sleeping.png');
    this.load.image('plant', 'assets/plant.png');
  }

  create() {
    this.scale.displaySize.setAspectRatio(this.scale.width / this.scale.height);
    this.scale.refresh();

    this.matter.world.setBounds(
      0,0,this.scale.width, this.scale.height
    ).disableGravity();

    this.matter.world.update60Hz()

    this.fpsMeter = this.add.text(0,0,'hello world', {color: '#000000'});

    this.ecosystem = new EcoSystemV1(this, {
      addPlayer: true,
      raycaster: {
        plugin: this.raycasterPlugin,
        options: {
          debug: false
        }
      },
      plants: {
        popSize: 200,
      },
      boids: {
        popSize: 100,
        mutationRate: 0.05,
        keepTop: 4,
        cloneTop: 20
      }
    })


    tf.tidy(() => {
      this.ecosystem.popuplate().then();
    });
  }

  override update() {
    this.fpsMeter.setText('fps: ' + this.sys.game.loop.actualFps);
    tf.tidy(() => {
      this.ecosystem.update();
    });
  }
}
