import Container = Phaser.GameObjects.Container;
import {Scene} from "phaser";

export type HAlignment = 'left' | 'center' | 'right';
export type VAlignment = "top" | "center" | "bottom";

export abstract class AbstractText extends Container {
  protected _size: number;
  protected _font: string;
  protected _container!: Container;

  constructor(scene: Scene, x: number, y: number, font: string, text: string, size?: number) {
    super(scene, x, y);
    this._size = size || 0;
    this._font = font;

    this.create();
    this.setText(text);
  }

  protected _text!: string;

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this.setText(value);
  }

  protected _halignment: HAlignment = 'center';

  get halignment(): HAlignment {
    return this._halignment;
  }

  set halignment(value: HAlignment) {
    this._halignment = value;
    this.align();
  }

  protected _valignment: VAlignment = 'center';

  get valignment(): VAlignment {
    return this._valignment;
  }

  set valignment(value: VAlignment) {
    this._valignment = value;
    this.align();
  }

  setText(text: string): void {
    this._text = text;
    this.align();
  }

  protected abstract align(): void ;

  protected abstract create(): void;
}
