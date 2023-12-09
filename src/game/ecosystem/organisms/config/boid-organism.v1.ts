import {Serialized} from "../../organism-factory";
import {BoidOrganismConfig} from "../boid/boid.organism";
import {randomRange} from "../../../util/random";

export const BoidOrganismConfigV1: () => Serialized<BoidOrganismConfig> = () => ({
  type: 'boid',
  config: {
    body: {type: 'boid', config: {sprite: 'boid'}},
    brain: {type: 'sequential', config: {
        hiddenNodes:[
          //{units: 5, activation: 'tanh'},
        ],
        outputNode: {units: 2, activation: 'tanh'}
      },
    },
    sensors: [
      //{type: 'boid', config: {}},
      {type: 'bias', config: {}},
      //{type: 'sine', config: {frequency: randomRange(1, 10)}},
      {type: 'raycast', config: {cone: 1, range: 250, frequency: 3}},
    ],
    energy: 600
  }
});
