// Calculator variables
let display = document.getElementById('display');
let previousAnswer = 0;
let isDegree = true;

// Append value to display
function appendValue(value) {
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

// Append function to display
function appendFunction(func) {
    const currentValue = display.value;
    
    switch(func) {
        case 'x!':
            calculateFactorial();
            break;
        case '1/':
            if (currentValue && currentValue !== '0') {
                display.value = '1/(' + currentValue + ')';
            }
            break;
        case 'sin':
            display.value = 'sin(' + currentValue;
            break;
        case 'cos':
            display.value = 'cos(' + currentValue;
            break;
        case 'tan':
            display.value = 'tan(' + currentValue;
            break;
        case 'ln':
            display.value = 'ln(' + currentValue;
            break;
        case 'log':
            display.value = 'log(' + currentValue;
            break;
        case 'sqrt':
            display.value = 'sqrt(' + currentValue;
            break;
        case 'π':
            appendValue('3.141592653589793');
            break;
        case 'e':
            appendValue('2.718281828459045');
            break;
        case 'x^':
            display.value = currentValue + '^';
            break;
        case 'x^2':
            display.value = '(' + currentValue + ')^2';
            break;
    }
}

// Clear display
function clearDisplay() {
    display.value = '0';
}

// Backspace function
function backspace() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

// Toggle between Degree and Radian
function toggleAngle() {
    isDegree = !isDegree;
    const btn = event.target;
    btn.textContent = isDegree ? 'Deg' : 'Rad';
}

// Calculate factorial
function calculateFactorial() {
    try {
        const num = parseInt(display.value);
        if (num < 0) {
            display.value = 'Error';
            return;
        }
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        display.value = result;
    } catch (e) {
        display.value = 'Error';
    }
}

// Show previous answer
function showPreviousAnswer() {
    display.value = previousAnswer;
}

// Main calculate function
function calculate() {
    try {
        let expression = display.value;
        
        // Replace display symbols with mathematical operators
        expression = expression.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
        
        // Handle trigonometric functions
        expression = handleTrigonometric(expression);
        
        // Handle logarithmic functions
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        
        // Handle square root
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
        
        // Handle power operations
        expression = expression.replace(/\^/g, '**');
        
        // Handle percentage
        if (expression.includes('%')) {
            expression = expression.replace(/(\d+)%/g, '($1/100)');
        }
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;
        
        // Store the result as previous answer
        previousAnswer = result;
        
        // Display the result
        display.value = result;
    } catch (e) {
        display.value = 'Error';
    }
}

// Handle trigonometric functions
function handleTrigonometric(expression) {
    let result = expression;
    
    // Replace sin, cos, tan with Math functions
    result = result.replace(/sin\(/g, 'Math.sin(');
    result = result.replace(/cos\(/g, 'Math.cos(');
    result = result.replace(/tan\(/g, 'Math.tan(');
    
    // Convert degrees to radians if needed
    if (isDegree) {
        // This is a simplified approach - for a production calculator,
        // you'd want more sophisticated parsing
        result = result.replace(/Math\.sin\(/g, 'Math.sin((');
        result = result.replace(/Math\.cos\(/g, 'Math.cos((');
        result = result.replace(/Math\.tan\(/g, 'Math.tan((');
        
        // Add radian conversion and closing parentheses
        if (result.includes('Math.sin((') || result.includes('Math.cos((') || result.includes('Math.tan((')) {
            result = result.replace(/\)\)/g, ')*Math.PI/180)');
        }
    }
    
    return result;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Number keys
    if (key >= '0' && key <= '9') {
        appendValue(key);
    }
    // Operators
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendValue(key);
    }
    // Decimal point
    else if (key === '.') {
        appendValue('.');
    }
    // Enter or = for calculation
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Backspace
    else if (key === 'Backspace') {
        event.preventDefault();
        backspace();
    }
    // Escape for clear
    else if (key === 'Escape') {
        clearDisplay();
    }
    // Parentheses
    else if (key === '(') {
        appendValue('(');
    }
    else if (key === ')') {
        appendValue(')');
    }
});

// Initialize display
display.value = '0';
