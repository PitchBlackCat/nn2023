import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameComponent} from "../../components/game/game.component";

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule, GameComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.sass'
})
export class GamePageComponent {

}
