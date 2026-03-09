function countFibonacciSequenceSum() {
    let sum = 0, count = 0, a = 0, b = 1;
    while (count < 10) {
        let nextNumber = a + b;
        sum += a;
        a = b;
        b = nextNumber;
        count++;
    }
    return sum;
}

function sumPrimesUpTo1000() {
    let sum = 0;
    for (let i = 2; i <= 1000; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            sum += i;
        }
    }
    return sum;
}

function convertToString(int) {
    switch(int) {
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        case 7: return "Sunday";
        default: return "Number must be in between 1 and 7!";
    }
}

function removeEvenLengthString(stringArray) {
    if (stringArray.length === 0){
        return "Nothing to work with!";
    }
    for (let i = stringArray.length - 1; i >= 0; i--) {
        if (stringArray[i].length % 2 === 0) {
            stringArray.splice(i, 1);
        }
    }
    return stringArray;
}

const incrementNumbers = (arr) => arr.map(num => num + 1);

const checkTen = (a, b) => (a + b === 10) || Math.abs(a - b) === 10;

console.log("Завдання 1:", countFibonacciSequenceSum());
console.log("Завдання 2:", sumPrimesUpTo1000());
console.log("Завдання 3 (для 1):", convertToString(1));
console.log("Завдання 3 (для 8):", convertToString(8));
console.log("Завдання 4:", removeEvenLengthString(["cat", "dog", "fish", "bird"]));
console.log("Завдання 5:", incrementNumbers([10, 20, 30, 42]));
console.log("Завдання 6 (2, 12):", checkTen(2, 12));
console.log("Завдання 6 (4, 5):", checkTen(4, 5));