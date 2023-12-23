import {Scene} from "phaser";
import {StaticText} from "./staticText";
import {AbstractText, VAlignment} from "./AbstractText";
import Container = Phaser.GameObjects.Container;

export class DynamicText extends AbstractText {
  get spacing(): number {
    return this._spacing;
  }

  set spacing(value: number) {
    this._spacing = value;
    let runningWidth = 0;
    this.characters.forEach(char => {
      char.x = runningWidth + char.bitmapText.width / 2;
      char.y = char.bitmapText.height / 2;
      runningWidth += char.bitmapText.width + this._spacing;
    })
  }
  characters!: StaticText[];
  container!: Container;
  private _spacing: number = 0

  constructor(scene: Scene, x: number, y: number, font: string, text?: string, spacing: number = 0, size?: number) {
    super(scene, x, y, font, text || '', size);
    this.spacing = spacing;
  }

  override setText(text: string): void {
    if (this.characters.length) {
      this.characters.forEach(char => char.destroy(true));
      this.characters = [];
    }

    text.split('').forEach(char => {
      const character = new StaticText(this.scene, 0, 0, this._font, char, this._size);
      this.container.add(character);
      this.characters.push(character);
    })

    this.characters.forEach(char => {
      char.halignment = 'center';
      char.valignment = 'center';
    });

    this.spacing = this._spacing;

    super.setText(text);
  }

  protected create(): void {
    this.characters = [];
    this.container = new Container(this.scene, 0, 0);
    this.add(this.container);
  }

  protected align(): void {
    if (this.characters.length === 0) return;
    const lastChar = this.characters[this.characters.length - 1];
    const width = (lastChar.x || 0) + lastChar.bitmapText.width;

    switch (this._halignment) {
      case "left":
        this.container.x = 0;
        break;
      case "center":
        this.container.x = -width / 2;
        break;
      case "right":
        this.container.x = -width;
        break;
    }

    switch (this._valignment) {
      case "top":
        this.container.y = 0;
        break;
      case "center":
        this.container.y = -lastChar.bitmapText.height / 2;
        break;
      case "bottom":
        this.container.y = -lastChar.bitmapText.height;
        break;
    }
  }
}
