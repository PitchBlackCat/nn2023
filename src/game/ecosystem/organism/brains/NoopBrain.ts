import {AbstractBrain, BrainConfig} from "../abstract-brain";

export class NoopBrain extends AbstractBrain<BrainConfig> {

  constructor(config: BrainConfig) {
    super(config);
  }

  think(inputs: number[]): number[] {
    return []
  }

  destroy(): void {

  }
}
