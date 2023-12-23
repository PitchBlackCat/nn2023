import {AbstractIdiotenScene} from "./abstract.idioten.scene";
import {RedButton} from "../game-objects/redButton";
import {take} from "rxjs";
import {DynamicText} from "../game-objects/dynamicText";
import {AbstractText} from "../game-objects/AbstractText";

export class IdiotenStartScene extends AbstractIdiotenScene {
  private gameTitle!: DynamicText;
  private start!: RedButton;
  private margin = 150;

  constructor() {
    super({key: 'IdiotenStartScene'});
  }

  preload() {
    this.load.bitmapFont('hey-comic', 'assets/fonts/hey-comic/image_font.png', 'assets/fonts/hey-comic/image_font.xml.fnt');
    this.load.spritesheet('cards', 'assets/idioten/cards.gif', {frameWidth: 80.95, frameHeight: 117.4});
    this.load.atlasXML('red-button', 'assets/buttons/redSheet.png', 'assets/buttons/redSheet.xml');
    this.load.image('sparkles', 'assets/idioten/sparkles.png');
    this.load.image('check', 'assets/idioten/check.png');
    this.load.image('reload', 'assets/idioten/reload.png');
  }

  override create() {
    super.create();

    this.createTitle();
    this.createButtons();
  }

  override update() {
  }

  private createTitle() {
    this.gameTitle = new DynamicText(this, 0, this.margin - this.scale.height / 2, 'hey-comic', 'IDIOTEN', 6, 128);
    this.gameTitle.valignment = 'top'
    this.children.add(this.gameTitle);

    let delay = 0;
    this.gameTitle.characters.forEach(char => {
      this.tweens.add({
        targets: char,
        delay: delay += 500,
        y: '-=20', // Bob down by 10 pixels
        ease: 'Sine.easeInOut', // Use a sine wave for smooth bobbing
        duration: 1500, // Duration of the bobbing animation
        yoyo: true, // Yoyo back to the original position
        repeat: -1, // Repeat indefinitely
      });
    })
  }

  private createButtons() {
    this.start = new RedButton(this, 0, -100, 'start');
    this.children.add(this.start);

    this.start.alpha = 0;

    this.tweens.add({
      targets: this.start,
      delay: 500,
      y: 0, // Bob down by 10 pixels
      alpha: 1,
      ease: 'Sine.easeOut', // Use a sine wave for smooth bobbing
      duration: 250, // Duration of the bobbing animation
    });

    this.start.click$.pipe(take(1)).subscribe(() => {
      this.scene.start('IdiotenGameScene');
    })

    setTimeout(() => {
      this.start.click$.emit();
    }, 10)
  }
}
