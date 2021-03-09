const xhttp = new XMLHttpRequest();
let data;
function setAttributeHelper(element, attr) {
  // sets multiple attributes
  // element: an element
  // attr: {"attribute": "value"}
  for (var key in attr) {
    element.setAttribute(key, attr[key]);
  }
}

function checkAnswer() {
  let studentSelection = [];
  let correctAnswers = [];
  // get question answers
  for (let i = 0; i < data.length; i++) {
    question = data[i];
    correctAnswers.push(question.correctAnswer);
  }

  // get student answers
  for (let i = 1; i <= data.length; i++) {
    for (let j = 1; j < 5; j++) {
      if (document.getElementById("radio_id" + i + "x" + j).checked === true) {
        studentSelection.push(j);
      }
    }
  }

  if (studentSelection.length !== data.length) {
    alert("Please answer all questions");
    return;
  }

  let num_correct = 0;
  for (let i = 0; i < data.length; i++) {
    console.log(data.length);
    correctTextArea = document.getElementById("answer_id"+(i+1)+"x"+correctAnswers[i]);
    console.log(typeof correctTextArea);
    correctTextArea.classList.add("correctAnswer");
    if (studentSelection[i] === correctAnswers[i]) {
      num_correct += 1;
    } else {
      studentSelectionTextArea = document.getElementById(
        "answer_id" + (i + 1) + "x" + studentSelection[i]
      );
      studentSelectionTextArea.classList.add("wrongAnswer");
    }
  }

  alert("You answered " + num_correct + "/" + data.length + " correctly.");
}

function showQuestion(question, num) {
  let questionArea = document.getElementById("questionArea");
  let questionTitle = document.createElement("h4");
  let questionText = document.createElement("TEXTAREA");

  questionTitle.classList.add("question-number");
  questionText.classList.add("question-text", "textArea");
  questionText.disabled = true;

  questionTitle.innerHTML = "Question" + num;
  questionText.innerHTML = question['QUESTION'];

  let answersHeader = document.createElement("h6");
  answersHeader.innerHTML = "answers *";

  questionArea.appendChild(questionTitle);
  questionArea.appendChild(questionText);
  questionArea.append(answersHeader);

  // create and add radio + answer box
  for (let i = 1; i < 5; i++) {
    if (question["Q" + i]) {
      let radio_name = "radio" + num;
      let radio_id = "radio_id" + num + "x" + i;
      const radio_button = document.createElement("input");
      setAttributeHelper(radio_button, {
        type: "radio",
        name: radio_name,
        id: radio_id,
      });

      let answer_id = "answer_id" + num + "x" + i;
      const answer_text = document.createElement("TEXTAREA");
      setAttributeHelper(answer_text, {type: "text", id: answer_id});
      answer_text.disabled = true;
      answer_text.classList.add("textArea");

      answer_text.innerHTML = question["Q" + i];

      questionArea.appendChild(document.createElement("br"));
      questionArea.appendChild(radio_button);
      questionArea.appendChild(answer_text);
    }
  }
}
function getQuestions() {
  xhttp.open("GET", "/questions", true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    console.log("xhttp ready");
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      if (jsonObj === null) {
        alert("There is no quiz available.");
      } else {
        data = jsonObj;
        for (i = 0; i < jsonObj.length; i++) {
          let question = jsonObj[i];
          showQuestion(question, i + 1);
        }
      }
    }
  };
}

getQuestions();
