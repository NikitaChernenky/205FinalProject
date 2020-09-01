CS205 Final Project - Corona Virus Game </br>
Click to play - https://editor.p5js.org/nikasblack/full/yPz_0grzF

Mykyta Chernenky (200367631) </br>
Kyle Callander (200252132) </br>
Group Project Write Up </br>

For our group project, we decided to make a top-down round-based survival shooter. The purpose of this game is to survive as long as you can. You are a doctor that is trying to get rid of the Corona Virus. The controls are fairly simple WASD or arrows to move, left mouse click to shoot, B to access buy menu/upgrades and Q to locate the nearest virus to you.  The buy menu consists of several things you can upgrade such as speed, damage output, armour, health and store currency capacity. Lastly, there are power-ups that can be dropped by the virus and picked up such as speed boost, invincibility and double damage. These are all the basic parts of our game. I will explain the game in more depth starting with the player, then go to the virus. Followed by the store and miscellaneous parts.</br></br>

                       The character is the head of Minecraft’s Steve with a surgical mask. For this character, there were several things that needed to be programmed. First would be health and armour, this needs to be always up to date and accurate. The player gets two hits then they are dead unless they have armour which increases their health. Next, we had to make sure that the game could detect a collision between the player and the virus. This is done by keeping track of the virus’s position and the player position. If they get close enough to one another then a collision occurred and the player would take damage. The next part of the player is the weapon. It is stationary on the player character by rotated around to point at the mouse by tracking its position. The last part of the player we needed to make sure that the gun fired. This was done by taking the location of the mouse (which the gun would be pointed at) and updating the X and Y coordinates at an even and consistent rate to make it go straight.</br></br>

                       The virus has required the major part of the programming.  Firstly, we had programmed it to wobbly move towards the player, updating its X and Y coordinates to reach the target. The collision detection is also needed but for damage from the player. For this, the location of the bullet is compared to that of the virus and if they are the same then the virus takes damage. The health of each virus is located above that virus. The virus also needs to be spawned into the game. There are a number of positions, health stats, speed and strengths that the virus can be spawned with/at. This is used to help scale the difficulty the longer the game progresses. Lastly, when the virus is defeated it must disappear from the screen and drop either currency for the shop or power-ups and currency for the shop.</br></br>

                       The last thing to talk about is the drops, shop, and miscellaneous things that haven’t been covered. First are the drops. The power-ups each have their own model. Speed boosts are Lysol wipes, invincibility is toilet paper, and increased damage is a corona beer bottle. The drops have a random chance at dropping and only one can drop from a single virus. The speed boost increases the user’s speed by 3.5X the original speed, the damage increase doubles the player’s damage, and the invincibility makes the users health past the point where they would be able to die temporarily. Each power-up lasts for about 5 seconds and only 1 can be active at a time. The other drop from the virus is shop currency which each drop is worth 1 in the shop.  A random number drop upon each virus defeated. Next is the buy menu/upgrade shop. There are 4 things that can be purchased as upgrades and 1 that is not an upgrade. The upgrades are for speed, health/armour, damage, and shop currency capacity. Each has its own costs and a limited number of upgrades. The last thing to purchase in the shop is health refills for the player at a flat rate. The last part of this game is the sound effects. There is background music that plays, sound effects for the gun hits to the virus hits from the virus, player death sounds, and sounds for each power-up. This is everything that we had to do/include for our project. </br></br>


                       In the end result, we have been able to achieve a fully functioning game. Even though the project was highly complex, we had been able to fully complete it on time. We have spent over 60 hours to completely build the game. Despite the heavy homework load from other classes and the quarantine, we have done a great job successfully building the game with all its advanced features such as power-ups and buy menu.
