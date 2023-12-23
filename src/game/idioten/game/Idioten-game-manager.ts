import {Idioot} from "../idioot/idioot";
import {Scene} from "phaser";
import {IdiotenContext} from "./idioten-context";
import {Card} from "../card/card";
import {VMath} from "../../util/transform";
import {filter, interval, take, takeUntil, takeWhile, tap} from "rxjs";
import {IdiotenEvents} from "./IdiotenEvents";
import {cardname} from "../../util/card-utils";
import Container = Phaser.GameObjects.Container;

export class IdiotenGameManager extends Container {
  idioten: Idioot[] = [];
  context: IdiotenContext;
  rx: IdiotenEvents;
  protected cards: Card[] = [];
  protected anouncement: Phaser.GameObjects.BitmapText;

  constructor(scene: Scene, context: IdiotenContext, players: Idioot[]) {
    super(scene);
    this.context = context;
    this.context.idioten = players;
    this.rx = this.context.rx;

    players.forEach((idioot, i) => {
      let position = VMath.moveAtAngle({x: 0, y: 0}, -Math.PI + (((Math.PI * 2) / players.length) * i), 600);
      idioot.setPosition(position.x, position.y);
      this.idioten.push(idioot);
    });

    this.anouncement = scene.add.bitmapText(0, 100, 'hey-comic');
    this.anouncement.setTint(0xFFFFFF);
    this.add(this.anouncement);

    this.add(this.idioten);
  }

  anounce(msg: string) {
    this.anouncement.text = msg;
    this.anouncement.setOrigin(.5, .5)
    this.anouncement.setScale(1.5, 1.5)

    this.scene.add.tween({
      targets: [this.anouncement],
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'bounce',
      delay: 250
    });
  }

  start() {
    this.rx.game$.init$.subscribe(() => {
      this.createDeck();
      this.deal();

      this.anounce(`Players! Pick your 3 best cards!`);
      this.rx.startRound(-1);
    })

    this.rx.round$.init$.subscribe(round => {
      this.context.round = round;
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
    })

    this.rx.playCards$.beforeInit$.subscribe(({idioot, cards}) => {
      if (!this.context.isLegalMove(idioot, cards)) {
        this.rx.playCards$.cancel();
      }
    });

    this.rx.playCards$.init$.subscribe(({idioot, cards}) => {
      const canGoAgain = this.context.playCards(idioot, cards);
      this.rx.turn$.updateValue({...this.rx.turn$.value!, canGoAgain});
      this.rx.playCards$.updateValue({idioot, cards});
    });

    this.rx.pass$.beforeInit$.subscribe((idioot) => {
      if (!this.context.table.hasCards) this.rx.pass$.cancel();
    });

    this.rx.pass$.init$.subscribe((idioot) => {
      this.context.takeTable(idioot);
    });

    this.rx.whoHasA$.afterInit$.subscribe(r => {
      this.anounce(`Who has a ${cardname(r)}?!`);
    })

    this.rx.turn$.init$.subscribe(({idioot}) => {
      this.context.currentIdioot = idioot;
      this.anounce(`${idioot.playerName}, it's your turn!`);
    })

    this.rx.game$.emit();
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
      const aCard = (a as Card);
      const bCard = (b as Card);

      if (aCard.pile && aCard.pile === bCard.pile){
        return aCard.pile.cards.indexOf(aCard) - bCard.pile.cards.indexOf(bCard);
      }

      return (b as Card).y - (a as Card).y;
    });
  }

  protected startPreperationRound() {
    this.rx.playCards$.afterInit$.pipe(
      filter(() => this.context.idioten.every(i => i.beforeLastCards.length === 3)),
      take(1)
    ).subscribe(() => {
      this.rx.startRound(0);
    });
  }

  protected startWhoHasARound() {
    const someonePlayedACard$ = this.rx.playCards$.afterInit$.pipe(take(1));

    interval(2000).pipe(
      takeWhile(() => this.context.whoHasA < 14),
      takeUntil(someonePlayedACard$),
    ).subscribe(() => {
      this.rx.whoHasA(this.context.whoHasA + 1);
    })

    this.rx.whoHasA$.init$.pipe(
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

  protected startRegularRound() {
    this.rx.playCards$.afterInit$.pipe(
      takeUntil(this.context.rx.game$.ended$)
    ).subscribe(({idioot}) => {
      this.drawCards(idioot);
      if (idioot.hand.length >= 3) {
        if (!this.rx.turn$.value!.canGoAgain) {
          this.startNextIdiootsTurn();
        } else {
          this.startSameIdiootsTurn();
        }
      }

    });
  }

  protected drawCards(idioot: Idioot) {
    if (!this.context.canDraw(idioot)) return;

    while (
      idioot.hand.length < 3
      && this.context.deck.hasCards
      ) {
      this.context.deck.draw(idioot.hand).closed = false;
    }

    while (
      idioot.hand.length < 3
      && idioot.beforeLastCards.length === 0
      && idioot.lastCards.hasCards
      ) {
      idioot.lastCards.draw(idioot.hand).closed = false;
    }
  }

  protected startNextIdiootsTurn() {
    const index = this.idioten.findIndex(i => i === this.context.currentIdioot);
    this.rx.startTurn(this.idioten[(index + 1) % this.idioten.length]);
  }

  protected startSameIdiootsTurn() {
    this.rx.startTurn(this.context.currentIdioot!);
  }
}


