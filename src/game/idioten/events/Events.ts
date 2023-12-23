import {Idioot} from "../idioot/idioot";
import {Card} from "../card/card";
import {CardPile} from "../card/card-pile";
import {Action} from "./EventManager";

export class StartRound extends Action {
  constructor(readonly round: number) {
    super();
  }
}

export class EndRound extends Action {
  constructor(readonly round: number) {
    super();
  }
}

export class StartTurn extends Action {
  constructor(readonly idioot: Idioot) {
    super();
  }
}

export class EndTurn extends Action {
  constructor(readonly idioot: Idioot) {
    super();
  }
}

export class StartGame extends Action {
}

export class EndGame extends Action {
}

export class StartDrawing extends Action {
  constructor(readonly idioot: Idioot) {
    super();
  }
}

export class MoveCards extends Action {
  constructor(readonly idioot: Idioot, readonly cards: Card[], readonly targetPile: CardPile) {
    super()
  }
}

export class MoveCardsComplete extends Action {
  constructor(readonly cards: Card[]) {
    super()
  }
}

export class WhoHasA extends Action {
  constructor(readonly cardValue: number) {
    super();
  }
}

export class Pass extends Action {
  constructor(readonly idioot: Idioot,) {
    super();
  }
}
