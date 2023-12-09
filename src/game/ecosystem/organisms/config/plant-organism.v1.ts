import {Serialized} from "../../organism-factory";
import {OrganismConfig} from "../../organism/organism";
import {BodyConfig} from "../../organism/abstract-body";
import {PlantOrganismConfig} from "../plant/plant.organism";

export const PlantOrganismConfigV1: () => Serialized<PlantOrganismConfig> = () => ({
  type: 'plant',
  config: {
    body: {type: 'plant', config: {sprite: 'plant'}},
    brain: {type: 'noop', config: {}},
    sensors: [],
    energy: 50
  }
});
