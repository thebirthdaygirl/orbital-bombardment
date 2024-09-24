export const SHIPS = {
  SMALL: {
    id: 'small',
    fireRateMultiplier: 1.5,
    baseCost: 100,
    costIncreaseFactor: 1.1,
    damagePerShot: 1
  },
  MEDIUM: {
    id: 'medium',
    fireRateMultiplier: 1,
    baseCost: 250,
    costIncreaseFactor: 1.15,
    damagePerShot: 3
  },
  LARGE: {
    id: 'large',
    fireRateMultiplier: 0.7,
    baseCost: 500,
    costIncreaseFactor: 1.2,
    damagePerShot: 7
  }
};

export const PLANETS = {
  MERCURY: {
    id: 'mercury',
    name: "Mercury",
    health: 1000
  },
  VENUS: {
    id: 'venus',
    name: "Venus",
    health: 2000
  },
  EARTH: {
    id: 'earth',
    name: "Earth",
    health: 3000
  },
  MARS: {
    id: 'mars',
    name: "Mars",
    health: 4000
  },
  JUPITER: {
    id: 'jupiter',
    name: "Jupiter",
    health: 5000
  }
};

export const UPGRADES = {
  SMALL: {
    cooldown: {
      levels: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
      costs: [0, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600]
    },
    damage: {
      levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      costs: [0, 150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400]
    }
  },
  MEDIUM: {
    cooldown: {
      levels: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
      costs: [0, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200]
    },
    damage: {
      levels: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      costs: [0, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800]
    }
  },
  LARGE: {
    cooldown: {
      levels: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
      costs: [0, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400]
    },
    damage: {
      levels: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      costs: [0, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800, 153600]
    }
  }
};

export const PRESTIGE_UPGRADES = {
  MONEY_MULTIPLIER: {
    name: "Money Multiplier",
    levels: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2],
    costs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  DAMAGE_MULTIPLIER: {
    name: "Damage Multiplier",
    levels: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2],
    costs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }
};

export const PRESTIGE_GOLD_GAIN = [
  4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
];

export const PRESTIGE_GOLD_PER_PLANET = 2;
