
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Sample route
app.get('/', (req, res) => {
  res.send('Number Classificatioon API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function isPrime(number) {
    if (number < 2) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return false;
        }
    }

    return true;
}
function isPerfect(number) {
    if (number < 2) {
        return false;
    }   
    
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            sum += i;
            if (i !== number / i) {
                sum += number / i;
            }
        }
    }
    return sum === number;
}
function isArmstrong(number) {
    const digits = number.toString().split('');
    const power = digits.length;
    let sum = 0;
    for (let digit of digits) {
        sum += Math.pow(Number(digit), power);
    }
    return sum === number;
}
function digitSum(number) {
    return Math.abs(number).toString().split('').reduce((sum, digit) => sum + Number(digit), 0);
}

function generateFunFact(number) {
    if (isArmstrong(number)) {
const digits = number.toString().split('');
const power = digits.length;

const calculation = digits.map(digit => `${digit}^${power}`).join(' + ');

return `${number} is an Armstrong number because ${calculation} = ${number}.`;
    }
    if (isPerfect(number)) {
        return `${number} is a perfect number.`;
    }
    if (isPrime(number)) {
        return `${number} is a prime number.`;
    }
    return `${number} is an ${number % 2 === 0 ? 'even' : 'odd'} number.`;
}

app.get("/api/classify-number", async (req, res) => {
    try {
       const number = Number(req.query.number);

 if (!Number.isInteger(number)) {
    return res.status(400).json({number: req.query.number, error: true});
 }

    let funFact;
    try {
    const response = await fetch(`https://numbersapi.com/${number}/math?json`);
    if (!response.ok) {
        const data = await response.json();
        funFact = data.text;
    }
    } catch (error) {
    // Number fact API failed, generate a fun fact locally
    if (!funFact) {
        funFact = generateFunFact(number);
    }
    
    res.json({
        number: number, 
        is_prime: isPrime(number), 
        is_perfect: isPerfect(number),
        properties:[
            ...(isArmstrong(number) ? ['armstrong'] : []),
            ...(number % 2 === 0 ? ['even'] : ['odd'])
        ],
        digit_sum: digitSum(number),
        fun_fact: funFact
    });
    }

    } catch (error) {
    return res.status(500).json({
        error: error.message
    });
}
});