var player, buyMenu, ztracker;
var zombies = [];
var NUM_ZOMBIES = 50;
var bullets = [];
var parts = [];
var powerups = [];
var powerupChance = 0.15; //chance of the power up drop
var playerDead = false;
var buyMenu = false;
var paused = false;
var wave = 0;
var newWave = false;
var fcount = 100; //counts frames for wave text
var fhurt = 10; //counts frames for hurt animation
var canShoot = true;
// https://techcrunch.com/pages/covid-19-updates/

function preload() {
  main_sound = createAudio('coronatime.mp3');
  gameover_sound = loadSound('coronavirus.mp3');
  powerup_sfx = loadSound('powerup.mp3');
  shootSound_sfx = loadSound('hitmarker.mp3');
  bumpSound_sfx = loadSound('bumpSound.mp3');
  eliminate_sfx = loadSound('eliminate.mp3');
  hitTarget_sfx = loadSound('slap.mp3');
  shootSound_sfx.setVolume(0.3);
  hitTarget_sfx.setVolume(0.2);
  
}

function setup() {
    createCanvas(600,600);
    main_sound.loop(); //play background music
    //spawn player
    player = new Player();
    //initiate Buy Menu
    BuyMenu = new BuyMenu();
    //zombie tracker
    ztracker = new Ztracker();
    //gun
    weapon = new Weapon();
}

function draw() {
    background(200);

    //player display
    // use translate function to always show player in center
    translate(width/2-player.pos.x, height/2-player.pos.y);
  
    player.move();
    //create grid lines
    drawGrid(-width*2, -height*2, width*2, height*2);
    
    //do stuff with parts
    for(var i = 0; i < parts.length; i++) {
        parts[i].show();
        parts[i].update();
        if(player.getPart(parts[i]) || parts[i].done){
            parts.splice(i, 1);
        }
    }

    //do stuff with powerups
    for(var i = 0; i < powerups.length; i++) {
        powerups[i].show();
        powerups[i].update();
        if(player.getPowerup(powerups[i])) {
            powerup_sfx.play();
            powerups[i].boost(player);
            powerups.splice(i,1);
        } else if(powerups[i].done) powerups.splice(i,1);
    }

    //do stuff with zombies
    for (var i = zombies.length - 1; i >= 0; i--) {
        zombies[i].show();
        zombies[i].showHealth();
        zombies[i].move(player.pos.x, player.pos.y);

        if(zombies[i].isInRange(player)) {
            if(zombies[i].canAttack){
                fhurt = 0;
            }
            zombies[i].attack(player);
        }
        
        //reduce zombie overlap
        for(var j = zombies.length - 1; j >= 0; j--) {
            if(zombies[i].isInRange(zombies[j])) {
                zombies[i].noOverlap(zombies[j]);
            }
        }

        if(zombies[i].dead()){
            player.killCount++;
            eliminate_sfx.play();
            parts = parts.concat(zombies[i].die());
            if(random() < powerupChance) {
                powerups.push(zombies[i].dropPowerup());
            }
            zombies.splice(i, 1);
        }
    }
     

    //hurt animation
    if(fhurt < 10) {
        push();
            var c = color(255,0,0,100 - fhurt*10);
            fill(c);
            rect(player.pos.x-300,player.pos.y-300,height,width);
        pop();
        fhurt++;
    }

    //when wave is over, start new wave
    if(zombies.length == 0) { newWave = true; wave++; }
    if(newWave) {
        spawnZombies(1);
        if(zombies.length == NUM_ZOMBIES) {
            newWave = false;
            fcount = 0; //frames
        }
    }
    if(fcount < 100) {
        push();
            fill(0);
            textSize(48);
            text("Wave " + wave, player.pos.x-75, player.pos.y-100);
        pop();
        fcount++;
    }

    //do stuff with bullets
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].render();
        bullets[i].fire();
        for (var j = 0; j < zombies.length; j++) {
            if(bullets[i].hits(zombies[j])){
                zombies[j].getShot(bullets[i]);
                hitTarget_sfx.play(0);
                bullets.splice(i,1);
                break;
            } else if(bullets[i].offscreen()) {
                bullets.splice(i, 1);
                break;
            }
        }
    }

    //show player
    player.show();

    //show health
    player.showHealth();

    //zombie counter and powerup display
    push();
        fill(0);
        textSize(16);
        textStyle(BOLD);
        text("Zombies left: " + zombies.length, player.pos.x+170, player.pos.y-275);
        if(player.boosted) { text(player.powerupText, player.pos.x-290, player.pos.y-275); }
    pop();

    //show paused text if game is paused
    if(paused) {
        fill(0);
        textSize(48);
        text("Paused", player.pos.x-80, player.pos.y-100);
    }

    //display buymenu if it's open
    if(buyMenu) { buyMenu.open(player); }

    //game over when health is 0
    if(player.health <= 0) {
        gameOver();
    }

    // movement of player
    //weird stuff happens if this isn't last in draw
    if(keyIsDown(87) || keyIsDown(UP_ARROW)) {player.move('up');}
    if(keyIsDown(65) || keyIsDown(LEFT_ARROW)) {player.move('left');} 
    if(keyIsDown(83) || keyIsDown(DOWN_ARROW)) {player.move('down');} 
    if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {player.move('right');} 
    if(keyIsDown(90)) {locateNearest();}

    if(mouseIsPressed && canShoot){
        canShoot = false;
        shootSound_sfx.play();
        bullets.push(player.shoot(player, mouseX, mouseY));
        setTimeout(() => canShoot = true, player.firingSpeed);
    }
}

