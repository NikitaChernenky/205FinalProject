function Bullet(player, mX, mY) {
    this.pos = createVector(player.pos.x + 20, player.pos.y + 20);
    //origin keeps track of where the bullet started to calculate damage
    this.origin = createVector(player.pos.x, player.pos.y);
    this.damage = player.damage;
    this.range = player.range;
    // mouse position is on canvas, so math must be done to get position on game area
    this.mouse = createVector(mX+player.pos.x-(width/2), mY+player.pos.y-(height/2)); 
    this.vel = this.mouse.sub(this.pos);
    this.vel.setMag(20);
}

Bullet.prototype.fire = function() {
    this.pos.add(this.vel);
}

Bullet.prototype.calculateDamage = function() {
    var dam = this.damage;
    var distFromOrigin = floor(dist(this.origin.x, this.origin.y, this.pos.x, this.pos.y));
    if(distFromOrigin > this.range) {
        dam -= distFromOrigin - this.range;
        if(dam < 20) {
            dam = 20;
        } 
    }

    return dam;
}

Bullet.prototype.render = function() {
    push();
    stroke(30);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
}

Bullet.prototype.hits = function(zombie) {
    // find distance between bullet and zombie
    var d = dist(this.pos.x, this.pos.y, zombie.pos.x, zombie.pos.y);
    this.calculateDamage();
    return d < zombie.r;
}

Bullet.prototype.offscreen = function() {
    return this.pos.x > width*2 || this.pos.x < -width*2 || 
            this.pos.y > height*2 || this.pos.y < -height*2;
}