import {Idioot} from "./idioot";
import {Scene} from "phaser";
import {IdiotenContext} from "./idioten-context";
import {HumanIdioot} from "./HumanIdioot";
import {Card} from "./card";
import {VMath} from "../util/transform";
import {filter, interval, take, takeUntil, takeWhile} from "rxjs";
import {IdiotenEventManager} from "./Idioten-event-manager";
import Container = Phaser.GameObjects.Container;

export class IdiotenGameManager extends Container {
  idioten: Idioot[] = [];
  context: IdiotenContext;
  rx: IdiotenEventManager;
  private cards: Card[] = [];
  private anouncement: Phaser.GameObjects.BitmapText;

  constructor(scene: Scene, players: number) {
    super(scene);
    this.context = new IdiotenContext(scene);
    this.rx = this.context.rx;

    for (let i = 0; i < players; i++) {
      let position = VMath.moveAtAngle({x: 0, y: 0}, -Math.PI + (((Math.PI * 2) / players) * i), 600);
      this.idioten.push(new HumanIdioot(this.scene, this.context, `Player ${i + 1}`, position.x, position.y));
    }

    this.anouncement = scene.add.bitmapText(-110, 100, 'hey-comic');
    this.anouncement.setTint(0xFFFFFF);
    this.add(this.anouncement);

    this.add(this.idioten);
  }

  start() {
    this.createDeck();
    this.deal();

    this.rx.startRound$.subscribe(r => {
      if (r !== this.context.round) this.rx.endRound(this.context.round);
      this.context.round = r;
      this.rx.roundStarted(this.context.round);
    });

    this.rx.roundStarted$.subscribe(r => {
      this.roundStartedHandler(r);
    })

    this.rx.playCards$.subscribe(({idioot, cards}) => {
      this.context.playCards(idioot, cards);
      this.rx.playedCards(idioot, cards);
    });

    this.rx.takeTable$.subscribe((idioot) => {
      this.context.takeTable(idioot);
    });

    this.rx.whoHasA$.subscribe(r => {
      this.anouncement.text = `Who has a ${r}!`;
    })

    this.rx.startTurn$.subscribe(i => {
      this.context.currentIdioot = i;
      this.anouncement.text = `${i.label.text}, it's your turn!`;
      this.rx.turnStarted(i);
    })

    this.rx.startRound(-1);
  }

  createDeck() {
    this.cards = [];
    for (let suit = 0; suit < 4; suit++) {
      for (let value = 2; value <= 14; value++) {
        this.cards.push(new Card(this.scene, suit, value, this.context.deck));
      }
    }

    this.add(this.cards);
    this.context.deck.shuffle();
  }

  deal() {
    for (let i = 0; i < 3; i++) {
      this.idioten.forEach(idioot => {
        this.context.deck.draw(idioot.lastCards)
      })
    }

    for (let i = 0; i < 6; i += 2) {
      this.idioten.forEach(idioot => {
        this.context.deck.draw(idioot.hand)
        this.context.deck.draw(idioot.hand)
      })
    }

    this.idioten.forEach(idioot => {
      idioot.hand.show();
    })
  }

  override update(...args: any[]): void {
    this.list.sort((a, b) => {
      return (b as Card).y - (a as Card).y;
    });
  }

  private roundStartedHandler(round: number) {
    switch (round) {
      case -1:
        this.startPreperationRound();
        break;
      case 0:
        this.startWhoHasARound();
        break;
      default:
        this.startRegularRound();
        break;
    }
  }

  private startPreperationRound() {
    this.rx.playCards$.pipe(
      filter(() => this.idioten.every(i => i.beforeLastCards.length === 3)),
      take(1)
    ).subscribe(() => {
      this.rx.startRound(0);
    });
  }

  private startWhoHasARound() {
    const someonePlayedACard$ = this.rx.playedCards$.pipe(take(1));

    interval(2000).pipe(
      takeWhile(() => this.context.whoHasA < 14),
      takeUntil(someonePlayedACard$),
    ).subscribe(() => {
      this.rx.whoHasA(this.context.whoHasA + 1);
    })

    this.rx.whoHasA$.pipe(
      takeUntil(someonePlayedACard$)
    ).subscribe(whoHasA => {
      this.context.whoHasA = whoHasA;
    })

    someonePlayedACard$.subscribe(({idioot, cards}) => {
      this.context.currentIdioot = idioot;
      while (idioot.hand.length < 3 && this.context.deck.length > 1) {
        this.context.deck.draw(idioot.hand).closed = false;
      }

      this.startNextIdiootsTurn();
      this.rx.startRound(1);
    })

    this.rx.whoHasA(3);
  }

  private startRegularRound() {
    this.rx.playedCards$.pipe(
      takeUntil(this.rx.gameFinished$)
    ).subscribe({
      next: () => {
        const curr = this.context.currentIdioot;
        while (curr.hand.length < 3 && this.context.deck.length > 1) {
          this.context.deck.draw(curr.hand).closed = false;
        }
        this.startNextIdiootsTurn();
      }
    });
  }

  private startNextIdiootsTurn() {
    const index = this.idioten.findIndex(i => i === this.context.currentIdioot);
    this.rx.startTurn(this.idioten[(index + 1) % this.idioten.length]);
  }

  private startSameIdiootsTurn() {
    this.rx.startTurn(this.context.currentIdioot!);
  }
}


