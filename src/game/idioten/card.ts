import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import {Scene} from "phaser";
import {CardPile} from "./card-pile";

export const closedCardFrame = 52;

export class Card extends Container {
  sprite: Sprite;
  value: number;
  suit: number;
  frame: number;
  pile!: CardPile;
  private teleport: boolean = false;
  _selected: boolean = false;
  set selected(v: boolean) {
    this.setSelected(v);
  }
  get selected() {
    return this._selected;
  }

  private moveTween: Phaser.Tweens.Tween | undefined;

  protected _closed: boolean = true;
  private selectedTween: Phaser.Tweens.Tween;
  get closed() {
    return this._closed
  }

  set closed(val: boolean) {
    this.sprite.setFrame(val ? closedCardFrame : this.frame);
    this._closed = val;
  }

  constructor(scene: Scene, suit: number, value: number, pile: CardPile) {
    super(scene);

    this.value = value;
    this.suit = suit;
    this.frame = (suit * 13) + (value - 2);
    this.sprite = scene.add.sprite(0, 0, 'cards', closedCardFrame)
    this.add(this.sprite);

    pile.add(this);

    this.selectedTween = this.scene.tweens.add({
      targets: this.sprite,
      y: '-=10', // Bob down by 10 pixels
      ease: 'Sine.easeInOut', // Use a sine wave for smooth bobbing
      duration: 500, // Duration of the bobbing animation
      yoyo: true, // Yoyo back to the original position
      repeat: -1, // Repeat indefinitely
    });

    this.setSelected(false);
  }

  setSelected(v: boolean) {
    this._selected = v;
    if(v) {
      this.selectedTween.play();
    } else {
      this.selectedTween.restart();
      this.selectedTween.pause();
    }
  }

  move(x: number, y: number) {
    if (this.teleport) {
      this.setPosition(x, y);
    } else {
      if (this.moveTween)
        this.moveTween.stop()

      this.moveTween = this.scene.tweens.add({
        targets: this,
        x: x,
        y: y,
        ease: 'Sine.easeOut', // Use a sine wave for smooth bobbing
        duration: 500, // Duration of the bobbing animation
      });
    }
  }
}
