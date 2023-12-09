export interface MatterCollisionInfo {
  bodyA: MatterJS.BodyType;
  bodyB: MatterJS.BodyType;
}

export const RaycasterLabel = 'phaser-raycaster-ray-body';
export const getRayTarget = (info: MatterCollisionInfo) => {
  return info.bodyA.label === RaycasterLabel ? info.bodyB : info.bodyA;
}


export interface RaycasterOptions {
  mapSegmentCount?: number;
  objects?: any | object[];
  boundingBox?: Phaser.Geom.Rectangle;
  autoUpdate?: boolean;
  debug?: boolean | any;
}
