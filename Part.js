function Part(startX, startY) {
    this.pos = createVector(startX, startY);
    this.r = 5;
    this.vel = createVector(random(-7,7), random(-7,7));
    this.friction = .8;
    this.timeAlive = 20000 + random(-1000,1000); //in milliseconds
    this.done = false;
    this.value = 1;
    this.color = color(200,200,0);

    setTimeout(() => this.done = true, this.timeAlive);
}

Part.prototype.show = function() {
    fill(this.color);
    // ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    rect(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Part.prototype.update = function() {
    //constrain to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2+this.r, height*2-this.r);
    this.pos.x = constrain(this.pos.x, -width*2+this.r, width*2-this.r);

    this.pos.add(this.vel);
    this.vel.mult(this.friction);
}

Part.prototype.setValue = function(val, color) {
    this.value = val;
    this.color = color;
}