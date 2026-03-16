function task1() {
    console.log("      Завдання 1 ");
    let fruits = ["банан", "апельсин", "яблуко", "ківі"];

    fruits.pop();
    console.log("1. Видалено останній елемент:", structuredClone(fruits));

    fruits.unshift("ананас");
    console.log("2. Додано 'ананас':", structuredClone(fruits));

    fruits.sort((a, b) => b.localeCompare(a));
    console.log("3. Відсортовано у зворотньому порядку:", structuredClone(fruits));

    let appleIndex = fruits.indexOf("яблуко");
    console.log("4. Індекс 'яблуко':", appleIndex);
}

function task2() {
    console.log("\n      Завдання 2 ");
    let colors = ["червоний", "темно-синій", "зелений", "світло-синій", "жовтий"];

    let longestColor = colors.reduce((a, b) => a.length > b.length ? a : b);
    console.log("2. Найдовший елемент:", longestColor);

    let shortestColor = colors.reduce((a, b) => a.length < b.length ? a : b);
    console.log("2. Найкоротший елемент:", shortestColor);

    colors = colors.filter(color => color.includes("синій"));
    console.log("3. Рядки зі словом 'синій':", structuredClone(colors));

    let joinedString = colors.join(", ");
    console.log("4/5. Об'єднаний рядок:", joinedString);
}

function task3() {
    console.log("\n      Завдання 3 ");
    let workers = [
        { name: "Іван", age: 35, position: "менеджер" },
        { name: "Марія", age: 28, position: "розробник" },
        { name: "Антон", age: 42, position: "тестувальник" },
        { name: "Олена", age: 25, position: "розробник" }
    ];

    workers.sort((a, b) => a.name.localeCompare(b.name));
    console.log("2. Відсортовано за іменами:", structuredClone(workers));

    let developers = workers.filter(w => w.position === "розробник");
    console.log("3. Тільки розробники:", structuredClone(developers));

    workers = workers.filter(w => w.age <= 40);
    console.log("4. Видалено працівників, старших за 40:", structuredClone(workers));

    workers.push({ name: "Сергій", age: 30, position: "дизайнер" });
    console.log("5. Оновлений масив (додано Сергія):", structuredClone(workers));
}

function task4() {
    console.log("\n      Завдання 4 ");
    let students = [
        { name: "Олексій", age: 20, course: 2 },
        { name: "Дарина", age: 21, course: 3 },
        { name: "Віктор", age: 19, course: 1 }
    ];

    students = students.filter(s => s.name !== "Олексій");
    console.log("2. Без Олексія:", structuredClone(students));

    students.push({ name: "Ігор", age: 22, course: 4 });
    console.log("3. Додано Ігора:", structuredClone(students));

    students.sort((a, b) => b.age - a.age);
    console.log("4. Відсортовано за віком:", structuredClone(students));

    let thirdCourseStudent = students.find(s => s.course === 3);
    console.log("5. Студент 3-го курсу:", structuredClone(thirdCourseStudent));
}

function task5() {
    console.log("\n      Завдання 5 ");
    let numbers = [1, 2, 3, 4, 5];

    let squared = numbers.map(n => n * n);
    console.log("1. Квадрати чисел (map):", structuredClone(squared));

    let evens = numbers.filter(n => n % 2 === 0);
    console.log("2. Парні числа (filter):", structuredClone(evens));

    let sum = numbers.reduce((acc, curr) => acc + curr, 0);
    console.log("3. Сума (reduce):", sum);

    let moreNumbers = [6, 7, 8, 9, 10];
    let combined = numbers.concat(moreNumbers);
    console.log("4. Об'єднаний масив:", structuredClone(combined));

    combined.splice(0, 3);
    console.log("5. Видалено перші 3 елементи (splice):", structuredClone(combined));
}

function libraryManagement() {
    console.log("\n      Завдання 6 ");

    let books = [
        { title: "Гаррі Поттер", author: "Дж. К. Роулінг", genre: "Фентезі", pages: 350, isAvailable: true },
        { title: "1984", author: "Джордж Орвелл", genre: "Антиутопія", pages: 328, isAvailable: false }
    ];

    return {
        addBook: function(title, author, genre, pages) {
            books.push({ title, author, genre, pages, isAvailable: true });
            console.log(`Додано книгу: "${title}"`);
        },
        removeBook: function(title) {
            books = books.filter(b => b.title !== title);
            console.log(`Книгу "${title}" видалено.`);
        },
        findBooksByAuthor: function(author) {
            return structuredClone(books.filter(b => b.author === author));
        },
        toggleBookAvailability: function(title, isBorrowed) {
            let book = books.find(b => b.title === title);
            if (book) {
                book.isAvailable = !isBorrowed;
                console.log(`Статус "${title}" змінено. Доступна: ${book.isAvailable}`);
            }
        },
        sortBooksByPages: function() {
            return structuredClone([...books].sort((a, b) => a.pages - b.pages));
        },
        getBooksStatistics: function() {
            let total = books.length;
            let available = books.filter(b => b.isAvailable).length;
            let borrowed = total - available;
            let totalPages = books.reduce((sum, b) => sum + b.pages, 0);
            let avgPages = total > 0 ? Math.round(totalPages / total) : 0;

            return { totalBooks: total, availableBooks: available, borrowedBooks: borrowed, averagePages: avgPages };
        },
        getAllBooks: () => structuredClone(books)
    };
}

function testLibrary() {
    let lib = libraryManagement();
    lib.addBook("Дюна", "Френк Герберт", "Фантастика", 896);
    lib.toggleBookAvailability("Дюна", true);
    console.log("Статистика:", lib.getBooksStatistics());
}

function task7() {
    console.log("\n      Завдання 7 ");

    let student = {
        name: "Андрій",
        age: 18,
        course: 2
    };

    student.subjects = ["JavaScript", "Бази даних", "Алгоритми"];
    delete student.age;

    console.log("Оновлений об'єкт студента:", structuredClone(student));
}

task1();
task2();
task3();
task4();
task5();
testLibrary();
task7();