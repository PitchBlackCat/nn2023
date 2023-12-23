import {IdiotenContext} from "../game/idioten-context";
import {Idioot} from "./idioot";

export class StaticIdioot extends Idioot {
  constructor(scene: Phaser.Scene, context: IdiotenContext, name: string, x?: number, y?: number) {
    super(scene, context, `Static ${name}`, x, y);
  }
}
