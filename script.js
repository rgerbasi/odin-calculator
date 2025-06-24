// script.js

/* 
Current Idea: get all buttons, switch statement for different listeners
*/
//state
let entries = [];
let current = "";
let evaluated = false;
let displayString = "";
const display = document.querySelector('#display');

const buttonNodes = document.querySelectorAll('button');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalButton = document.querySelector("#equals");

const buttons = {};
buttonNodes.forEach((button) => {
    //assign proper listener
    if (!button.id) return; // do nothing if no button id
    
    buttons[button.id] = button;

    if (!isNaN(button.id)) { //is a number
        //number button listeners
        button.addEventListener("click", handleNumberPressed);
    } else {
        switch(button.id) {
            case "delete":
                button.addEventListener("click", handleDeletePressed);
                break;
            case "random":
                button.addEventListener("click", handleRandomPressed);
                break;
            case "clear":
                button.addEventListener("click", handleClearPressed);
                break;
            case "decimal":
                button.addEventListener("click", handleDecimalPressed);
                break;
            case "equals":
                button.addEventListener("click", handleEqualsPressed);
                break;
            case "divide":
            case "times":
            case "minus":
            case "plus":
                button.addEventListener("click", handleOperatorPressed);
                break;
        }
    } // end of if button.id is number
});
let baseSize = 4; //em
let originalHeight = display.clientHeight;
//DISPLAY FUNCTIONS
function updateDisplay() {
    current = current ?? ""; //safety
    checkValidButtons();
    displayString = toString([...entries, current]);
    display.textContent = displayString;
    adaptFontSize();
}
function isOverflown(element) { return element.scrollWidth > element.clientWidth;}
function adaptFontSize() {
    //from stack overflw https://stackoverflow.com/questions/56099198/make-html-input-font-size-shrink-as-more-type-is-typed
    let curSize = parseInt(
      window.getComputedStyle(display, null).getPropertyValue("font-size"),
      10
    );
    // console.log(curSize)
    if (isOverflown(display)) {
        // console.log("overflow")
        for (; isOverflown(display); curSize--){
            display.style.fontSize = `${curSize}px`;
        }
    } else {
        curSize = originalHeight/2;
        display.style.fontSize = `${curSize}px`;
         for (; isOverflown(display); curSize--){
            display.style.fontSize = `${curSize}px`;
        }
    }
}
function checkValidButtons(){
    decimalButton.disabled = (current.includes("."));
    operatorButtons.forEach((button) => {
        button.disabled = (current === "" && !entries.length); //only allow operator buttons if theres is number
    })
    equalButton.disabled = (isOperator(current));
}
//BUTTON HANDLERS
// e is event passed in, this is the button
function handleDeletePressed(e) {
    // if (!displayString.length) return; //do nothing if display string is empty
    // displayString = displayString.slice(0,-1);  string attempot
    if (!current.length && !entries.length) return; //empty
    //token attempt
    if (current.length) {
        current = current.slice(0,-1);
    } else {
        //pop last entry for delete
        current = entries.pop();
        if (isNumber(current)) { //if is number delete the same way as the previous
            current = current.slice(0,-1);
        } else {
            current = "";
        }
    }
    updateDisplay()
}
//logic: update current value as number gets pressed then push value into array when operator is pressed
function handleNumberPressed(e) {
    //Check if entry should be pushed and current should be updated
    if (isOperator(current)) {
        entries.push(current);
        current = "";
    }
    if (evaluated){
        current = this.id;
        evaluated = false;
    } else {
        current += this.id;
    }
    updateDisplay()
}

function handleOperatorPressed(e) {
    //check if entry should be pushed and current should be updated
    if (isNumber(current)){
        entries.push(current);
        current = "";
    }
    let op = this.id;
    let opString = "";
    switch (op){
        case "divide":
            opString = "÷"
            break;
        case "times":
            opString = "×"
            break;
        case "minus":
            opString = "−"
            break;
        case "plus":
            opString = "+"
            break;
    }
    current = opString;
    updateDisplay();
}
const decimalButton = document.querySelector("#decimal");
function handleDecimalPressed(e) {
    // print(this);
    if (current === ""){
        current = "0";
    }
    current += ".";
    updateDisplay();
}

