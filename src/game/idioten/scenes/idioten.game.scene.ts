import {IdiotenGameManager} from "../game/Idioten-game-manager";
import {HumanIdioot} from "../idioot/HumanIdioot";
import {IdiotenContext} from "../game/idioten-context";
import {AbstractIdiotenScene} from "./abstract.idioten.scene";


export class IdiotenGameScene extends AbstractIdiotenScene {
  private gameManager!: IdiotenGameManager;

  constructor() {
    super({key: 'IdiotenGameScene'});
  }

  preload() {
    this.load.bitmapFont('hey-comic', 'assets/fonts/hey-comic/image_font.png', 'assets/fonts/hey-comic/image_font.xml.fnt');
    this.load.spritesheet('cards', 'assets/idioten/cards.gif', {frameWidth: 80.95, frameHeight: 117.4});
    this.load.image('sparkles', 'assets/idioten/sparkles.png');
    this.load.image('bg', 'assets/idioten/poker-table.jpg');
    this.load.image('check', 'assets/idioten/check.png');
    this.load.image('reload', 'assets/idioten/reload.png');
  }

  override create() {
    const idioten = [];
    const context = new IdiotenContext(this);
    for (let i = 0; i < 3; i++) {
      idioten.push(new HumanIdioot(this, context, `Player ${i + 1}`, 0, 0));
    }

    this.gameManager = new IdiotenGameManager(this, context, idioten);

    this.children.add(this.gameManager);

    setTimeout(() => {
      this.gameManager.start();
    }, 10);

    this.cameras.main.centerOn(0, 0);
  }

  override update() {
    this.zoomOutToFit(this.gameManager);
    this.gameManager.update();
  }
}
