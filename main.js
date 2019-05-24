const width = 800;
const height = 800;

const G = 9.80665e2;

const platformHeightCm = 20;
const pxPerCm = 15;
const diameterCm = 5;
const radiusCm = diameterCm / 2;
const groozikWidthCm = 2;
const groozikHeightCm = 1;
const stierdzenHeightCm = 20;
const stierdzenWidthCm = 0.2;
const threadInitialCm = 5;
const krestovinGrizikMassGram = 300;
const grizikMassGram = 200;
const forCenterHeightMargin = (radiusCm + stierdzenHeightCm + groozikHeightCm) * pxPerCm;
const forCenterWidthMargin = width / 2;

const maxDt = 20;

let dalachestb = document.getElementById("sDistance");

let distanceCm = dalachestb.value;

let draw = SVG('drawing').size(width, height);

let bg = draw.rect(width, height).fill('#FF0000');

// document.getElementById("data").style.margin += document.getElementById("picture").offsetWidth;

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
        krestovinGrooziky.push(draw.rect(stierdzenWidthCm * pxPerCm, stierdzenHeightCm * pxPerCm).fill('#FFFF00').cx(forCenterWidthMargin).y(forCenterHeightMargin - stierdzenHeightCm * pxPerCm));
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
        krestovinGrooziky[2*i + 1].cy(forCenterHeightMargin - distanceCm * pxPerCm).transform({rotation: a + 90 * i, cx: forCenterWidthMargin, cy: forCenterHeightMargin});
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
    Matter.Body.setInertia(centralPhyCirc, centralPhyCircInertia + 4 * distanceCm * distanceCm * krestovinGrizikMassGram);
    if (!isRunning) {
        isRunning = true;
        animFrame = requestAnimationFrame(callback);
    }
};

let m0 = document.getElementById("grizikMass");
let m = document.getElementById("krestovinGrizikMass");
let h = document.getElementById("height");
let R = document.getElementById("radius");
let value = document.getElementById("value");
let epsilon = document.getElementById("epsilon");
let timeValue = document.getElementById("time");
value.innerHTML = dalachestb.value;
m0.innerHTML = grizikMassGram;
m.innerHTML = krestovinGrizikMassGram;
h.innerHTML = platformHeightCm;
R.innerHTML = radiusCm;

dalachestb.oninput = function() {
    distanceCm = this.value;
    value.innerHTML = this.value;
    isRunning = false;
    display(0);
};

let isRunning = false;

function update(dt) {
    Matter.Body.applyForce(centralPhyCirc,{x : 0, y : radiusCm}, {x : -grizikMassGram * G / 2, y : 0});
    Matter.Body.applyForce(centralPhyCirc,{x : 0, y : -radiusCm}, {x : grizikMassGram * G / 2, y : 0});
    Matter.Engine.update(engine, dt);
    let a = centralPhyCirc.angle;
    if (Math.PI * a / 180 * radiusCm > platformHeightCm) {
        isRunning = false;
        const t = (Date.now() - startTime) / 1000;
        timeValue.innerHTML = t;
        epsilon.innerHTML = (2 * platformHeightCm / radiusCm / t / t).toPrecision(5);
    }
    display(a);
}

let lastTime = 0;
let animFrame;

function callback(ms) {
    let dt = ms - lastTime;
    while (isRunning && lastTime !== 0 && dt > 0) {
        update(Math.min(dt, maxDt) / 1000);
        dt -= maxDt;
    }

    if (isRunning) {
        lastTime = ms;
        animFrame = requestAnimationFrame(callback);
    } else {
        lastTime = 0;
    }
}

init();
