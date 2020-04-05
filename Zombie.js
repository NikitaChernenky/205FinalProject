function Zombie(posX, posY, kills, ztracker) {
    this.img = loadImage('coronavirus.png')
    this.pos = createVector(posX, posY);
    this.r = 40;
    this.angle;
    this.vel = .5;
    this.maxVel = .5;
    this.health = 200;
    this.maxHealth = 200;
    this.strength = 50;
    this.attackSpeed = 2000;
    this.canAttack = true;
    this.color = color(127, 127, 0);
    this.parts = random(1,5); //amount of parts held by zombie
    this.xoff = random(-10000,10000); //x offset for perlin noise
    this.yoff = random(-10000,10000); //y offset for perlin noise
    this.wobble = 400; //magnitude of the wobble
    this.playerKills = kills;
    
    this.getRandomType(ztracker);
}

Zombie.prototype.show = function() {
    //fill(this.color);
    //ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
     image(this.img, this.pos.x, this.pos.y, this.r, this.r)
}

Zombie.prototype.move = function(playerX, playerY) {
    //contrain zombie to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2+this.r, height*2-this.r);
    this.pos.x = constrain(this.pos.x, -width*2+this.r, width*2-this.r);

    var playerPos = createVector(playerX, playerY);

    if(this.vel < this.maxVel) {
        this.vel += .5;
    } else {
        this.vel = this.maxVel;
        playerPos.x = playerX+map(noise(this.xoff), 0, 1, -this.wobble, this.wobble);
        playerPos.y = playerY+map(noise(this.yoff), 0, 1, -this.wobble, this.wobble);
        this.xoff += 0.01;
        this.yoff += 0.01;
    }
    // var player = createVector(playerX+map(noise(this.xoff), 0, 1, -this.wobble, this.wobble), playerY+map(noise(this.yoff), 0, 1, -this.wobble, this.wobble)); //perlin noise for wobble

    playerPos.sub(this.pos);
    playerPos.setMag(this.vel);
    this.pos.add(playerPos);
}


Zombie.prototype.getShot = function(bullet) {
    var angle = createVector(bullet.pos.x, bullet.pos.y);
    angle.sub(this.pos);
    angle.setMag(1);
    this.pos.add(angle);
    this.vel -= 3;
    this.health -= bullet.calculateDamage();
}

Zombie.prototype.isInRange = function(something) {
    //check distance to the thing
    var d = dist(this.pos.x, this.pos.y, something.pos.x, something.pos.y);
    return d < something.r/2+this.r/2;
}

Zombie.prototype.attack = function(player) {
    if(this.canAttack){
        player.health -= this.strength;
        bumpSound_sfx.play();
        this.canAttack = false;
        setTimeout(() => this.canAttack = true, this.attackSpeed);
    }
}

Zombie.prototype.getRandomType = function(ztracker) {
    var chance = random();
    switch(true) {
        case (chance < (this.playerKills / 12000) && ztracker.type5 > 25):
            console.log("Type 6 spawned");
            this.color = color(0, 0, 200);
            this.health = 10000;
            this.maxHealth = 10000;
            this.vel = 2.5;
            this.maxVel = 2.5;
            this.r = 30
            this.strength = 150;
            this.attackSpeed = 250;
            this.parts = random(100,200);
            break;
        case (chance < (this.playerKills / 10000) && ztracker.type4 > 20):
            console.log("Type 5 spawned");
            ztracker.type5++;
            this.color = color(130, 200, 200);
            this.health = 3000;
            this.maxHealth = 3000;
            this.vel = 2.5;
            this.maxVel = 2.5;
            this.strength = 75;
            this.attackSpeed = 250;
            this.parts = random(75,150);
            break;
        case (chance < (this.playerKills / 7500) && ztracker.type3 > 15):
            console.log("Type 4 spawned");
            ztracker.type4++;
            this.color = color(255, 130, 200);
            this.health = 1000;
            this.maxHealth = 1000;
            this.vel = 2;
            this.maxVel = 2;
            this.r = 10;
            this.strength = 50;
            this.attackSpeed = 250;
            this.parts = random(50,100);
            break;
        case (chance < (this.playerKills / 5000) && ztracker.type2 > 10):
            console.log("Type 3 spawned");
            ztracker.type3++;
            this.color = color(130, 0, 130);
            this.health = 4000;
            this.maxHealth = 4000;
            this.vel = .75;
            this.maxVel = .75;
            this.r = 24;
            this.strength = 150;
            this.attackSpeed = 750;
            this.parts = random(30,60);
            break;
        case (chance < (this.playerKills / 2500) && ztracker.type1 > 5):
            console.log("Type 2 spawned");
            ztracker.type2++;
            this.color = color(200, 200, 0);
            this.health = 2000;
            this.maxHealth = 2000;
            this.vel = 1;
            this.maxVel = 1;
            this.strength = 50;
            this.attackSpeed = 1000;
            this.parts = random(10,20);
            break;
        case chance < (this.playerKills / 500):
            console.log("Type 1 spawned");
            ztracker.type1++;
            this.color = color(160, 160, 0);
            this.health = 500;
            this.maxHealth = 500;
            this.vel = .75;
            this.maxVel = .75;
            this.strength = 50;
            this.attackSpeed = 1900;
            this.parts = random(5,10);
            break;
        default:
            //keep default values
            return;
    }   
}

Zombie.prototype.dead = function() {
    return this.health <= 0;
}

Zombie.prototype.showHealth = function() {
    var posX = this.pos.x - 15;
    var posY = this.pos.y - 25;
    var healthBarLen = 30;

    //establish minimum health
    if(this.health < 0) {this.health = 0;}

    push();
    if(this.health < this.maxHealth) {
        noFill();
        rect(posX, posY, healthBarLen, 5, 10);
        fill(255,80,80);
        rect(posX, posY, floor(healthBarLen*(this.health/this.maxHealth)), 5, 10);
    }
    pop();
}

Zombie.prototype.die = function() {
    var parts = [];
    var spPartsValue = 10;
    var blueChance = .33;
    for(var i = 0; i < this.parts; i++) {
        if(this.parts - i > spPartsValue && random() < blueChance) {
            i += spPartsValue;
            part = new Part(this.pos.x, this.pos.y);
            part.setValue(spPartsValue, color(0,0,255));
            parts.push(part);
        } else {
            parts.push(new Part(this.pos.x, this.pos.y));
        }
    }
    return parts;
}

Zombie.prototype.dropPowerup = function() {
    return new Powerup(this.pos.x, this.pos.y);
}

Zombie.prototype.noOverlap = function(otherZombie) {
    var zomb = createVector(otherZombie.pos.x, otherZombie.pos.y);
    zomb.sub(this.pos);
    zomb.setMag(this.vel);
    this.pos.sub(zomb);
}