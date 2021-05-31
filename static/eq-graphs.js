const correctTxt = document.getElementById('correct-text');
const incorrectTxt = document.getElementById('incorrect-text');
const showPtsBtn = document.getElementById('show-points-button');
const checkBtn = document.getElementById('check-button');
const message = document.getElementById('message');
const answer = document.getElementById('answer');

const newLineBtn = document.getElementById('new-line-button');

const userEq = document.getElementById('user-eq');
const MQ = MathQuill.getInterface(2);

const calcDiv = document.getElementById('calculator');

let correct = 0;
let incorrect = 0;

class LinearEquation {
    constructor() {
        const equation = getEquation();
  
        this.eq = equation.eq;
        this.exp = this.eq.slice(2);
        this.m = equation.m;
        this.b = equation.b;
        this.rise = equation.rise;
        this.run = equation.run;
    }
}


class EqFromGraphProblem {
    constructor(calc) {
        this.calculator = calc;
        this.equation = new LinearEquation();

        this.graphLine();
    }
    
    graphLine() {
        this.calculator.setBlank();

        let expWithCond = this.equation.exp.replace('x', 'x_2')
        expWithCond += `\\{\\mod(${expWithCond},1)=0\\}`

        this.calculator.setExpression({
            id: 'points',
            type: 'table',
            columns: [
            {
                latex: 'x_2',
                values: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                pointSize: 15,
            },
            {
                latex: expWithCond,
                values: [],
                pointSize: 15,
                color: Desmos.Colors.BLUE,
                hidden: true,
            }
            ]
        })
        this.calculator.setExpression({id: 'line', latex: this.equation.eq, color: Desmos.Colors.BLUE});
        ;
    }

    showPoints() {
        const solutionTable = this.calculator.getExpressions().find(obj => obj['id'] == 'points');
        solutionTable.columns[1].hidden = false;
        this.calculator.setExpression(solutionTable);
    }
    
    checkLine(line) {
        if (line == this.equation.eq) {
            return true;
        }
        return false;
    }
}




const calc = Desmos.GraphingCalculator(calcDiv, {expressions : false, lockViewport : true, settingsMenu: false});
let newEqfromGraphProblem = new EqFromGraphProblem(calc);
console.log(newEqfromGraphProblem.equation.eq);

showPtsBtn.addEventListener('click', () => {
    newEqfromGraphProblem.showPoints();
});

let enteredMath;
const userEqMathField = MQ.MathField(userEq, {
    handlers: {
        edit: function() {
            enteredMath = userEqMathField.latex(); 
        }
    }
});

checkBtn.addEventListener('click', () => {
    if (newEqfromGraphProblem.checkLine(enteredMath)) {
        message.innerText = "Correct!"
    } else {
        message.innerText = "Incorrect. The correct equation is:";
        answer.innerText = `${newEqfromGraphProblem.equation.eq}`;
        MQ.StaticMath(answer); 
    }
    checkBtn.classList.add("d-none");
    newLineBtn.classList.remove("d-none");
});



newLineBtn.addEventListener("click", () => {
    newEqfromGraphProblem = new EqFromGraphProblem(calc);
    
    newLineBtn.classList.add('d-none');
    message.innerText = "";
    answer.innerText = "";
    userEqMathField.latex("");
    checkBtn.classList.remove("d-none");
    userEq.classList.remove("d-none");
}
)

