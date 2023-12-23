import {Card} from "./card";
import {shuffleArray} from "../../util/compareArrays";
import {Vector2} from "../../util/transform";
import Container = Phaser.GameObjects.Container;

export class CardPile {
  parent?: Container;
  position: Vector2;
  cards: Card[] = [];

  constructor(x: number, y: number) {
    this.position = {x, y};
  }

  get length() {
    return this.cards.length;
  }

  get empty() {
    return this.cards.length === 0;
  }

  get hasCards() {
    return this.cards.length > 0;
  }

  protected get worldPosition() {
    return {
      x: (this.parent?.x ?? 0) + this.position.x,
      y: (this.parent?.y ?? 0) + this.position.y
    } as Vector2
  }

  add(cards: Card | Card[]) {
    if (cards instanceof Card) {
      this.cards.push(cards);
      cards.pile = this;
    } else {
      cards.forEach(c => c.pile = this);
      this.cards.push(...cards);
    }
    this.repositionCards();
  }

  show() {
    this.cards.forEach(c => c.closed = false);
  }

  take() {
    const cards = this.cards;
    this.cards = [];
    return cards;
  }

  draw(target: CardPile) {
    const card = this.peek();
    if (!card) throw new Error(`Can't draw from an empty pile!`);
    this.moveTo([card], target);
    return card;
  }

  reset() {
    this.cards = [];
  }

  peek() {
    if (this.cards.length === 0) return undefined;
    return this.cards[this.cards.length - 1];
  }

  peekFour() {
    if (this.cards.length < 4) return undefined;
    return this.cards.slice(-4);
  }

  shuffle() {
    this.cards = shuffleArray(this.cards);
    this.repositionCards();
  }

  assertContains(cards: Card[]) {
    cards.forEach(c => {
      const match = this.cards.find(h => h === c);
      if (!match) throw new Error(`Card ${c.value}, is not mine!`)
    })
  }

  contains(cards: Card[]) {
    try {
      this.assertContains(cards);
      return true;
    } catch (e) {
      return false;
    }
  }

  remove(cards: Card[]) {
    this.cards = this.cards.filter(a => !cards.find(b => a === b));
    this.repositionCards();
  }

  moveTo(cards: Card[], pile: CardPile) {
    this.assertContains(cards);
    this.remove(cards);
    pile.add(cards);
  }

  repositionCards() {
    this.cards.forEach((c, index) => c.move(this.worldPosition.x, this.worldPosition.y - (index * 2)));
  }
}
