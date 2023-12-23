import {IdiotenContext} from "../game/idioten-context";
import {Idioot} from "./idioot";
import {take, takeUntil} from "rxjs";
import {Card} from "../card/card";
import {CardPile} from "../card/card-pile";

export class HumanIdioot extends Idioot {
  private btnConfirm: Phaser.GameObjects.Image;
  private sparkleParticles: Phaser.GameObjects.Particles.ParticleEmitter;
  private btnTake: Phaser.GameObjects.Image;

  private activePile: CardPile;

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

    this.activePile = this.hand;

    this.sparkleParticles.setConfig({
      speed: {min: -50, max: 50},
      scale: {start: .05, end: 0},
      blendMode: 'ADD',
      lifespan: 1500,
      frequency: 75
    });
    this.updateButton();

    this.context.rx.round$.afterInit$
      .pipe(take(1))
      .subscribe(() => {
        this.makeInteractive();
        this.setPileInteractive(this.hand);
      })

    this.context.rx.turn$.afterInit$
      .pipe(takeUntil(this.context.rx.game$.ended$))
      .subscribe(() => {
        this.updateButton();
      })
  }

  makeInteractive() {
    this.btnConfirm.setInteractive({useHandCursor: true});
    this.btnConfirm.on('pointerup', () => {
      try {
        this.context.assertLegalMove(this, this.selected)
      } catch (e: any) {
        this.error.text = e.message;
        this.error.setOrigin(.5,.5);
        setTimeout(() => this.error.text = ' ', 5000)
      }

      const cards = this.selected
      this.removePileInteractive(this.activePile);
      this.context.rx.playCards(this, cards);
      console.log('dang!')
      setTimeout(() => {
        this.setPileInteractive(this.activePile);
        this.updateButton();
      }, 100);
    })

    this.btnTake.setInteractive({useHandCursor: true});
    this.btnTake.on('pointerup', () => {
      this.removePileInteractive(this.activePile);
      this.context.rx.takeTable(this);
      setTimeout(() => {
        this.setPileInteractive(this.activePile);
        this.updateButton();
      }, 100);
    })
  }

  setPileInteractive(pile: CardPile) {
    pile.cards.forEach(c => this.setCardInteractive(c));
  }

  removePileInteractive(pile: CardPile) {
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

  isLegalMove() {
    return this.context.isLegalMove(this, this.selected);
  }
}
