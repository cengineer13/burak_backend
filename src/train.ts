console.log("============== TASK K ==============");
/* Berilayotgan parametr tarkibida nechta unli harf bor ekanligini aniqlovchi function tuzing.
Masalan: countVowels("string") return 1 */

function countVowels(word: string): number {
  let count: number = 0;
  for (const letter of word.toLocaleLowerCase()) {
    if ("aeiou".includes(letter)) count += 1;
  }
  return count;
}
const word: string = "stringaa";
const result_k: number = countVowels(word);
console.log(`Berilgan ${word} so'zida ${result_k} ta unli qatnashgan!\n`);

console.log("============== TASK L ==============");
/* So'zlarni ketma-ketligini buzmasdan har bir so'zni alohida teskarisiga o'girib beradigan function tuzing.
Masalan: reverseSentence("we like coding!") return "ew ekil !gnidoc */

// Bu safar arrow funtion orqali hosil qildim
const result_l = (sentence: string): string => {
  let reversedText: string = "";
  const array: string[] = sentence.split(" ");
  for (const word of array) {
    reversedText += ` ${word.split("").reverse().join("")}`;
    // console.log(reversedText);
  }
  return reversedText;
};
const text: string = "We like codinG!";
console.log(`${text} ==> ning teskari natijasi ==> ${result_l(text)}\n`);

console.log("============== TASK M ==============");
/*Array ichidagi har bir raqam uchun raqamning o'zi va uning kvadratidan tashkil topgan object hosil qilib qaytarsin.
Masalan: getSquareNumbers([1, 2, 3]) return [{number: 1, square: 1}, ...] */

interface squaredList {
  number: number;
  square: number;
}
function getSquareNumbers(array: number[]): squaredList[] {
  const result: squaredList[] = [];
  for (const el of array) {
    result.push({ number: el, square: el * el });
  }
  return result;
}
const array: number[] = [1, 2, 3];
const result_m = getSquareNumbers(array);
console.log(array, " ==> kvadratlangan natija ==>", result_m);

console.log("============== TASK N ==============");
/* Stringni palindrom ekanligini aniqlab true yoki false qaytarsin.
Masalan: palindromCheck("dad") return true */

function palindromCheck(word: string): boolean {
  const reversed: string = word.split("").reverse().join("");
  const result: boolean =
    reversed.toLowerCase() === word.toLowerCase() ? true : false;
  return result;
}

const word_n: string = "dad";
const result_n: boolean = palindromCheck(word_n);
console.log(`${word_n} so'zining polindromlik natijasi: ${result_n}\n`);

console.log("============== TASK O ==============");
console.log(`Array ichidagi har xil qiymatlardan faqat sonlar yig'indisini hisoblab qaytarsin.
Masalan: calculateSumOfNumbers([10, "10", {son: 10}, true, 35]) return 45 `);

function calculateSumOfNumbers(array: any[]): number {
  let sum = 0;
  for (const el of array) {
    if (Number.isInteger(el)) sum += el;
  }
  return sum;
}

const array_o: any[] = [10, "10", { son: 10 }, true, 35];
const result_o = calculateSumOfNumbers(array_o);
console.log(array_o, `arrayida faqat sonlar yig'indisi: ${result_o}\n`);

console.log("============== TASK P ==============");
console.log(`Objectni nested array sifatida convert qilib qaytarsin.
Masalan: objectToArray({a: 10, b: 20}) return [["a", 10], ["b", 20]]`);

interface Object_P {
  [key: string]: number;
}

function objectToArray(obj: Object_P) {
  return Object.entries(obj_p);
}
const obj_p = { a: 10, b: 20 };
const result_p = objectToArray(obj_p);

console.log(obj_p, ` obyekti ==>`, result_p, ` ga o'tkazildi!\n`);

console.log("============== TASK Q ==============");
console.log(`Objectda berilgan string propertysi borligini tekshirsin.
Masalan: hasProperty({name: "BMW"}, "name") return true`);

interface Object_Q {
  [key: string]: any;
}

function hasProperty(obj: Object_Q, input_key: string): boolean {
  return input_key in obj;
}

const obj_q = { name: "BMW", year: 1994, color: "black" };
const key_q: string = "year";

const result_q = hasProperty(obj_q, key_q);
console.log(obj_q, ` obyektida ${key_q} propertysi mavjudligi: ${result_q}\n`);


console.log("============== TASK R ==============");
console.log(`"1 + 3" ko'rinishidagi stringni hisoblab number qaytarsin. Masalan: calculate("1 + 3") return 4`);

function calculate(str: string): number | null {
  const operator = str[1];
  const num1 = Number(str[0]);
  const num2 = Number(str[2]);

  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      if (num2 === 0) {
        console.log("0 ga bo'lish mumkin emas");
        return null;
      }
      return num1 / num2;
    default:
      console.log("Amal noto'g'ri");
      return null;

  }

}
const result_r = calculate("2+3");
console.log(` "2 + 3" string jo'natilganda natija: ${result_r} \n`);

console.log("============== TASK S ==============");
console.log(`Array ichidagi tushib qolgan sonni topib qaytarsin.
Masalan: missingNumber([3, 0, 1]) return 2`);

const missingNumber = (arr: number[]) => {
  const start = Math.min(...arr);
  const end = Math.max(...arr);
  let new_arr: number[] = []
  for (let i = start; i < end; i++) {
    if (!arr.includes(i)) new_arr.push(i);
  }
  return new_arr;
};

const array_s = [0, 5, 2, 8];
const result_s = missingNumber(array_s);
console.log(array_s, ` massiv sonlar orasida tushib qolgan sonlar: ${result_s}\n`);

console.log("============== TASK T ==============");
console.log(`Ikkita arrayni qabul qilib, ularni birlashtirib tartiblangan holda qaytarsin.
Masalan: mergeSortedArrays([0, 3, 4], [4, 6]) return [0, 3, 4, 4, 6]`);

function mergeSortedArrays(arr1: number[], arr2: number[]) {
  return arr1.concat(arr2).sort();
}
const arr_1 = [0, 7, 3, 4];
const arr_2 = [4, 6];
const result_t = mergeSortedArrays([0, 7, 3, 4], [4, 6]);
console.log(arr_1, " bilan ", arr_2, `arraylar birlashtirilib tartiblandi. Natija:`, result_t, `\n`);


console.log("============== TASK V ==============");
console.log(`Stringdagi har bir harf necha marta takrorlanganini object sifatida qaytarsin.
Masalan: countChars("hello") return {h: 1, e: 1, l: 2, o: 1}\n`);


function countChars(text:string): Record<string, number> {
  const newObj: Record<string, number> = {};
  for (const letter of text) {
    newObj[letter] = (newObj[letter] ?? 0) + 1   
  }
  return newObj
}
const string_v = "hello";
const result_v = countChars(string_v);
console.log(string_v, "so'zida harflarning takrorlanish soni ", result_v, `\n`);



console.log("============== TASK W ==============");
console.log(`Arrayni berilgan uzunlikda bo'laklarga ajratib qaytarsin.
Masalan: chunkArray([1, 2, 3, 4, 5], 2) return [[1, 2], [3, 4], [5]]\n`);

function chunkArray <T>(arr: T[number], size: number): T[][] {
  if (size <= 0) return [];

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

console.log(chunkArray([1, 2, 3, 4, 5], 2)); 
// Natija: [[1, 2], [3, 4], [5]]

console.log(chunkArray(['a', 'b', 'c', 'd'], 3)); 
// Natija: [['a', 'b', 'c'], ['d']]