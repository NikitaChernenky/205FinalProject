function Powerup(startX, startY) {
    this.imgLysol = loadImage('lysol.png')
    this.imgCoronaBeer = loadImage('coronabeer.png')
    this.imgToiletPaper = loadImage('toiletpaper.png')
  
    this.lysolWidth = 25;
    this.lysolHeight = 50;
    this.beerWidth = 14;
    this.beerHeight = 50;
    this.toiletPaperDimension = 40;
  
    this.imgWidth  = this.beerWidth; //default
    this.imgHeight = this.beerHeight;
    this.img = this.imgCoronaBeer;
  
    this.pos = createVector(startX, startY);
    this.r = 10;
    this.vel = createVector(random(-7, 7), random(-7,7));
    this.friction = .8;
    this.timeAlive = 20000 + random(-1000,1000);
    this.boostTime = 5000;
    this.done = false;
    this.color = color(0);
    this.type = "error";

    this.getRandom();

    setTimeout(() => this.done = true, this.timeAlive);

}

Powerup.prototype.show = function() {
    //fill(this.color);
    //ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    image(this.img, this.pos.x, this.pos.y, this.imgWidth, this.imgHeight);
}

Powerup.prototype.update = function() {
    //constrain to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2+this.r, height*2-this.r);
    this.pos.x = constrain(this.pos.x, -width*2+this.r, width*2-this.r);
    
    this.pos.add(this.vel);
    this.vel.mult(this.friction);
}

Powerup.prototype.getRandom = function() {
    var randBoost = floor(random(0,3));
    switch(randBoost) {
        case 0:
            this.type = "Agility";
            //this.color = color(255,255,0);
            this.img = this.imgLysol;
            this.imgWidth = this.lysolWidth;
            this.imgHeight = this.lysolHeight;
            break;
        case 1:
            this.type = "Damage";
            //this.color = color(255,0,0);
            this.img = this.imgCoronaBeer;
            this.imgWidth = this.beerWidth;
            this.imgHeight = this.beerHeight;
            break;
        case 2:
            this.type = "Invincibility";
            //this.color = color(0,0,200);
            this.img = this.imgToiletPaper;
            this.imgWidth = this.toiletPaperDimension;
            this.imgHeight = this.toiletPaperDimension;
            break;

    }
}

Powerup.prototype.boost = function(player) {
    var orig;
    switch(this.type) {
        case "Agility":
            orig = player.vel;
            player.vel = 3.5;
            player.boosted = "vel";
            player.powerupText = "Active: Agility";
            setTimeout(() => { 
                player.vel = orig;
                player.boosted = false;
                player.powerupText = "";
             }, this.boostTime);
            break;
        case "Damage":
            orig = player.damage;
            player.damage = orig*2;
            player.boosted = "damage";
            player.powerupText = "Active: Damage x2";
            setTimeout(() => { 
                player.damage = orig;
                player.boosted = false;
                player.powerupText = "";
             },  this.boostTime);
            break;
        case "Invincibility":
            orig = player.health;
            var origMax = player.maxHealth;
            player.health = 9999999;
            player.maxHealth = 9999999;
            player.boosted = "maxHealth";
            player.powerupText = "Active: Invincibility";
            setTimeout(() => { 
                player.health = orig; 
                player.maxHealth = origMax;
                player.boosted = false;
                player.powerupText = "";
             }, this.boostTime);
            break;
    }
}

