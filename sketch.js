// Daniel Shiffman
// http://codingtra.in
// Earthquake Data Viz
// Video: [coming soon]

var mapimg;

var clat = 0;
var clon = 0;

var ww = 1024;
var hh = 512;

var zoom = 1;
var earthquakes;

var Earthquakes = [];
var startDate, currentDate, endDate;
var hourInms = 3600000;
var timeToShowInHours = 24;

function preload() {
    mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
        clat + ',' + clon + ',' + zoom + '/' +
        ww + 'x' + hh +
        '?access_token=pk.eyJ1IjoidG9tZXJvbmkiLCJhIjoiY2l6NHp4c3ltMDZlZzJxcGdoem83a2FuYyJ9.BijCUhRD19jiqc7De21rpA');
    // earthquakes = loadStrings('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv');
    earthquakes = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
}

function mercX(lon) {
    lon = radians(lon);
    var a = (256 / PI) * pow(2, zoom);
    var b = lon + PI;
    return a * b;
}

function mercY(lat) {
    lat = radians(lat);
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
}


function setup() {
    createCanvas(ww, hh);

    var cx = mercX(clon);
    var cy = mercY(clat);

    for (var i = 1; i < earthquakes.length; i++) {
        var data = earthquakes[i].split(/,/);
        var lat = data[1];
        var lon = data[2];
        var mag = data[4];
        var x = mercX(lon) - cx;
        var y = mercY(lat) - cy;
        mag = pow(10, mag);
        mag = sqrt(mag);
        var magmax = sqrt(pow(10, 10));
        var d = map(mag, 0, magmax, 0, 180);
        Earthquakes.push(new Earthquake(x, y, data[0], d));
    }

    startDate = Earthquakes[Earthquakes.length - 1].time;
    endDate = Earthquakes[0].time;
    currentDate = new Date(startDate);

    frameRate(1);
}

function draw() {
    translate(width / 2, height / 2);
    imageMode(CENTER);
    image(mapimg, 0, 0);
    for (var i = 0; i < Earthquakes.length; i++) {
        Earthquakes[i].shouldDraw(currentDate);
    }
    currentDate.setTime(currentDate.getTime() + hourInms * 24);

    if (currentDate.getTime() > Earthquakes[0].time.getTime()) {
        currentDate.setTime(startDate.getTime());
    }
    fill(255);
    noStroke();
    text(currentDate, -1 * ww / 2 + 80, hh / 2 - 7);
}

function Earthquake(x, y, time, mag) {
    this.x = x;
    this.y = y;
    this.time = new Date(time);
    this.mag = mag;

    this.shouldDraw = function(current) {
        var timeInSeconds = this.time.getTime();
        var currentTimeInSeconds = current.getTime();
        if (timeInSeconds < currentTimeInSeconds && timeInSeconds + (hourInms * timeToShowInHours) > currentTimeInSeconds) {
            this.show();
        }
    }

    this.show = function() {
        stroke(255, 0, 0);
        fill(255, 0, 0, 200);
        ellipse(this.x, this.y, this.mag, this.mag);
    }
}
