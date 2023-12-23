import * as tf from "@tensorflow/tfjs";
import {sequential, Sequential, Tensor} from "@tensorflow/tfjs";
import {TrainingData} from "../util/training-data";

export type I = number[];
export type O = number[];

export abstract class IdiotenBrain {
  protected model!: Sequential;
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract createModel(): Sequential;

  train(data: TrainingData<I, O>[]) {
    const inputTensor = tf.tensor2d(data.map(d => d.input!));
    const outputTensor = tf.tensor2d(data.map(d => d.expectedOutput!));

    return this.model.fit(inputTensor, outputTensor, {
      epochs: 10, // Adjust the number of training epochs
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs: any) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
        },
      },
    })
  }

  predict(input: I): O {
    const inputTensor = tf.tensor([input]);
    return ((this.model.predict(inputTensor) as Tensor).arraySync() as any)[0] as O;
  }

  save() {

  }

  load() {

  }
}

export class ConfigurableIdiotenBrain extends IdiotenBrain {
  config: IdiotenBrainConfig;

  constructor(config: IdiotenBrainConfig) {
    super(config.name);
    this.config = config;
    this.createModel();
  }

  createModel(): Sequential {
    this.model = sequential();

    this.model.add(tf.layers.embedding({
      inputDim: 52,   // Assuming you have 52 unique cards
      outputDim: 16,  // Size of the embedding vector
      inputLength: 6,  // Length of each input sequence (in this case, a single card index)
    }));

    this.model.add(tf.layers.flatten());

    // this.model.add(tf.layers.dense({
    //   inputShape: [6],
    //   units: 24,
    //   activation: 'relu'
    // }));

    this.model.add(tf.layers.dense({
      units: 12,
      activation: 'relu'
    }));

    this.model.add(tf.layers.dense({
      units: 6,
      activation: 'sigmoid'
    }));

    this.model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    })

    return this.model;
  }
}

export interface IdiotenBrainConfig {
  name: string;
  weights?: any[]
}
