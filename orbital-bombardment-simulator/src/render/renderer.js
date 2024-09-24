import * as PIXI from 'pixi.js';
import { PLANET_RENDERER_CONFIGS } from './rendererModels';
import { SHIPS } from '../simulation/simulationModels';
import { ObjectPool } from './utils';

const ASSET_PATHS = {
  BACKGROUND: '/assets/game_background.png',
  SHIPS: {
    [SHIPS.SMALL.id]: '/assets/small_ship.png',
    [SHIPS.MEDIUM.id]: '/assets/medium_ship.png',
    [SHIPS.LARGE.id]: '/assets/big_ship.png',
  },
  PLANETS: {
    MERCURY: '/assets/planets/mercury.png',
    VENUS: '/assets/planets/venus.png',
    EARTH: '/assets/planets/earth.png',
    MARS: '/assets/planets/mars.png',
    JUPITER: '/assets/planets/jupiter.png',
  },
  BULLETS: {
    SMALL: '/assets/bullet_small.png',
    MEDIUM: '/assets/bullet_medium.png',
    LARGE: '/assets/bullet_large.png',
  },
  EXPLOSION: '/assets/explosion_spritesheet.png'
};

class ShipRenderer {
  constructor(ship) {
    try {
      if (!ship || !ship.type || !ship.type.id) {
        console.error('Invalid ship object:', ship);
        throw new Error('Invalid ship object');
      }

      this.textures = {
        [SHIPS.SMALL.id]: PIXI.Texture.from(ASSET_PATHS.SHIPS[SHIPS.SMALL.id]),
        [SHIPS.MEDIUM.id]: PIXI.Texture.from(ASSET_PATHS.SHIPS[SHIPS.MEDIUM.id]),
        [SHIPS.LARGE.id]: PIXI.Texture.from(ASSET_PATHS.SHIPS[SHIPS.LARGE.id]),
      };

      if (!this.textures[ship.type.id]) {
        console.error('Invalid ship type:', ship.type.id);
        throw new Error('Invalid ship type');
      }

      this.sprite = new PIXI.Sprite(this.textures[ship.type.id]);
      this.sprite.anchor.set(0.5);
      this.updateSprite(ship);
    } catch (error) {
      console.error('Error in ShipRenderer constructor:', error);
      throw error;
    }
  }

  updateSprite(ship) {
    try {
      if (!ship || !ship.type) return;
      this.sprite.texture = this.textures[ship.type.id];

      switch(ship.type.id) {
        case SHIPS.SMALL.id:
          this.sprite.scale.set(0.25);
          break;
        case SHIPS.MEDIUM.id:
          this.sprite.scale.set(0.3);
          break;
        case SHIPS.LARGE.id:
          this.sprite.scale.set(0.37);
          break;
        default:
          console.warn(`Unexpected ship type: ${ship.type.id}`);
          this.sprite.scale.set(0.5);
      }
    } catch (error) {
      console.error('Error in updateSprite:', error);
    }
  }

  render(ship) {
    try {
      this.sprite.x = ship.x;
      this.sprite.y = ship.y;
      this.sprite.rotation = ship.angle + Math.PI / 2;
    } catch (error) {
      console.error('Error in ShipRenderer render:', error);
    }
  }
}

class BulletRenderer {
  constructor(bullet) {
    this.textures = {
      [SHIPS.SMALL.id]: PIXI.Texture.from(ASSET_PATHS.BULLETS.SMALL),
      [SHIPS.MEDIUM.id]: PIXI.Texture.from(ASSET_PATHS.BULLETS.MEDIUM),
      [SHIPS.LARGE.id]: PIXI.Texture.from(ASSET_PATHS.BULLETS.LARGE),
    };
    this.sprite = new PIXI.Sprite(this.textures[SHIPS.SMALL.id]); // Default to small bullet
    this.sprite.anchor.set(0.5);
    this.updateSprite(bullet);
  }

