class flowerBouquet {
    constructor(flowerType, flowerAmount) {
        this.flowerType = flowerType;
        this.flowerAmount = flowerAmount;
    }
    static compareByFlowerType(firstBouquet, secondBouquet) {
        if (firstBouquet.flowerType === secondBouquet.flowerType) {
            return `Match! Both bouquets are made of ${firstBouquet.flowerType}s.`;
        } else {
            return `No match. One is a ${firstBouquet.flowerType} and the other is a ${secondBouquet.flowerType}.`;
        }
    }
    static compareByFlowerAmount(firstBouquet, secondBouquet) {
        if (firstBouquet.flowerAmount === secondBouquet.flowerAmount) {
            return `Match! Both bouquets' size is ${firstBouquet.flowerAmount}`;
        } else {
            return `These bouquets are different sizes! The ${firstBouquet.flowerType} bouquet has ${firstBouquet.flowerAmount} flowers, and the ${secondBouquet.flowerType} one has ${secondBouquet.flowerAmount}.`;
        }
    }
}

let bouquet1 = new flowerBouquet('rose', 13);
let bouquet2 = new flowerBouquet('tulip', 9);
let bouquet3 = new flowerBouquet('rose', 21);
let bouquet4 = new flowerBouquet('daffodil', 21);
console.log(flowerBouquet.compareByFlowerType(bouquet1, bouquet2));
console.log(flowerBouquet.compareByFlowerType(bouquet1, bouquet3));
console.log(flowerBouquet.compareByFlowerAmount(bouquet1, bouquet2));
console.log(flowerBouquet.compareByFlowerAmount(bouquet3, bouquet4));