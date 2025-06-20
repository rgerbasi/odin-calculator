// script.js

/* 
Current Idea: get all buttons, switch statement for different listeners
*/
let entries = [];
let current = "";
let displayString = "";
const display = document.querySelector('#display');

const buttons = document.querySelectorAll('button');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons =document.querySelectorAll('.operator');
const equalButton = document.querySelector("#equals");
buttons.forEach((button) => {
    //assign proper listener
    if (!button.id) return; // do nothing if no button id
    
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
        button.disabled = (!isNumber(current)); //only allow operator buttons if theres is number
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
    
    current += this.id;
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
    operate();
   
}
//Helper functions
function print(thing) { console.log(thing);}
function isNumber(str) { return /\d/.test(str);}
function isOperator(str) { return ["+","−","×","÷"].includes(str)}
function toString(arr) {
    return arr.join("\u00A0"); //join on unbreakablewhitespace
}
let operations = {
    "+":1,
    "−":2,
    "×":3,
    "÷":4,
}
function operate(a, b) {

}

//initial calls
updateDisplay();
