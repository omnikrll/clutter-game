//constant values
const dpb = 16; //dice per bin
// const dpb = 6;
const dt = dpb * 6; //total number of dice
const diceValues = [4,6,8,10,12,20];
const endings = [
    {
        person: 'Eric Zimmerman',
        text: '"I need 200 decks of cards for Game Design 1!"',
        img: 'img/people/eric.jpg'
    },
    {
        person: 'Naomi Clark',
        text: '"The microphones in 640 are out of batteries!"',
        img: 'img/people/naomi.jpg'
    },
    {
        person: 'Clara Fernandez-Vara',
        text: '"I can\'t get into the microphone closet in lecture hall 202!"',
        img: 'img/people/clara.jpg'
    },
    {
        person: 'The Librarians',
        text: '"We can\'t get the Nintendo 64 to work!"',
        img: 'img/people/librarians.jpg'
    },
    {
        person: 'Shawn Pierre',
        text: '"Hey, can I borrow a MIDI controller?"',
        img: 'img/people/shawn.jpg'
    },
    {
        person: 'Ramiro Corbetta',
        text: '"I need to borrow all the webcams you have!"',
        img: 'img/people/ramiro.jpg'
    },
    {
        person: 'Ashley Guajardo',
        text: '"The smartboard in the Large Conference Room isn\'t working!"',
        img: 'img/people/ashley.jpg'
    },
    {
        person: 'Charles Pratt',
        text: '"Can I borrow a whiteboard eraser? There isn\'t one in 627."',
        img: 'img/people/charles.jpg'
    },
    {
        person: 'Mitu Khandaker',
        text: '"My Quest 3 headsets won\'t connect to the wifi, can you help?"',
        img: 'img/people/mitu.jpg'
    },
    {
        person: 'Jake Weidner',
        text: '"Do you have a webcam and a microphone I can borrow an Incubator meeting?"',
        img: 'img/people/jake.jpg'
    },
    {
        person: 'Logan Clare',
        text: '"It\'s time to set up for the lecture series, can you bring the camera and tripod down to 202?"',
        img: 'img/people/logan.jpg'
    }
];
//sounds
const pickupSound = new Audio('audio/pickup.wav');
const dropSound = new Audio('audio/drop.wav');
const recordScratch = new Audio('audio/record_scratch.wav');
const cheerSound = new Audio('audio/CrowdYay.wav');
const music = new Audio('audio/windowlicker.mp3');
//frequently referenced dom elements
const bins = document.querySelectorAll('.bin');
const timer = document.getElementById('timer');
const characterImage = document.getElementById('character-image');
const characterName = document.getElementById('character-name');
const characterText = document.getElementById('character-text');
const gameOverSummary = document.getElementById('game-over-summary');
const gameOverDialog = document.getElementById('game-over-dialog');
//mutable values
let timeLeft = 59;
// let timeLeft = 1;
let moves = 0;
let mistakes = 0;
let interval;

function generateRandomDie(faces) {
    let num;
    if ((Math.round(Math.random())) == 0) {
        num = faces;
    } else {
        num = diceValues[Math.floor(Math.random() * diceValues.length)];
    }

    const template = document.querySelector('#temp_' + num);

    return document.importNode(template.content, true);
}

function showMistakes() {
    bins.forEach((bin) => {
        let binMistakes = 0;
        for (const child of bin.children) {
            if (child.dataset.faces != bin.dataset.faces) {
                child.classList.add('bin-mistake');
                binMistakes++;
            }
        }

        if (binMistakes == 0) bin.classList.add('all-clear');
    });
}

function gameOver() {
    clearTimeout(interval);
    showMistakes();

    music.pause();
    music.currentTime = 0;

    const ending = endings[Math.floor(Math.random() * endings.length)];

    characterImage.src = ending.img;
    characterImage.alt = ending.person;
    characterName.textContent = ending.person + ':';
    characterText.textContent = ending.text;

    let summary = `You successfully sorted ${(moves - mistakes)} dice.`
    if (document.querySelectorAll('.all-clear').length == 6) {
        summary += ' Perfect score!'
        cheerSound.play();
    } else {
        recordScratch.play();
    }

    gameOverSummary.textContent = summary;

    gameOverDialog.showModal();
}

function countdown() {
    const prefix = timeLeft < 10 ? '00:0' : '00:'
    timer.innerHTML = prefix + timeLeft;

    if (timeLeft == 0) {
        gameOver();
    } else {
        timeLeft--;
    }
}

bins.forEach((bin) => {
    bin.addEventListener('dragover', (e) => {
        if (e.dataTransfer.types.includes('die')) {
            e.preventDefault();
        }
    });
    
    bin.addEventListener('drop', (e) => {
        e.preventDefault();

        const draggedDie = document.getElementById('dragged-die');
        draggedDie.remove();
        bin.appendChild(draggedDie);
        console.log(`${draggedDie.classList[1]} in ${bin.classList[1]} bin.`);

        if (draggedDie.dataset.lastParent == bin.id) {
            console.log('die not moved.');
        } else {
            moves++;
        }

        if (bin.classList.contains(draggedDie.classList[1])) {
            console.log(`correct. moved ${moves} dice so far`);
        } else {
            console.log(`incorrect. moved ${moves} dice so far`);
            mistakes++;
        }

        console.log(`${mistakes} mistakes`);
        dropSound.play();
    });


    for (let i=0; i<dpb; i++) {
        let die = generateRandomDie(bin.dataset.faces);
        bin.appendChild(die);
    }
});

//select dice after they have been generated
const dice = document.querySelectorAll('.die');

dice.forEach((die) => {
    die.style.backgroundPositionX = (Math.floor(Math.random() * 5) * 40) + 'px';

    die.addEventListener('dragstart', (e) => {
        die.id = 'dragged-die';
        die.dataset.lastParent = die.parentNode.id;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('die', '');

        pickupSound.play();
    });

    die.addEventListener('dragend', (e) => {
        die.removeAttribute('id');
        delete die.dataset.lastParent;
    });
});

document.getElementById('restart-button').addEventListener('click', (e) => {
    window.location.reload();
});

document.getElementById('start-button').addEventListener('click', (e) => {
    music.play();
    interval = setInterval(countdown, 1000);
    document.getElementById('start-dialog').close();
});

document.getElementById('start-dialog').showModal();