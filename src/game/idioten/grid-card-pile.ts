import {CardPile} from "./card-pile";

export class GridCardPile extends CardPile {
  override repositionCards() {
    const step = 90;
    const width = 13 * step;
    this.cards.forEach((c, index) => {
      let row = (index % 13);
      let col = Math.floor(index / 13);

      c.x = this.position.x - (width / 2) + (step * row);
      c.y = this.position.y + (col * 150);
      c.depth = c.y;
    });
  }
}
