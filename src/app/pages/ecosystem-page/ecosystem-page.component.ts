import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameComponent} from "../../components/game/game.component";
import PhaserRaycaster from 'phaser-raycaster';
import {EcosystemScene} from "../../../game/scenes/EcosystemScene";
import GameConfig = Phaser.Types.Core.GameConfig;

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule, GameComponent],
  templateUrl: './ecosystem-page.component.html',
  styleUrl: './game-page.component.sass'
})
export class EcosystemPageComponent {

  protected config: GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scale: {
      mode: Phaser.Scale.FIT,
    },
    scene: [EcosystemScene],
    parent: 'gameContainer',
    title: "Neural 2023",
    backgroundColor: "#f6d7b0",
    physics: {
      default: 'arcade',
      matter: {
        debug: false,
        gravity: {y: 0}
      }
    },
    plugins: {
      scene: [
        {
          key: 'PhaserRaycaster',
          plugin: PhaserRaycaster,
          mapping: 'raycasterPlugin'
        }
      ]
    }
  }

}
