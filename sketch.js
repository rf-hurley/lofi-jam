const CANVASX = 1200;
const CANVASY = 900;
let animation = [];
let jewelAnimation = [];
let seshAnimation = [];
let inuyasha, jewel, sesshomaru, size, spritedata, spritesheet, jeweldata, jewelsheet, bass, mid, treble, BG, bgImage, music;
const jewelY = 500

const NUMROWS = 45;
const NUMCOLS = 60;
const BOXSIZE = 20;
let spectrumCounter = 0;
let boxes = make2DArray(NUMROWS, NUMCOLS);

function preload(){
    spritedata = loadJSON('inuyasha.json');
    spritesheet = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019670/final-project-assets/inuyasha_ihbiab.png');
    jeweldata = loadJSON('jewel.json');
    jewelsheet = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019670/final-project-assets/jewel_f1asfs.png');
    seshdata = loadJSON('sesshomaru.json');
    seshsheet = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019670/final-project-assets/sesshomaru_myypr1.png');

    shrine = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019671/final-project-assets/shrine_mzskea.png');
    castle = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019670/final-project-assets/castle_nf47va.png');
    house = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019670/final-project-assets/house_inhflv.png');
    sunset = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019671/final-project-assets/sunset_exmtzg.png');
    wellhouse = loadImage('https://res.cloudinary.com/dwazrafwg/image/upload/v1607019671/final-project-assets/wellhouse_pqzvfa.png')

    music = loadSound('fairytale.mp3');
  }

function setup(){
    createCanvas(CANVASX, CANVASY);

    

    angleMode(DEGREES);
    frameRate(12);
    // newInput();
    fft = new p5.FFT();
    // fft.setInput(music);
    amp = new p5.Amplitude;
    amp.setInput(music);
    // fill(255);
    // stroke(0);
    //animate the sprite sheet
    makeAnimation();
    inuyasha = new Sprite(animation, 300, 650, 200, 10);
    push();
    makeJewelAnimation();
    jewel = new Sprite (jewelAnimation, 600, jewelY, 100, 10);
    pop();
    push();
    makeSeshAnimation();
    sesshomaru = new Sprite(seshAnimation, 900, 640, 210, 10);
    pop();

    for(let i = 0; i<NUMROWS; i++){
        for(let j = 0; j < NUMCOLS; j++){
          boxes[i][j] = new SoundBox(j*BOXSIZE, i*BOXSIZE, BOXSIZE, BOXSIZE);
        }
      }
}

function draw(){
    textFont("Courier New");
    textSize(50);
    stroke(255);
    fill(255);
    
    
    
    drawGame();

}

function mousePressed() { 
    getAudioContext().resume();
    console.log('clickStarted')
    let playing = music.isLooping();
    if (playing == false) {   
      playMusic();
    } else if (playing == true) {
      pauseMusic();
    }
    // Set the value of fullscreen 
    // into the variable 
    let fs = fullscreen(); 
    // Call to fullscreen function 
    fullscreen(!fs);  
} 
  
function playMusic() {
  music.loop();
} 
  
function pauseMusic() {
  music.pause();
}

function newInput(){
    input = new p5.AudioIn();
    input.start();
    console.log('audio has begun')

  }

function makeAnimation() {
    let frames = spritedata.frames;
    for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }
}

function makeJewelAnimation() {
    let frames = jeweldata.frames;
    for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = jewelsheet.get(pos.x, pos.y, pos.w, pos.h);
    jewelAnimation.push(img);
  }
}

function makeSeshAnimation() {
    let frames = seshdata.frames;
    for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = seshsheet.get(pos.x, pos.y, pos.w, pos.h);
    seshAnimation.push(img);
  }
}

function drawGame() {
    background(0);
    changeBackground(); 
    displayCharacters();
}

function displayCharacters(){
    
    spectrum = fft.analyze();
    bass = fft.getEnergy("bass");
    mid = fft.getEnergy("mid");
    treble = fft.getEnergy("treble");

    for(let i = 0; i<NUMROWS; i++){
        for(let j = 0; j < NUMCOLS; j++){
          boxes[i][j].display();
          const spectrumValue = spectrum[spectrumCounter%1024]
        //   const Rval = map(spectrumValue, 0, 255, 0, 100);
        //   const Gval = map(spectrumValue, 0, )
        //   const Bval = map(spectrumValue, 0, 100, 0, 255);

          boxes[i][j].update(spectrumValue); 
          
          // theta += 0.00001;
          spectrumCounter++;
        }
      }

    let threshold = 0.02;
    // let volume = input.getLevel();
    let volume = amp.getLevel();
        // console.log(volume);
    if (volume > threshold) {

    bass = map(bass, 1, 255, 200, 300);
    treble = map(treble, 1, 255, 100, 300);
    // mid = map(mid, 1, 255, 200, 300);
    yvalue = map(volume, 0.001, 0.5, 0, 500)

    inuyasha.show(bass);
    inuyasha.update();
    jewel.show(treble);
    jewel.update();
    jewel.move(jewelY - yvalue);
    sesshomaru.show(bass);
    sesshomaru.update();

    } else {
    inuyasha.show();
    jewel.show();
    sesshomaru.show();
    }
}

function changeBackground() {
    if (key == "1") {
        background(shrine);
    };
    if (key == "2") {
        background(castle);
    }
    if (key == "3") {
        background(house);
    };
    if (key == "4") {
        background(sunset);
    }
    if (key == "5") {
        background(wellhouse);
    };
    if (key == "6") {
        background(255);
    }
}

function make2DArray(rows, cols){
    let arr = new Array(rows);
    for(let i = 0; i < arr.length; i++){
        arr[i] = new Array(cols)
    }
    return arr
  }

  class SoundBox {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      // this.z = z;
      this.w = w;
      this.h = h;
      // this.d = d;
      this.fill = [random(255), random(255), random (255), 150];
    }
    update(val){
      // this.d = val*10;
      this.fill = [val, val, 255-val, 100];
    }
    display(){
      push()
      // translate(this.x, this.y, this.z);
      stroke(0,0,0,0);
      fill(this.fill);
      rect(this.x, this.y, this.w, this.h);
      pop()
    }
  }
  