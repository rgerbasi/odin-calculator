// script.js

/* 
Current Idea: get all buttons, switch statement for different listeners
*/

const buttons = document.querySelectorAll('button');
console.log(buttons)

function print(thing) { console.log(thing);}

buttons.forEach((button) => {
    //assign proper listener
    if (!button.id) return;
    
    if (!isNaN(button.id)) {
        //number button listeners
        // print(button.id)
    } else {
        switch(button.id) {
            default:
                print(button)
        }
    } // end of if button.id is number
});