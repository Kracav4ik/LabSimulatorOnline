const width = 420;
const height = 640;
const diameter = 75;
const radius = diameter / 2;
const topMargin = 75;
const groozikWidth = 75;
const groozikHeight = 30;
const forCenterHeightMargin = diameter + topMargin;
const forCenterWidthMargin = width / 2;
const stierdzenWidth = 10;
const threadInitial = 200;

let draw = SVG('drawing').size(width, height);

let bg = draw.rect(width, height).fill('#FF0000');

let thread;
let freeGroozik;
let krestovinGrooziky = [];

function init(d) {
    thread = draw.line(forCenterWidthMargin + radius, forCenterHeightMargin, forCenterWidthMargin + radius, forCenterHeightMargin + threadInitial).stroke({color: '#8000FF', width: 2});
    freeGroozik = draw.rect(groozikWidth, groozikHeight).fill('#FF00FF').cx(forCenterWidthMargin + radius);

    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky.push(draw.rect(stierdzenWidth, forCenterHeightMargin).fill('#FFFF00').cx(forCenterWidthMargin));
        krestovinGrooziky.push(draw.rect(groozikWidth, groozikHeight).fill('#000000').cx(forCenterWidthMargin).cy(topMargin - d));
    }

    draw.ellipse(diameter, diameter).fill('#00FF00').cx(forCenterWidthMargin).cy(forCenterHeightMargin);
}

function display(a) {
    thread.size(2, threadInitial + a / 180 * Math.PI * radius);
    freeGroozik.cy(forCenterHeightMargin + threadInitial + a / 180 * Math.PI * radius);

    for (let i = 0; i < 4; ++i) {
        krestovinGrooziky[2*i].transform({rotation: a + 90 * i, cx: forCenterWidthMargin, cy: forCenterHeightMargin});
        krestovinGrooziky[2*i + 1].transform({rotation: a + 90 * i, cx: forCenterWidthMargin, cy: forCenterHeightMargin});
    }
}

let engine = Matter.Engine.create();

let centralPhyCirc = Matter.Bodies.circle(0, 0, radius, {density : 1});
centralPhyCirc.frictionAir = 0;

Matter.World.add(engine.world, centralPhyCirc);

let start = document.getElementById("bStart");

start.onclick = function() {
    Matter.Body.setAngularVelocity(centralPhyCirc,1);
    Matter.Body.setAngle(centralPhyCirc, 0);
    isRunning = true;
    animFrame = requestAnimationFrame(callback);
};

let isRunning = false;

function update(dt) {
    Matter.Engine.update(engine, dt);
    let a = centralPhyCirc.angle;
    if (a > 720) {
        a = 0;
        isRunning = false;
    }
    display(a);
}

let lastTime = 0;
let animFrame;

function callback(ms) {
    if (lastTime !== 0) {
        update(ms - lastTime);
    }

    if (isRunning) {
        lastTime = ms;
        animFrame = requestAnimationFrame(callback);
    } else {
        lastTime = 0;
    }
}

init(10);

display(0);