  updateSprite(bullet) {
    if (!bullet || !bullet.shipType) {
      console.warn('Invalid bullet object:', bullet);
      return;
    }

    if (this.textures[bullet.shipType]) {
      this.sprite.texture = this.textures[bullet.shipType];
    } else {
      console.warn(`Unexpected ship type for bullet: ${bullet.shipType}`);
      this.sprite.texture = this.textures[SHIPS.SMALL.id];
    }

    // You might want to adjust the scale based on the bullet type
    switch (bullet.shipType) {
      case SHIPS.SMALL.id:
        this.sprite.scale.set(1);
        break;
      case SHIPS.MEDIUM.id:
        this.sprite.scale.set(1);
        break;
      case SHIPS.LARGE.id:
        this.sprite.scale.set(1);
        break;
    }
  }

  render(bullet) {
    this.sprite.x = bullet.x;
    this.sprite.y = bullet.y;
  }
}

class PlanetRenderer {
  constructor(planet) {
    try {
      if (!planet || !planet.id) {
        console.error('Invalid planet object:', planet);
        throw new Error('Invalid planet object');
      }

      this.textures = {
        MERCURY: PIXI.Texture.from(ASSET_PATHS.PLANETS.MERCURY),
        VENUS: PIXI.Texture.from(ASSET_PATHS.PLANETS.VENUS),
        EARTH: PIXI.Texture.from(ASSET_PATHS.PLANETS.EARTH),
        MARS: PIXI.Texture.from(ASSET_PATHS.PLANETS.MARS),
        JUPITER: PIXI.Texture.from(ASSET_PATHS.PLANETS.JUPITER),
      };

      if (!this.textures[planet.id.toUpperCase()]) {
        console.error('Invalid planet type:', planet.id);
        throw new Error('Invalid planet type');
      }

      this.sprite = new PIXI.Sprite(this.textures[planet.id.toUpperCase()]);
      this.sprite.anchor.set(0.5);

      this.healthBarSprite = new PIXI.Graphics();
      this.nameText = new PIXI.Text(planet.name.toUpperCase(), {
        fontFamily: "'Exo', sans-serif",
        fontSize: 18,
        fill: 0xFFFFFF,
        align: 'center'
      });
      this.nameText.anchor.set(0.5);

      this.namePadding = 30;
      this.healthBarPadding = 20;
      this.healthBarWidth = 100;
      this.healthBarHeight = 10;

      // Create explosion textures
      this.explosionTextures = [];
      const spritesheet = PIXI.BaseTexture.from(ASSET_PATHS.EXPLOSION);
      for (let i = 0; i < 8; i++) {
        this.explosionTextures.push(new PIXI.Texture(spritesheet, new PIXI.Rectangle(i * 135, 0, 135, 135)));
      }

      // Create explosion sprite
      this.explosionSprite = new PIXI.Sprite(this.explosionTextures[0]);
      this.explosionSprite.anchor.set(0.5);
      this.explosionSprite.visible = false;
      this.explosionSprite.scale.set(1); // Adjust scale as needed

      // Explosion animation control
      this.explosionFrame = 0;
      this.explosionPlaying = false;
      this.explosionSpeed = 20; // Adjust this value to control animation speed (frames per update)
      this.explosionCounter = 0;
      this.explosionRepeatCount = 1; // Number of times to play the animation
      this.explosionCurrentRepeat = 0;

      this.updateSprite(planet);
    } catch (error) {
      console.error('Error in PlanetRenderer constructor:', error);
      throw error;
    }
  }

  updateSprite(planet) {
    try {
      if (!planet || !planet.id) return;
      this.sprite.texture = this.textures[planet.id.toUpperCase()];

      switch(planet.id.toUpperCase()) {
        case 'MERCURY':
          this.sprite.scale.set(1);
          break;
        case 'VENUS':
          this.sprite.scale.set(1);
          break;
        case 'EARTH':
          this.sprite.scale.set(1.25);
          break;
        case 'MARS':
          this.sprite.scale.set(1.25);
          break;
        case 'JUPITER':
          this.sprite.scale.set(1.5);
          break;
        default:
          console.warn(`Unexpected planet type: ${planet.id}`);
          this.sprite.scale.set(0.5);
      }

      const scaledHeight = this.sprite.height * this.sprite.scale.y;

      this.healthBarSprite.x = -this.healthBarWidth / 2;
      this.healthBarSprite.y = (scaledHeight / 2) + this.healthBarPadding;

      this.nameText.y = -(scaledHeight / 2) - this.namePadding;
    } catch (error) {
      console.error('Error in updateSprite:', error);
    }
  }

