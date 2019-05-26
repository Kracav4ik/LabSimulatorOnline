const width = 1200;
const height = 800;

const G = 9.80665e2;

const platformHeightCm = 20;
const pxPerCm = 15;
const diameterCm = 5;
const radiusCm = diameterCm / 2;
const groozikWidthCm = 3;
const groozikHeightCm = 2;
const stierdzenHeightCm = 20;
const stierdzenWidthCm = 0.4;
const threadInitialCm = 5;
const threadWidthCm = 0.4;
const krestovinGrizikMassGram = 300;
const grizikMassGram = 200;
const forCenterMargin = (diameterCm + stierdzenHeightCm + groozikHeightCm) * pxPerCm;

const blockLeft = forCenterMargin + 350;
const blockTop = forCenterMargin - 200;
const blockDiameterCm = diameterCm * 0.4;

const joinerThreadLength = 402;
const joinerThreadRotation = 243.5;

const maxDt = 20;

let dalachestb = document.getElementById("sDistance");

let distanceCm = dalachestb.value;

let draw = SVG('drawing').size(width, height);

let bg = draw.image("bg.png", width, height);

// document.getElementById("data").style.margin += document.getElementById("picture").offsetWidth;

let thread1;
let thread2;
let freeGroozik;
let krestovinGrooziky = [];
let shkiv;
let block;

function cylinderMass(p, r, h) {
    return p * Math.PI * r * r * h;
}

function cylinderInertia(m, r, l) {
    return m * r * r / 4 + m * l * l / 12;
}

const threadTransform = {x : blockLeft + (blockDiameterCm/2 - threadWidthCm) * pxPerCm, y : blockTop};

const threadPattern = draw.pattern(6, 21, function(add) {
    add.image("thread.png");
});
const joinerThreadPattern = draw.pattern(6, 21, function(add) {
    add.image("thread.png");
}).x(forCenterMargin + (radiusCm - threadWidthCm) * pxPerCm);

function init() {
    thread1 = draw.rect().fill(threadPattern).transform(threadTransform);
    thread2 = draw.rect(threadWidthCm * pxPerCm, joinerThreadLength).fill(joinerThreadPattern)
        .x(forCenterMargin + (radiusCm - threadWidthCm) * pxPerCm).y(forCenterMargin)
        .transform({cx: forCenterMargin, cy: forCenterMargin, rotation: joinerThreadRotation});

    freeGroozik = draw.image("gruzik.png", groozikWidthCm * pxPerCm, groozikHeightCm * pxPerCm)
        .cx(blockLeft + (blockDiameterCm/2 - threadWidthCm / 2) * pxPerCm);

    const stierdzenPattern = draw.pattern(22, 162, function(add) {
        add.image("stierdzen.png")
    }).x(-stierdzenWidthCm / 2 * pxPerCm);

    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky.push(draw.rect(stierdzenWidthCm * pxPerCm, stierdzenHeightCm * pxPerCm).fill(stierdzenPattern).cx(forCenterMargin).y(forCenterMargin - stierdzenHeightCm * pxPerCm));
        krestovinGrooziky.push(draw.image("gruzik.png", groozikWidthCm * pxPerCm, groozikHeightCm * pxPerCm).cx(forCenterMargin));
    }

    const shkivPattern = draw.pattern(diameterCm * pxPerCm, diameterCm * pxPerCm, function(add) {
        add.image("shkiv.png")
    }).cx(forCenterMargin).cy(forCenterMargin);

    shkiv = draw.circle(diameterCm * pxPerCm).fill(shkivPattern).cx(forCenterMargin).cy(forCenterMargin);

    const blockPattern = draw.pattern(blockDiameterCm * pxPerCm, blockDiameterCm * pxPerCm, function(add) {
        add.image("block.png").transform({scale: blockDiameterCm / diameterCm / 2})
    }).cx(blockLeft).cy(blockTop);
    block = draw.circle(blockDiameterCm * pxPerCm).fill(blockPattern).cx(blockLeft).cy(blockTop);

    display(0);
}

function display(a) {
    thread1.size(threadWidthCm * pxPerCm, (threadInitialCm + a / 180 * Math.PI * radiusCm) * pxPerCm);
    freeGroozik.cy(blockTop + (threadInitialCm + a / 180 * Math.PI * radiusCm) * pxPerCm);
    threadPattern.cy((a / 180 * Math.PI * radiusCm) * pxPerCm);
    joinerThreadPattern.cy((a / 180 * Math.PI * radiusCm) * pxPerCm);
    shkiv.transform({rotation: a});
    block.transform({rotation: a / blockDiameterCm * diameterCm});
    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky[2*i].transform({rotation: a + 90 * i, cx: forCenterMargin, cy: forCenterMargin});
        krestovinGrooziky[2*i + 1].cy(forCenterMargin - distanceCm * pxPerCm).transform({rotation: a + 90 * i, cx: forCenterMargin, cy: forCenterMargin});
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
