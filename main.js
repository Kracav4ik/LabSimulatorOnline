const width = 720;
const height = 640;
const centerMarginLeft = 320;
const centerMarginTop = 320;

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

const blockLeft = centerMarginLeft + 350;
const blockTop = centerMarginTop - 200;
const blockDiameterCm = diameterCm * 0.4;

const joinerThreadLength = 402;
const joinerThreadRotation = 243.5;

const maxDt = 9;

let dalachestb = document.getElementById("sDistance");

let distanceCm = dalachestb.value;

let draw = SVG('drawing').size(width, height);

draw.image("bg.jpg", width, height);
draw.image("ruler.jpg").x(blockLeft - 35).y(blockTop + 90);
draw.image("shtativ.png").x(300);

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
}).x(centerMarginLeft + (radiusCm - threadWidthCm) * pxPerCm);

function init() {
    thread1 = draw.rect().fill(threadPattern).transform(threadTransform);
    thread2 = draw.rect(threadWidthCm * pxPerCm, joinerThreadLength).fill(joinerThreadPattern)
        .x(centerMarginLeft + (radiusCm - threadWidthCm) * pxPerCm).y(centerMarginTop)
        .transform({cx: centerMarginLeft, cy: centerMarginTop, rotation: joinerThreadRotation});

    freeGroozik = draw.image("gruzik.png", groozikWidthCm * pxPerCm, groozikHeightCm * pxPerCm)
        .cx(blockLeft + (blockDiameterCm/2 - threadWidthCm / 2) * pxPerCm);

    const stierdzenPattern = draw.pattern(22, 162, function(add) {
        add.image("stierdzen.png")
    }).x(-stierdzenWidthCm / 2 * pxPerCm);

    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky.push(draw.rect(stierdzenWidthCm * pxPerCm, stierdzenHeightCm * pxPerCm).fill(stierdzenPattern).cx(centerMarginLeft).y(centerMarginTop - stierdzenHeightCm * pxPerCm));
        krestovinGrooziky.push(draw.image("gruzik.png", groozikWidthCm * pxPerCm, groozikHeightCm * pxPerCm).cx(centerMarginLeft));
    }

    const shkivPattern = draw.pattern(diameterCm * pxPerCm, diameterCm * pxPerCm, function(add) {
        add.image("shkiv.png")
    }).cx(centerMarginLeft).cy(centerMarginTop);

    shkiv = draw.circle(diameterCm * pxPerCm).fill(shkivPattern).cx(centerMarginLeft).cy(centerMarginTop);

    const blockPattern = draw.pattern(blockDiameterCm * pxPerCm, blockDiameterCm * pxPerCm, function(add) {
        add.image("block.png").transform({scale: blockDiameterCm / diameterCm / 2})
    }).cx(blockLeft).cy(blockTop);
    block = draw.circle(blockDiameterCm * pxPerCm).fill(blockPattern).cx(blockLeft).cy(blockTop);

    display(0);
}

function display(a) {
    thread1.size(threadWidthCm * pxPerCm, (threadInitialCm + a * radiusCm) * pxPerCm);
    freeGroozik.cy(blockTop + (threadInitialCm + a * radiusCm) * pxPerCm);
    threadPattern.cy((a * radiusCm) * pxPerCm);
    joinerThreadPattern.cy((a * radiusCm) * pxPerCm);
    const aDeg = a / Math.PI * 180;
    shkiv.transform({rotation: aDeg});
    block.transform({rotation: aDeg / blockDiameterCm * diameterCm});
    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky[2*i].transform({rotation: aDeg + 90 * i, cx: centerMarginLeft, cy: centerMarginTop});
        krestovinGrooziky[2*i + 1].cy(centerMarginTop - distanceCm * pxPerCm).transform({rotation: aDeg + 90 * i, cx: centerMarginLeft, cy: centerMarginTop});
    }
}

let engine = Matter.Engine.create({world: Matter.World.create({gravity: {x: 0, y: 0}})});

let centralPhyCirc = Matter.Bodies.circle(0, 0, radiusCm, {density : 1, friction: 0, frictionStatic: 0, frictionAir: 0});

Matter.World.add(engine.world, centralPhyCirc);

let start = document.getElementById("bStart");
let stop = document.getElementById("bStop");
let startTime = Date.now();
let cMass = cylinderMass(7.7, radiusCm, 3);
let centralPhyCircInertia = cMass * radiusCm * radiusCm / 2;
let stierdzenInertia = cylinderInertia(cMass/10, stierdzenWidthCm / 2, 2 * stierdzenHeightCm);

stop.onclick = function() {
    display(0);
    isRunning = false;
};
start.onclick = function() {
    startTime = Date.now();
    Matter.Body.setAngularVelocity(centralPhyCirc,0);
    Matter.Body.setAngle(centralPhyCirc, 0);
    Matter.Body.setInertia(centralPhyCirc, centralPhyCircInertia + 2 * stierdzenInertia + 4 * distanceCm * distanceCm * krestovinGrizikMassGram);
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
    if (a * radiusCm > platformHeightCm) {
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
