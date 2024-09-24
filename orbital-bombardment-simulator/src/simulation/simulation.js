import { SHIPS, PLANETS, UPGRADES, PRESTIGE_UPGRADES, PRESTIGE_GOLD_PER_PLANET } from './simulationModels';

class Ship {
  constructor(type, x, y, simulation) {
    this.type = SHIPS[type.toUpperCase()];
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.lastFiredTime = 0;
    this.simulation = simulation;
    this.orbitRadiusX = 250; // Reduced from 300 to 250
    this.orbitRadiusY = 150; // Kept the same as before
  }

  update(deltaTime, fireRate) {
    this.angle += deltaTime * 0.5;
    this.x = this.simulation.width / 2 + Math.cos(this.angle) * this.orbitRadiusX;
    this.y = this.simulation.height / 2 + Math.sin(this.angle) * this.orbitRadiusY;

    const currentTime = Date.now();
    const cooldownReduction = UPGRADES[this.type.id.toUpperCase()].cooldown.levels[this.simulation.getUpgradeLevel(this.type.id, 'cooldown')] / 100;
    const adjustedFireRate = fireRate * (1 + cooldownReduction);
    if (currentTime - this.lastFiredTime > (1000 / adjustedFireRate) / this.type.fireRateMultiplier) {
      this.simulation.fireBullet(this);
      this.lastFiredTime = currentTime;
    }
  }

  getDamage() {
    const baseDamage = this.type.damagePerShot;
    const damageIncrease = UPGRADES[this.type.id.toUpperCase()].damage.levels[this.simulation.getUpgradeLevel(this.type.id, 'damage')];
    const prestigeDamageMultiplier = PRESTIGE_UPGRADES.DAMAGE_MULTIPLIER.levels[this.simulation.getPrestigeUpgradeLevel('DAMAGE_MULTIPLIER')];
    return (baseDamage + damageIncrease - 1) * prestigeDamageMultiplier;
  }
}

class Bullet {
  constructor(ship) {
    this.x = ship.x;
    this.y = ship.y;
    this.damage = ship.getDamage();
    this.speed = 5;
    this.shipType = ship.type.id;  // Add this line to store the ship type
  }

  update(deltaTime, simulation) {
    const dx = simulation.width / 2 - this.x;
    const dy = simulation.height / 2 - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) {
      simulation.hitPlanet(this.damage);
      return false;
    }

    this.x += (dx / distance) * this.speed;
    this.y += (dy / distance) * this.speed;
    return true;
  }
}

class Planet {
  constructor(planetData, x, y) {
    this.id = planetData.id;
    this.name = planetData.name;
    this.health = planetData.health;
    this.maxHealth = planetData.health;
    this.x = x;
    this.y = y;
  }
}

