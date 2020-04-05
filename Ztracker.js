//simple object to keep track of the number of zombies that spawn
//so that type 6 zombies don't luckily spawn before the player can kill them
function Ztracker() {
    this.type1 = 0;
    this.type2 = 0;
    this.type3 = 0;
    this.type4 = 0;
    this.type5 = 0;
}

Ztracker.prototype.reset = function() {
    this.type1 = 0;
    this.type2 = 0;
    this.type3 = 0;
    this.type4 = 0;
    this.type5 = 0;
}