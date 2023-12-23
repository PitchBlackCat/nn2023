import {Idioot} from "./idioot/idioot";
import {Scene} from "phaser";
import {IdiotenContext} from "./game/idioten-context";
import {IdiotenGameManager} from "./game/Idioten-game-manager";
import {TrainingData, TrainingStore} from "../util/training-data";
import {filter, take, takeUntil} from "rxjs";
import {shuffleArray} from "../util/compareArrays";
import {ConfigurableIdiotenBrain, IdiotenBrain} from "./idioten-brain";
import * as tf from '@tensorflow/tfjs';
import {randomItem} from "../util/random";
import {Card} from "./card/card";

export class IdiotenBrain1Trainer extends IdiotenGameManager {
  static trainingData: TrainingStore = new TrainingStore<number[], number[]>('idioten-blcp-trainingdata-1.0');
  static brain: IdiotenBrain = new ConfigurableIdiotenBrain({name: 'idioten-blcp-brain-1.0'});

  static rounds = 100;
  static dataSetSize = 10000;

  constructor(scene: Scene, context: IdiotenContext, players: Idioot[]) {
    super(scene, context, players);

    this.context.deck.position.x = 500;
    this.anouncement.x = 500;

    this.idioten.forEach((idioot, i) => {
      idioot.x = -200;
      idioot.y = -500 + (500 * i);
    });

    this.createDeck();
    this.deal();

    IdiotenBrain1Trainer.trainingData.load();
    if (IdiotenBrain1Trainer.trainingData.data.length >= IdiotenBrain1Trainer.dataSetSize) {

      setTimeout(() => {
        this.train(IdiotenBrain1Trainer.trainingData.data);
      }, 1000)
      //IdiotenBrain1Trainer.trainingData.delete();
    } else {
      setTimeout(() => {
        this.start();
      }, 0);
    }
  }

  override start() {
    if (IdiotenBrain1Trainer.rounds < 0) {
      this.idioten.forEach(i => {
        const values = i.hand.cards.map(c => c.value);
        const prediction = IdiotenBrain1Trainer.brain.predict(values);
        console.log(`${i.playerName} has ${values} and predicts ${prediction}`)
      })

      return;
    }

    this.rx.game$.afterInit$
      .pipe(takeUntil(this.rx.game$.ended$))
      .subscribe(() => {
        this.anounce(`Players! Pick your 3 best cards!`);
        this.rx.startRound(-1);
      })

    this.rx.round$.init$
      .pipe(
        filter(round => round === -1),
        takeUntil(this.rx.game$.ended$)
      )
      .subscribe(round => {
        this.context.round = round;
        this.startPreperationRound();
      })

    this.rx.round$.ended$
      .pipe(
        filter(round => round! === -1),
        takeUntil(this.rx.game$.ended$)
      )
      .subscribe(round => {
        this.record();
        this.rx.game$.end();
      })

    this.rx.playCards$.beforeInit$
      .pipe(takeUntil(this.rx.game$.ended$))
      .subscribe(({idioot, cards}) => {
        if (!this.context.isLegalMove(idioot, cards)) {
          this.rx.playCards$.cancel();
        }
      });

    this.rx.playCards$.init$
      .pipe(takeUntil(this.rx.game$.ended$))
      .subscribe(({idioot, cards}) => {
        this.context.playCards(idioot, cards);
      });

    this.rx.game$.ended$
      .pipe(take(1))
      .subscribe(() => {
        this.restart();
      })

    this.rx.game$.emit();
  }

  private record() {
    this.idioten.forEach(idioot => {
      const myCards = shuffleArray([...idioot.hand.cards, ...idioot.beforeLastCards.cards]);
      const input = myCards.map(card => this.cards.indexOf(card));
      const output = myCards.map(c => idioot.beforeLastCards.contains([c]) ? 1 : -1);

      IdiotenBrain1Trainer.trainingData.current.input = input;
      IdiotenBrain1Trainer.trainingData.current.expectedOutput = output;
      IdiotenBrain1Trainer.trainingData.addCurrent();
    })
  }

  private restart() {
    IdiotenBrain1Trainer.trainingData.save();
    //console.log(IdiotenBrain1Trainer.trainingData.data)
    setTimeout(() => {
      this.scene.scene.restart();
    }, 0);

  }

  private train(data: TrainingData<any, any>[]) {
    IdiotenBrain1Trainer.brain.train(IdiotenBrain1Trainer.trainingData.data)
      .then(() => {

        this.idioten.forEach(idioot => {
          console.group(idioot.label.text);
          const cards = idioot.hand.cards.map(c => c.toString());
          console.log('I: ' + cards);
          const prediction: number[] = IdiotenBrain1Trainer.brain.predict(idioot.hand.cards.map(c => this.cards.indexOf(c)));
          const predictedCards = this.getPredictedCards(idioot.hand.cards, prediction);

          console.log('O: ' + predictedCards.map(c => c.toString()));
          console.groupEnd();
        });

        IdiotenBrain1Trainer.rounds--;
        this.start();
      })
  }

  private getPredictedCards(cards: Card[], prediction: number[]) {
    let copy = [...cards];
    copy = copy.sort((a, b) => {
      return prediction[cards.indexOf(b)] - prediction[cards.indexOf(a)]
    });
    return copy.slice(0,3);
  }
}


