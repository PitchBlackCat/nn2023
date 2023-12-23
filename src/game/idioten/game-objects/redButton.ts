import Container = Phaser.GameObjects.Container;
import NineSlice = Phaser.GameObjects.NineSlice;
import {Scene} from "phaser";
import {StaticText} from './staticText';
import {EventEmitter} from "@angular/core";

export class RedButton extends Container {
  click$ = new EventEmitter();
  protected text: StaticText;
  protected nineslice: Phaser.GameObjects.NineSlice;
  protected _down = false;
  protected _over = false;
  protected _disabled = false;

  set disabled(f: boolean) {
    this._disabled = f;
    this.nineslice.removeInteractive();
    if (this._disabled) {
      this.nineslice.setInteractive();
      this.nineslice.setTint(0xABABAB);
      this.text.bitmapText.setTint(0xABABAB);
    } else {
      this.nineslice.setInteractive({cursor: 'pointer'});
      this.nineslice.clearTint();
      this.text.bitmapText.clearTint();
    }

    this.updateFrame();
  }
  protected frames = {
    up: 'red_button04.png',
    down: 'red_button05.png',
    over: 'red_button01.png',
    overdown: 'red_button02.png'
  }

  constructor(scene: Scene, x: number, y: number, label: string) {
    super(scene, x, y);

    this.nineslice = new NineSlice(scene, 0, 0, 'red-button', 'red_button04.png', 190, 45, 10, 10, 20, 20);
    this.add(this.nineslice);

    this.text = new StaticText(scene, 0, 0, 'hey-comic', label, 24);
    this.add(this.text);

    this.addListeners();
  }

  override destroy(fromScene?: boolean) {
    this.removeListeners();
    super.destroy(fromScene);
  }

  private addListeners() {
    this.nineslice.setInteractive({cursor: 'pointer'});
    this.nineslice.on('pointerover', () => {
      this._over = true;
      this.updateFrame();
    })

    this.nineslice.on('pointerout', () => {
      this._over = false;
      this.updateFrame();
    })

    this.nineslice.on('pointerdown', () => {
      this._down = true;
      this.updateFrame();
    })

    this.scene.input.on('pointerup', () => {
      this._down = false;
      this.updateFrame();
    });

    this.nineslice.on('pointerup', () => {
      if (this._down) {
        this.click$.emit();
      }
    })
  }

  private removeListeners() {
    this.nineslice.off('pointerover');
    this.nineslice.off('pointerout');
    this.nineslice.off('pointerdown');
    this.nineslice.off('pointerup');
  }

  private updateFrame() {
    if (this._disabled) return this.setDisabledFrame();

    if (!this._down && !this._over)
      this.nineslice.setFrame(this.frames.up);

    if (this._down && !this._over)
      this.nineslice.setFrame(this.frames.down);

    if (!this._down && this._over)
      this.nineslice.setFrame(this.frames.over);

    if (this._down && this._over)
      this.nineslice.setFrame(this.frames.overdown);

    this.text.y = this._down ? 3 : 0;
    this.nineslice.y = this._down ? 3 : 0;
    this.nineslice.height = this._down ? 42 : 45;
  }

  private setDisabledFrame() {
    this.nineslice.setFrame(this.frames.up);
    this.text.y = 0;
    this.nineslice.y = 0;
    this.nineslice.height = 45;
  }
}
