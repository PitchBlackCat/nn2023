import Sprite = Phaser.GameObjects.Sprite;

let tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
let tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix();
export const getWorldCoords = (gameObject: Sprite) => {
  gameObject.getWorldTransformMatrix(tempMatrix, tempParentMatrix);
  return tempMatrix.decomposeMatrix();
}
