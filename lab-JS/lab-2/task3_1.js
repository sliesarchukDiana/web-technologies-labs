function returnStringGrade (grade){
    if (grade > 0 && grade <= 5){
        if (grade === 5) return "Perfect!"
        else if (grade === 4) return "Well done!"
        else if (grade === 3) return "Okay."
        else if (grade <= 2) return "Bad."
    }
    else return "Incorrect grade";
}

console.log(returnStringGrade(2));
console.log(returnStringGrade(5));
console.log(returnStringGrade(100));