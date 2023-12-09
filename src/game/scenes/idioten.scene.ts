import {Scene} from "phaser";
import {IdiotenGameManager} from "../idioten/Idioten-game-manager";


export class IdiotenScene extends Scene {
  private gameManager!: IdiotenGameManager;
  private backgroundImage!: Phaser.GameObjects.TileSprite;
  private scroll = 0;
  constructor() {
    super({key: 'IdiotenScene'});
  }

  preload() {
    this.load.bitmapFont('hey-comic', 'assets/hey-comic/image_font.png', 'assets/hey-comic/image_font.xml.fnt');
    this.load.spritesheet('cards', 'assets/cards.gif', {frameWidth: 80.95, frameHeight: 117.4});
    this.load.image('sparkles', 'assets/sparkles.png');
    this.load.image('bg', 'assets/poker-table.jpg');
    this.load.image('check', 'assets/check.png');
    this.load.image('reload', 'assets/reload.png');
  }

  create() {
    this.scale.displaySize.setAspectRatio(this.scale.width / this.scale.height);
    this.scale.refresh();

    this.cameras.main.centerOn(0,0);
    this.input?.mouse?.disableContextMenu();

    this.backgroundImage = this.add.tileSprite(0, 0, this.scale.displaySize.width, this.scale.displaySize.height, 'bg');
    this.backgroundImage.setTileScale(.2, .2);

    this.gameManager = new IdiotenGameManager(this, 3);

    this.children.add(this.gameManager);

    setTimeout(() => {
      this.gameManager.start();
    },10);
  }

  zoomOutToFit() {
    // Calculate the bounding box that includes all sprites in the container
    const bounds = new Phaser.Geom.Rectangle();
    this.gameManager.getBounds(bounds);

    // Calculate the zoom level to fit the bounding box within the viewport
    const margin = 100;
    const zoomLevelX = (+this.game.config.width - margin) / bounds.width;
    const zoomLevelY = (+this.game.config.height - margin) / bounds.height;
    const zoomLevel = Math.min(zoomLevelX, zoomLevelY);

    // Apply the calculated zoom level
    this.cameras.main.setZoom(zoomLevel);
    this.backgroundImage.setScale(1+zoomLevel, 1+zoomLevel);
    this.backgroundImage.setTilePosition(this.scroll, this.scroll)
    this.scroll -= .1;
    this.scroll = this.scroll % 580
  }

  override update() {
    this.zoomOutToFit();
    this.gameManager.update();
  }
}
