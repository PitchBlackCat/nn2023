import {Card} from "../card/card";
import {Scene} from "phaser";
import {allEqual} from "../../util/compareArrays";
import {CardPile} from "../card/card-pile";
import {Idioot} from "../idioot/idioot";
import {IdiotenEvents} from "./IdiotenEvents";
import Container = Phaser.GameObjects.Container;
import {cardname} from "../../util/card-utils";
import {MessyCardPile} from "../card/messy-card-pile";

export class IdiotenContext extends Container {
  deck = new CardPile(200, 0);
  table = new MessyCardPile(0, 0);
  graveyard = new CardPile(-200, 0);
  round: number = -1;
  whoHasA: number = 3;
  currentIdioot!: Idioot;
  rx: IdiotenEvents = new IdiotenEvents(this);
  idioten!: Idioot[];

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
        return false;
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
    const names = values.map(v => cardname(v));
    switch (this.round) {
      case -1:
        if (idioot.beforeLastCards.length + cards.length > 3) throw new Error(`I can only place 3 cards down.`);
        break;
      case 0:
        if (!allEqual(values)) throw new Error(`I can't play ${ names } at once!`);
        if (!cards.every(c => c.value <= this.whoHasA)) throw new Error(`That's not a ${cardname(this.whoHasA)} or lower..`);
        break;
      default:
        if (idioot !== this.currentIdioot) throw new Error(`It's not my turn...`);
        if (!allEqual(values)) throw new Error(`I can't play ${names} at once!`);

        const card = cards[0];
        const topCard = this.table.peek();
        if (topCard === undefined) return;
        if (topCard.value === 2) return;
        if (card.value === 2 || card.value === 10) return;
        if (card.value === topCard.value) return;
        if (topCard.value == 9 && card.value <= 9) return;
        if (topCard.value != 9 && card.value >= topCard.value) return;
        throw new Error(`I can't throw a ${cardname(card.value)} on top of a ${cardname(topCard.value)}!`);
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
      return canGoAgain!;
    }
    return false;
  }

  canDraw(idioot: Idioot) {
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