function keyPressed() {

    //pause
    if(keyCode == ESCAPE && !buyMenu) {
        pause();
    }

    //change selection
    if(buyMenu) {buyMenu.moveSelection(keyCode, player);}

    //buy item
    if(buyMenu && keyCode == 13) {buyMenu.buy(player);}

    if(keyCode == 32 && playerDead) restart();

    //open buyMenu
    if(keyCode == SHIFT) {
        if(!buyMenu) { buyMenu = true; }
        else { buyMenu = false; buyMenu.close(); }
    }

    return false; //prevent default browser behavior
}

function spawnZombies(num) {
    var areaView = (height / 2) + player.r; //works as long as height = width
    for (var i = 0; i < num; i++) {
        var randW = random(-width * 2, width * 2);
        var randH = random(-height * 2, height * 2);
        //make sure zombie doesn't spawn in the view of the player
        if(randW > player.pos.x - areaView && randW < player.pos.x + areaView &&
            randH > player.pos.y - areaView && randH < player.pos.y + areaView) {
        } else {
            zombies.push(new Zombie(randW, randH, player.killCount, ztracker));
        }
    }
}

function locateNearest() {
    var nearestX, nearestY, d;
    var shortest = 999999;
    for(var i = 0; i < zombies.length; i++) {
        d = dist(player.pos.x, player.pos.y, zombies[i].pos.x, zombies[i].pos.y);
        if(d < shortest) {
            shortest = d;
            nearestX = zombies[i].pos.x;
            nearestY = zombies[i].pos.y;
        }
    }
    line(player.pos.x, player.pos.y, nearestX, nearestY);
}

function drawGrid(topLeftX, topLeftY, botRightX, botRightY) {
    var LINE_DIST = 50;
    push();
        stroke(149, 165, 166);
        for(var x = topLeftX; x <= botRightX; x += LINE_DIST) {
            line(x, topLeftY, x, botRightY);
        }
        for(var y = topLeftY; y <= botRightY; y += LINE_DIST) {
            line(topLeftX, y, botRightX, y);
        }
    pop();
}

function gameOver() {
    playerDead = true;
    main_sound.stop();
    gameover_sound.play();
    push();
        fill(0);
        textSize(48);
        text("Game Over", player.pos.x-100, player.pos.y-100);
        textSize(20);
        text("Press space to restart", player.pos.x-75, player.pos.y-75);
    pop();
    noLoop();
}

function pause() {
    if(!paused) {
        noLoop();
        paused = true;
    } else {
        loop();
        paused = false;
    }
}

function restart() {
    playerDead = false;
    player.startOver();
    buyMenu.reset();
    ztracker.reset();
    
    //kill all zombies and reset wave
    for(var i = zombies.length; i >= 0; i--) {
        zombies.splice(i,1);
    }
    wave = 0;

    //remove all bullets
    for(var j = bullets.length; j >= 0; j--) {
        bullets.splice(j, 1);
    }

    //remove all parts
    for(var k = parts.length - 1; k >= 0; k--) {
        parts.splice(k, 1);
    }

    //remove all powerups
    for (var l = powerups.length - 1; l >= 0; l--) {
        powerups.splice(l, 1);
    }

    loop();
}