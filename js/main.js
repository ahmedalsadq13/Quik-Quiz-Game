const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const homePage = document.getElementById("homePage") ;
const docHead = document.head;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = []; 

/* This Code for favicon at all pages */
if(docHead.title != `Quick Quiz`){
    docHead.innerHTML +=`
        <link rel="apple-touch-icon" sizes="180x180" href="../images/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon//favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon//favicon-16x16.png">       
        ${console.log('Second done')}
    `
}
fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
    .then(res=>{
    return res.json();
    })
    .then(loadingQuestions =>{
        
        console.log(loadingQuestions.results);
        questions = loadingQuestions.results.map(loadedQuestion =>{
            const foramttedQuestion = {
                question: loadedQuestion.question
            }
            const answerChoices = [... loadedQuestion.incorrect_answers];
            foramttedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(foramttedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
            answerChoices.forEach((choice, index)=>{
                foramttedQuestion["choice" + (index+1)] = choice;
            })

            return foramttedQuestion;
        });
        
        startGame()
    })
    .catch(err=>{
        console.log(err);
    })

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
startGame = ()=> {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}
getNewQuestion = ()=> {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        // Go to the end page
        return window.location.assign('../pages/end.html')
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} / ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice =>{
       const number =  choice.dataset['number'];
       choice.innerText = currentQuestion['choice' + number];

    });
    availableQuestions.splice(questionIndex, 1)
    acceptingAnswers = true
};
choices.forEach(choice=>{
    choice.addEventListener('click', e=>{
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if(classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion()

        }, 1000)
    });    
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

