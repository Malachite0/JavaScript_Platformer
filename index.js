const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 600
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 100;
        this.height = 150;
        this.onGround = false; // Initially set to false

        this.image = new Image();
        this.image.src = 'images/sprite.png';
    }

    draw() {
        if (this.image.complete) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        } else {
            this.image.onload = () => {
                c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
            };
        }
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Apply gravity if not on ground
        if (!this.onGround) {
            this.velocity.y += gravity;
        }

        // Check collision with platforms to update onGround
        let collided = false;
        platforms.forEach((platform) => {
            if (
                this.position.y + this.height + this.velocity.y >= platform.position.y &&
                this.position.y + this.height <= platform.position.y &&
                this.position.x + this.width >= platform.position.x &&
                this.position.x <= platform.position.x + platform.width
            ) {
                this.velocity.y = 0;
                this.position.y = platform.position.y - this.height;
                this.onGround = true;
                collided = true;
            }
        });

        if (!collided) {
            this.onGround = false;
        }
    }

    jump() {
        if (this.onGround) { // Only jump if player is on the ground
            this.velocity.y = -20; // Adjust jump velocity as needed
            this.onGround = false; // Update onGround immediately upon jumping
        }
    }
}

class Platform {
    constructor({ x, y, width, height }) {
        this.position = {
            x,
            y
        };

        this.width = width;
        this.height = height;
    }

    draw() {
        c.fillStyle = 'rgb(222, 215, 190)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let player = new Player();
platforms = [
    new Platform({ x: -6, y: 800, width: 700, height: 200 }),
    new Platform({ x: 1100, y: 800, width: 700, height: 200 }),
    new Platform({ x: 2200, y: 770, width: 450, height: 200 }),
    new Platform({ x: 2950, y: 400, width: 500, height: 200 }),
    new Platform({ x: 3700, y: 800, width: 500, height: 200 }),
    new Platform({ x: 4600, y: 840, width: 500, height: 200 }),
    new Platform({ x: 5420, y: 400, width: 750, height: 20 }),
    new Platform({ x: 6270, y: 830, width: 300, height: 120 }),
    new Platform({ x: 7000, y: 700, width: 800, height: 30 }),
    new Platform({ x: 8350, y: 830, width: 300, height: 120 }),
    new Platform({ x: 9000, y: 800, width: 50, height: 50 })
];
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};

let scrollOffset = 0;

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'rgb(100, 138, 144)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    platforms.forEach((platform) => {
        platform.draw();
    });

    player.update();

    if (keys.right.pressed && player.position.x < 750) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            scrollOffset += 5;
            platforms.forEach((platform) => {
                platform.position.x -= 5;
            });
        }
        if (keys.left.pressed) {
            scrollOffset -= 5;
            platforms.forEach((platform) => {
                platform.position.x += 5;
            });
        }
    }

    // Win condition
    if (scrollOffset > 8230) {
        console.log('You win');

        // Create the div element
        const winDiv = document.createElement('div');
        winDiv.innerText = 'You Win';
        winDiv.style.position = 'fixed';
        winDiv.style.top = '50%';
        winDiv.style.left = '50%';
        winDiv.style.transform = 'translate(-50%, -50%)';
        winDiv.style.padding = '20px';
        winDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        winDiv.style.color = 'white';
        winDiv.style.fontSize = '30px';
        winDiv.style.textAlign = 'center';
        winDiv.style.borderRadius = '10px';
        winDiv.style.zIndex = '1000';

        document.body.appendChild(winDiv);

        setTimeout(() => {
            document.body.removeChild(winDiv);
            init(); // Call init function upon winning
        }, 2000);
    }

    // Lose condition
    if (player.position.y > canvas.height || player.position.y <= 0) {
        console.log('You lose');

        const loseDiv = document.createElement('div');
        loseDiv.innerText = 'You lose';
        loseDiv.style.position = 'fixed';
        loseDiv.style.top = '50%';
        loseDiv.style.left = '50%';
        loseDiv.style.transform = 'translate(-50%, -50%)';
        loseDiv.style.padding = '20px';
        loseDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        loseDiv.style.color = 'white';
        loseDiv.style.fontSize = '30px';
        loseDiv.style.textAlign = 'center';
        loseDiv.style.borderRadius = '10px';
        loseDiv.style.zIndex = '1000';

        document.body.appendChild(loseDiv);

        setTimeout(() => {
            init(); 
            document.body.removeChild(loseDiv);
        }, 2000);
    }
}

animate();

// Event listeners
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65: 
            keys.left.pressed = true;
            break;
        case 68: 
            keys.right.pressed = true;
            break;
        case 87: 
            player.jump(); 
            break;
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: // Left arrow key (A)
            keys.left.pressed = false;
            break;
        case 68: // Right arrow key (D)
            keys.right.pressed = false;
            break;
    }

    // Ensure smooth movement after releasing left or right keys
    if (!keys.left.pressed && !keys.right.pressed) {
        player.velocity.x = 0;
    }
});

function init() {
    player = new Player();

    platforms = [
        new Platform({ x: -6, y: 800, width: 700, height: 200 }),
        new Platform({ x: 1100, y: 800, width: 700, height: 200 }),
        new Platform({ x: 2200, y: 770, width: 450, height: 200 }),
        new Platform({ x: 2950, y: 400, width: 500, height: 200 }),
        new Platform({ x: 3700, y: 800, width: 500, height: 200 }),
        new Platform({ x: 4600, y: 840, width: 500, height: 200 }),
        new Platform({ x: 5420, y: 400, width: 750, height: 20 }),
        new Platform({ x: 6270, y: 830, width: 300, height: 120 }),
        new Platform({ x: 7000, y: 700, width: 800, height: 30 }),
        new Platform({ x: 8350, y: 830, width: 300, height: 120 }),
        new Platform({ x: 9000, y: 800, width: 50, height: 50 })
    ];
    scrollOffset = 0;
}
