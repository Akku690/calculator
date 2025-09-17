
class Calculator {
            constructor(previousOperandTextElement, currentOperandTextElement) {
                this.previousOperandTextElement = previousOperandTextElement;
                this.currentOperandTextElement = currentOperandTextElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '';
                this.previousOperand = '';
                this.operation = undefined;
                this.updateDisplay();
            }

            delete() {
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                this.updateDisplay();
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                this.currentOperand = this.currentOperand.toString() + number.toString();
                this.updateDisplay();
            }

            chooseOperation(operation) {
                if (operation === '±') {
                    if (this.currentOperand === '') return;
                    this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
                    this.updateDisplay();
                    return;
                }

                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateDisplay();
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            this.displayError('Cannot divide by zero');
                            return;
                        }
                        computation = prev / current;
                        break;
                    case '%':
                        computation = prev % current;
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = this.roundResult(computation).toString();
                this.operation = undefined;
                this.previousOperand = '';
                this.updateDisplay();
            }

            roundResult(number) {
                return Math.round((number + Number.EPSILON) * 100000000) / 100000000;
            }

            displayError(message) {
                this.currentOperandTextElement.textContent = message;
                this.currentOperandTextElement.classList.add('error');
                setTimeout(() => {
                    this.clear();
                    this.currentOperandTextElement.classList.remove('error');
                }, 2000);
            }

            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                if (this.currentOperand === '') {
                    this.currentOperandTextElement.textContent = '0';
                } else {
                    this.currentOperandTextElement.textContent = this.getDisplayNumber(this.currentOperand);
                }
                
                if (this.operation != null) {
                    this.previousOperandTextElement.textContent = 
                        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandTextElement.textContent = '';
                }
            }
        }

        // Initialize calculator
        const previousOperandTextElement = document.getElementById('previousOperand');
        const currentOperandTextElement = document.getElementById('currentOperand');

        const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            
            if (key >= '0' && key <= '9' || key === '.') {
                calculator.appendNumber(key);
            } else if (key === '+' || key === '-') {
                calculator.chooseOperation(key);
            } else if (key === '*') {
                calculator.chooseOperation('×');
            } else if (key === '/') {
                event.preventDefault();
                calculator.chooseOperation('÷');
            } else if (key === '%') {
                calculator.chooseOperation('%');
            } else if (key === 'Enter' || key === '=') {
                calculator.compute();
            } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                calculator.clear();
            } else if (key === 'Backspace') {
                calculator.delete();
            }
        });

        // Add visual feedback for button presses
        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(2px)';
            });
            
            button.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });