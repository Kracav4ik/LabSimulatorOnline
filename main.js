const width = 1080;
const height = 1540;

const G = 9.80665e2;

const pxPerCm = 37.5;
const diameterCm = 5;
const radiusCm = diameterCm / 2;
const topMargin = 300;
const groozikWidthCm = 2;
const groozikHeightCm = 1;
const forCenterHeightMargin = diameterCm * pxPerCm + topMargin;
const forCenterWidthMargin = width / 2;
const stierdzenHeightCm = 10;
const stierdzenWidthCm = 0.2;
const threadInitialCm = 5;
const gruzikMassGram = 300;
const forceMassGram = 200;

let dalachestb = document.getElementById("sDistance");

let distanceCm = dalachestb.value;

let draw = SVG('drawing').size(width, height);

let bg = draw.rect(width, height).fill('#FF0000');

let thread;
let freeGroozik;
let krestovinGrooziky = [];

function cylinderMass(p, r, h) {
    return p * Math.PI * r * r * h;
}

function cylinderInertia(m, r, l) {
    return m * r * r / 4 + m * l * l / 12;
}


function init() {
    thread = draw.line(forCenterWidthMargin + radiusCm * pxPerCm, forCenterHeightMargin, forCenterWidthMargin + radiusCm * pxPerCm, forCenterHeightMargin + threadInitialCm * pxPerCm).stroke({color: '#8000FF', width: 2});
    freeGroozik = draw.rect(groozikWidthCm * pxPerCm, groozikHeightCm * pxPerCm).fill('#FF00FF').cx(forCenterWidthMargin + radiusCm * pxPerCm);

    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky.push(draw.rect(stierdzenWidthCm * pxPerCm, stierdzenHeightCm * pxPerCm).fill('#FFFF00').cx(forCenterWidthMargin).y(stierdzenHeightCm * pxPerCm - topMargin));
        krestovinGrooziky.push(draw.rect(groozikWidthCm * pxPerCm, groozikHeightCm * pxPerCm).fill('#000000').cx(forCenterWidthMargin));
    }

    draw.ellipse(diameterCm * pxPerCm, diameterCm * pxPerCm).fill('#00FF00').cx(forCenterWidthMargin).cy(forCenterHeightMargin);

    display(0);
}

function display(a) {
    thread.size(2, (threadInitialCm + a / 180 * Math.PI * radiusCm) * pxPerCm);
    freeGroozik.cy(forCenterHeightMargin + (threadInitialCm + a / 180 * Math.PI * radiusCm) * pxPerCm);

    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky[2*i].transform({rotation: a + 90 * i, cx: forCenterWidthMargin, cy: forCenterHeightMargin});
        krestovinGrooziky[2*i + 1].cy(forCenterHeightMargin - groozikHeightCm * pxPerCm / 2 - distanceCm * pxPerCm).transform({rotation: a + 90 * i, cx: forCenterWidthMargin, cy: forCenterHeightMargin});
    }
}

let engine = Matter.Engine.create();

let centralPhyCirc = Matter.Bodies.circle(0, 0, radiusCm, {density : 1, friction: 0, frictionStatic: 0, frictionAir: 0});

Matter.World.add(engine.world, centralPhyCirc);

let start = document.getElementById("bStart");
let stop = document.getElementById("bStop");
let startTime = Date.now();
let cMass = cylinderMass(7.7, radiusCm, 2);
Matter.Body.setMass(centralPhyCirc, cMass);
let centralPhyCircInertia = cylinderInertia(cMass, radiusCm, 2);

stop.onclick = function() {
    display(0);
    isRunning = false;
};
start.onclick = function() {
    startTime = Date.now();
    Matter.Body.setAngularVelocity(centralPhyCirc,0);
    Matter.Body.setAngle(centralPhyCirc, 0);
    Matter.Body.setInertia(centralPhyCirc, centralPhyCircInertia + 4 * distanceCm * distanceCm * gruzikMassGram);
    if (!isRunning) {
        isRunning = true;
        animFrame = requestAnimationFrame(callback);
    }
};

let value = document.getElementById("value");
let timeValue = document.getElementById("time");
value.innerHTML = dalachestb.value;

dalachestb.oninput = function() {
    distanceCm = this.value;
    value.innerHTML = this.value;
    isRunning = false;
    display(0);
};

let isRunning = false;

function update(dt) {
    Matter.Body.applyForce(centralPhyCirc,{x : 0, y : radiusCm}, {x : -forceMassGram * G / 2, y : 0});
    Matter.Body.applyForce(centralPhyCirc,{x : 0, y : -radiusCm}, {x : forceMassGram * G / 2, y : 0});
    Matter.Engine.update(engine, dt);
    let a = centralPhyCirc.angle;
    if (Math.PI * a / 180 * radiusCm > 20) {
        isRunning = false;
        timeValue.innerHTML = (Date.now() - startTime) / 1000;
    }
    display(a);
}

let lastTime = 0;
let animFrame;

function callback(ms) {
    if (isRunning && lastTime !== 0) {
        update((ms - lastTime) / 1000);
    }

    if (isRunning) {
        lastTime = ms;
        animFrame = requestAnimationFrame(callback);
    } else {
        lastTime = 0;
    }
}

init();
