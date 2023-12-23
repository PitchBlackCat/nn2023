import {Scene} from "phaser";
import {IdiotenGameManager} from "../game/Idioten-game-manager";
import {IdiotenBrain1Trainer} from "../Idioten-brain-1-trainer";
import {IdiotenContext} from "../game/idioten-context";
import {HumanIdioot} from "../idioot/HumanIdioot";
import {StaticIdioot} from "../idioot/StaticIdioot";
import {randomName} from "../../util/random";
import {SimpleAiIdioot} from "../idioot/SimpleAiIdioot";
import {AbstractIdiotenScene} from "./abstract.idioten.scene";


export class IdiotenTrainBrain1Scene extends AbstractIdiotenScene {
  private gameManager!: IdiotenBrain1Trainer;
  constructor() {
    super({key: 'IdiotenTrainBrain1Scene'});
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
    super.create();

    const idioten = [];
    const context = new IdiotenContext(this);
    idioten.push(new SimpleAiIdioot(this, context, `${randomName()} - first`, 0, 0));
    idioten.push(new SimpleAiIdioot(this, context, `${randomName()} - second`, 0, 0));
    idioten.push(new SimpleAiIdioot(this, context, `${randomName()} - third`, 0, 0));
    idioten.push(new SimpleAiIdioot(this, context, `${randomName()} - 5`, 0, 0));
    idioten.push(new SimpleAiIdioot(this, context, `${randomName()} - 6`, 0, 0));

    this.gameManager = new IdiotenBrain1Trainer(this, context, idioten);
    this.children.add(this.gameManager);
  }

  override update() {
    this.zoomOutToFit(this.gameManager);
    this.gameManager.update();
  }
}
