export const constructorToType = (me: any, postfix: string) => {
  return me.constructor.name
    .slice(0, -postfix.length)
    .split('')
    .filter((c: string) => c !== '_')
    .join('')
    .toLowerCase();
}
