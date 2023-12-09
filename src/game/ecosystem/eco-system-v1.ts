import {AbstractEcoSystem, EcoSystemConfig} from "./abstract-eco-system";
import {Scene} from "phaser";
import * as tf from '@tensorflow/tfjs';
import {BoidOrganism} from "./organisms/boid/boid.organism";
import {PlantOrganism} from "./organisms/plant/plant.organism";
import {MatterCollisionInfo, RaycasterOptions} from "../util/matter-collision-info";
import {getCollidingOrganism} from "../util/getCollidingOrganism";
import {OrganismStore} from "./organism/organism-store";
import {OrganismFactory, Serialized} from "./organism-factory";
import {BoidOrganismConfigV1} from "./organisms/config/boid-organism.v1";
import {PlantOrganismConfigV1} from "./organisms/config/plant-organism.v1";
import {OrganismConfig} from "./organism/organism";
import {SequentialBrain} from "./organism/brains/sequential-brain";


export class EcoSystemV1 extends AbstractEcoSystem<EcoSystemV1Config> {
  static winners: Serialized<OrganismConfig>[] = [];
  factory: OrganismFactory = new OrganismFactory(this);
  organismStore: OrganismStore = new OrganismStore();
  raycaster: Raycaster;
  scene: Phaser.Scene;
  private player!: BoidOrganism;
  private isStopped: boolean = true;

  constructor(scene: Scene, config: EcoSystemV1Config) {
    super(config);
    this.scene = scene;
    this.raycaster = config.raycaster.plugin.createRaycaster(config.raycaster.options);

    const storedWinners = localStorage.getItem('EcoSystemV1.winners');
    EcoSystemV1.winners = storedWinners ? JSON.parse(storedWinners) : [];
  }

  exterminate(): void {
    if (!this.organismStore.length) throw new Error('Trying to exterminate an empty world!')
    this.raycaster.removeMappedObjects(this.organismStore.organisms.map(o => o.body.body));

    tf.tidy(() => {
      this.organismStore.destroy();
    })

    this.raycaster.destroy();
  }

  calcColor(perc: number): number {
    perc = 100 - (perc * 100);
    var r, g, b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return Number('0x' + ('000000' + h.toString(16)).slice(-6));
  }

  async popuplate(): Promise<void> {
    if (this.organismStore.length) throw new Error('Trying to populate an already populated world!')

    this.raycaster = this.config.raycaster.plugin.createRaycaster(this.config.raycaster.options);

    // if (this.config.addPlayer) {
    //   this.player = await this.factory.createOrganism(BoidPlayerConfigV1()) as BoidOrganism;
    //   this.organismStore.add(this.player);
    // }

    if (EcoSystemV1.winners) {
      for (const winner of EcoSystemV1.winners) {
        const tint = this.calcColor(EcoSystemV1.winners.indexOf(winner) / (EcoSystemV1.winners.length - 1));
        for (let i = 0; i < this.config.boids.cloneTop; i++) {
          const organism = await this.factory.createOrganism(winner);
          organism.body.sprite.tint = tint;
          organism.brain.mutate(this.config.boids.mutationRate);
          this.organismStore.add(organism);
        }
      }
    }

    for (let i = this.organismStore.organismsByType['boid']?.length ?? 0; i < this.config.boids.popSize; i++) {
      const organism = await this.factory.createOrganism(BoidOrganismConfigV1()) as BoidOrganism;
      this.organismStore.add(organism);
    }

    for (let i = 0; i < this.config.plants.popSize; i++) {
      const organism = await this.factory.createOrganism(PlantOrganismConfigV1());
      this.organismStore.add(organism);

    }

    // eat!
    this.organismStore.organismsByType['boid']?.forEach((organism) => {
      organism.body.sprite.setOnCollide((info: MatterCollisionInfo) => {
        const them = getCollidingOrganism(info, this.organismStore, organism.label);
        if (them) {
          if (them instanceof PlantOrganism) {
            (organism as BoidOrganism).energy += them.energy;
            organism.brain.fitness += 10;
            this.raycaster.removeMappedObjects(them.body.body);
            them.destroy();
          } else {
            (organism as BoidOrganism).energy -= 10;
            organism.brain.fitness -= 10;
          }
        }
      });
    })

    this.raycaster.mapGameObjects(this.organismStore.organisms.map(o => o.body.body), true);

    this.isStopped = false;
  }


  update(): void {
    if (this.isStopped) return;
    this.raycaster.update();
    tf.tidy(() => {
      //this.player.energy = 100;
      this.organismStore.update();

      const o = this.organismStore.organismsByType['boid']?.sort((a, b) => a.brain.fitness > b.brain.fitness ? -1 : a.brain.fitness == b.brain.fitness ? 0 : 1) ?? [];
      this.scene.cameras.main.setZoom(2);
      this.scene.cameras.main.centerOn(o[0].body.sprite.x, o[0].body.sprite.y);

      if (!this.organismStore.organismsByType['boid']?.find(b => !b.isDead)) {
        this.restartSimulation().then();
      }
    })
  }

  destroy(): void {
    this.exterminate();
  }

  private async restartSimulation() {
    this.isStopped = true;

    let sorted = this.organismStore.organismsByType['boid']!
      .filter(o => o.brain instanceof SequentialBrain)
      .sort((a, b) => a.brain.fitness > b.brain.fitness ? -1 : a.brain.fitness == b.brain.fitness ? 0 : 1)
    console.log(sorted.map(s => s.brain.fitness));
    sorted = sorted.slice(0, this.config.boids.keepTop)
    console.log(sorted.map(s => s.brain.fitness));

    const serialized = await Promise.all(sorted.map(a => a.serialize()));
    for (const i in sorted) {
      serialized[i].config.modelConfig = `localstorage://${sorted[i].type}-${i}`;
      await sorted[i].brain.model.save(serialized[i].config.modelConfig)
    }

    EcoSystemV1.winners = serialized;
    localStorage.setItem('EcoSystemV1.winners', JSON.stringify(serialized));

    const log = JSON.parse(localStorage.getItem('EcoSystemV1.log') ?? '[]');
    log.push(sorted[0].brain.fitness);
    localStorage.setItem('EcoSystemV1.log', JSON.stringify(log));

    this.scene.registry.destroy();
    this.scene.scene.restart();
  }
}

export interface EcoSystemV1Config extends EcoSystemConfig {
  addPlayer?: boolean,
  boids: {
    popSize: number,
    mutationRate: number,
    keepTop: number,
    cloneTop: number
  },
  plants: {
    popSize: number
  },
  raycaster: {
    plugin: PhaserRaycaster,
    options: RaycasterOptions
  }
}
