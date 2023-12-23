import {IdiotenContext} from "../game/idioten-context";
import {Idioot} from "./idioot";
import {filter, take} from "rxjs";
import {Card} from "../card/card";

export class SimpleAiIdioot extends Idioot {
  constructor(scene: Phaser.Scene, context: IdiotenContext, name: string, x?: number, y?: number) {
    super(scene, context, `Simple ${name}`, x, y);

    this.context.rx.round$.afterInit$.pipe(
      filter(r => r === -1),
      take(1)
    ).subscribe(() => {
      this.context.rx.playCards(this, this.getBestCards());
    });
  }

  private getBestCards(): Card[] {
    const choices: CardScore[] = [];
    const myCards = [...this.hand.cards, ...this.beforeLastCards.cards];

    this.hand.cards.forEach(card => {
      let score = card.value;

      if (card.value === 10 || card.value === 2) score = 20;

      let cards = myCards.filter(c => c.value == card.value).slice(0, 3);
      score += (.5 * score * (cards.length - 1));

      choices.push({card, score});
    })

    choices.sort((a, b) => b.score - a.score)

    //console.log(this.playerName, choices.map(c => ({card: c.card.value, score: c.score})));
    return choices.slice(0, 3).map(cs => cs.card);
  }
}

interface CardScore {
  score: number;
  card: Card;
}
