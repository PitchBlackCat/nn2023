import {Organism} from "../organism/organism";
import {Updateable} from "../../util/updateable";
import {Destructable} from "../../util/destructable";
import Dict = NodeJS.Dict;
import {removeFromArray} from "../../util/compareArrays";

export class OrganismStore implements Updateable, Destructable{
  organisms: Organism[] = [];
  organismsById: Dict<Organism> = {}
  organismsByType: Dict<Organism[]> = {}

  get length() {
    return this.organisms.length;
  }

  get types() {
    return Object.keys(this.organismsByType);
  }

  add(organism: Organism<any, any>) {
    this.organismsById[organism.label] = organism;

    this.organisms.push(organism);

    if (this.organismsByType[organism.type] === undefined)
      this.organismsByType[organism.type] = [];
    this.organismsByType[organism.type]!.push(organism);

  }

  remove(organism: Organism<any, any>, destroy: boolean = true) {
    delete this.organismsById[organism.label];
    removeFromArray(this.organisms, organism);
    removeFromArray(this.organismsByType[organism.type]!, organism);
    if (destroy) organism.destroy();
  }

  removeById(label: string, destroy: boolean = true) {
    this.remove(this.organismsById[label]!, destroy);
  }

  destroy(): void {
    this.organisms.forEach(o => o.destroy());

    this.organisms = [];
    this.organismsById = {};
    this.organismsByType = {};
  }

  update(): void {
    this.organisms.forEach(o => o.update());
  }
}
