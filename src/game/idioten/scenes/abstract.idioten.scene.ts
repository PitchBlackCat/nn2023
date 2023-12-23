import {Scene} from "phaser";
import Container = Phaser.GameObjects.Container;


export abstract class AbstractIdiotenScene extends Scene {
  create() {
    this.cameras.main.centerOn(0, 0);
    this.input?.mouse?.disableContextMenu();
  }

  protected zoomOutToFit(go: Container, margin: number = 100) {
    // Calculate the bounding box that includes all sprites in the container
    const bounds = new Phaser.Geom.Rectangle();
    go.getBounds(bounds);

    // Calculate the zoom level to fit the bounding box within the viewport
    const zoomLevelX = (+this.game.scale.width - margin) / bounds.width;
    const zoomLevelY = (+this.game.scale.height - margin) / bounds.height;
    const zoomLevel = Math.min(zoomLevelX, zoomLevelY);

    // Apply the calculated zoom level
    this.cameras.main.setZoom(zoomLevel);
    this.cameras.main.setZoom(.5);
  }
}
