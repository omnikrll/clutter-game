const dieValues = [4,6,8,10,12,20];
const dpb = 16; //dice per bin
const dt = dpb * 6; //total number of dice
const bins = document.querySelectorAll(".bin");
const timer = document.getElementById("timer");
const endings = [
    'Eric Zimmerman says, "I need 200 decks of cards for Game Design 1!"',
    'Naomi Clark says, "The microphones in 640 are out of batteries!"',
    'Clara Fernandez-Vara says, "I can\'t get into the microphone closet in lecture hall 202!"',
    'The Librarians say, "We can\'t get the Nintendo 64 to work!"',
    'Shawn Pierre says, "I need to borrow a MIDI controller!"',
    'Ramiro Corbetta says, "I need to borrow all the webcams you have!"',
    'Ashley Guajardo says, "The smartboard in the Large Conference Room isn\'t working!"',
    'Charles Pratt says, "Can I borrow a whiteboard eraser? There isn\'t one in 627."',
    'John Hwang says, "Do you have a webcam and a microphone I can borrow for the fulltimers meeting?"',
    'Logan Clare says, "It\'s time to set up for the lecture series, can you bring the camera and tripod down to 202?"'
];
// let timeLeft = 1;
let timeLeft = 59;
let moves = 0;
let mistakes = 0;


function generateRandomDie(faces) {
    let num;
    if ((Math.round(Math.random())) == 0) {
        num = faces;
    } else {
        num = dieValues[Math.floor(Math.random() * dieValues.length)];
    }

    const template = document.querySelector("#temp_" + num);

    return document.importNode(template.content, true);
}

function countdown() {
    const prefix = timeLeft < 10 ? "00:0" : "00:"
    timer.innerHTML = prefix + timeLeft;
    if (timeLeft == 0) {
        clearTimeout(interval);
        const ending = endings[Math.floor(Math.random() * endings.length)];
        alert(ending + "\n\nYou successfully sorted " + (moves - mistakes) + " out of " + dt + " dice.\n\nRefresh the page to play again.")
    } else {
        timeLeft--;
    }
}

bins.forEach((bin) => {
    bin.addEventListener("dragover", (e) => {
        if (e.dataTransfer.types.includes("die")) {
            e.preventDefault();
        }
    });
    
    bin.addEventListener("drop", (e) => {
        e.preventDefault();

        const draggedDie = document.getElementById("dragged-die");
        draggedDie.remove();
        bin.appendChild(draggedDie);
        console.log(draggedDie.classList[1] + " in " + bin.classList[1] + " bin");
        moves++;

        if (bin.classList.contains(draggedDie.classList[1])) {
            console.log("correct. moved " + moves + " dice so far");
            console.log(mistakes + " mistakes");
        } else {
            console.log("incorrect. moved " + moves + " dice so far");
            mistakes++;
            console.log(mistakes + " mistakes");
        }
    });


    for (let i=0; i<dpb; i++) {
        let die = generateRandomDie(bin.dataset.faces);
        bin.appendChild(die);
    }
});

const dice = document.querySelectorAll(".die");

dice.forEach((die) => {
    die.addEventListener("dragstart", (e) => {
        die.id = "dragged-die";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("die", "");
    });

    die.addEventListener("dragend", (e) => {
        die.removeAttribute("id");
    });
});

alert("You have one minute to sort the dice.");

const interval = setInterval(countdown, 1000);