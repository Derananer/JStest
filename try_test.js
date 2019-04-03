function CheckAnswers() {
    var RightAnswers = 0;

    if (test_form.answ1.value.toUpperCase() == 'HTML') {
        RightAnswers += 1
    }
    ;

    if (test_form.answ2[2].checked) {
        RightAnswers += 1
    }
    ;


    if (!test_form.answ4[0].checked &&
        test_form.answ4[1].checked &&
        test_form.answ4[2].checked &&
        !test_form.answ4[3].checked) {
        RightAnswers += 1
    }
    ;

    if ((test_form.answ10_font.value == '1') &&
        (test_form.answ10_img.value == '4') &&
        (test_form.answ10_a.value == '2') &&
        (test_form.answ10_table.value == '3')) {
        RightAnswers += 1
    }
    ;


    alert('Результат: ' + RightAnswers);
};

function ResetAnswers() {
    test_result.innerHTML = '<input type=button value="Проверить" onclick="CheckAnswers()"><input type=reset value="Сброс">';
    test_form.reset();
}

function startTimer() {
    var my_timer = document.getElementById("my_timer");
    var time = my_timer.innerHTML;
    var arr = time.split(":");
    var m = arr[0];
    var s = arr[1];
    if (s == 0) {
        if (m == 0) {
            alert("Время вышло");
            window.location.reload();
            return;

        }
        m--;
        if (m < 10) m = "0" + m;
        s = 59;
    }
    else s--;
    if (s < 10) s = "0" + s;
    document.getElementById("my_timer").innerHTML = m + ":" + s;
    setTimeout(startTimer, 1000);
};