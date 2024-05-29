let secretNumber; // Загадочное число
let attempts = []; // Массив для хранения истории попыток

// Реализация решета Аткина для поиска простых чисел
function sieveOfAtkin(limit) {
    const isPrime = Array(limit + 1).fill(false); // Массив для отметки простых чисел
    const sqrtLimit = Math.floor(Math.sqrt(limit));
    isPrime[2] = true;
    isPrime[3] = true;

    // Применяем решето Аткина для отметки простых чисел
    for (let x = 1; x <= sqrtLimit; x++) {
        for (let y = 1; y <= sqrtLimit; y++) {
            let n;

            // Проверяем числа по выражениям x^2 + y^2
            n = (4 * x * x) + (y * y);
            if (n <= limit && (n % 12 === 1 || n % 12 === 5)) {
                isPrime[n] = !isPrime[n];
            }

            n = (3 * x * x) + (y * y);
            if (n <= limit && n % 12 === 7) {
                isPrime[n] = !isPrime[n];
            }

            n = (3 * x * x) - (y * y);
            if (x > y && n <= limit && n % 12 === 11) {
                isPrime[n] = !isPrime[n];
            }

        }
    }

    // Отмечаем кратные чисел квадратов как не простые
    for (let n = 5; n <= sqrtLimit; n++) {
        if (isPrime[n]) {
            const nSquared = n * n;
            for (let i = nSquared; i <= limit; i += nSquared) {
                isPrime[i] = false;
            }
        }
    }

    // Создаем массив простых чисел
    const primes = [];
    for (let i = 2; i <= limit; i++) {
        if (isPrime[i]) {
            primes.push(i);
        }
    }

    return primes;
}

//Проверка чтоб не было повторяющихся чисел
function hasUniqueDigits(number) {
    const digits = number.toString().split('');
    const uniqueDigits = new Set(digits);
    return uniqueDigits.size === digits.length;
}

// Функция для выбора случайного числа в качестве загадываемого числа
function generateSecretNumber() {
    const primes = sieveOfAtkin(9999); // Найдем простые числа до 9999 с помощью решета Аткина
    // Отбираем только 4-значные простые числа с уникальными цифрами
    const fourDigitPrimes = primes.filter(prime => prime >= 1000 && prime <= 9999 && hasUniqueDigits(prime));
    // Выбираем случайное 4-значное простое число в качестве загадываемого числа
    secretNumber = fourDigitPrimes[Math.floor(Math.random() * fourDigitPrimes.length)].toString();
    return secretNumber;
}

// Функция для подсчета быков и коров
function countBullsAndCows(guess, secretNumber) {
    let bulls = 0;
    let cows = 0;
    // Проход по каждой цифре в числе
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretNumber[i]) { // Если цифры совпадают по позиции
            bulls++;
        } else if (secretNumber.includes(guess[i])) { // Если цифра присутствует в числе, но на другой позиции
            cows++;
        }
    }
    return { bulls, cows };
}

//Функция для проверки предположения игрока
function checkGuess(guess, secretNumber, attempts) {
    // Проверка, что догадка соответствует 4-значному числу
    if (guess.length !== 4 || isNaN(guess)) {
        return "Число введено неверно. Введите 4-значное число.";
    }

    const { bulls, cows } = countBullsAndCows(guess, secretNumber);
    const feedback = `Быков: ${bulls}, Коров: ${cows}`;

    // Добавляем догадку и результат в историю попыток
    attempts.push({ guess, bulls, cows });

    // Если игрок угадал все 4 цифры, возвращаем поздравление
    if (bulls === 4) {
        return "Поздравляем! Вы угадали число!";
    }

    // Возвращаем обратную связь по догадке
    return feedback;
}
//функция для отправки ответа пользователем
function handleGuess() {
    const guess = document.getElementById('guess').value;
    const feedback = checkGuess(guess, secretNumber, attempts);
    alert(feedback); // Покажем обратную связь пользователю
    updateAttemptsHistory(); // Обновим историю попыток
}

// Функция для сброса игры
function resetGame() {
    generateSecretNumber();
    attempts = []; // Обнуляем массив попыток
    document.getElementById('history').value = '';
    alert('Новая игра началась! Попробуйте угадать новое число.');
}

// Функция для обновления истории попыток
function updateAttemptsHistory() {
    const history = document.getElementById("history");
    history.value = attempts.map((attempt, index) =>
        `Попытка ${index + 1}: ${attempt.guess} - Быков: ${attempt.bulls}, Коров: ${attempt.cows}`
    ).join('\n');
}

// Инициализация игры при загрузке страницы
generateSecretNumber();

module.exports = {hasUniqueDigits,sieveOfAtkin, countBullsAndCows, checkGuess, generateSecretNumber};
