
var responseToken;
var questionArray;
var intervalId;
var count = 30;
var totalNumberOfQuestions;
var currentQuestion = 0;

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
    startNewGame();
});

function startNewGame() {
    if (questionArray == []) {
        gameLoad();
    }
    totalNumberOfQuestions = questionArray.length; 
    $(".start-button").hide();
    processQuestion();
}

function processQuestion() {
    $("#question-div").empty(); 
    var questionP = $("<h4></h4>").html(questionArray[currentQuestion].question);
    $("#question-div").append(questionP)
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
    run(); //starts timer on each question    
}

function checkAnswers() {
    var selectedAnswer = $(this).html();
    var correctAnswer = $(this).attr("correct-answer");

    if (selectedAnswer == correctAnswer) {
        alert("this is correct")
    }
    else {
        alert("the answer is incorrect")
    }
}

function run() {
    clearInterval(intervalId);
    intervalId = setInterval(decrement, 1000);
}
function stop() {
    clearInterval(intervalId);
  }


function decrement() {

    $("#counter").text("Time remaining: " + count + " seconds");
    
    if (count <= 0) {        
        stop(); 
        $("#question-div").empty(); 

        var answerP = $("<h4></h4>").html("The correct answer is: " + questionArray[currentQuestion].correct_answer);
        $("#question-div").append(answerP); 

        clearInterval(counter);
        //counter ended, do something here
        processNextQuestion();
       
        return;
    }
    count = count - 1;    
} 


function processNextQuestion(){
    currentQuestion ++;
    count = 30;
    processQuestion();    
}
//click event for answer
$(document).on("click", ".clickAnswer", checkAnswers);

//used to shuffle answer array
function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};