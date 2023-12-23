import {AbstractIdiotenScene} from "./abstract.idioten.scene";


export class IdiotenBgScene extends AbstractIdiotenScene {
  private backgroundImage!: Phaser.GameObjects.TileSprite;
  private scroll = 0;

  constructor() {
    super({key: 'IdiotenBgScene'});
  }

  preload() {
    this.load.bitmapFont('hey-comic', 'assets/fonts/hey-comic/image_font.png', 'assets/fonts/hey-comic/image_font.xml.fnt');
    this.load.image('bg', 'assets/idioten/poker-table.jpg');
  }

  override create() {
    super.create();

    this.backgroundImage = this.add.tileSprite(0, 0, this.scale.gameSize.width * 2, this.scale.gameSize.height * 2, 'bg');
    this.backgroundImage.setTileScale(.2, .2);
    this.backgroundImage.setScrollFactor(0, 0);

    this.cameras.main.centerOn(0, 0);

    this.scene.launch('IdiotenStartScene');
  }

  override update() {
    this.scrollBackground();
  }

  private scrollBackground() {
    this.scroll -= .15;
    this.scroll = this.scroll % 580
    this.backgroundImage.setTilePosition(this.scroll, this.scroll);
  }
}
