import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Game} from 'phaser';
import {IdiotenScene} from "../../../game/scenes/idioten.scene";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.sass'
})
export class GameComponent implements OnInit {
  phaserGame!: Game;

  constructor() {
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1200,
      height: 800,
      scale: {
        mode: Phaser.Scale.FIT,
      },
      scene: [IdiotenScene],
      parent: 'gameContainer',
      title: "Neural 2023",
      backgroundColor: "#f6d7b0",
      physics: {
        default: 'arcade'
      }
      // physics: {
      //   default: 'arcade',
      //   matter: {
      //     debug: false,
      //     gravity: {y: 0}
      //   }
      // },
      // plugins: {
      //   scene: [
      //     {
      //       key: 'PhaserRaycaster',
      //       plugin: PhaserRaycaster,
      //       mapping: 'raycasterPlugin'
      //     }
      //   ]
      // }
    });
  }
}
