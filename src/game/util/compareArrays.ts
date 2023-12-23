export const compareArrays = <T>(a: T[], b: T[]) =>
  a.length === b.length &&
  a.every((element, index) => element === b[index]);

export const containsAllOf = <T>(sub: T[], arr: T[]) =>
  sub.every((s) => arr.find(i => i === s) !== undefined);

export const removeFromArray = <T>(arr: T[], item: T) => {
  arr.splice(arr.findIndex(i => i === item), 1);
}

export const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const allEqual = <T>(arr: T[]) => arr.every(val => val === arr[0]);

export const removeFrom = <T>(rem: T[], arr: T[]) => {
  return arr.filter(a => rem.find(b => a === b))
}

export const getItemBefore = <T>(arr: T[], item: T) => {
  const index = arr.indexOf(item);
  if (index < 0) throw Error(`item not in array!`);
  return arr[(index === 0 ? arr.length : index) - 1];
}

export const getItemAfter = <T>(arr: T[], item: T) => {
  const index = arr.indexOf(item);
  if (index < 0) throw Error(`item not in array!`);
  return arr[index === arr.length - 1 ? 0 : index + 1];
}
