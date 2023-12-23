import {CardPile} from "./card-pile";
import {SeededRandom} from "../../util/random";

export class MessyCardPile extends CardPile {
  seededRandom: SeededRandom;
  messyness = 45;

  constructor(x: number, y: number) {
    super(x, y);
    this.seededRandom = new SeededRandom(Date.now());
  }


  override repositionCards() {
    this.seededRandom.reset();
    this.cards.forEach((c, index) => c.move(this.worldPosition.x + this.seededRandom.range(-this.messyness, this.messyness), this.worldPosition.y - (index * 2) + this.seededRandom.range(-this.messyness, this.messyness), this.seededRandom.range(-Math.PI, Math.PI)));
  }
}
