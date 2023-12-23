import {EventEmitter} from "@angular/core";
import Container = Phaser.GameObjects.Container;
import {CardPile} from "../card/card-pile";
import {IdiotenContext} from "../game/idioten-context";
import {Card} from "../card/card";
import {SortedHorizontalCardPile} from "../card/sorted-horizontal-card-pile";
import {HorizontalCardPile} from "../card/horizontal-card-pile";

export abstract class Idioot extends Container {
  lastCards: CardPile = new HorizontalCardPile(0, 0);
  beforeLastCards: CardPile = new HorizontalCardPile(0, -25);
  hand: CardPile = new SortedHorizontalCardPile(0, -150);
  finished = false;

  cards$: EventEmitter<Card[]> = new EventEmitter<Card[]>;
  context: IdiotenContext;
  label: Phaser.GameObjects.BitmapText;
  error: Phaser.GameObjects.BitmapText;

  get playerName(): string {
    return this.label.text;
  }

  protected constructor(scene: Phaser.Scene, context: IdiotenContext, name: string, x = 0, y = 0) {
    super(scene, x, y);

    this.lastCards.parent = this;
    this.beforeLastCards.parent = this;
    this.hand.parent = this;
    this.context = context;

    this.label = scene.add.bitmapText(0, 100, 'hey-comic', name);
    this.label.setOrigin(.5, .5)
    this.label.setTint(0xFFCC2A);
    this.add(this.label);

    this.error = scene.add.bitmapText(0, 150, 'hey-comic', ' ');
    this.error.setTint(0xFF0000);
    this.add(this.error);
  }

  takeTable(game: IdiotenContext) {
    if (game.table.length === 0) throw Error(`I can't take an empty table!`);
    this.hand.add(game.table.take());
  }

  skip(game: IdiotenContext) {
    if (game.table.hasCards) {
      this.takeTable(game);
    }
  }

  override setPosition(x?: number, y?: number, z?: number, w?: number): this {
    const result = super.setPosition(x, y, z, w);
    [this.lastCards, this.beforeLastCards, this.hand].forEach(pile => pile?.repositionCards());
    return result;
  }
}
