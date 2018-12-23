var responseToken;
var questionArray = [];
var intervalId;
var count = 30;
var intervalId2;
var count2 = 5;
var totalNumberOfQuestions;
var currentQuestion = 0;
var numberCorrectAnswers;
var numberWrongAnswers;

gameLoad();

function gameLoad() {
    getBatchOfQuestions();
}

function requestToken() { // initial request for token
    $.ajax({
        url: "https://opentdb.com/api_token.php?command=request",
        method: "GET"
    }).then(function (response) {
        responseToken = response.token;
        getBatchOfQuestions();
    });
}

function resetToken() {  // gets called to reset token
    $.ajax({
        url: "https://opentdb.com/api_token.php?command=reset&token=" + responseToken,
        method: "GET"
    }).then(function (response) {
        responseToken = response.token;
        getBatchOfQuestions();
    });
}

function getBatchOfQuestions() { // checks token status and calls for batch of questions, will reset or request functions as needed. 
    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&token=" + responseToken,
        method: "GET"
    }).then(function (response) {
        // Code 3: Token Not Found Session Token does not exist.
        // Code 4: Token Empty Session Token has returned all possible questions
        // for the specified query. Resetting the Token is necessary.

        if (response.response_code == 3) {
            requestToken();
        }
        else if (response.response_code == 4) {
            resetTokens();
        }
        else {
            questionArray = response.results;
        }
    });
}

$(".start-button").click(function () {
    numberWrongAnswers = 0;
    numberCorrectAnswers = 0;
    currentQuestion = 0
    $("#question-div").empty();
    startNewGame();
});

function startNewGame() {
    if (questionArray == []) {
        gameLoad();
    }
    $(".start-button").hide();
    $("#counter").show();
    processQuestion();
}

function processQuestion() {

    if (currentQuestion === (questionArray.length)) {  //end of game
        //  if(currentQuestion === 2) {
        // show stats
        // alert("end of game");
        $("#question-div").empty();
        $("#counter").hide();
        var final = $('<h4 class = "final score"></h4>').html("Total number of questions: " + questionArray.length);
        var final2 = $('<h4 class = "final score"></h4>').html("Correct Answers: " + numberCorrectAnswers);
        var final3 = $('<h4 class = "final score"></h4>').html("Wrong Answers: " + numberWrongAnswers);
        $("#question-div").hide().append(final);
        $("#question-div").append(final2);
        $("#question-div").append(final3).fadeIn(300);
        questionArray = [];  //prep for next game
        gameLoad();  //prep for next game
        $(".start-button").show().fadeIn(300);
        //  gameLoad();
    }
    else {
        run(); //starts timer on each question 
        $("#question-div").empty();
        var questionP = $('<h4 class = "question-element"></h4>').html(questionArray[currentQuestion].question);
        $("#question-div").append(questionP);
        $("#question-div").append("<br>");
        //append answers
        var answers = questionArray[currentQuestion].incorrect_answers;
        answers.push(questionArray[currentQuestion].correct_answer);
        answers = shuffle(answers);

        for (var j = 0; j < answers.length; j++) {
            var answerP = $("<p></p>").html(answers[j]);
            answerP.addClass("clickAnswer");
            $("#question-div").append(answerP);
            //encrpt correct-answer
            answerP.attr("correct-answer", questionArray[currentQuestion].correct_answer);
        }
    }
}

function checkAnswers() {

    stop();
    var selectedAnswer = $(this).html();
    var correctAnswer = $(this).attr("correct-answer");
    $("#question-div").empty();

    if (selectedAnswer == correctAnswer) {
        $("#question-div").empty();
        var answerP = $("<h4></h4>").html("You answered correctly: " + questionArray[currentQuestion].correct_answer);
        $("#question-div").append(answerP);
        numberCorrectAnswers++;
    }
    else {
        var answerP = $("<h4></h4>").html("Wrong the correct answer is: " + questionArray[currentQuestion].correct_answer);
        $("#question-div").append(answerP);
        numberWrongAnswers++;
    }
    run2();  //start second timer       
}

function run() {
    clearInterval(intervalId);
    intervalId = setInterval(decrement, 1000);
    //prep for next game
    $("#counterDiv").hide().append('<h4><span id="counter"  show ></span></h4> ').fadeIn(3000);

}
function stop() {
    clearInterval(intervalId);
}

function run2() {
    clearInterval(intervalId2);
    intervalId2 = setInterval(decrement2, 1000);
}
function stop2() {
    clearInterval(intervalId2);
}

function decrement() {
    $("#counter").text("Time remaining: " + count + " seconds")

    if (count <= 0) {
        stop();
        $("#question-div").empty();
        var answerP = $("<h4></h4>").html("Out of time, the correct answer is: " + questionArray[currentQuestion].correct_answer);
        $("#question-div").append(answerP);
        numberWrongAnswers++;
        run2(); //wait 5 secs and start new ?
        return;
    }
    count = count - 1;
}

function decrement2() {

    if (count2 <= 0) {
        stop2();
        $("#question-div").empty();

        processNextQuestion();
        return;
    }
    count2 = count2 - 1;
}

function processNextQuestion() {
    // clearInterval(counter);
    currentQuestion++;
    count = 30;
    count2 = 5;
    processQuestion();
}
//click event for answer
$(document).on("click", ".clickAnswer", checkAnswers);

//used to shuffle answer array
function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


