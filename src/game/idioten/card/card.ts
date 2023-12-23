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
  private moveTween: Phaser.Tweens.Tween | undefined;
  private selectedTween: Phaser.Tweens.Tween;

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

  _selected: boolean = false;

  get selected() {
    return this._selected;
  }

  set selected(v: boolean) {
    this.setSelected(v);
  }

  protected _closed: boolean = true;

  get closed() {
    return this._closed
  }

  set closed(val: boolean) {
    this.sprite.setFrame(val ? closedCardFrame : this.frame);
    this._closed = val;
  }

  setSelected(v: boolean) {
    this._selected = v;
    if (v) {
      this.selectedTween.play();
    } else {
      this.selectedTween.restart();
      this.selectedTween.pause();
    }
  }

  move(x: number, y: number, rot: number = 0) {
    if (this.teleport) {
      this.setPosition(x, y);
    } else {
      if (this.moveTween)
        this.moveTween.stop()

      this.moveTween = this.scene.tweens.add({
        targets: this,
        x: x,
        y: y,
        rotation: rot,
        ease: 'Sine.easeOut', // Use a sine wave for smooth bobbing
        duration: 500, // Duration of the bobbing animation
      });
    }
  }

  suitToString(): string {
    switch (this.suit) {
      case 0:
        return '♣';
      case 1:
        return '♦';
      case 2:
        return '♥';
      case 3:
        return '♠';
    }
    return '?';
  }

  valueToString(): string {
    switch (this.value) {
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      case 14:
        return 'A';
    }
    return this.value.toString();
  }

  override toString(): string {
    return `${this.suitToString()}${this.valueToString()}`;
  }
}
