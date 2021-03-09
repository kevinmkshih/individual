const xhttp = new XMLHttpRequest();
let TwoAnswerBtn = document.getElementById("TwoAnswer");
let FourAnswerBtn = document.getElementById("FourAnswer");
TwoAnswerBtn.addEventListener("click", postForm);
FourAnswerBtn.addEventListener("click", postForm);

function checkRadioEmpty(chooseAnswers) {
    let isEmpty;
    let radioButton = [];
    for (let i = 1; i < chooseAnswers; i++) {
        let thisRadio = "r" + i;
        radioButton.push(document.getElementById(thisRadio).checked);
    }
    isEmpty = !radioButton.includes(true);
    return isEmpty;
}

function uCheckRadioEmpty(chooseAnswers) {
    let isEmpty;
    let radioButton = [];
    for (let i = 1; i < chooseAnswers + 1; i++) {
        let thisRadio = "ur" + i;
        radioButton.push(document.getElementById(thisRadio).checked);
    }
    isEmpty = !radioButton.includes(true);
    return isEmpty;
}

function checkTextEmpty(chooseAnswers) {
    let isEmpty = false;
    let textFields = [];
    textFields.push(document.getElementById("questionTextArea").value);
    for (let i = 1; i < chooseAnswers; i++) {
        let thisText = "q" + i;
        textFields.push(document.getElementById(thisText).value);
    }
    textFields.forEach((text) => {
        if (text.length === 0) {
            isEmpty = true;
        }
    });
    return isEmpty;

}

function uCheckTextEmpty(chooseAnswers) {
    let isEmpty = false;
    let textFields = [];
    textFields.push(document.getElementById("uQuestionTextArea").value);
    for (let i = 1; i < chooseAnswers - 1; i++) {
        let thisText = "uq" + i;
        textFields.push(document.getElementById(thisText).value);
    }
    textFields.forEach((text) => {
        if (text.length === 0) {
            isEmpty = true;
        }
    });
    return isEmpty;
}

function checkForm() {
    let chooseAnswers;
    let curButton = document.activeElement.textContent;
    if (curButton === "4 Answer") {
        chooseAnswers = 5;
    } else if (curButton === "2 Answer") {
        chooseAnswers = 3;
    }
    let textEmpty = checkTextEmpty(chooseAnswers);
    if (textEmpty) {
        alert("You must input all required textfields!");
        return false;
    }
    let radioEmpty = checkRadioEmpty(chooseAnswers);
    if (radioEmpty) {
        alert("You must choose a correct answer!");
        return false;
    }
    return true;
};

function getCorrectAnswer() {
    let correctAnswer;
    for (let i = 1; i < 5; i ++) {
        let thisRadio = "r" + i;
        if (document.getElementById(thisRadio).checked ) {
            correctAnswer = i;
        }
    }
    return correctAnswer;
}

function postForm() {
    let checkFormResult = checkForm()
    if (!checkFormResult) {
        return false;
    }
    let numChoice;
    let curButton = document.activeElement.textContent;
    if (curButton === "4 Answer") {
        numChoice = 5;
    } else if (curButton === "2 Answer") {
        numChoice = 3;
    }
    let correctAnswer = getCorrectAnswer(numChoice);
    let q1 = document.getElementById('q1').value;
    let q2 = document.getElementById('q2').value;
    let q3 = document.getElementById('q3').value;
    let q4 = document.getElementById('q4').value;
    let question = document.getElementById('questionTextArea').value;
    xhttp.open("POST", '/questions/?q1=' + q1 + '&q2=' + q2 + '&q3=' + q3 + '&q4=' + q4 + '&question=' + question +
        '&correctAnswer=' + correctAnswer + '&numberAnswer=' + numChoice, true);
    xhttp.send();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
            document.getElementById("demo").innerHTML = xhttp.responseText;
        }
    }

}

// update section

let updateTwoAnswerBtn = document.getElementById("uTwoAnswer");
let updateFourAnswerBtn = document.getElementById("uFourAnswer");
updateTwoAnswerBtn.addEventListener("click", putForm);
updateFourAnswerBtn.addEventListener("click", putForm);

function uCheckForm(chooseAnswer) {

    let chooseAnswers = chooseAnswer;
    let textEmpty = uCheckTextEmpty(chooseAnswers);
    if (textEmpty) {
        alert("You must input all required textfields!");
        return false;
    }
    let radioEmpty = uCheckRadioEmpty(chooseAnswers);
    if (radioEmpty) {
        alert("You must choose a correct answer!");
        return false;
    }
    return true;

};

function uGetCorrectAnswer() {
    let correctAnswer;
    for (let i = 1; i < 5; i ++) {
        let thisRadio = "ur" + i;
        if (document.getElementById(thisRadio).checked ) {
            correctAnswer = i;
        }
    }
    return correctAnswer;
}

function putForm() {
    let choice;
    let curButton = document.activeElement.textContent;
    if (curButton === "4 Answer") {
        choice = 4;
    } else if (curButton === "2 Answer") {
        choice = 3;
    }
    if (!uCheckForm(choice)) {
        return false;
    }
    let correctAnswer = uGetCorrectAnswer();
    console.log("correctAnswer = " + correctAnswer)
    let q1 = document.getElementById('uq1').value;
    let q2 = document.getElementById('uq2').value;
    let q3 = document.getElementById('uq3').value;
    let q4 = document.getElementById('uq4').value;
    let question = document.getElementById('uQuestionTextArea').value;
    xhttp.open("PUT", '/questions/?q1=' + q1 + '&q2=' + q2 + '&q3=' + q3 + '&q4=' + q4 + '&question=' + question +
        '&correctAnswer=' + correctAnswer + '&choice=' + choice, true);
    xhttp.send();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
            document.getElementById("demo2").innerHTML = xhttp.responseText;
        }
    }
}
