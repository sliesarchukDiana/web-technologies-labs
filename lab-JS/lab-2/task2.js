function isInRange(lowerLim, upperLim, val) {
    if (lowerLim > upperLim) {
        let temp = lowerLim;
        lowerLim = upperLim;
        upperLim = temp;
    }
    if (val > lowerLim && val < upperLim) {
        return "Value is in range";
    } else {
        return "Value is NOT in range";
    }
}

let isTaskComplete = false;
console.log(`Is task complete? ${isTaskComplete}`);

console.log(isInRange(-2, 2, 0));
console.log(isInRange(-2, 2, 10));


isTaskComplete = !isTaskComplete;
console.log(`And now? ${isTaskComplete}`);