  updateRotation(deltaTime) {
    const rotationSpeed = 0.1;
    this.sprite.rotation += rotationSpeed * deltaTime;
  }

  updateExplosion() {
    if (this.explosionPlaying) {
      this.explosionCounter++;
      if (this.explosionCounter >= this.explosionSpeed) {
        this.explosionCounter = 0;
        this.explosionFrame++;
        if (this.explosionFrame >= this.explosionTextures.length) {
          this.explosionCurrentRepeat++;
          if (this.explosionCurrentRepeat >= this.explosionRepeatCount) {
            // All repeats complete
            this.explosionPlaying = false;
            this.explosionSprite.visible = false;
          } else {
            // Start next repeat
            this.explosionFrame = 0;
          }
        }
        this.explosionSprite.texture = this.explosionTextures[this.explosionFrame];
      }
    }
  }

  playExplosion(repeatCount = 1) {
    this.explosionPlaying = true;
    this.explosionFrame = 0;
    this.explosionCounter = 0;
    this.explosionRepeatCount = repeatCount;
    this.explosionCurrentRepeat = 0;
    this.explosionSprite.visible = true;
    this.explosionSprite.texture = this.explosionTextures[0];
  }

  render(planet, health) {
    try {
      if (health <= 0 && !this.explosionPlaying) {
        this.sprite.visible = false;
        this.healthBarSprite.visible = false;
        this.nameText.visible = false;
        this.playExplosion(1); // Play the explosion once
      } else if (health > 0) {
        this.sprite.visible = true;
        this.healthBarSprite.visible = true;
        this.nameText.visible = true;
        this.explosionSprite.visible = false;

        this.healthBarSprite.clear();
        this.healthBarSprite.beginFill(0x191123);
        this.healthBarSprite.drawRect(0, 0, this.healthBarWidth, this.healthBarHeight);
        this.healthBarSprite.endFill();

        const healthPercentage = health / planet.maxHealth;
        const healthFillWidth = this.healthBarWidth * healthPercentage;

        this.healthBarSprite.beginFill(0xFF4C4C);
        this.healthBarSprite.drawRect(0, 0, healthFillWidth, this.healthBarHeight);
        this.healthBarSprite.endFill();

        this.nameText.text = planet.name.toUpperCase();
      }

      this.updateExplosion();
    } catch (error) {
      console.error('Error in PlanetRenderer render:', error);
    }
  }
}

export class GameRenderer {
  constructor(container, width, height, initialPlanet) {
    try {
      this.width = width;
      this.height = height;
      this.app = new PIXI.Application({
        width,
        height,
        backgroundColor: 0x000000,
      });
      container.appendChild(this.app.view);

      this.background = PIXI.Sprite.from(ASSET_PATHS.BACKGROUND);
      this.background.width = width;
      this.background.height = height;
      this.app.stage.addChild(this.background);

      this.shipRenderers = new Map();
      this.bulletRenderers = new Map();

      this.planetRenderer = new PlanetRenderer(initialPlanet);
      this.planetRenderer.sprite.x = width / 2;
      this.planetRenderer.sprite.y = height / 2;
      this.planetRenderer.explosionSprite.x = width / 2;
      this.planetRenderer.explosionSprite.y = height / 2;

      this.app.stage.addChild(this.planetRenderer.sprite);
      this.app.stage.addChild(this.planetRenderer.healthBarSprite);
      this.app.stage.addChild(this.planetRenderer.nameText);
      this.app.stage.addChild(this.planetRenderer.explosionSprite);

      this.shipPool = new ObjectPool(() => new ShipRenderer({type: {id: SHIPS.SMALL.id}}));
      this.bulletPool = new ObjectPool(() => new BulletRenderer({shipType: SHIPS.SMALL.id}));

      this.lastUpdateTime = Date.now();

      this.preloadTextures();
    } catch (error) {
      console.error('Error in GameRenderer constructor:', error);
    }
  }

