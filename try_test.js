function InitTest() {
    $.getJSON('package.json', function (data) {
        var app = document.getElementById("content-wrapper");
        var testForm = document.createElement('form');
        app.appendChild(testForm);
        testForm.id = 'test_form';
        var orderList = document.createElement('div');
        orderList.id = "content";
        orderList.className = "hide";
        testForm.appendChild(orderList);
        for (var i = 0; i < data.number; i++) {
            var question = data.questions[i];
            var listElement = document.createElement('div');
            listElement.className = 'post';
            listElement.innerHTML = "<h4 class='title'>" + (i + 1) + ") " + question.value + "</h4>";
            for (var j = 0; j < question.numberOfAnswers; j++) {
                let answer = document.createElement('input');
                answer.type = question.type;
                answer.name = "answ" + i;
                let paragraph = document.createElement('p');
                paragraph.className = "title";
                paragraph.appendChild(answer);
                paragraph.innerHTML += question.answers[j].value;
                listElement.appendChild(paragraph);
            }
            orderList.appendChild(listElement);
        }
        var button = document.createElement('input');
        button.id = "check_button";
        button.type = "button";
        button.value = "Проверить";
        button.className = "butt";
        testForm.appendChild(button);
        var resetButton = document.createElement('input');
        resetButton.id = "reset_button";
        resetButton.disabled = true;
        resetButton.type = "button";
        resetButton.value = "Начать заново";
        resetButton.className = "butt";
        resetButton.addEventListener('click', function () {
            ResetTest();
            this.disabled = true;
        });
        testForm.appendChild(resetButton);
        var clearButton = document.createElement('input');
        clearButton.id = "clear_button";
        clearButton.type = "button";
        clearButton.value = "Очистить";
        clearButton.className = "butt";
        clearButton.addEventListener('click', ClearAnswers);
        testForm.appendChild(clearButton);
        //resetButton.addEventListener('click', ResetTest);
        //button.addEventListener('click', StopTimer);
    });
}

function StopTimer() {
    document.getElementById("timer").innerHTML = "00:00";
    document.getElementById("timer").className = "hide";

}

function CreateButtonsForPlainTest() {
    var button = document.getElementById("check_button");
    button.removeEventListener('click', CheckAnswers);
    button.addEventListener('click', StopTimer);
    button = document.getElementById("train_test");
    button.disabled = true;

}

function CreateButtonsForTrainTest() {
    var button = document.getElementById("check_button");
    button.removeEventListener('click', StopTimer);
    button.addEventListener('click', CheckAnswers);
    button = document.getElementById("reset_button");
    button.disabled = true;
}

function DeleteForm() {
    var testForm = document.getElementById('test_form');
    var app = document.getElementsByTagName("body");
    if (testForm != null) app[0].removeChild(testForm);
}

function ChangeButton() {
    var plain_test = document.getElementById('plain_test')
}

function PlainTest() {
    document.getElementById("content").className = "plain";
    document.getElementById("timer").className = "plain";
    document.getElementById("timer").innerHTML = "20:00";
    var plain_test = document.getElementById("plain_test");
    var train_test = document.getElementById("train_test");
    plain_test.className = "hide";
    train_test.className = "plain";
    document.getElementById("reset_button").className = "butt";
    document.getElementById("reset_button").disabled = true;
    //DeleteForm();
    //InitTest();
    CreateButtonsForPlainTest();
    startTimer();
}

function TrainTest() {
    document.getElementById("results").className = "hide";
    document.getElementById("timer").className = "hide";
    document.getElementById("content").className = "plain";
    var plain_test = document.getElementById("plain_test");
    var train_test = document.getElementById("train_test");
    train_test.className = "hide";
    plain_test.className = "plain";
    document.getElementById("reset_button").className = "hide";
    //DeleteForm();
    //InitTest();
    CreateButtonsForTrainTest();
}

function CheckAnswers() {
    var count = 0;
    document.getElementById("timer").className = "hide";
    document.getElementById("content").className = "hide";
    document.getElementById("train_test").disabled = false;
    $.getJSON('package.json', function (data) {
        for (var i = 0; i < data.number; i++) {
            var answer = document.getElementsByName("answ" + i);
            var question = data.questions[i];
            if (question.type == "radio") {
                let rightAnswer = question.rightAnswer;
                if (CheckRadioAnswer(answer, rightAnswer)) count++;
            }
            if (question.type == "checkbox") {
                let numberOfRightAnswers = question.numberOfRightAnswers;
                let rightAnswers = question.rightAnswers;
                if (CheckCheckboxAnswer(answer, numberOfRightAnswers, rightAnswers)) count++;
            }
            if (question.type == "text") {
                let rightAnswer = question.rightAnswer;
                if (CheckTextAnswer(answer, rightAnswer)) count++;
            }
        }
        ShowResults(count, data.number);

    });
}

function CheckRadioAnswer(answers, rightAnswer) {
    if (answers[rightAnswer].checked) {
        return true;
    }
    return false;

}

function CheckCheckboxAnswer(answers, numberOfRightAnswers, rightAnswers) {
    var count = 0;
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].checked) count++;
    }
    if (count != numberOfRightAnswers) return false;
    else {
        for (var i = 0; i < numberOfRightAnswers; i++) {
            if (!answers[rightAnswers[i].value].checked) return false;
        }
        return true;
    }
}

function CheckTextAnswer(answer, rightAnswer) {
    return answer[0].value == rightAnswer;
}

function ClearAnswers() {
    var test_form = document.getElementById('test_form');
    test_form.reset();
}

function ResetTest() {
    ClearAnswers();
    document.getElementById("timer").innerHTML = "20:00";
    document.getElementById("content").className = "plain";
    document.getElementById("train_test").disabled = true;
    document.getElementById("results").className = "hide";
    startTimer();
}


function ShowResults(count, countOfQuestions) {
    var mark;
    var result = Math.round(count / countOfQuestions * 100);
    if (result >= 90) mark = 5;
    else if (result >= 70) mark = 4;
    else if (result >= 40) mark = 3;
    else mark = 2;
    document.getElementById("reset_button").disabled = false;
    document.getElementById("results").innerHTML = "<h2> Результат: " + result + "%, ваша оценка " + mark + "</h2>";
    document.getElementById("results").className = "plain";
}

function startTimer() {
    var timer = document.getElementById("timer");
    timer.className = "plain";
    var time = timer.innerHTML;
    var arr = time.split(":");
    var m = arr[0];
    var s = arr[1];
    if (s == 0) {
        if (m == 0) {
            CheckAnswers();
            return;

        }
        m--;
        if (m < 10) m = "0" + m;
        s = 59;
    }
    else s--;
    if (s < 10) s = "0" + s;
    document.getElementById("timer").innerHTML = m + ":" + s;
    setTimeout(startTimer, 1000);
}


