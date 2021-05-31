const correctTxt = document.getElementById('correct-text');
const incorrectTxt = document.getElementById('incorrect-text');
const drawLineBtn = document.getElementById('draw-line');
const checkBtn = document.getElementById('check-button');
const message = document.getElementById('message');
const newLineBtn = document.getElementById('new-line-button');


let correct = 0;
let incorrect = 0;

const elt = document.getElementById('calculator');
const calculator = Desmos.GraphingCalculator(elt, {expressions : false, lockViewport : true, settingsMenu: false});

let newEquation;
let newEq;
let newEqExp;
let userTable;
let xArray;
let yArray;
let userM;
let userB;

let notStraightError = false;

function newGraph() {
    calculator.setBlank()
    const linearEq = document.querySelector("#linear-eq");

    newEquation = getLatexEquation();
    newEq = newEquation.eq;

    newEqExp = newEquation.exp;
    newEqExp = newEqExp.replace('x', 'x_2')
    newEqExp += `\\{\\mod(${newEqExp},1)=0\\}`

    linearEq.innerText = newEq;
    var MQ = MathQuill.getInterface(2);
    MQ.StaticMath(linearEq);

    calculator.setExpression({
        id: 'solutionTable',
        type: 'table',
        hidden: true,
        columns: [
        {
            latex: 'x_2',
            values: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            pointSize: 15,
            hidden: true,

        },
        {
            latex: newEqExp,
            values: [],
            pointSize: 15,
            color: Desmos.Colors.ORANGE,
            hidden: true,
        }
        ]
    });

    calculator.setExpression({
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

    userTable = calculator.getExpressions().find(obj => obj['id'] === 'userTable');
    xArray = userTable.columns[0].values;
    yArray = userTable.columns[1].values;
}

function reset() {
    newLineBtn.classList.add('d-none');
    message.classList.add('d-none');
    drawLineBtn.classList.remove('d-none');
    document.addEventListener('click', plotpoint);
}

newGraph();
reset();


// Find the math coordinates of the mouse
function plotpoint(evt) {
    const calculatorRect = elt.getBoundingClientRect();

    const pixel_x = evt.clientX - calculatorRect.left;
    const pixel_y = evt.clientY - calculatorRect.top;

    if (pixel_x >=0 && pixel_x <= calculatorRect.width && pixel_y >=0 && pixel_y <= calculatorRect.height) {
        const point = calculator.pixelsToMath({x : pixel_x, y: pixel_y});

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);

        let newPoint = true

        for (let i = 0; i < xArray.length; i++) {
            if (xArray[i] == point.x && yArray[i] == point.y) {
                xArray.splice(i, 1);
                yArray.splice(i, 1);
                newPoint = false;
            } 
        }

        if (newPoint==true) {
            xArray.push(point.x);
            yArray.push(point.y);
        }

        calculator.setExpression(userTable);
    }
}

document.addEventListener('click', plotpoint);


drawLineBtn.addEventListener("click", () => {
    if (xArray.length > 2) {

        let slopesEq = true;
        userM = (yArray[1] - yArray[0]) / (xArray[1] - xArray[0]);
        for (i = 2; i < xArray.length; i++) {
            let newM = (yArray[i] - yArray[0]) / (xArray[i] - xArray[0]);
            if (newM !== userM) {
                slopesEq = false;
                break;
            }
        }

        if (slopesEq) {
            userB = yArray[0] - userM * xArray[0];

            calculator.setExpression({id: 'userLine', latex: `y = ${userM}x+${userB}`, color: Desmos.Colors.BLUE});
            drawLineBtn.classList.add('d-none');
            checkBtn.classList.remove('d-none');
    
            document.removeEventListener('click', plotpoint);

            if (notStraightError) {
                message.classList.add('d-none');
                notStraightError = false;
            }
        } else {
            message.classList.remove("d-none");
            message.innerText = "Your points don't form a straight line. Please adjust.";
            notStraightError = true;
        }
    }
})



checkBtn.addEventListener("click", () => {
    console.log(userM, newEquation.m)
    console.log(userB, newEquation.b)

    if (userM == newEquation.m && userB == newEquation.b) {
        correct++;
        correctTxt.innerText = `Correct: ${correct}`
        message.innerText = "Your line is correct! Please check for any additional points.";
    } else {
        incorrect++;
        incorrectTxt.innerText = `Incorrect: ${incorrect}`
        calculator.setExpression({id: 'line_solution', latex: newEq, lineWidth: 4, color: Desmos.Colors.ORANGE});
        message.innerText = "Your line is not correct. Please compare to the correct line.";
    }
    message.classList.remove('d-none');
    
    let solutionTable = calculator.getExpressions().find(obj => obj['id'] == 'solutionTable');
    solutionTable.columns[0].hidden = false;
    solutionTable.columns[1].hidden = false;
    calculator.setExpression(solutionTable);

    checkBtn.classList.add('d-none');
    newLineBtn.classList.remove('d-none');
})


newLineBtn.addEventListener("click", () => {
    // window.location.href = "/graphs"
    newGraph();
    reset();
}
)



