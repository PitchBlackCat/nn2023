import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IdiotenGameScene} from "../../../game/idioten/scenes/idioten.game.scene";
import {GameComponent} from "../../components/game/game.component";
import {IdiotenBgScene} from "../../../game/idioten/scenes/idioten.bg.scene";
import {IdiotenStartScene} from "../../../game/idioten/scenes/idioten.start.scene";
import {IdiotenTrainBrain1Scene} from "../../../game/idioten/scenes/idioten.train-brain-1.scene";
import {Plugin as NineSlicePlugin} from 'phaser3-nineslice'
import GameConfig = Phaser.Types.Core.GameConfig;

@Component({
  selector: 'app-idioten-page',
  standalone: true,
  imports: [CommonModule, GameComponent],
  templateUrl: './idioten-page.component.html',
  styleUrl: './idioten-page.component.sass'
})
export class IdiotenPageComponent {
  protected config: GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scale: {
      mode: Phaser.Scale.RESIZE,
    },
    scene: [IdiotenBgScene, IdiotenGameScene, IdiotenStartScene, IdiotenTrainBrain1Scene],
    parent: 'gameContainer',
    title: "Neural 2023",
    backgroundColor: "#f6d7b0",
    physics: {
      default: 'arcade'
    },
    plugins: {
      global: [NineSlicePlugin.DefaultCfg],
    }
  }
}
