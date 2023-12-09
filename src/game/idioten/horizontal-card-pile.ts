import {CardPile} from "./card-pile";

export class HorizontalCardPile extends CardPile {
  override repositionCards() {
    const step = 90;
    const width = this.cards.length * step;
    this.cards.forEach((c, index) => {
      c.move(this.position.x - (width / 2) + (step * index),this.position.y)
    });
  }
}
