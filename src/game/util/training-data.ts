export interface TrainingData<I = any, O = any> {
  input?: I;
  expectedOutput?: O;
}

export class TrainingStore<I = any, O = any> {
  data: TrainingData<I, O>[] = [];
  private _current?: TrainingData<I, O>;

  private _name;
  constructor(name: string) {
    this._name = name;
  }

  get current() {
    if (!this._current) this._current = {input: undefined, expectedOutput: undefined};
    return this._current;
  }

  add(data: TrainingData<I, O>) {
    this.data.push(data);
  }

  addCurrent() {
    if (!this._current) throw new Error('Nothing to commit!');
    this.add(this._current);
    this._current = undefined;
  }

  save() {
    localStorage.setItem(this._name, JSON.stringify(this.data));
  }

  load() {
    const item = localStorage.getItem(this._name);
    if (item) {
      this.data = JSON.parse(item) as TrainingData<I, O>[];
    }
  }

  // delete the save file
  delete() {
    this.data = [];
    this.save();
  }

  // clear all data from the in memory store
  clear() {
    this.data = [];
  }
}
