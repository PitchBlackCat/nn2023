import {EventEmitter} from "@angular/core";
import {filter} from "rxjs";

export class ActionManager {

  emitter$: EventEmitter<Action> = new EventEmitter<Action>();
  queue: Action[] = [];

  constructor() {
  }

  emit(action: Action) {
    this.emitter$.emit(action);
  }

  on<A extends Action>(action: new (...args: any[]) => A) {
    return this.emitter$
      .pipe(filter(a => a instanceof action))
  }

  dispose() {
    this.emitter$.complete();
  }
}

export abstract class Action {

}


