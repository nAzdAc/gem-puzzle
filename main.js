const body = document.querySelector('body'),
    title = document.createElement('div'),
    time = document.createElement('div'),
    steps = document.createElement('div'),
    pause = document.createElement('button'),
    soundButton = document.createElement('button'),
    field = document.createElement('div'),
    audio = document.createElement('audio'),
    popup = document.createElement('div'),
    popupFieldSize = document.createElement('div'),
    popupFieldSizeMenu = document.createElement('div'),
    menu = document.createElement('div'),
    start = document.createElement('button'),
    fieldSizeButton = document.createElement('button'),
    finish = document.createElement('div'),
    finishMenu = document.createElement('div'),
    congrats = document.createElement('div'),
    back = document.createElement('button'),
    resume = document.createElement('button');


const properties = {
    sound: false,
    running: false
}

    
    
field.className = 'field element-open';
popup.className = 'element-open popup';
menu.className = 'popup-menu';
popupFieldSize.className = 'popup';
popupFieldSizeMenu.className = 'popup-menu';
start.className = 'popup-item';
fieldSizeButton.className = 'popup-item';
finish.className = 'finish';
finishMenu.className = 'finish-menu';
congrats.className = 'congrats';
back.className = 'back-button';
title.className = 'title';
time.className = 'time';
steps.className = 'steps';
pause.className = 'pause';
soundButton.className = 'sound-button';
resume.className = 'popup-item';
resume.innerHTML = 'Resume';

body.append(title);
body.append(field);
body.append(popup);
body.append(audio);
body.append(popupFieldSize);
popupFieldSize.append(popupFieldSizeMenu);
popup.append(menu);
menu.append(start, fieldSizeButton);
body.append(finish);
finish.append(finishMenu);
finishMenu.append(congrats);
finishMenu.append(back);
title.append(time);
title.append(steps);
title.append(pause);
title.append(soundButton);

const createIconHTML = (src) => {
    return `<img src="${src}">`;
};



soundButton.innerHTML = createIconHTML("/assets/volume_off.png");

soundButton.addEventListener("click", () => {
    properties.sound = !properties.sound;
    properties.sound ? soundButton.innerHTML = createIconHTML("/assets/volume_up.png") : soundButton.innerHTML = createIconHTML("/assets/volume_off.png");
});

function playSound() {
    const audio = new Audio();
    audio.src = "/assets/tink.wav";
    audio.currentTime = 0;
    audio.play();
}

let cell;
let step = 0;
const cellSize = 100;


let clock = 0,
    secs = 0,
    mins = 0,
    tenth = 0;


start.textContent = "New Game";
back.textContent = "Go back";
steps.textContent = `Moves: 0`;
pause.textContent = "pause game";
time.textContent = `Time: ${mins}0:${secs}0:${tenth}0`;
fieldSizeButton.textContent = 'Field Size';


fieldSizeButton.addEventListener("click", () => {
    popup.classList.remove("element-open");
    popupFieldSize.classList.add('element-open');
    for(let i = 3; i < 9; i++) {
        const sizeButton = document.createElement('button');
        sizeButton.className = "popup-item";
        const value = `${i} x ${i}`;
        sizeButton.innerHTML = value;

        popupFieldSizeMenu.append(sizeButton)
    }
    popupFieldSizeMenu.append(back);
    
});

start.addEventListener("click", () => {
    clear();
    properties.running = true;
    clock = 0;
    step = 0;
    steps.textContent = `Moves: ${step}`;
    time.innerHTML = `Time: ${mins}:${secs}:${tenth}`;
    popup.classList.remove("element-open");
    createStart();
    showTime();
});

function showTime() {
    if (properties.running) {
        setTimeout(function () {

            clock += 1;
            secs = Math.floor(clock / 10 % 60)
            mins = Math.floor(clock / 10 / 60);
            tenth = Math.floor(clock % 10);
            if (mins < 10) {
                mins = "0" + mins;
            }
            if (secs < 10) {
                secs = "0" + secs;
            }
            time.innerHTML = `Time: ${mins}:${secs}:${tenth}`;
            showTime();
        }, 100)
    }
}


const empty = {
    value: 0,
    top: 0,
    left: 0
};

const cells = [];
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
function createStart() {
    
    body.append(field)
    
    cells.push(empty);
    let randomNumber = getRandomInt(8);

const numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);

    for (let i = 1; i <= 15; i++) {
        
        cell = document.createElement('div');
        cell.className = "cell element-open";
        const value = numbers[i - 1] + 1;
        cell.innerHTML = value;
        
        
        let src = `/assets/images${randomNumber}/${value}.png`;
        cell.style.backgroundImage = `url(${src})`;
        cell.style.backgroundSize = 'cover';
        
        const left = (i % 4);
        const top = (i - left) / 4;

        cells.push({
            value: value,
            left: left,
            top: top,
            element: cell
        })

        cell.style.left = `${left * cellSize}px`;
        cell.style.top = `${top * cellSize}px`;

        field.appendChild(cell);

        cell.addEventListener('click', () => {
            if (properties.sound) {
                playSound()
            };
          
            
            move(i);

        });
    }
}


function move(index) {
    const cell = cells[index];
    const leftDiff = Math.abs(empty.left - cell.left);
    const topDiff = Math.abs(empty.top - cell.top);

    if (leftDiff + topDiff > 1) {
        return;
    }
    const emptyLeft = empty.left;
    const emptyTop = empty.top;

    cell.element.style.left = `${emptyLeft * cellSize}px`;
    cell.element.style.top = `${emptyTop * cellSize}px`;

    empty.left = cell.left;
    empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;
    
    step++;
    steps.textContent = `Moves: ${step}`;


    const isFinished = cells.every(cell => {
    
        return cell.value === cell.top * 4 + cell.left;
    });

    if (isFinished) {
        properties.running = false;
        congrats.textContent = `Ура! Вы решили головоломку за ${mins}:${secs} и ${step} ходов`;
        finish.classList.add("element-open");
    }
}

function clear() {
    while (field.firstChild) {
        field.removeChild(field.firstChild);
    }
}


back.addEventListener("click", () => {
    
    popupFieldSize.classList.remove("element-open");
    finish.classList.remove("element-open");
    popup.classList.add("element-open");

});

pause.addEventListener("click", () => {
    popup.classList.add("element-open");
    
    popup-menu.append(resume)
})

resume.addEventListener('click', () => {

    popup.classList.remove("element-open");
})