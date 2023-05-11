export default function generateUniqueRandomNumbers(
  min: number,
  max: number,
  count: number
) {
  if (count > max - min + 1) {
    console.log(
      "Error: Not enough numbers in the range to generate unique random numbers."
    );
    return [];
  }

  let numbers: number[] = [];

  while (numbers.length < count) {
    var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }

  return numbers;
}
