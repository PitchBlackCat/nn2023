import {MatterCollisionInfo} from "./matter-collision-info";
import {OrganismStore} from "../ecosystem/organism/organism-store";

export const getCollidingOrganism = (info: MatterCollisionInfo, organismStore: OrganismStore, myLabel: string) => {
  const them = info['bodyA'] === undefined ? (info as unknown as MatterJS.BodyType) : (info.bodyA.label === myLabel ? info.bodyB : info.bodyA);
  return organismStore.organismsById[them.label];
}

