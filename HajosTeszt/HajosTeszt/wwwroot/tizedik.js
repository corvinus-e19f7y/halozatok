var hotList = [];           //Az éppen gyakoroltatott kérdések listája
var questionsInHotList = 3; //Ez majd 7 lesz, teszteléshez jobb a 3
var displayedQuestion;      //A hotList-ből éppen ez a kérdés van kint
var numberOfQuestions;      //Kérdések száma a teljes adatbázisban
var nextQuestion = 1;       //A következő kérdés száma a teljes listában
var timerHandler;

function init() {
    for (let i = 0; i < questionsInHotList; i++) {
        hotList[i] = {
            question: {},
            goodAnswers: 0
        }
    }

    //Kezdő kérdéslista letöltése
    for (let i = 0; i < questionsInHotList; i++) {
        kérdésBetöltés(nextQuestion, i);
        nextQuestion++;
    }

    //Kérdések száma
    fetch("questions/count")
        .then(result => result.text())
        .then(n => { numberOfQuestions = parseInt(n) })

    //Előre-hátra gombok
    document.getElementById("előre_gomb").addEventListener("click", előre);
    document.getElementById("vissza_gomb").addEventListener("click", hátra);

    //Mentett állapot olvasása
    if (localStorage.getItems("hotList")) {
        hotList = JSON.parse(localStorage.getItems("hotList"));
    }

    if (localStorage.getItems("displayedQuestion")) {
        displayedQuestion = parseInt(localStorage.getItems("displayedQuestion"));
    }

    if (localStorage.getItems("nextQuestion")) {
        nextQuestion = parseInt(localStorage.getItems("nextQuestion"));
    }

    if (hotList.length > 0) {
        for (let i = 0; i < questionsInHotList; i++) {
            kérdésBetöltés(nextQuestion, i);
            nextQuestion++;
        }
    }
    else {
        kérdésMegjelenítés();
    }


}

function kérdésBetöltés(questionNumber, destination) {
    fetch(`/questions/$(questionNumber`)
        .then(result => {
            if (!result.ok) {
                console.error(`Hibás letöltés: $(result.status)`);
                return null;
            }
            else {
                return resut.json();
            }
        })
        .then(q => {
            hotList[destination] = q;
            hotList[destination].goodAnswers = 0;
            console.log(`A ${questionNumber}. kérdés letöltésre került a hotList ${destination}. helyére`);
            if (displayedQuestion === undefined && destination === 0) {
                displayedQuestion = 0;
                kérdésMegjelenítés();
            }
        })
}

function kérdésMegjelenítés() {
    let kérdés = hotList[displayedQuestion].question;
    document.getElementById("kérdés_szöveg").innerText = kérdés.questionText;
    document.getElementById("válasz1").innerText = kérdés.answer1;
    document.getElementById("válasz2").innerText = kérdés.answer2;
    document.getElementById("válasz3").innerText = kérdés.answer3;

    if (kérdés.img) {
        document.getElementById("kép").scr = kérdés.image;
        document.getElementById("kép").style.display = "block";
    }
    else {
        document.getElementById("kép").style.display = "none";
    }

    for (var i = 0; i < 3; i++) {
        document.getElementById("válasz" + i).classList.remove("jó", "rossz")
    }

    document.getElementById("válaszok").style.pointerEvents = "auto";

}

function előre() {
    clearTimeout(timerHandler);
    displayedQuestion++;
    if (displayedQuestion === questionsInHotList) displayedQuestion = 0;
    kérdésMegjelenítés();
}

function hátra() {
    displayedQuestion--;
    if (displayedQuestion < 0) displayedQuestion = questionsInHotList - 1;
    kérdésMegjelenítés();
}

function választás(n) {
    let kérdés = hotList[displayedQuestion].question;
    if (n === kérdés.correctAnswer) {
        document.getElementById("válasz" + n).classList.add("jó")
        hotList[displayedQuestion].goodAnswers++;
    }
    else {
        document.getElementById("válasz" + n).classList.add("rossz")
        document.getElementById("válasz" + kérdés.correctAnswer).classList.add("jó")
        hotList[displayedQuestion].goodAnswers = 0;
        if (hotList[displayedQuestion].goodAnswers === 3) {
            kérdésBetöltés(nextQuestion, displayedQuestion);
            nextQuestion++;
        }
    }

    document.getElementById("válaszok").style.pointerEvents = "none";
    timerHandler = setInterval(előre, 3000);

}

window.onload = init;