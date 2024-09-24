# Orbital Bombardment Game Design
The game is a space-themed idle/incremental game where players destroy planets by firing at them with various types of ships

## Game Logic

### Key stats
- money: currency used to buy ships and upgrades
- gold: this is the 'prestige' currency
- planets destroyed: this is basically a track of 'level', it's how many planets the player has destroyed

### Mechanics
- Players start with a certain amount of money and can buy different types of ships.
- Ships automatically orbit and fire at the current planet.
- When a planet is destroyed, players move on to the next planet.
- Players earn money by damaging planets.
- Players can upgrade their ships to increase damage and fire rate.
- A prestige system allows players to reset progress for permanent bonuses.

## Rendering

- Ships, bullets, and planets are represented by simple geometric shapes.
- The planet is rendered at the center of the screen, with ships orbiting around it.
- Bullets travel from ships towards the planet.

## Models

### Ships

1. Small Ship
   Specs:
     - ID: 'small'
     - Fire Rate Multiplier: 1.5
     - Base Cost: 100
     - Cost Increase Factor: 1.1
     - Damage Per Shot: 1
   Appearance:
     - A small green rectangle
   Upgrades:
     - Cooldown:
       - Levels: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
       - Costs: [0, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600]
     - Damage:
       - Levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
       - Costs: [0, 150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400]

2. Medium Ship
   Specs:
     - ID: 'medium'
     - Fire Rate Multiplier: 1
     - Base Cost: 250
     - Cost Increase Factor: 1.15
     - Damage Per Shot: 3
   Appearance:
     - A medium-sized blue rectangle
   Upgrades:
     - Cooldown:
       - Levels: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
       - Costs: [0, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200]
     - Damage:
       - Levels: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
       - Costs: [0, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800]

3. Large Ship
   Specs:
     - ID: 'large'
     - Fire Rate Multiplier: 0.7
     - Base Cost: 500
     - Cost Increase Factor: 1.2
     - Damage Per Shot: 7
   Appearance:
     - A large red rectangle
   Upgrades:
     - Cooldown:
       - Levels: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
       - Costs: [0, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400]
     - Damage:
       - Levels: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
       - Costs: [0, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800, 153600]

### Planets

- mercury:
    Specs:
        ID: mercury
        Health: 1000
    Appearance:
        A grey small sphere
- venus:
    Specs:
        ID: venus
        Health: 2000
    Appearance:
        A yellowish medium sphere
- earth:
    Specs:
        ID: earth
        Health: 3000
    Appearance:
        A blue and green medium sphere
- mars:
    Specs:
        ID: mars
        Health: 4000
    Appearance:
        A reddish medium sphere
- jupiter:
    Specs:
        ID: jupiter
        Health: 5000
    Appearance:
        A large sphere with reddish and white bands

## UI

1. HUD (Head-Up Display):
   - Displays current money, planet health, planets destroyed, and gold
   - Buttons to open Ships, Upgrades, and Prestige menus

2. Ships Submenu:
   - Shows available ships to purchase
   - Displays current count and cost for each ship type
   - "Buy" button for each ship type

3. Upgrades Submenu:
   - Lists available upgrades for each ship type
   - Shows current level and cost for each upgrade
   - "Buy" button for each upgrade

4. Prestige Submenu:
   - Displays current prestige level and gold
   - Shows available prestige upgrades and their costs
   - "Prestige" button to reset progress and gain gold

## Debug UI

- Fire Rate slider: Adjusts the base fire rate of all ships
- Pause/Resume Rendering button: Toggles renderer on or off 
- Total Ships counter: Displays the total number of ships in the game
- Add/Remove buttons for each ship type: Instantly adds or removes ships (without cost)
- Ship count display for each ship type
- Prestige Level input: Allows direct modification of the prestige level
- Gold input: Allows direct modification of the gold amount
- Money input: Allows direct modification of the money amount
- Planets Destroyed input: Allows direct modification of the number of planets destroyed (for prestige)
- Force Prestige button: Triggers a prestige reset without meeting the normal requirements
