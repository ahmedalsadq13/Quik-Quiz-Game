const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const listItems = highScores.map(score=>`<li class="high-score"> ${score.name} - ${score.score} </li>`).join("");

highScoresList.innerHTML = listItems;

