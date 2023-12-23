import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Game} from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.sass'
})
export class GameComponent implements OnInit {
  @Input() config!: GameConfig;
  phaserGame!: Game;

  constructor() {
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
    //Phaser.Display.Canvas.CanvasInterpolation.setCrisp(this.phaserGame.canvas);
  }
}
