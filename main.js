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
let a = 0;

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

let start = document.getElementById("bStart");

start.onclick = function() {
    a = 0;
    isRunning = true;
    animFrame = requestAnimationFrame(callback);
};

let isRunning = false;

function update(dt) {
    a += dt * 100;
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
        update((ms - lastTime) / 1000);
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
