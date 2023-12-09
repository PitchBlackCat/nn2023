import {Serialized} from "../../organism-factory";
import {BoidOrganismConfig} from "../boid/boid.organism";
import {randomRange} from "../../../util/random";
import {ManualBrainCallback} from "../../organism/brains/manual-brain";

const callback: ManualBrainCallback = (keys) => [
  keys.up.isUp ? -1 : 1,
  keys.left.isDown ? -1 : keys.right.isDown ? 1 : 0
];
export const BoidPlayerConfigV1: () => Serialized<BoidOrganismConfig> = () => ({
  type: 'boid',
  config: {
    body: {type: 'boid', config: {sprite: 'boid_dead'}},
    brain: {type: 'manual', config: {
        generateOutput: callback
      },
    },
    sensors: [
      {type: 'raycast', config: {cone: 1, range: 150, frequency: 5}},
      {type: 'sine', config: {frequency: randomRange(10, 50)}},
    ],
    energy: 1000
  }
});