export class Simulation {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.ships = [];
    this.bullets = [];
    this.isRendering = true;
    this.fireRate = 1;
    this.money = 1000;
    this.planetsDestroyed = 0;
    this.currentPlanetIndex = 0;
    this.planets = Object.values(PLANETS).map(planet => new Planet(planet, width / 2, height / 2));
    this.upgrades = {
      small: { cooldown: 0, damage: 0 },
      medium: { cooldown: 0, damage: 0 },
      large: { cooldown: 0, damage: 0 }
    };
    this.prestigeLevel = 0;
    this.gold = 0;
    this.prestigeUpgrades = {
      MONEY_MULTIPLIER: 0,
      DAMAGE_MULTIPLIER: 0
    };
    this.explosionTimer = 0;
    this.explosionDuration = 1500; // Duration of explosion animation in milliseconds
    this.isExploding = false;
  }

  addShip(type, x, y) {
    const ship = new Ship(type, x, y, this);
    this.ships.push(ship);
    return ship;
  }

  buyShip(type) {
    const shipType = SHIPS[type.toUpperCase()];
    const currentCost = this.getShipCost(type);
    if (this.money >= currentCost) {
      const angle = Math.random() * Math.PI * 2;
      const x = this.width / 2 + Math.cos(angle) * 250; // Updated from 300 to 250
      const y = this.height / 2 + Math.sin(angle) * 150; // Kept the same as before
      const ship = this.addShip(type, x, y);
      this.money -= currentCost;
      return ship;
    }
    return null;
  }

  removeShip(ship) {
    const index = this.ships.indexOf(ship);
    if (index !== -1) {
      this.ships.splice(index, 1);
    }
  }

  fireBullet(ship) {
    const bullet = new Bullet(ship);
    this.bullets.push(bullet);
  }

  hitPlanet(damage) {
    const currentPlanet = this.planets[this.currentPlanetIndex];
    currentPlanet.health -= damage;
    this.addMoney(damage);
    if (currentPlanet.health <= 0 && !this.isExploding) {
      this.isExploding = true;
      this.explosionTimer = this.explosionDuration;
    }
  }

  update(deltaTime) {
    if (this.isExploding) {
      this.explosionTimer -= deltaTime * 1000;
      if (this.explosionTimer <= 0) {
        this.isExploding = false;
        this.explosionTimer = 0;
        this.moveToNextPlanet();
      }
    } else {
      this.ships.forEach(ship => ship.update(deltaTime, this.fireRate));
      this.bullets = this.bullets.filter(bullet => bullet.update(deltaTime, this));
    }
  }
  moveToNextPlanet() {
    this.planetsDestroyed++;
    this.currentPlanetIndex++;
    if (this.currentPlanetIndex >= this.planets.length) {
      this.currentPlanetIndex = 0;
      this.planetsDestroyed = 0;
      this.planets = Object.values(PLANETS).map(planet => new Planet(planet, this.width / 2, this.height / 2));
    }
  }

  addMoney(amount) {
    const moneyMultiplier = PRESTIGE_UPGRADES.MONEY_MULTIPLIER.levels[this.getPrestigeUpgradeLevel('MONEY_MULTIPLIER')];
    this.money += amount * moneyMultiplier;
  }

  setFireRate(rate) {
    this.fireRate = rate;
  }

  toggleRendering() {
    this.isRendering = !this.isRendering;
  }

  getShipCount(type) {
    return this.ships.filter(s => s.type.id === type).length;
  }

  getTotalShipCount() {
    return this.ships.length;
  }

  getFireRate() {
    return this.fireRate;
  }

  getIsRendering() {
    return this.isRendering;
  }

  getMoney() {
    return Math.floor(this.money);
  }

  getPlanetHealth() {
    const currentPlanet = this.planets[this.currentPlanetIndex];
    return Math.max(0, Math.floor(currentPlanet.health));
  }

  getPlanetsDestroyed() {
    return this.planetsDestroyed;
  }

  getShipCountByType(type) {
    return this.ships.filter(ship => ship.type.id === type).length;
  }

  getShipCost(type) {
    const shipType = SHIPS[type.toUpperCase()];
    const currentCount = this.getShipCountByType(type);
    return Math.floor(shipType.baseCost * Math.pow(shipType.costIncreaseFactor, currentCount));
  }

  getCurrentPlanetIndex() {
    return this.currentPlanetIndex;
  }

  getCurrentPlanet() {
    return this.planets[this.currentPlanetIndex];
  }

  getUpgradeLevel(shipType, upgradeType) {
    return this.upgrades[shipType][upgradeType];
  }

  getUpgradeCost(shipType, upgradeType) {
    const currentLevel = this.getUpgradeLevel(shipType, upgradeType);
    if (currentLevel >= 10) return Infinity;
    return UPGRADES[shipType.toUpperCase()][upgradeType].costs[currentLevel];
  }

  canUpgrade(shipType, upgradeType) {
    const cost = this.getUpgradeCost(shipType, upgradeType);
    return this.money >= cost && this.getUpgradeLevel(shipType, upgradeType) < 10;
  }

  upgrade(shipType, upgradeType) {
    if (this.canUpgrade(shipType, upgradeType)) {
      const cost = this.getUpgradeCost(shipType, upgradeType);
      this.money -= cost;
      this.upgrades[shipType][upgradeType]++;
      return true;
    }
    return false;
  }

  prestige(force=false) {
    if (this.planetsDestroyed >= 5 || force) {
      this.gold += this.getGoldGainOnPrestige();
      this.prestigeLevel++;
      this.money = 1000;
      this.planetsDestroyed = 0;
      this.currentPlanetIndex = 0;
      this.ships = [];
      this.bullets = [];
      this.upgrades = {
        small: { cooldown: 0, damage: 0 },
        medium: { cooldown: 0, damage: 0 },
        large: { cooldown: 0, damage: 0 }
      };
      this.planets = Object.values(PLANETS).map(planet => new Planet(planet, this.width /2, this.height / 2));
      return true;
    }
    return false;
  }

  getPrestigeUpgradeLevel(upgradeType) {
    return this.prestigeUpgrades[upgradeType];
  }

  getPrestigeUpgradeCost(upgradeType) {
    const currentLevel = this.getPrestigeUpgradeLevel(upgradeType);
    if (currentLevel >= 10) return Infinity;
    return PRESTIGE_UPGRADES[upgradeType].costs[currentLevel];
  }

  canPrestigeUpgrade(upgradeType) {
    const cost = this.getPrestigeUpgradeCost(upgradeType);
    return this.gold >= cost && this.getPrestigeUpgradeLevel(upgradeType) < 10;
  }

  prestigeUpgrade(upgradeType) {
    if (this.canPrestigeUpgrade(upgradeType)) {
      const cost = this.getPrestigeUpgradeCost(upgradeType);
      this.gold -= cost;
      this.prestigeUpgrades[upgradeType]++;
      return true;
    }
    return false;
  }

  getPrestigeLevel() {
    return this.prestigeLevel;
  }

  getGold() {
    return this.gold;
  }

  getGoldGainOnPrestige() {
    return this.planetsDestroyed * PRESTIGE_GOLD_PER_PLANET;
  }
}
