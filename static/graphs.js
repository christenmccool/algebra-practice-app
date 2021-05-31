const correctTxt = document.getElementById('correct-text');
const incorrectTxt = document.getElementById('incorrect-text');
const drawLineBtn = document.getElementById('draw-line');
const checkBtn = document.getElementById('check-button');
const message = document.getElementById('message');
const newLineBtn = document.getElementById('new-line-button');

const linearEq = document.getElementById('linear-eq');
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


class GraphingProblem {
    constructor(calc) {
        this.calculator = calc;
        this.equation = new LinearEquation();

        this.setupCalc();
        this.userTable = this.calculator.getExpressions().find(obj => obj['id'] === 'userTable');
        this.xArray = this.userTable.columns[0].values;
        this.yArray = this.userTable.columns[1].values;
    }
    
    setupCalc() {
        this.calculator.setBlank();

        let expWithCond = this.equation.exp.replace('x', 'x_2')
        expWithCond += `\\{\\mod(${expWithCond},1)=0\\}`

        this.calculator.setExpression({
            id: 'solutionTable',
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
                color: Desmos.Colors.ORANGE,
                hidden: true,
            }
            ]
        });
        
        this.calculator.setExpression({
            id: 'userTable',
            type: 'table',
            hidden: false,
            columns: [
            {
                latex: 'x_1',
                values: [],
                pointSize: 15,
            },
            {
                latex: 'y_1',
                values: [],
                pointSize: 15,
                color: Desmos.Colors.BLUE
            },
            ]
        });
    }

    plotpoint(evt) {
        const calculatorRect = calcDiv.getBoundingClientRect();
    
        const pixel_x = evt.clientX - calculatorRect.left;
        const pixel_y = evt.clientY - calculatorRect.top;
    
        if (pixel_x >=0 && pixel_x <= calculatorRect.width && pixel_y >=0 && pixel_y <= calculatorRect.height) {
            const point = this.calculator.pixelsToMath({x : pixel_x, y: pixel_y});
    
            point.x = Math.round(point.x);
            point.y = Math.round(point.y);
    
            let newPoint = true
    
            for (let i = 0; i < this.xArray.length; i++) {
                if (this.xArray[i] == point.x && this.yArray[i] == point.y) {
                    this.xArray.splice(i, 1);
                    this.yArray.splice(i, 1);
                    newPoint = false;
                } 
            }
    
            if (newPoint == true) {
                this.xArray.push(point.x);
                this.yArray.push(point.y);
            }

            this.calculator.setExpression(this.userTable);
        }
    }

    drawLine() {
        if (this.xArray.length <= 2) {
            return "needMorePoints"
        }

        if (this.xArray.length > 2) {
            let slopesEq = true;
            const userM = (this.yArray[1] - this.yArray[0]) / (this.xArray[1] - this.xArray[0]);

            for (let i = 2; i < this.xArray.length; i++) {
                let newM = (this.yArray[i] - this.yArray[0]) / (this.xArray[i] - this.xArray[0]);
                if (newM !== userM) {
                    slopesEq = false;
                    break;
                }
            }
    
            if (slopesEq) {
                const userB = this.yArray[0] - userM * this.xArray[0];
    
                this.calculator.setExpression({id: 'userLine', latex: `y = ${userM}x+${userB}`, color: Desmos.Colors.BLUE});
                return "lineDrawn";
            } else {
                return "fixLine";
            }
        }
    }
    
    checkLine() {
        const userM = (this.yArray[1] - this.yArray[0]) / (this.xArray[1] - this.xArray[0]);
        const userB = this.yArray[0] - userM * this.xArray[0];

        const solutionTable = this.calculator.getExpressions().find(obj => obj['id'] == 'solutionTable');
        solutionTable.columns[1].hidden = false;
        this.calculator.setExpression(solutionTable);
    
        if (userM == this.equation.m && userB == this.equation.b) {
            return true;
        } else {
            this.calculator.setExpression({id: 'line_solution', latex: this.equation.eq, lineWidth: 4, color: Desmos.Colors.ORANGE});
            return false;;
        }
    }
}

const calc = Desmos.GraphingCalculator(calcDiv, {expressions : false, lockViewport : true, settingsMenu: false});
let newGraphingProblem = new GraphingProblem(calc);
linearEq.innerText = newGraphingProblem.equation.eq;
MQ.StaticMath(linearEq);

newLineBtn.classList.add('d-none');
drawLineBtn.classList.remove('d-none');



function plotpoint(evt) {
    newGraphingProblem.plotpoint(evt);
}
document.addEventListener('click', plotpoint);


drawLineBtn.addEventListener('click', () => {
    let response = newGraphingProblem.drawLine();
    if (response == "lineDrawn") {
        message.innerText = "";
        drawLineBtn.classList.add('d-none');
        checkBtn.classList.remove('d-none');
        document.removeEventListener('click', plotpoint);
    } else if (response == "fixLine"){
        message.innerText = "Your points don't form a straight line. Please adjust.";
    } else if (response == "needMorePoints"){
        message.innerText = "Please plot more points before drawing the line.";
    }
});

checkBtn.addEventListener("click", () => {
    let correctLine = newGraphingProblem.checkLine();
    if (correctLine) {
        correct++;
        correctTxt.innerText = `Correct: ${correct}`;
        message.innerText = "Your line is correct! Please check for any additional points.";
    } else {
        incorrect++;
        incorrectTxt.innerText = `Incorrect: ${incorrect}`;
        message.innerText = "Your line is not correct. Please compare to the correct line.";
    }
    checkBtn.classList.add('d-none');
    newLineBtn.classList.remove('d-none');
});

newLineBtn.addEventListener("click", () => {
    newGraphingProblem = new GraphingProblem(calc);

    linearEq.innerText = newGraphingProblem.equation.eq;
    MQ.StaticMath(linearEq);

    newLineBtn.classList.add('d-none');
    message.innerText = "";
    drawLineBtn.classList.remove('d-none');
    document.addEventListener('click', plotpoint);
}
)
