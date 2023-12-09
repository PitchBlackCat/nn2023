import {AbstractBrain, BrainConfig} from "../abstract-brain";
import {ActivationIdentifier} from "@tensorflow/tfjs-layers/dist/keras_format/activation_config";
import * as tf from "@tensorflow/tfjs";
import {Sequential, Tensor} from "@tensorflow/tfjs";
import {DenseLayerArgs} from "@tensorflow/tfjs-layers/dist/layers/core";
import {randomGaussian} from "../../../util/random";

export class SequentialBrain extends AbstractBrain<SequentialBrainConfig> {
  private model: Sequential;

  static async create(config: SequentialBrainConfig) {
    const model = config.modelConfig ? await tf.loadLayersModel(config.modelConfig) as Sequential : this.createModel(config);
    return new SequentialBrain(model, config);
  }

  copy(): SequentialBrain {
    const model = SequentialBrain.createModel(this.config);
    model.setWeights([...this.model.getWeights()].map(t => tf.clone(t)));

    return new SequentialBrain(model, this.config);
  }

  override mutate(rate: number): this {
    if (rate === 0) return this;
    tf.tidy(() => {
      const mutatedWeights = [...this.model.getWeights()].map(t => {
        const shape = t.shape;
        const values = t
          .dataSync()
          .map(v => Math.random() > rate ? v : v + randomGaussian(0, 1));

        return tf.tensor(values, shape);
      });

      this.model.setWeights(mutatedWeights);
    })
    return this;
  }

  constructor(model: Sequential, config: SequentialBrainConfig) {
    super(config);
    this.model = model;
  }

  static createModel(config: SequentialBrainConfig): Sequential {
    const model = tf.sequential();

    [...config.hiddenNodes, config.outputNode].forEach((n, i) => {
      const args: DenseLayerArgs = n;
      if (i == 0) args.inputShape = [config.inputNode!.units];
      model.add(tf.layers.dense(args));
    })

    return model;
  }

  think(inputs: number[]): number[] {
    const xs = tf.tensor([inputs]);
    const ys = this.model.predict(xs) as Tensor;
    return [...ys.dataSync()];
  }

  destroy(): void {
    tf.tidy(() => {
      this.model.dispose();
    });
  }
}

export interface HiddenNodeConfig {
  units: number,
  activation: ActivationIdentifier
}

export interface SequentialBrainConfig extends BrainConfig {
  inputNode?: { units: number },
  hiddenNodes: HiddenNodeConfig[],
  outputNode: HiddenNodeConfig,
  modelConfig?: any
}
