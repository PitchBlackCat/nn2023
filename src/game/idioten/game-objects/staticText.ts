import BitmapText = Phaser.GameObjects.BitmapText;
import {Scene} from "phaser";
import {AbstractText} from "./AbstractText";

export class StaticText extends AbstractText {
  bitmapText!: BitmapText;

  constructor(scene: Scene, x: number, y: number, font: string, text?: string, size?: number) {
    super(scene, x, y, font, text || '', size);
  }

  create() {
    this.bitmapText = new BitmapText(this.scene, 0, 0, this._font, this._text, this._size);
    this.add(this.bitmapText);
  }

  override setText(text: string): void {
    this.bitmapText.text = text;
    super.setText(text);
  }

  protected align(): void {
    switch (this._halignment) {
      case "left":
        this.bitmapText.x = 0;
        break;
      case "center":
        this.bitmapText.x = -this.bitmapText.width / 2;
        break;
      case "right":
        this.bitmapText.x = -this.bitmapText.width;
        break;
    }

    switch (this._valignment) {
      case "top":
        this.bitmapText.y = 0;
        break;
      case "center":
        this.bitmapText.y = -this.bitmapText.height / 2;
        break;
      case "bottom":
        this.bitmapText.y = -this.bitmapText.height;
        break;
    }
  }
}
