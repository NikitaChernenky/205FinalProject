function BuyMenu() {
    this.title = "Buy Menu"
    this.info = "Use arrow keys to make a selection and press enter to buy";
    this.barLength = 200;
    this.helpText = "";
    this.helpTime = 2000;
}

BuyMenu.prototype.upgrades = 
{    
    "item": [
    {
        "name": "vel",
        "text": "Upgrade exoskeleton",
        "selected": true,
        "hasProgress": true,
        "posX": 130,
        "posY": 150,
        "upgrade": 0,
        "maxUpgrade": 8,
        "cost": 10
    },
    {
        "name": "damage",
        "text": "Modify bullets",
        "selected": false,
        "hasProgress": true,
        "posX": 130,
        "posY": 225,
        "upgrade": 0,
        "maxUpgrade": 18,
        "cost": 15
    },
    {
        "name": "maxParts",
        "text": "Build a bigger bag",
        "selected": false,
        "hasProgress": true,
        "posX": 130,
        "posY": 300,
        "upgrade": 0,
        "maxUpgrade": 9,
        "cost": 25
    },
    {
        "name": "maxHealth",
        "text": "Enhance Armor",
        "selected": false,
        "hasProgress": true,
        "posX": 130,
        "posY": 375,
        "upgrade": 0,
        "maxUpgrade": 15,
        "cost": 20
    },
    {
        "name": "health",
        "text": "Heal 25%",
        "selected": false,
        "posX": 130,
        "posY": 450,
        "cost": 10
    }
    ]
}

BuyMenu.prototype.open = function(player) {
    noLoop();
    var progress = 0;
    push();
        translate(player.pos.x-width/2, player.pos.y-height/2);
        //background
        fill(165,42,42);
        noStroke();
        rect(0,0,width,height);
        fill(0);
        //Title
        textSize(24);
        text(this.title, 250, 50);
        //Info
        textSize(12);
        text(this.info, 150, 75);
        //helpText
        textSize(18);
        textStyle(BOLD);
        fill(255,100,100);
        text(this.helpText, 38, 110);
        //labels
        fill(0);
        text("Current", 330, 110);
        text("Upgrade Cost", 445, 110);
        //Bag display
        fill(255,255,0);
        rect(440, 570, 170, 30, 10);
        fill(0);
        text("Bag: " + player.parts + " parts", 450,590);
        //selections
        textAlign(CENTER);
        for(var i = 0; i < this.upgrades.item.length; i++){
            var item = this.upgrades.item[i];
            if(item.selected) {
                fill(0,255,0);
            } else {
                fill(255);
            }
            text(item.text, item.posX, item.posY);
            //only show cost if the item isnt fully upgraded
            fill(0);
            if(this.getUpgradeProgress(item, player) < 1) {
                text(item.cost + "p", item.posX+380, item.posY);
            }
            text(this.getUpgradeValue(item, player), item.posX+235, item.posY);

            //upgrade bars
            fill(255);
            rect(item.posX-100, item.posY+10, this.barLength, 10, 5);
            fill(138,43,226);
            rect(item.posX-100, item.posY+10, floor(this.barLength*(this.getUpgradeProgress(item, player))), 10, 5);
        }
    pop();
}

BuyMenu.prototype.moveSelection = function(key, player) {
    var selectedIndex;
    var numItems = 0;
    this.helpText = "";
    for(var i = 0; i < this.upgrades.item.length; i++) {
        if(this.upgrades.item[i].selected) {
            selectedIndex = i;
            this.upgrades.item[i].selected = false;
        }
        numItems++;
    }

    if(key === UP_ARROW || key === 87) {
        selectedIndex--;
        if(selectedIndex < 0) {selectedIndex = numItems - 1;}
    } else if(key === DOWN_ARROW || key === 83) {
        selectedIndex++;
        if(selectedIndex > numItems - 1) {selectedIndex = 0;}
    }

    this.upgrades.item[selectedIndex].selected = true;
    this.open(player);
}

BuyMenu.prototype.getUpgradeProgress = function(item, player) {
    var progress = 0;
    switch(item.name) {
        case "health":
            progress = (player.health / player.maxHealth);
            break;
        default:
            progress = item.upgrade / item.maxUpgrade;
            break;
    }

    return progress;
}

BuyMenu.prototype.buy = function(player) {
    var item;
    //get the item
    for(var i = 0; i < this.upgrades.item.length; i++) {
        if(this.upgrades.item[i].selected) {
            item = this.upgrades.item[i];
        }
    }

    if(this.getUpgradeProgress(item, player) >= 1) {
        this.helpText = "Item fully upgraded.";
    } else if(player.parts < item.cost) {
        this.helpText = "You cannot afford this.";
    } else if (player.boosted == item.name) {
        this.helpText = "Not while boosted.";
    } else {
        item.upgrade++;
        player.parts -= item.cost;
        player.numUpgrades++;
        switch(item.name) {
            case "vel":
                player.vel += 0.2
                item.cost = floor(item.cost * 1.73);
                break;
            case "maxHealth":
                var hp = player.maxHealth;
                player.maxHealth = floor(player.maxHealth*1.25);
                player.health += player.maxHealth - hp;
                item.cost = floor(item.cost * 1.53);
                this.upgrades.item[4].cost = floor(this.upgrades.item[4].cost * 1.4); //item 5 = health
                break;
            case "maxParts":
                player.maxParts *= 2;
                item.cost = player.maxParts;
                break;
            case "damage":
                player.damage = floor(player.damage * 1.2);
                item.cost = floor(item.cost * 1.45);
                break;
            case "health":
                player.health += ceil(player.maxHealth * .25);
                if(player.health > player.maxHealth) { player.health = player.maxHealth; }
                break;
            default:
                break;
        }
    }



    this.open(player);
}

BuyMenu.prototype.getUpgradeValue = function(item, player) {
    var value = "";
    switch(item.name) {
        case "vel": 
            value = "Agility " + player.vel.toFixed(1);
            break;
        case "maxHealth":
            value = "Max health: " + player.maxHealth;
            break;
        case "maxParts":
            value = "Capacity: " + player.maxParts;
            break;
        case "damage":
            value = "Damage: " + player.damage;
            break;
        case "health":
            value = "Health: " + player.health;
            break;
        default:
            console.error("Something went wrong in getUpgradeValue function");
            break;
    }
        return value;
}

BuyMenu.prototype.close = function() {
    this.helpText = "";
    //reset selection to first item
    for(var i = 0; i < this.upgrades.item.length; i++) {
        if(this.upgrades.item[i].selected) {
            this.upgrades.item[i].selected = false;
        }
    }
    this.upgrades.item[0].selected = true;
    loop();
}

BuyMenu.prototype.reset = function() {
    this.upgrades.item[0].cost = 10;
    this.upgrades.item[1].cost = 15;
    this.upgrades.item[2].cost = 25;
    this.upgrades.item[3].cost = 20;
    this.upgrades.item[4].cost = 10;


    this.upgrades.item[0].upgrade = 0;
    this.upgrades.item[1].upgrade = 0;
    this.upgrades.item[2].upgrade = 0;
    this.upgrades.item[3].upgrade = 0;
}