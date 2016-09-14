// Global variables
var cavnas, context,
    particleList;

// Constants
var WIDTH = document.body.clientWidth,
    HEIGHT = document.body.clientHeight,
    DEPTH = 200,
    MAX_PARTICLES = 100,
    MAX_SIZE = 1,
    MULTIPLIER = 2,
    MUSIC = new Audio('js/void.mp3'),
    ORIGIN;

// Class descriptions
var Vector = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector.prototype.Magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

Vector.prototype.UnitVector = function() {
    m = this.Magnitude();
    u = new Vector(this.x/m, this.y/m, this.z/m);
    return u;
}

Vector.prototype.Sum = function(v) {
    var r = new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    return r;
}

Vector.prototype.Difference = function(v) {
    var r = new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    return r;
}

Vector.prototype.DistanceFrom = function(v) {
    return Math.sqrt(
        (this.x - v.x) * (this.x - v.x) +
        (this.y - v.y) * (this.y - v.y) +
        (this.z - v.z) * (this.z - v.z)
    );
}

// Particle Object
var Particle = function(x, y, z) {
    this.position = new Vector(x, y, z);
    this.velocity = new Vector(1, 1, -10);
    this.size = 0;
}

Particle.prototype.Velocity = function() {
    var v = ORIGIN.Sum(this.position).UnitVector();
    var m = this.position.DistanceFrom(ORIGIN) /
            Math.sqrt(WIDTH/2 * WIDTH/2 + HEIGHT/2 * HEIGHT/2);
    v.x *= m * MULTIPLIER;
    v.y *= m * MULTIPLIER;
    v.z = -m * MULTIPLIER;
    return v;
}

Particle.prototype.Size = function() {
    var x = this.position.z/DEPTH;
    var s = MAX_SIZE * Math.sqrt(1 - x * x);
    s = (s > MAX_SIZE) ? MAX_SIZE : s;
    return s;
}

Particle.prototype.Reset = function() {
    this.position.x = Math.random()*WIDTH-WIDTH/2,
    this.position.y = Math.random()*HEIGHT-HEIGHT/2,
    this.position.z = DEPTH;
}

Particle.prototype.Render = function(context) {

    // Getting current velocity and size
    this.velocity = this.Velocity();
    this.size = this.Size();

    // Creating the star
    context.beginPath();
    context.fillStyle = "#FFFFFF";
    context.arc(
        WIDTH/2 + this.position.x,
        HEIGHT/2 + this.position.y,
        this.size, Math.PI*2, false
    );
    context.closePath();
    context.fill();

    // Creating the trails
    context.globalAlpha = 0.01;
    context.strokeStyle = "#FFFFFF";
    context.beginPath();
    context.moveTo(
        WIDTH/2 + this.position.x,
        HEIGHT/2 + this.position.y
    );
    context.lineTo(
        WIDTH/2 + (5*this.position.x/6 - ORIGIN.x/4),
        HEIGHT/2 + (5*this.position.y/6 - ORIGIN.y/4)
    );
    context.closePath();
    context.stroke();

    context.globalAlpha = 0.02;
    context.beginPath();
    context.moveTo(
        WIDTH/2 + this.position.x,
        HEIGHT/2 + this.position.y
    );
    context.lineTo(
        WIDTH/2 + (7*this.position.x/8 - ORIGIN.x/10),
        HEIGHT/2 + (7*this.position.y/8 - ORIGIN.y/10)
    );
    context.closePath();
    context.stroke();

    context.globalAlpha = 0.03;
    context.beginPath();
    context.moveTo(
        WIDTH/2 + this.position.x,
        HEIGHT/2 + this.position.y
    );
    context.lineTo(
        WIDTH/2 + (9*this.position.x/10 - ORIGIN.x/10),
        HEIGHT/2 + (9*this.position.y/10 - ORIGIN.y/10)
    );
    context.closePath();
    context.stroke();

    context.globalAlpha = 1.0;

    this.position = this.position.Sum(this.velocity);

    // Resetting cases
    if (
        this.position.x > WIDTH/2 ||
        this.position.x < -WIDTH/2
    ) {
        this.Reset();
    } if (
        this.position.y > HEIGHT/2 ||
        this.position.y < -HEIGHT/2
    ) {
        this.Reset();
    }

}

// Initialization function
function init() {

    MUSIC.play();

    // Canvas description
    cavnas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    // Canvas size setting
    canvas.height = HEIGHT;
    canvas.width = WIDTH;

    // Origin definition
    ORIGIN = new Vector(0, 0, 0);

    // Particle initialization
    particleList = new Array();
    for (var i = 0; i < MAX_PARTICLES; i++) {
        var p = new Particle(0, 0, 0);
        p.Reset();
        particleList.push(p);
    }

    // Start loop
    setInterval(loop, 10);
}

// Main loop
function loop() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < particleList.length; i++) {
        var p = particleList[i];
        p.Render(context);
    }
}

// Initialization
window.onload = init;

// Event handlers
function get_mouse_position(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};

function handleMove(event){
    event.preventDefault();
    if(event.type == "touchmove" || event.type == "touchstart"){
        mouse_position = get_mouse_position(canvas, event.touches[0]);
        ORIGIN.x = mouse_position.x - WIDTH/2;
        ORIGIN.y = mouse_position.y - HEIGHT/2;
    }
    else{
        mouse_position = get_mouse_position(canvas, event);
        ORIGIN.x = mouse_position.x - WIDTH/2;
        ORIGIN.y = mouse_position.y - HEIGHT/2;
    }
}

function handleMouseDown(event){
    event.preventDefault();
    while (MULTIPLIER < 4) {
        MULTIPLIER += 0.05;
    }
    // MUSIC.play();
}

function handleMouseUp(event){
    event.preventDefault();
    while (MULTIPLIER > 2) {
        MULTIPLIER -= 0.05;
    }
    // MUSIC.pause();
}

// Event listeners
window.addEventListener('mousemove', handleMove, false);
window.addEventListener('touchmove', handleMove, false);
window.addEventListener('mousedown', handleMouseDown, false);
window.addEventListener('touchstart', handleMouseDown, false);
window.addEventListener('mouseup', handleMouseUp, false);
window.addEventListener('touchend', handleMouseUp, false);
window.addEventListener('touchcancel', handleMouseUp, false);