  preloadTextures() {
    Object.values(ASSET_PATHS.SHIPS).forEach(path => {
      PIXI.Texture.from(path);
    });
    Object.values(ASSET_PATHS.PLANETS).forEach(path => {
      PIXI.Texture.from(path);
    });
    Object.values(ASSET_PATHS.BULLETS).forEach(path => {
      PIXI.Texture.from(path);
    });
  }

  getShipRenderer(ship) {
    try {
      if (!this.shipRenderers.has(ship)) {
        console.log('Creating new ShipRenderer for ship:', ship);
        const renderer = this.shipPool.get();
        renderer.updateSprite(ship);
        this.app.stage.addChild(renderer.sprite);
        this.shipRenderers.set(ship, renderer);
      }
      return this.shipRenderers.get(ship);
    } catch (error) {
      console.error('Error in getShipRenderer:', error);
      console.error('Ship object:', ship);
      throw error;
    }
  }

  getBulletRenderer(bullet) {
    if (!this.bulletRenderers.has(bullet)) {
      const renderer = this.bulletPool.get();
      renderer.updateSprite(bullet);  // This will now use the correct sprite based on bullet.shipType
      this.app.stage.addChild(renderer.sprite);
      this.bulletRenderers.set(bullet, renderer);
    }
    return this.bulletRenderers.get(bullet);
  }


  getPlanetRenderer(planet) {
    if (this.planetRenderer.sprite.texture !== this.planetRenderer.textures[planet.id.toUpperCase()]) {
      this.planetRenderer.updateSprite(planet);
    }
    return this.planetRenderer;
  }

  removeShipRenderer(ship) {
    const renderer = this.shipRenderers.get(ship);
    if (renderer) {
      this.app.stage.removeChild(renderer.sprite);
      this.shipPool.release(renderer);
      this.shipRenderers.delete(ship);
    }
  }

  removeBulletRenderer(bullet) {
    const renderer = this.bulletRenderers.get(bullet);
    if (renderer) {
      this.app.stage.removeChild(renderer.sprite);
      this.bulletPool.release(renderer);
      this.bulletRenderers.delete(bullet);
    }
  }

  updatePlanetRotation() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
    this.planetRenderer.updateRotation(deltaTime);
    this.lastUpdateTime = currentTime;
  }

  render(simulation) {
    try {
      this.updatePlanetRotation();

      simulation.ships.forEach(ship => {
        try {
          const renderer = this.getShipRenderer(ship);
          renderer.render(ship);
        } catch (error) {
          console.error('Error rendering ship:', error);
          console.error('Problematic ship:', ship);
        }
      });

      this.shipRenderers.forEach((renderer, ship) => {
        if (!simulation.ships.includes(ship)) {
          this.removeShipRenderer(ship);
        }
      });

      simulation.bullets.forEach(bullet => {
        const renderer = this.getBulletRenderer(bullet);
        renderer.render(bullet);
      });

      this.bulletRenderers.forEach((renderer, bullet) => {
        if (!simulation.bullets.includes(bullet)) {
          this.removeBulletRenderer(bullet);
        }
      });

      const currentPlanet = simulation.getCurrentPlanet();
      const planetRenderer = this.getPlanetRenderer(currentPlanet);
      planetRenderer.render(currentPlanet, simulation.getPlanetHealth());

      planetRenderer.sprite.x = this.width / 2;
      planetRenderer.sprite.y = this.height / 2;
      planetRenderer.explosionSprite.x = this.width / 2;
      planetRenderer.explosionSprite.y = this.height / 2;
      planetRenderer.healthBarSprite.x = this.width / 2 - planetRenderer.healthBarWidth / 2;
      planetRenderer.healthBarSprite.y = this.height / 2 +
        (planetRenderer.sprite.height * planetRenderer.sprite.scale.y / 2) +
        planetRenderer.healthBarPadding;

      planetRenderer.nameText.x = this.width / 2;
      planetRenderer.nameText.y = this.height / 2 -
        (planetRenderer.sprite.height * planetRenderer.sprite.scale.y / 2) -
        planetRenderer.namePadding;
    } catch (error) {
      console.error('Error in GameRenderer render:', error);
    }
  }

  destroy() {
    this.app.destroy(true);
  }
}