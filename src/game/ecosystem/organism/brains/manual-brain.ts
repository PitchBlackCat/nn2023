import {AbstractBrain, BrainConfig} from "../abstract-brain";
import {Scene} from "phaser";

export class ManualBrain extends AbstractBrain<ManualBrainConfig> {
  generateOutput: (keys: Phaser.Types.Input.Keyboard.CursorKeys) => number[];
  private keys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Scene, config: ManualBrainConfig) {
    super(config);
    this.generateOutput = config.generateOutput;
    this.keys = scene.input.keyboard!.createCursorKeys();
  }

  think(inputs: number[]): number[] {
    console.log(inputs);
    return this.generateOutput(this.keys);
  }

  destroy(): void {
    this.generateOutput = null!;
  }
}

export interface ManualBrainConfig extends BrainConfig {
  generateOutput: ManualBrainCallback
}

export type ManualBrainCallback = (keys: Phaser.Types.Input.Keyboard.CursorKeys) => number[];
