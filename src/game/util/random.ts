import {names} from "./names";

export const random = (max: number = 1) => {
  return Math.random() * max;
}
export const randomRange = (min: number, max: number) => {
  return random(max - min) + min;
}

export const randomInt = (max: number) => {
  return Math.floor(random(max));
}
export const randomIntRange = (min: number, max: number) => {
  return Math.round(randomRange(min, max));
}
export const randomGaussian = (mean = 0, stdDev = 1) => {
  // Random numbers in the interval: (0,1]
  const u1 = 1 - Math.random();
  const u2 = 1 - Math.random();

  // Generate a normal sample with a mean of 0 and standard deviation of 1.
  const sample = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

  // Translate and scale the sample to the wanted mean and standard deviation.
  const scaled = mean + stdDev * sample;

  return scaled;
};

export const randomString = () => btoa(Math.random().toString()).substring(10, 15)

export const randomItem = <T>(arr: T[]) => {
  return arr[randomInt(arr.length)];
}

export const randomName = () => {
  return `${randomItem(names)}`;
}

export class SeededRandom {
  m = 2 ** 35 - 31
  a = 185852
  seed: number;
  s!: number;

  constructor(seed: number) {
    this.seed = seed;
    this.reset();
  }

  reset() {
    this.s = this.seed % this.m;
  }

  next() {
    return (this.s = this.s * this.a % this.m) / this.m;
  }

  range = (min: number, max: number) => {
    return this.next() * (max - min) + min;
  }
}
