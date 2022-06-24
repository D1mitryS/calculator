const inputField = document.querySelector('#input-field');

//Controls if 'inputField' value must be overwritten on input
let resetAfterOperation = true;

//Node of number buttons
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
'nextBinaryOperations' is used to calculate result by 'calculate' func
Calculates previous binary operation if exists and overwrites it.
'loggedSign' is used by 'addIntoBuffer' and 'logOperation' funcs to store an arithmetic sign.
*/
let firstNum = 0;
let nextBinaryOperation = '';
let storedSign = '';

const binaryOperationBtns = document.querySelectorAll('.operation').forEach(operationBtn => {
    operationBtn.addEventListener('click', (event) => {
        if (nextBinaryOperation) {
            calculate();
        };

        firstNum = Number(inputField.value) || 0;
        nextBinaryOperation = event.currentTarget.dataset.operation;
        resetAfterOperation = true;

        storedSign = event.currentTarget.value;
        addOperationIntoBuffer();

        inputField.classList.add('turn-grey');
    });
});

const equalsBtn = document.querySelector('#equals');
equalsBtn.addEventListener('click', () => {
    calculate();
});

/*
Calculates result based on 'nextBinaryOperation' value by calling 'Basic functions'.
nextBinaryOperation = '' is necessary for correct 'backSpace' and 'unaryOperationBtns' use.
Adds the arithmetical operation and result intto 'logList' and 'operationBuffer'..
*/
let secondNum = 0;

const calculate = () => {
    secondNum = Number(inputField.value, 10) || 0;

    if (nextBinaryOperation === 'summarize') inputField.value = summarize(firstNum, secondNum);
    else if (nextBinaryOperation === 'substract') inputField.value = substract(firstNum, secondNum);
    else if (nextBinaryOperation === 'divide') inputField.value = divide(firstNum, secondNum);
    else if (nextBinaryOperation === 'multiply') inputField.value = multiply(firstNum, secondNum);
    else if (nextBinaryOperation === 'percentage') inputField.value = getPercentage(firstNum, secondNum);;

    logBinaryOperation();
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
    storedSign = '';
    inputField.classList.remove('turn-grey');
};

/* 
Works only before nextBinaryOpperation is reassigned by 'binaryOperationBtns' 
or after 'equalsBtn' was pressed.
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
Adds arithmetical operation and result to 'logList' and 'operationBuffer'.
*/
const unaryOperationBtns = document.querySelectorAll('.unary-operation').forEach(operationBtn => {
    operationBtn.addEventListener('click', (event) => {
        if (nextBinaryOperation) {
            calculate();
        };

        firstNum = Number(inputField.value) || 0;
        const nextUnaryOperation = event.currentTarget.dataset.operation;

        if (nextUnaryOperation === 'square') inputField.value = Math.pow(firstNum, 2);
        else if (nextUnaryOperation === 'square-root') inputField.value = Math.sqrt(firstNum);
        else if (nextUnaryOperation === 'revert-sign') inputField.value = revertSign(firstNum);

        storedSign = event.currentTarget.value;

        if (storedSign) {
            logUnaryOperation();
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

//Add to log funcs
const logList = document.querySelector('#log-list');

const logBinaryOperation = () => {
    logList.insertAdjacentHTML('beforeend',
        `<li>
            <output class="expression">${firstNum} ${storedSign} ${secondNum}</output>
            <output class="result">${inputField.value}</output>
        </li>`);
};

const logUnaryOperation = () => {
    logList.insertAdjacentHTML('beforeend',
        `<li>
            <output class="expression">${firstNum} ${storedSign}</output>
            <output class="result">${inputField.value}</output>
        </li>`);
};

//Add to buffer funcs
const operationBuffer = document.querySelector('#operation-buffer');

const addOperationIntoBuffer = () => {
    operationBuffer.innerHTML = `${firstNum} ${storedSign}`;
};

const addResultIntoBuffer = () => {
    operationBuffer.textContent = `${firstNum} ${storedSign} ${secondNum}`;
};
