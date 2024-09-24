export const SHIP_RENDERER_CONFIGS = {
  SMALL: {
    width: 20,
    height: 10,
    color: 0x00FF00,
  },
  MEDIUM: {
    width: 30,
    height: 15,
    color: 0x0000FF,
  },
  LARGE: {
    width: 40,
    height: 20,
    color: 0xFF0000,
  }
};

export const PLANET_RENDERER_CONFIGS = {
  MERCURY: {
    minRadius: 30,
    maxRadius: 40,
    minCraterCount: 1,
    maxCraterCount: 3,
    craterOpacity: 0.4,
    minCraterSize: 0.05,
    maxCraterSize: 0.15,
    craterDistanceFactor: 0.6,
    color: 0xC0C0C0,
    rotationSpeed: 0.1
  },
  VENUS: {
    minRadius: 35,
    maxRadius: 45,
    minCraterCount: 2,
    maxCraterCount: 4,
    craterOpacity: 0.3,
    minCraterSize: 0.06,
    maxCraterSize: 0.18,
    craterDistanceFactor: 0.65,
    color: 0xFFA500,
    rotationSpeed: 0.08
  },
  EARTH: {
    minRadius: 40,
    maxRadius: 50,
    minCraterCount: 3,
    maxCraterCount: 5,
    craterOpacity: 0.2,
    minCraterSize: 0.07,
    maxCraterSize: 0.2,
    craterDistanceFactor: 0.7,
    color: 0x0000FF,
    rotationSpeed: 0.05
  },
  MARS: {
    minRadius: 38,
    maxRadius: 48,
    minCraterCount: 4,
    maxCraterCount: 6,
    craterOpacity: 0.35,
    minCraterSize: 0.08,
    maxCraterSize: 0.22,
    craterDistanceFactor: 0.75,
    color: 0xFF4500,
    rotationSpeed: 0.06
  },
  JUPITER: {
    minRadius: 60,
    maxRadius: 80,
    minCraterCount: 5,
    maxCraterCount: 8,
    craterOpacity: 0.25,
    minCraterSize: 0.1,
    maxCraterSize: 0.25,
    craterDistanceFactor: 0.8,
    color: 0xFFA07A,
    rotationSpeed: 0.03
  }
};
