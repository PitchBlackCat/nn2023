import {Idioot} from "./idioot";
import {IdiotenContext} from "./idioten-context";
import {Card} from "./card";
import {EventEmitter} from "@angular/core";

export class IdiotenEventManager {
  private context: IdiotenContext;

  startRound$ = new EventEmitter<number>();
  roundStarted$ = new EventEmitter<number>();
  roundEnded$ = new EventEmitter<number>();
  whoHasA$ = new EventEmitter<number>();
  gameFinished$ = new EventEmitter<void>();
  playCards$ = new EventEmitter<{ idioot: Idioot, cards: Card[] }>();
  playedCards$ = new EventEmitter<{ idioot: Idioot, cards: Card[] }>();
  takeTable$ = new EventEmitter<Idioot>();
  startTurn$ = new EventEmitter<Idioot>();
  turnStarted$ = new EventEmitter<Idioot>();

  constructor(context: IdiotenContext) {
    this.context = context;

    this.startRound$.subscribe(r => console.log(`[EVENT] startRound$`, r));
    this.roundStarted$.subscribe(r => console.log(`[EVENT] roundStarted$`, r));
    this.roundEnded$.subscribe(r => console.log(`[EVENT] roundEnded$`, r));
    this.whoHasA$.subscribe(val => console.log(`[EVENT] whoHasA$`, val));
    this.gameFinished$.subscribe(() => console.log(`[EVENT] gameFinished$`));
    this.playCards$.subscribe(({idioot, cards}) => console.log(`[EVENT] playCards$`, idioot, cards));
    this.playedCards$.subscribe(({idioot, cards}) => console.log(`[EVENT] playedCards$`, idioot, cards));
    this.startTurn$.subscribe((idioot) => console.log(`[EVENT] startTurn$`, idioot));
    this.turnStarted$.subscribe((idioot) => console.log(`[EVENT] startTurn$`, idioot));
  }

  playCards(idioot: Idioot, cards: Card[]) {
    this.playCards$.emit({idioot, cards});
  }

  playedCards(idioot: Idioot, cards: Card[]) {
    this.playedCards$.emit({idioot, cards});
  }

  startRound(round: number) {
    this.startRound$.emit(round);
  }

  endRound(round: number) {
    this.roundEnded$.emit(round);
  }

  whoHasA(cardValue: number) {
    this.whoHasA$.emit(cardValue);
  }

  roundStarted(round: number) {
    this.roundStarted$.emit(round);
  }

  startTurn(idioot: Idioot) {
    this.startTurn$.emit(idioot);
  }

  turnStarted(idioot: Idioot) {
    this.turnStarted$.emit(idioot);
  }

  takeTable(idioot: Idioot) {
    this.takeTable$.emit(idioot);
  }
}


