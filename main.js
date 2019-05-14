let width = 420;
let height = 640;

let draw = SVG('drawing').size(width, height);

let bg = draw.rect(width, height).fill('#FF0000');

function display(a, d) {
    let diameter = 75;
    let radius = diameter / 2;
    let topMargin = 75;
    let groozikWidth = 75;
    let groozikHeight = 30;
    let forCenterHeightMargin = diameter + topMargin;
    let forCenterWidthMargin = width / 2;
    let stierdzenWidth = 10;

    draw.line(forCenterWidthMargin + radius, forCenterHeightMargin, forCenterWidthMargin + radius, forCenterHeightMargin + diameter + a * 2 * Math.PI).stroke({color: '#8000FF', width: 2});
    draw.rect(groozikWidth, groozikHeight).fill('#FF00FF').cx(forCenterWidthMargin + radius).cy(forCenterHeightMargin + diameter + a * 2 * Math.PI);

    for (let angle = 0; angle < 360; angle += 90) {
        draw.rect(stierdzenWidth, forCenterHeightMargin).fill('#FFFF00').cx(forCenterWidthMargin).transform({rotation: angle + a, cx: forCenterWidthMargin, cy: forCenterHeightMargin});
        draw.rect(groozikWidth, groozikHeight).fill('#000000').cx(forCenterWidthMargin).cy(topMargin - d).transform({rotation: angle + a, cx: forCenterWidthMargin, cy: forCenterHeightMargin})
    }
    draw.ellipse(diameter, diameter).fill('#00FF00').cx(forCenterWidthMargin).cy(forCenterHeightMargin);
}

display(20, 10);
