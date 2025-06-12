// script.js

/* 
Current Idea: get all buttons, switch statement for different listeners
*/
let operands = [];
let operators = [];
let displayString = "";
const display = document.querySelector('#display');

const buttons = document.querySelectorAll('button');
console.log(buttons)

function print(thing) { console.log(thing);}

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

function updateDisplay() {
    display.textContent = displayString;
}
// e is event passed in, this is the button
function handleDeletePressed(e) {
    if (!displayString.length) return; //do nothing if display string is empty

    displayString = displayString.slice(0,-1);
    updateDisplay()
}

function handleNumberPressed(e) {
    // print(e);
    //populate display, store value
    displayString += this.id;
    updateDisplay()
}

function handleOperatorPressed(e) {
    print(this)
}

function handleDecimalPressed(e) {
    print(this)
}

function handleRandomPressed(e) {
    print(this)
}

function handleClearPressed(e) {
    print(this)
}

function handleEqualsPressed(e){
    print(this)
}