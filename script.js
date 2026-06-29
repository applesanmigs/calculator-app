// DOM
// Access DOM elements of the calculator
const inputBox = document.getElementById('input');
const expressionOutput = document.getElementById('expression');
const resultOutput = document.getElementById('result');

// STATE
// Define expression and result variable
let expression = '';
let result = '';

// EVENT LISTENERS
inputBox.addEventListener('click', buttonClick);
document.addEventListener('keydown', handleKeydown);

// EVENT HANDLERS
// Define event handler for button clicks
function buttonClick(event) {
  // Get values from clicked button
  const target = event.target;
  const action = target.dataset.action;
  const value = target.dataset.value;
  // console.log(target, action, value);

  // Switch case to control the calculator
  switch(action) {
    case 'number':
      addValue(value);
      break;
    case 'clear':
      clear();
      break;
    case 'backspace':
      backspace();
      break;
    // Add the result to expression as a starting point if expression is empty
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      if(expression === '' && result !== '') {
        startFromResult(value);
      } else if(expression !== '' && !isLastCharOperator()) {
        addValue(value);
      }
      break;
    case 'equate':
      equate();
      break;
    case 'negate':
      negate();
      break;
    case 'modulo':
      percentage();
      break;
    case 'decimal':
      decimal(value);
      break;
  }

  // Update display
  updateDisplay(expression, result);
}

function handleKeydown(event) {
  const key = event.key;

  switch (key) {
    case 'Enter':
      equate();
      break;
    case 'Backspace':
      backspace();
      break;
    case 'Escape':
      clear();
      break;
    case '.':
      addValue('.');
      break;
    case '+':
    case '-':
    case '*':
    case '/':
      addValue(key);
      break;
    default:
      if (!isNaN(key)) {
        addValue(key);
      }
  }

  updateDisplay(expression, result);
}

// DISPLAY
function updateDisplay(expression, result) {
  expressionOutput.textContent = expression;
  resultOutput.textContent = result;
}

// HELPERS
function isLastCharOperator() {
  return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
  expression += result + value;
}

function evaluateExpression() {
  const evalResult = eval(expression);
  // Checks if evalResult isNan or infinite
  // If so, return a space charachter ''
  return isNaN(evalResult) || !isFinite(evalResult)
    ? ''
    : parseFloat(evalResult.toFixed(10));
}

// CALCULATOR ACTIONS
function addValue(value) {
  if (value !== '.') {
    expression += value;
    return;
  }

  const lastOperator = Math.max(
    expression.lastIndexOf('+'),
    expression.lastIndexOf('-'),
    expression.lastIndexOf('*'),
    expression.lastIndexOf('/')
  );

  // Extract the current number after the last operator
  const currentNumber = expression.slice(lastOperator + 1);

  // Allow only one decimal per number
  if (!currentNumber.includes('.')) {
    expression += '.';
  }
}

function clear() {
  expression = '';
  result = '';
}

function backspace() {
  expression = expression.slice(0, -1);
}

function equate() {
  result = evaluateExpression();
  expression = '';
}

function negate() {
  // Negate the result if expression is empty and result is present
  if(expression === '' && result !== '') {
    result = -result;
    // Toggle the sign of the expression if it's not already negative and it's not empty
  } else if(!expression.startsWith('-') && expression !=='') {
    expression = '-' + expression;
    // Remove the negative sign from the expression if it's already negative
  } else if(expression.startsWith('-')) {
    expression = expression.slice(1);
  }
}

function percentage() {
  // Evaluate the expression, else it will take the percentage of the first number
  if(expression != '') {
    result = evaluateExpression();
    expression = '';
    if(!isNaN(result) && isFinite(result)) {
      result /= 100;
      } else {
        result = '';
      }
  } else if(result !== '') {
    result = parseFloat(result) / 100;
  }
}

function decimal(value) {
  if(!expression.endsWith('.') && !isNaN(expression.slice(-1))) {
    addValue(value);
  }
}