import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameComponent} from "../../components/game/game.component";
import {IdiotenTrainBrain1Scene} from "../../../game/idioten/scenes/idioten.train-brain-1.scene";
import GameConfig = Phaser.Types.Core.GameConfig;

@Component({
  selector: 'app-idioten-train-brain-1-page',
  standalone: true,
  imports: [CommonModule, GameComponent],
  templateUrl: './idioten-train-brain-1-page.component.html',
  styleUrl: './idioten-train-brain-1-page.component.sass'
})
export class IdiotenTrainBrain1PageComponent {
  protected config: GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 1200,
    scale: {
      mode: Phaser.Scale.FIT,
    },
    scene: [IdiotenTrainBrain1Scene],
    parent: 'gameContainer',
    title: "Neural 2023",
    backgroundColor: "#f6d7b0",
    physics: {
      default: 'arcade'
    }
  }
}
