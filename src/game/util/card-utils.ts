export const cardname = (value: number) => {
  switch(value) {
    case 11: return 'Jack';
    case 12: return 'Queen';
    case 13: return 'King';
    case 14: return 'Ace';
    default: return value;
  }
}

export const cardValues = [2,3,4,5,6,7,8,9,10,11,12,13,14];