function handleRandomPressed(e) {
    let num = parseInt(current);
    let threshhold = isNaN(num) ? 1 : num;
    threshhold = (threshhold < 1? 1 : threshhold)
    current = (Math.random() * threshhold).toFixed(2);
    updateDisplay();
}

function handleClearPressed(e) {
    current = "";
    entries.length = 0;
    updateDisplay();
}

function handleEqualsPressed(e){
    let postfix = toPostFix([...entries, current]);
    print(postfix);
    current = evaluate(postfix);
    entries.length = 0 ;
    evaluated = true;
    updateDisplay();
}
//Helper functions
function print(thing) { console.log(thing);}
function isNumber(str) { return /\d/.test(str);}
function isOperator(str) { return ["+","−","×","÷"].includes(str)}
function toString(arr) {
    // return arr.join("\u00A0"); //join on unbreakablewhitespace
    return arr.join("");
}
function getPrecedence(op) {
    if (op === "×" || op === "÷") return 2;
    if (op === "−" || op === "+") return 1;
}
function toPostFix(arr) {
    let output = [];
    let operators = [];

    for (token of arr){
        // print(token);
        if (isNumber(token)) {
            output.push(token);
        }
        if (isOperator(token)){
            //check top of stack and add to output if op stack has >= prec
            while (
                operators.length &&
                (getPrecedence(operators[operators.length - 1]) >= getPrecedence(token))
            ) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }
    while (operators.length){
        output.push(operators.pop());
    }
    return output;
}
let operations = {
    "+":(a,b) => a + b,
    "−":(a,b) => a-b,
    "×":(a,b) => a*b,
    "÷":(a,b) => a/b,
}
function evaluate(postfix){
    let stack = [];
    for (token of postfix){
        if (isNumber(token)){
            stack.push(+token);
        }
        if (isOperator(token)){
            let b = stack.pop();
            let a = stack.pop();
            //check for division 0
            if (token === "÷" && b == 0){
                alert("Yea nice try.");
                handleClearPressed();
                return;
            }
            let result = operations[token](a,b);
            stack.push(result);
        }
    }
    // print(stack);
    //validating result
    let result = stack.pop();
    return result.toFixed(3);
}
function isValidKey(key) {
    if (isNumber(key) || isOperator(key) || 
        key === "Backspace" || key === "Enter" || key === "Shift" || key === ".") {
        return true;
    }
    return false;
}
//initial calls

//keyboard support
window.addEventListener("keydown", (e) =>{
    //translate input
    let token = e.key;
    if (e.key === "-"){
        // print("minus")
        token = "−"
    }
    if (e.key === "/") {
        // print("divide")
        token = "÷"
    }
    if (e.key === "*") {
        // print("mult")
        token = "×"
    }
    // print(e.key)
    if (!isValidKey(token)) return;

    if (isNumber(token)){
        // print(buttons[token])
        buttons[token].click();
    }
    if (isOperator(token)){
        switch(token) {
            case "+":
                // print(buttons["plus"])
                buttons["plus"].click();
                break;
            case "−":
                // print(buttons["minus"])
                buttons["minus"].click();
                break;
            case "×":
                // print(buttons["times"])
                buttons["times"].click();
                break;
            case "÷":
                // print(buttons["divide"])
                buttons["divide"].click();
                break;
        }
    }
    if (token === "."){
    //    print(buttons["decimal"]);
       buttons["decimal"].click();
    }
    if (token === "Backspace"){
        buttons["delete"].click();
    }
    if (token === "Enter"){
        // print(buttons["equals"])
        buttons["equals"].click();
    }
    // print(token)
    // print(isNumber(token));
    // print(isOperator(token))

})

updateDisplay();
