const inputField = document.querySelector('#input-field');
let resetAfterOperation = true;

/* 
Node of number buttons.
Overwrites 'inputField' if 'resetAfterOperation' === true.
Adding target's textContent to 'inputField'. 
*/
const numBtns = document.querySelectorAll('.number').forEach(numBtn => {
    numBtn.addEventListener('click', (event) => {
        if (resetAfterOperation) {
            inputField.value = '';
            resetAfterOperation = false;
        };
        inputField.value += event.currentTarget.value;
        inputField.classList.remove('turn-grey');
    });
});

/* 
Node of binary operation buttons.
Calculates previous binary operation if exists.
Reassign 'nextBinaryOperation' value to target's dataset. 
Reassign 'firstNum' value to current 'inputField' value. 
*/
let firstNum = 0;
let nextBinaryOperation = '';

const binaryOperationBtns = document.querySelectorAll('.operation').forEach(operationBtn => {
    operationBtn.addEventListener('click', (event) => {
        if (nextBinaryOperation) {
            calculate();
        };
        firstNum = Number(inputField.value) || 0;
        nextBinaryOperation = event.currentTarget.dataset.operation;
        resetAfterOperation = true;
        addOperationIntoBuffer();

        inputField.classList.add('turn-grey');
    });
});

const equalsBtn = document.querySelector('#equals');
equalsBtn.addEventListener('click', () => {
    calculate();
});

/*
Reassign 'secondNum' value to current 'inputField' value. 
Calculates result based on 'nextBinaryOperation' value by calling 'Basic functions'.
nextBinaryOperation = '' is necessary for correct 'backSpace' and 'unaryOperationBtns' use.
Adds 'firstNum', 'secondNum' and 'loggedSign' into 'logList'.
*/
let secondNum = 0;
let loggedSign = '';

const calculate = () => {
    secondNum = Number(inputField.value, 10) || 0;

    if (nextBinaryOperation === 'summarize') {
        inputField.value = summarize(firstNum, secondNum);
        loggedSign = '+';
    } else if (nextBinaryOperation === 'substract') {
        inputField.value = substract(firstNum, secondNum);
        loggedSign = '-';
    } else if (nextBinaryOperation === 'divide') {
        inputField.value = divide(firstNum, secondNum);
        loggedSign = '/';
    } else if (nextBinaryOperation === 'multiply') {
        inputField.value = multiply(firstNum, secondNum);
        loggedSign = '*';
    } else if (nextBinaryOperation === 'percentage') {
        inputField.value = getPercentage(firstNum, secondNum);
        loggedSign = '%';
    };

    addBinaryToLog();
    addResultIntoBuffer();
    clear();
};

// Basic functions
const summarize = (a, b) => a + b;
const substract = (a, b) => a - b;
const divide = (a, b) => a / b;
const multiply = (a, b) => a * b;
const getPercentage = (a, b) => (b / 100) * a;

// Resets main vars to initial state + resets log
const allClearBtn = document.querySelector('#clear-all');
allClearBtn.addEventListener('click', () => {
    clear();
    inputField.value = 0;
    operationBuffer.textContent = '';
    logList.textContent = '';
});

// Resets main vars to initial state
const clearBtn = document.querySelector('#clear');
clearBtn.addEventListener('click', () => {
    clear();
    inputField.value = 0;
    operationBuffer.textContent = '';
});

const clear = () => {
    firstNum = 0;
    secondNum = 0;
    nextBinaryOperation = '';
    resetAfterOperation = true;
    loggedSign = '';
    inputField.classList.remove('turn-grey');
};

/* 
Works only before nextBinaryOpperation is reassigned or after 'equalsBtn' pressed.
Deletes last symbol from 'inputField'. 
Overwrites last deleted symbol with 0 and allows it to be overwritten by 'numBtns'.
*/
const backSpace = document.querySelector('#backspace');
backSpace.addEventListener('click', () => {
    if (!nextBinaryOperation) {
        operationBuffer.textContent = '';

        const inputLen = inputField.value.length;

        if (inputLen >= 2) {
            inputField.value = inputField.value.substring(0, inputLen - 1);
        } else {
            inputField.value = '0';
            resetAfterOperation = true;
        };
    };
});

/* 
Node of unary operations buttons.
Calculates previous binaryOperation if exists.
Calculates result based on target's dataset.
Adds result and operation to 'logList'.
*/
const unaryOperationBtns = document.querySelectorAll('.unary-operation').forEach(operationBtn => {
    operationBtn.addEventListener('click', (event) => {
        if (nextBinaryOperation) {
            calculate();
        };

        firstNum = Number(inputField.value) || 0;
        const nextUnaryOperation = event.currentTarget.dataset.operation;

        if (nextUnaryOperation === 'square') {
            inputField.value = Math.pow(firstNum, 2);
            loggedSign = '^';
            addUnaryToLog();
        } else if (nextUnaryOperation === 'square-root') {
            inputField.value = Math.sqrt(firstNum);
            loggedSign = '√';
            addUnaryToLog();
        } else if (nextUnaryOperation === 'revert-sign') {
            inputField.value = revertSign(firstNum);
            addOperationIntoBuffer();
        };

        firstNum = 0;
        loggedSign = '';
        resetAfterOperation = true;
    });
});

// Reverts number's sign e.g. -10 --> 10 // 10 --> -10 
const revertSign = num => {
    const isPositive = num > 0;

    if (isPositive) return num - (num * 2);
    return Math.abs(num);
};

//Add to log functions
const logList = document.querySelector('#log-list');

const addBinaryToLog = () => {
    logList.insertAdjacentHTML('beforeend',
        `<li>
            <output class="expression">${firstNum} ${loggedSign} ${secondNum}</output>
            <output class="result">${inputField.value}</output>
        </li>`);
};

const addUnaryToLog = () => {
    logList.insertAdjacentHTML('beforeend',
        `<li>
            <output class="expression">${firstNum} ${loggedSign}</output>
            <output class="result">${inputField.value}</output>
        </li>`);
};};

//Add to buffer funcs
const operationBuffer = document.querySelector('#operation-buffer');

const addOperationIntoBuffer = () => {
    operationBuffer.innerHTML = `${firstNum} ${storedSign}`;
};

const addResultIntoBuffer = () => {
    operationBuffer.textContent = `${firstNum} ${storedSign} ${secondNum}`;
};
