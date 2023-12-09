import {Card} from "./card";
import {Scene} from "phaser";
import {allEqual} from "../util/compareArrays";
import {CardPile} from "./card-pile";
import {Idioot} from "./idioot";
import {IdiotenEventManager} from "./Idioten-event-manager";
import Container = Phaser.GameObjects.Container;

export class IdiotenContext extends Container {
  deck = new CardPile(200, 0);
  table = new CardPile(0, 0);
  graveyard = new CardPile(-200, 0);
  round: number = -1;
  whoHasA: number = 3;
  currentIdioot!: Idioot;
  rx: IdiotenEventManager = new IdiotenEventManager(this);

  get topCard(): Card | undefined {
    return this.table.peek();
  }

  constructor(scene: Scene) {
    super(scene);
  }

  playCards(idioot: Idioot, cards: Card[]) {
    this.assertLegalMove(idioot, cards);

    switch (this.round) {
      case -1:
        idioot.hand.moveTo(cards, idioot.beforeLastCards);
        break;
      case 0:
        this.currentIdioot = idioot;
        idioot.hand.moveTo(cards, this.table);
        break;
      default:
        idioot.hand.moveTo(cards, this.table);
        if (!this.canDraw(idioot)) this.declareWinner(idioot);
    }

    return this.wipe();
  }

  assertLegalMove(idioot: Idioot, cards: Card[]) {
    if (cards.length === 0) throw new Error(`?!`);

    const values = cards.map(c => c.value);
    switch (this.round) {
      case -1:
        if (idioot.beforeLastCards.length + cards.length > 3) throw new Error(`I can only place 3 cards down.`);
        break;
      case 0:
        if (!allEqual(values)) throw new Error(`I can't play ${values} at once!`);
        if (!cards.every(c => c.value <= this.whoHasA)) throw new Error(`That's not a ${this.whoHasA} or lower..`);
        break;
      default:
        if (idioot !== this.currentIdioot) throw new Error(`It's not my turn...`);
        if (!allEqual(values)) throw new Error(`I can't play ${values} at once!`);

        const card = cards[0];
        const topCard = this.table.peek();
        if (topCard === undefined) return;
        if (topCard.value === 2) return;
        if (card.value === 2 || card.value === 10) return;
        if (card.value === topCard.value) return;
        if (topCard.value == 9 && card.value <= 9) return;
        if (topCard.value != 9 && card.value >= topCard.value) return;
        throw new Error(`I can't throw a ${card.value} on top of a ${topCard.value}!`);
    }
  }

  isLegalMove(idioot: Idioot, cards: Card[]) {
    try {
      this.assertLegalMove(idioot, cards);
      return true;
    } catch {
      return false;
    }
  }

  private wipe() {
    const values = this.table.peekFour()?.map(c => c.value);
    const canGoAgain = this.table.length >= 4 && values && allEqual(values)
    if (canGoAgain || this.table.peek()?.value === 10) {
      this.graveyard.add(this.table.take());
      return canGoAgain;
    }
    return false;
  }

  private canDraw(idioot: Idioot) {
    return this.deck.length > 0
      || idioot.beforeLastCards.length > 0
      || idioot.lastCards.length > 0;
  }

  private declareWinner(idioot: Idioot) {
    console.log(idioot.label.text + ' won!!');
  }

  takeTable(idioot: Idioot) {
    if (idioot === this.currentIdioot)
      this.table.moveTo(this.table.cards, idioot.hand);
  }
}
