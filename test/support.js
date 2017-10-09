export function asyncAction(fn) {
  return (args) => { setTimeout(fn(args), 100); };
}
