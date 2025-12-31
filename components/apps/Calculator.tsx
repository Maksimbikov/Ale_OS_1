import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, next: number, op: string) => {
    switch (op) {
      case '+': return prev + next;
      case '-': return prev - next;
      case '×': return prev * next;
      case '÷': return prev / next;
      default: return next;
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const btnClass = "h-16 w-16 rounded-full text-2xl font-medium flex items-center justify-center active:opacity-70 transition-opacity";
  const grayBtn = "bg-gray-300 text-black";
  const orangeBtn = "bg-orange-500 text-white";
  const darkBtn = "bg-gray-800 text-white";

  return (
    <div className="h-full w-full bg-black flex flex-col p-4 pb-12">
      <div className="flex-1 flex items-end justify-end p-4">
        <span className="text-6xl text-white font-light break-all">{display}</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <button onClick={clear} className={`${btnClass} ${grayBtn}`}>AC</button>
        <button onClick={() => { setDisplay(String(parseFloat(display) * -1)) }} className={`${btnClass} ${grayBtn}`}>+/-</button>
        <button onClick={() => { setDisplay(String(parseFloat(display) / 100)) }} className={`${btnClass} ${grayBtn}`}>%</button>
        <button onClick={() => performOperation('÷')} className={`${btnClass} ${orangeBtn}`}>÷</button>
        
        <button onClick={() => inputDigit('7')} className={`${btnClass} ${darkBtn}`}>7</button>
        <button onClick={() => inputDigit('8')} className={`${btnClass} ${darkBtn}`}>8</button>
        <button onClick={() => inputDigit('9')} className={`${btnClass} ${darkBtn}`}>9</button>
        <button onClick={() => performOperation('×')} className={`${btnClass} ${orangeBtn}`}>×</button>
        
        <button onClick={() => inputDigit('4')} className={`${btnClass} ${darkBtn}`}>4</button>
        <button onClick={() => inputDigit('5')} className={`${btnClass} ${darkBtn}`}>5</button>
        <button onClick={() => inputDigit('6')} className={`${btnClass} ${darkBtn}`}>6</button>
        <button onClick={() => performOperation('-')} className={`${btnClass} ${orangeBtn}`}>-</button>
        
        <button onClick={() => inputDigit('1')} className={`${btnClass} ${darkBtn}`}>1</button>
        <button onClick={() => inputDigit('2')} className={`${btnClass} ${darkBtn}`}>2</button>
        <button onClick={() => inputDigit('3')} className={`${btnClass} ${darkBtn}`}>3</button>
        <button onClick={() => performOperation('+')} className={`${btnClass} ${orangeBtn}`}>+</button>
        
        <button onClick={() => inputDigit('0')} className={`${btnClass} ${darkBtn} col-span-2 w-auto`}>0</button>
        <button onClick={() => inputDigit('.')} className={`${btnClass} ${darkBtn}`}>.</button>
        <button onClick={() => performOperation('=')} className={`${btnClass} ${orangeBtn}`}>=</button>
      </div>
    </div>
  );
};

export default Calculator;