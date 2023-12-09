import {Card} from "./card";
import {IdiotenContext} from "./idioten-context";
import {CardPile} from "./card-pile";
import {VMath} from "../util/transform";
import {HorizontalCardPile} from "./horizontal-card-pile";
import {SortedHorizontalCardPile} from "./sorted-horizontal-card-pile";
import {EventEmitter} from "@angular/core";
import Container = Phaser.GameObjects.Container;

export abstract class Idioot extends Container {
  lastCards: CardPile = new HorizontalCardPile(0, 0);
  beforeLastCards: CardPile = new HorizontalCardPile(0, -25);
  hand: CardPile = new SortedHorizontalCardPile(0, -150);
  finished = false;

  cards$: EventEmitter<Card[]> = new EventEmitter<Card[]>;
  protected context: IdiotenContext;
  label: Phaser.GameObjects.BitmapText;
  error: Phaser.GameObjects.BitmapText;

  protected constructor(scene: Phaser.Scene, context: IdiotenContext, name: string, x = 0, y = 0) {
    super(scene, x, y);

    this.lastCards.position = VMath.add(this.lastCards.position, {x, y});
    this.beforeLastCards.position = VMath.add(this.beforeLastCards.position, {x, y});
    this.hand.position = VMath.add(this.hand.position, {x, y});
    this.context = context;

    this.label = scene.add.bitmapText(-110, 100, 'hey-comic', name);
    this.label.setTint(0xFFCC2A);
    this.add(this.label);

    this.error = scene.add.bitmapText(-110, 150, 'hey-comic', ' ');
    this.error.setTint(0xFF0000);
    this.add(this.error);
  }

  abstract chooseBeforeLastCards(context: IdiotenContext): Promise<Card[]>;

  abstract takeTurn(context: IdiotenContext): Promise<Card[]>;

  abstract drawBeforeLastCards(context: IdiotenContext): Promise<Card[]>;

  abstract whoHasAThree(context: IdiotenContext): Promise<Card[]>;

  takeTable(game: IdiotenContext) {
    if (game.table.length === 0) throw Error(`I can't take an empty table!`);
    this.hand.add(game.table.take());
  }

  skip(game: IdiotenContext) {
    if (game.table.hasCards) {
      this.takeTable(game);
    }
  }
}
