function findLocalMinMax(array) {
    let localMinMax = new Array(2);
    localMinMax[0] = array[0];
    localMinMax[1] = array[0];
    for (let i = 0; i < array.length; i++) {
        if (localMinMax[0] > array[i]){
            localMinMax[0] = array[i];
        }
        if (localMinMax[1] < array[i]){
            localMinMax[1] = array[i];
        }
    }
    return localMinMax;
}

const array = [1, 3, -21, 41, 7, 5, 0, 93];
console.log('[' + array.join(', ') + ']');
console.log(findLocalMinMax(array));
