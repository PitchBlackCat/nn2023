import {Card} from "./card";
import {IdiotenContext} from "./idioten-context";
import {Idioot} from "./idioot";
import {CardPile} from "./card-pile";
import {take, takeUntil} from "rxjs";

export class HumanIdioot extends Idioot {
  private btnConfirm: Phaser.GameObjects.Image;
  private sparkleParticles: Phaser.GameObjects.Particles.ParticleEmitter;
  private btnTake: Phaser.GameObjects.Image;

  get selected(): Card[] {
    return this.hand.cards.filter(c => c.selected);
  }

  constructor(scene: Phaser.Scene, context: IdiotenContext, name: string, x?: number, y?: number) {
    super(scene, context, name, x, y);

    this.btnConfirm = this.scene.add.image(175, 0, 'check');
    this.btnConfirm.scale = .7;

    this.btnTake = this.scene.add.image(-250, 0, 'reload');
    this.btnTake.scale = .7;

    this.sparkleParticles = this.scene.add.particles(this.btnConfirm.x, this.btnConfirm.y, 'sparkles');
    this.add(this.sparkleParticles);
    this.add(this.btnConfirm);
    this.add(this.btnTake);

    this.sparkleParticles.setConfig({
      speed: {min: -50, max: 50},
      scale: {start: .05, end: 0},
      blendMode: 'ADD',
      lifespan: 1500,
      frequency: 75
    });
    this.updateButton();

    this.context.rx.roundStarted$
      .pipe(take(1))
      .subscribe(() => {
        this.makeInteractive();
        this.setCardsInteractive(this.hand);
      })

    this.context.rx.turnStarted$
      .pipe(takeUntil(this.context.rx.gameFinished$))
      .subscribe(() => {
        this.updateButton();
      })
  }

  chooseBeforeLastCards(context: IdiotenContext): Promise<Card[]> {
    return Promise.resolve([]);
  }

  drawBeforeLastCards(context: IdiotenContext): Promise<Card[]> {
    return Promise.resolve([]);
  }

  takeTurn(context: IdiotenContext): Promise<Card[]> {
    return Promise.resolve([]);
  }

  whoHasAThree(context: IdiotenContext): Promise<Card[]> {
    return Promise.resolve([]);
  }

  makeInteractive() {
    this.btnConfirm.setInteractive({useHandCursor: true});
    this.btnConfirm.on('pointerup', () => {
      try {
        this.context.assertLegalMove(this, this.selected)
      } catch (e: any) {
        this.error.text = e.message;
        setTimeout(() => this.error.text = ' ', 5000)
      }

      const cards = this.selected
      this.removeCardsInteractive(this.hand);
      this.context.rx.playCards(this, cards);
      setTimeout(() => {
        this.setCardsInteractive(this.hand);
        this.updateButton();
      }, 100);
    })

    this.btnTake.setInteractive({useHandCursor: true});
    this.btnTake.on('pointerup', () => {
      this.removeCardsInteractive(this.hand);
      this.context.rx.takeTable(this);
      setTimeout(() => {
        this.setCardsInteractive(this.hand);
        this.updateButton();
      }, 100);
    })
  }

  setCardsInteractive(pile: CardPile) {
    pile.cards.forEach(c => this.setCardInteractive(c));
  }

  removeCardsInteractive(pile: CardPile) {
    pile.cards.forEach(c => this.removeCardInteractive(c));
  }
  setCardInteractive(c: Card) {
    c.sprite.setInteractive({useHandCursor: true});

    c.sprite.on('pointerup', () => {
      c.selected = !c.selected;
      this.updateButton();
    })
  }

  removeCardInteractive(c: Card) {
    c.sprite.removeInteractive();
    c.sprite.off('pointerup');
    c.selected = false;
  }

  updateButton() {
    const legal = this.isLegalMove();
    legal ? this.sparkleParticles.start() : this.sparkleParticles.stop(false);
    legal ? this.btnConfirm.clearTint() : this.btnConfirm.setTint(0x888888);

    this.context.currentIdioot === this ? this.btnTake.clearTint() : this.btnTake.setTint(0x888888);
  }

  stopInteractive() {
    this.hand.cards.forEach(c => {
      c.sprite.removeInteractive();
      c.sprite.off('pointerup');
    });
  }

  isLegalMove() {
    return this.context.isLegalMove(this, this.selected);
  }
}
