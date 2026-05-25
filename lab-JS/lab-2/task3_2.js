function getSeasonByMonth(month){
    return (month === 1 || month === 2 || month === 12) ? "It's winter!" :
        (month === 3 || month === 4 || month === 5) ? "It's spring!" :
            (month === 6 || month === 7 || month === 8) ? "It's summer!" :
                (month === 9 || month === 10 || month === 11) ? "It's autumn!" : "Incorrect value";
}

console.log(getSeasonByMonth(1));
console.log(getSeasonByMonth(4));
console.log(getSeasonByMonth(7));
console.log(getSeasonByMonth(10));
console.log(getSeasonByMonth(120));

