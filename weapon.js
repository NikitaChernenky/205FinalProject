function Weapon(weaponX, weaponY) {
    this.img = loadImage('gun.PNG')
    this.pos = createVector(weaponX, weaponY);
    this.dimension = 40; //width
    this.angle = 0;
    this.targetAngle = 0;
    this.easing = 0.15;

  
    this.update = function(x, y){
    this.pos.x = x 
    this.pos.y = y 
     }
  
  this.show = function(){
        push() //code to rotate the gun
        translate(this.pos.x, this.pos.y);
        this.angle = atan2( mouseY - height/2, mouseX - width/2 );
        var dir = (this.angle - this.targetAngle) / TWO_PI;
        dir -= round( dir );
        dir *= TWO_PI;
        this.targetAngle += dir * this.easing;
        rectMode(CENTER);
        rotate(this.targetAngle);
        image(this.img, 0, 0, this.dimension, this.dimension/3)
        pop()
     }
}
