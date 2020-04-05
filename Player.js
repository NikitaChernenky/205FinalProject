function Player() {
    this.img = loadImage('player.PNG')
    this.pos = createVector(width/2, height/2);
    this.r = 40; //radius
    this.vel = 2;
    this.maxHealth = 100;
    this.health = 100;
    this.damage = 100;
    this.range = 50;
    this.killCount = 0;
    this.parts = 0;
    this.maxParts = 25;
    this.boosted = false;
    this.powerupText = "";
    this.firingSpeed = 150; //in milliseconds
    this.weapon = new Weapon(this.pos.x + this.r/2, this.pos.y + this.r/2);
}

Player.prototype.show = function() {
    //fill(255);
    //ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    image(this.img, this.pos.x, this.pos.y, this.r, this.r);
    this.weapon.show();
}

Player.prototype.rotate = function() {
      weapon.rotate(this.pos.x, this.pos.y);
  
}

Player.prototype.move = function(dir) {
    //contrain player to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2+this.r, height*2-this.r);
    this.pos.x = constrain(this.pos.x, -width*2+this.r, width*2-this.r);

    switch(dir) {
        case 'up': 
            this.pos.y -= this.vel;
            break;
        case 'left':
            this.pos.x -= this.vel;
            break;
        case 'down':
            this.pos.y += this.vel;
            break;
        case 'right':
            this.pos.x += this.vel;
            break;
        default:
            //console.log("Error in player move function.");
            break;
    }
    this.weapon.update(this.pos.x + this.r/2, this.pos.y + this.r/2);
}


Player.prototype.shoot = function(p, shootX, shootY) {
    return new Bullet(p, shootX, shootY);
}

Player.prototype.showHealth = function() {
    var posX = this.pos.x+(width/2);
    var posY = this.pos.y+(height/2);

    //establish minimum and maximum health
    if(this.health < 0) {this.health = 0;}
    if(this.health > this.maxHealth) {this.health = this.maxHealth;}

    push();
        noStroke();
        //health bar
        fill(255,80,80,180);
        rect(posX-width, posY-10, floor(width*(this.health/this.maxHealth)), 10);
        //parts bag
        fill(255,255,80,180);
        rect(posX-width, posY-20, floor(width*(this.parts/this.maxParts)), 10);

        if(this.parts == this.maxParts) {
            fill(0);
            textSize(12);
            text("Inventory full. Press B to open the buy menu", this.pos.x-50, this.pos.y + 275);
    }
    pop();
}

Player.prototype.getPart = function(part) {
    var d = dist(this.pos.x, this.pos.y, part.pos.x, part.pos.y);
    var get = d < this.r + part.r*2 && this.parts < this.maxParts && part.value <= this.maxParts - this.parts;
    if(get) {
        this.parts += part.value;
        if(this.parts > this.maxParts) {this.parts = this.maxParts;}
    }
    return get;
}

Player.prototype.getPowerup = function(powerup) {
    var d = dist(this.pos.x, this.pos.y, powerup.pos.x, powerup.pos.y);
    if(player.boosted)
        return false;
    else
        return d < this.r + powerup.r;
}


Player.prototype.startOver = function() {
    this.pos = createVector(width/2, height/2);
    this.vel = 2;
    this.maxHealth = 100;
    this.health = 100;
    this.killCount = 0;
    this.parts = 0;
    this.maxParts = 25;
    this.damage = 100;
    this.boosted = false;
    this.powerupText = "";
}