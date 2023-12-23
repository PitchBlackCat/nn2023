import {HorizontalCardPile} from "./horizontal-card-pile";

export class SortedHorizontalCardPile extends HorizontalCardPile {
  override repositionCards() {
    this.cards.sort((a, b) => {
      const s = a.value - b.value;
      return s !== 0 ? s : a.suit - b.suit;
    })
    super.repositionCards();
  }
}
