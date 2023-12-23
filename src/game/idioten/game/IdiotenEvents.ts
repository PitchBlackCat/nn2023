import {Idioot} from "../idioot/idioot";
import {IdiotenContext} from "./idioten-context";
import {Card} from "../card/card";
import {IdiootVoidEndingEvent, IdiootEndingEvent, IdiootEvent} from "../../util/IdiootEvent";
import {CardPile} from "../card/card-pile";

export class IdiotenEvents {
  private context: IdiotenContext;
  round$ = new IdiootEndingEvent<number>();
  turn$ = new IdiootEndingEvent<{ idioot: Idioot, canGoAgain: boolean }>();
  game$ = new IdiootVoidEndingEvent<void>();
  draw$ = new IdiootEvent<Idioot>();
  drawCards$ = new IdiootEvent<{ idioot: Idioot, cards: Card[], pile?: CardPile }>();
  playCards$ = new IdiootEvent<{ idioot: Idioot, cards: Card[] }>();
  whoHasA$ = new IdiootEvent<number>();
  pass$ = new IdiootEvent<Idioot>();

  constructor(context: IdiotenContext) {
    this.context = context;

    for (let k of Object.getOwnPropertyNames(this)) {
      const me: any = this as any;
      const v = me[k];
      //if (v instanceof IdiootEvent) v.debug(k);
    }
  }

  playCards(idioot: Idioot, cards: Card[]) {
    this.playCards$.emit({idioot, cards});
  }

  startRound(round: number) {
    this.round$.emit(round);
  }

  whoHasA(cardValue: number) {
    this.whoHasA$.emit(cardValue);
  }

  draw(idioot: Idioot) {
    this.draw$.emit(idioot);
  }

  drawCards(idioot: Idioot, cards: Card[], pile: CardPile) {
    this.drawCards$.emit({idioot, cards, pile});
  }

  startTurn(idioot: Idioot) {
    this.turn$.emit({idioot, canGoAgain: false});
  }

  takeTable(idioot: Idioot) {
    this.pass$.emit(idioot);
  }
}


