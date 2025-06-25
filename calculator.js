
/**
 * JavaScript 计算器
 * 实现基本的四则运算功能，支持连续运算、小数点输入和错误处理
 */

// 全局变量
let currentInput = '0';           // 当前输入的数字
let previousInput = '';           // 上一个操作数
let operator = '';                // 当前运算符
let waitingForOperand = false;    // 是否等待新的操作数
let justCalculated = false;       // 是否刚刚完成计算

// 获取显示屏元素
const display = document.getElementById('display-screen');

/**
 * 更新显示屏
 * @param {string} value - 要显示的值
 */
function updateDisplay(value = currentInput) {
    // 限制显示的数字长度，避免溢出
    if (value.toString().length > 12) {
        value = parseFloat(value).toExponential(6);
    }
    display.value = value;
}

/**
 * 输入数字
 * @param {string} digit - 输入的数字
 */
function inputNumber(digit) {
    // 如果刚刚完成计算，重置计算器
    if (justCalculated) {
        currentInput = '0';
        justCalculated = false;
    }
    
    // 如果等待新操作数或当前输入为0，替换当前输入
    if (waitingForOperand || currentInput === '0') {
        currentInput = digit;
        waitingForOperand = false;
    } else {
        // 否则追加数字（限制长度）
        if (currentInput.length < 10) {
            currentInput += digit;
        }
    }
    
    updateDisplay();
}

/**
 * 输入运算符
 * @param {string} nextOperator - 运算符 (+, -, *, /)
 */
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    // 如果刚刚完成计算，使用结果作为第一个操作数
    if (justCalculated) {
        justCalculated = false;
    }
    
    // 如果之前没有输入，设置第一个操作数
    if (previousInput === '') {
        previousInput = inputValue;
    } else if (operator) {
        // 如果已有运算符且不等待操作数，执行之前的运算
        if (!waitingForOperand) {
            const result = performCalculation();
            
            if (result === null) {
                return; // 计算出错，不继续
            }
            
            currentInput = String(result);
            previousInput = result;
            updateDisplay();
        }
    }
    
    waitingForOperand = true;
    operator = nextOperator;
}

/**
 * 输入小数点
 */
function inputDecimal() {
    // 如果刚刚完成计算，重置为0.
    if (justCalculated) {
        currentInput = '0';
        justCalculated = false;
    }
    
    // 如果等待新操作数，从0.开始
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        // 如果当前数字没有小数点，添加小数点
        currentInput += '.';
    }
    
    updateDisplay();
}

/**
 * 执行计算
 * @returns {number|null} 计算结果或null（出错时）
 */
function performCalculation() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) {
        return null;
    }
    
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError('除数不能为零');
                return null;
            }
            result = prev / current;
            break;
        default:
            return null;
    }
    
    // 处理浮点数精度问题
    result = Math.round((result + Number.EPSILON) * 1000000000) / 1000000000;
    
    return result;
}

/**
 * 执行等号计算
 */
function calculate() {
    if (operator && previousInput !== '' && !waitingForOperand) {
        const result = performCalculation();
        
        if (result !== null) {
            currentInput = String(result);
            previousInput = '';
            operator = '';
            waitingForOperand = false;
            justCalculated = true;
            updateDisplay();
        }
    }
}

/**
 * 清除显示屏和所有数据
 */
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForOperand = false;
    justCalculated = false;
    
    // 移除错误样式
    display.classList.remove('error');
    
    updateDisplay();
}

/**
 * 删除最后一个字符（退格功能）
 */
function deleteLast() {
    if (justCalculated) {
        clearDisplay();
        return;
    }
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    
    updateDisplay();
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 */
function showError(message) {
    display.value = message;
    display.classList.add('error');
    
    // 2秒后清除错误状态
    setTimeout(() => {
        clearDisplay();
    }, 2000);
}

/**
 * 键盘事件处理
 */
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // 阻止默认行为
    event.preventDefault();
    
    // 数字键
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    // 运算符键
    else if (key === '+') {
        inputOperator('+');
    }
    else if (key === '-') {
        inputOperator('-');
    }
    else if (key === '*') {
        inputOperator('*');
    }
    else if (key === '/') {
        inputOperator('/');
    }
    // 小数点
    else if (key === '.' || key === ',') {
        inputDecimal();
    }
    // 等号或回车
    else if (key === '=' || key === 'Enter') {
        calculate();
    }
    // 清除
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    }
    // 退格
    else if (key === 'Backspace') {
        deleteLast();
    }
});

/**
 * 页面加载完成后的初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化显示
    updateDisplay();
    
    // 聚焦到显示屏（用于键盘事件）
    display.focus();
    
    console.log('JavaScript 计算器已加载完成');
    console.log('支持键盘操作：');
    console.log('- 数字键：0-9');
    console.log('- 运算符：+、-、*、/');
    console.log('- 小数点：. 或 ,');
    console.log('- 计算：= 或 Enter');
    console.log('- 清除：Escape 或 C');
    console.log('- 退格：Backspace');
});
