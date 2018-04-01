
'use strict';
$("#back").on('click', function () {
    location.href = "/";
})

var screenWidth = $(window).width();
var screenHeight = $(window).height();
var c = null;
var ctx = null;
var gradient = null;
var dogs = []

$(window).on('click', function(e) {
    bubbleSpawner.handlePop(e.pageX, e.pageY);
});

var bubbleSpawner = {
    bubbles: [],
    spawn: (x, y, r, dx, dy, img) => {
        var newB = {
            x: x,
            y: y,
            r: r,
            dx: dx,
            dy: dy,
            col: 'purple',
            img: dogs[Math.floor(Math.random() * 10)]
        }
        bubbleSpawner.bubbles.push(newB);
    },
    update: () => {
        if (
            bubbleSpawner.spawnCounter === 0
            && bubbleSpawner.bubbles.length < 8
        ){
            var pr = screenHeight / 10; //potential radius of new bubble
            var variance = 30;
            bubbleSpawner.spawn(
                pr + Math.random() * (screenWidth - 2 * pr),
                pr + Math.random() * (screenHeight - 2 * pr),
                pr - variance + Math.random() * variance,
                Math.random() * 8,
                Math.random() * 8,
                0
            );
            bubbleSpawner.spawnCounter = 20;
        }
        if (bubbleSpawner.spawnCounter <= 0)
            bubbleSpawner.spawnCounter = 20;
        else
            bubbleSpawner.spawnCounter -=1;
        for (var b in bubbleSpawner.bubbles) {
            var bubble = bubbleSpawner.bubbles[b];
            if (bubble.x + bubble.r > screenWidth || bubble.x - bubble.r < 0)
                bubble.dx *= -1;
            if (bubble.y + bubble.r > screenHeight || bubble.y - bubble.r < 0)
                bubble.dy *= -1;
            bubble.x += bubble.dx;
            bubble.y += bubble.dy;
            bubbleSpawner.drawBubble(b);
        }
    },
    drawBubble: (b) => {
        /*
        Code below is based off of the code found here:

            Author: Jared Williams
            Title: Image caching thing and Canvas
            Type: JavaScript
            Availability: https://jsfiddle.net/jaredwilli/ex5n5/
        */
        var bubble = bubbleSpawner.bubbles[b];
        ctx.strokeStyle = bubble.col;
        ctx.fillStyle = bubble.col;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        var resizeOffset = -bubble.img.width/bubble.r*2
        ctx.drawImage(bubble.img, bubble.x - bubble.img.width/2 + resizeOffset, bubble.y - bubble.img.height/2 + resizeOffset, bubble.img.width + resizeOffset, bubble.img.height + resizeOffset);
        ctx.beginPath();
        ctx.arc(0, 0, bubble.r, Math.PI*2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();
    },
    handlePop: (x, y) => {
        for (var b in bubbleSpawner.bubbles) {
            var bubble = bubbleSpawner.bubbles[b];
            if(
                bubble.x - bubble.r < x
                && bubble.x + bubble.r > x
                && bubble.y - bubble.r < y
                && bubble.y + bubble.r > y
            ){
                bubbleSpawner.bubbles.splice(b, 1);
            }
        }
    },
    spawnCounter: 0
}

//JS goes here
function gameLoop () {
    drawBackground();
    bubbleSpawner.update();
    setTimeout(gameLoop, 25);
}

function setup () {
    c = document.getElementById('screen');
    ctx = c.getContext('2d');
    ctx.canvas.width = screenWidth;
    ctx.canvas.height = screenHeight;
    ctx.lineWidth = 10;
    gradient = ctx.createLinearGradient(0, c.width, 0, c.height);
    gradient.addColorStop(0, '#cae0fc');
    gradient.addColorStop(1, '#718be2');

    var promise = new Promise ((resolve, reject) => {
        $.get('/user/images', (urlString, status) => {
            if(urlString) {
                var urls = JSON.parse(urlString);
                for(var u in urls) {
                    var dogImg = new Image();
                    dogImg.src = urls[u];
                    dogs.push(dogImg);
                }
                resolve();
            }
        })
    });
    promise.then(() => {
        gameLoop();
    })
}

function drawBackground () {
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, c.width, c.height);
}
setup();