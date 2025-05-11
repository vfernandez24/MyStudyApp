export default function selectColor(promedio: number) {
  let returnNumber : number = 0;
  if (promedio < 3) {
    returnNumber = 0;
  }
  if (promedio >= 3 && promedio < 5 ) {
    returnNumber = 1;
  }
  if (promedio >= 5 && promedio < 6 ) {
    returnNumber = 2;
  }
  if (promedio >= 6 && promedio < 6.5 ) {
    returnNumber = 3;
  }
  if (promedio >= 6.5 && promedio < 8 ) {
    returnNumber = 4;
  }
  if (promedio >= 8 && promedio < 9.5 ) {
    returnNumber = 5;
  }
  if (promedio >= 9.5 && promedio <= 10 ) {
    returnNumber = 6;
  }

  return returnNumber
}
