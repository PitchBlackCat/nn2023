import {EventEmitter} from "@angular/core";

export class IdiootEvent<T> {
  beforeInit$ = new EventEmitter<T>();
  init$ = new EventEmitter<T>();
  afterInit$ = new EventEmitter<T>();
  protected _cancel: boolean = false;
  protected _valueChanged: boolean = false;
  protected _value?: T;

  get value(): T | undefined {
    return this._value;
  }

  emit(t: T) {
    this._cancel = false;
    this._valueChanged = false;
    this._value = t;

    this.beforeInit$.emit(t);

    if (!this._cancel) {
      this.init$.emit(this._value);
      this.afterInit$.emit(this._value);
    }
  }

  cancel() {
    this._cancel = true;
  }

  updateValue(t: T) {
    if (this._valueChanged) {
      console.warn(`My value is getting changed by multiple subscribers. This can lead to unexpected bugs`);
    }
    this._value = t;
    this._valueChanged = true;
  }

  debug(name: string) {
    this.beforeInit$.subscribe(v => console.log(`[Event] | B | ${name}`, this._value))
    this.init$.subscribe(v => console.log(`[Event] | I | ${name}`, this._value))
    this.afterInit$.subscribe(v => console.log(`[Event] | A | ${name}`, this._value))
  }
}

export class IdiootEndingEvent<T> extends IdiootEvent<T> {
  ended$ = new EventEmitter<T | null>();

  override emit(t: T) {
    this.end();
    setTimeout(() => {
      super.emit(t);
    }, 0);
  }
  end() {
    if (this._value !== undefined) this.ended$.emit(this._value);
    this._value = undefined;
  }
  override debug(name: string) {
    this.ended$.subscribe(v => console.log(`[Event] | E | ${name}`, this._value))
    super.debug(name);
  }
}

export class IdiootVoidEndingEvent<T> extends IdiootEndingEvent<T> {
  private emitted = false;

  override emit(t: T) {
    super.emit(t);
    this.emitted = true;
  }
  override end() {
    if (this.emitted) this.ended$.emit(this._value);
    this._value = undefined;
  }
}
