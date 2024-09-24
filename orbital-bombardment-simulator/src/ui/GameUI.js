import React, { useState, useEffect } from 'react';
import { SHIPS, UPGRADES, PRESTIGE_UPGRADES } from '../simulation/simulationModels';

const Button = ({ onClick, children, disabled, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.25rem 0.5rem',
      background: disabled ? 'linear-gradient(to bottom, #888, #666)' : '#FFAE1D',
      color: '#000000',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
      marginRight: '0.25rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '0.7rem',
      fontFamily: "'Exo', sans-serif",
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      ...style
    }}
  >
    {children}
  </button>
);

const PurchaseItem = ({ name, cost, onClick, disabled }) => (
  <div style={{
    width: '100px',
    height: '70px',
    border: '1px solid #FFAE1D',
    borderRadius: '0.25rem',
    padding: '0.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
    margin: '0.25rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }}>
    <div style={{ color: 'white', textAlign: 'center', fontSize: '0.8rem', fontFamily: "'Exo', sans-serif", textTransform: 'uppercase' }}>
      <div>{name}</div>
      <div>${cost}</div>
    </div>
    <Button onClick={onClick} disabled={disabled} style={{ width: '50px', height: '25px', fontSize: '0.6rem', padding: '0' }}>
      Buy
    </Button>
  </div>
);

const HUD = ({ simulation, onOpenShips, onOpenUpgrades, onOpenPrestige }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '5px',
      left: '5px',
      right: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      fontSize: '0.8rem',
      fontFamily: "'Exo', sans-serif",
      textTransform: 'uppercase'
    }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/money_icon.png" alt="Money" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          Money: <span style={{ color: '#4ade80' }}>${simulation.getMoney()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/health_icon.png" alt="Health" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          Planet HP: <span style={{ color: '#60a5fa' }}>{simulation.getPlanetHealth()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/destroyed_icon.png" alt="Destroyed" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          Destroyed: <span style={{ color: '#f87171' }}>{simulation.getPlanetsDestroyed()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/gold_icon.png" alt="Gold" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          Gold: <span style={{ color: '#fcd34d' }}>{simulation.getGold()}</span>
        </div>
      </div>
      <div>
        <Button onClick={onOpenShips}>Ships</Button>
        <Button onClick={onOpenUpgrades}>Upgrades</Button>
        <Button onClick={onOpenPrestige}>Prestige</Button>
      </div>
    </div>
  );
};

const ShipsSubmenu = ({ simulation, onClose }) => (
  <div style={{
    position: 'absolute',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
    padding: '1rem',
    borderRadius: '0.25rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    maxWidth: '80%',
    fontFamily: "'Exo', sans-serif",
    textTransform: 'uppercase'
  }}>
    <Button onClick={onClose} style={{ position: 'absolute', top: '5px', right: '5px' }}>X</Button>
    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Ships</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Object.values(SHIPS).map(type => (
        <PurchaseItem
          key={type.id}
          name={`Buy ${type.id}`}
          cost={simulation.getShipCost(type.id)}
          onClick={() => simulation.buyShip(type.id)}
          disabled={simulation.getMoney() < simulation.getShipCost(type.id)}
        />
      ))}
    </div>
  </div>
);

const UpgradeSubmenu = ({ simulation, onClose }) => (
  <div style={{
    position: 'absolute',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
    padding: '1rem',
    borderRadius: '0.25rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    maxWidth: '80%',
    fontFamily: "'Exo', sans-serif",
    textTransform: 'uppercase'
  }}>
    <Button onClick={onClose} style={{ position: 'absolute', top: '5px', right: '5px' }}>X</Button>
    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Upgrades</h3>
    {Object.keys(UPGRADES).map(shipType => (
      <div key={shipType} style={{ marginBottom: '1rem' }}>
        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>{shipType.toUpperCase()} Upgrades:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <PurchaseItem
            name={`Cool (${simulation.getUpgradeLevel(shipType.toLowerCase(), 'cooldown')}/10)`}
            cost={simulation.getUpgradeCost(shipType.toLowerCase(), 'cooldown')}
            onClick={() => simulation.upgrade(shipType.toLowerCase(), 'cooldown')}
            disabled={!simulation.canUpgrade(shipType.toLowerCase(), 'cooldown')}
          />
          <PurchaseItem
            name={`Dmg (${simulation.getUpgradeLevel(shipType.toLowerCase(), 'damage')}/10)`}
            cost={simulation.getUpgradeCost(shipType.toLowerCase(), 'damage')}
            onClick={() => simulation.upgrade(shipType.toLowerCase(), 'damage')}
            disabled={!simulation.canUpgrade(shipType.toLowerCase(), 'damage')}
          />
        </div>
      </div>
    ))}
  </div>
);

const PrestigeSubmenu = ({ simulation, onClose }) => (
  <div style={{
    position: 'absolute',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
    padding: '1rem',
    borderRadius: '0.25rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    maxWidth: '80%',
    fontFamily: "'Exo', sans-serif",
    textTransform: 'uppercase'
  }}>
    <Button onClick={onClose} style={{ position: 'absolute', top: '5px', right: '5px' }}>X</Button>
    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Prestige</h3>
    <div style={{ color: 'white', marginBottom: '1rem' }}>
      Prestige Level: {simulation.getPrestigeLevel()}
    </div>
    <div style={{ color: 'white', marginBottom: '1rem' }}>
      Gold: {simulation.getGold()}
    </div>
    <div style={{ color: 'white', marginBottom: '1rem' }}>
      Gold gain on prestige: {simulation.getGoldGainOnPrestige()}
    </div>
    <Button
      onClick={() => simulation.prestige()}
      disabled={simulation.getPlanetsDestroyed() < 5}
      style={{ marginBottom: '1rem' }}
    >
      Prestige (Requires 5 planets destroyed)
    </Button>
    <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Prestige Upgrades:</h4>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Object.entries(PRESTIGE_UPGRADES).map(([upgradeType, upgrade]) => (
        <PurchaseItem
          key={upgradeType}
          name={`${upgrade.name} (${simulation.getPrestigeUpgradeLevel(upgradeType)}/10)`}
          cost={simulation.getPrestigeUpgradeCost(upgradeType)}
          onClick={() => simulation.prestigeUpgrade(upgradeType)}
          disabled={!simulation.canPrestigeUpgrade(upgradeType)}
        />
      ))}
    </div>
  </div>
);

const GameUI = ({ simulationRef }) => {
  const [, forceUpdate] = useState();
  const [showShips, setShowShips] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 100);
    return () => clearInterval(interval);
  }, []);

  if (!simulationRef.current) return null;

  const simulation = simulationRef.current;

  return (
    <div style={{
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      fontFamily: "'Exo', sans-serif",
      textTransform: 'uppercase'
    }}>
      <HUD
        simulation={simulation}
        onOpenShips={() => setShowShips(true)}
        onOpenUpgrades={() => setShowUpgrades(true)}
        onOpenPrestige={() => setShowPrestige(true)}
      />
      {showShips && <ShipsSubmenu simulation={simulation} onClose={() => setShowShips(false)} />}
      {showUpgrades && <UpgradeSubmenu simulation={simulation} onClose={() => setShowUpgrades(false)} />}
      {showPrestige && <PrestigeSubmenu simulation={simulation} onClose={() => setShowPrestige(false)} />}
    </div>
  );
};

export default GameUI;