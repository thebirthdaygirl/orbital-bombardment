import React, { useState, useEffect } from 'react';
import { SHIPS } from '../simulation/simulationModels';

const DebugUI = ({ simulationRef }) => {
  const [, forceUpdate] = useState();
  const [showHUD, setShowHUD] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 100);
    return () => clearInterval(interval);
  }, []);

  if (!simulationRef.current) return null;

  const simulation = simulationRef.current;

  return (
    <div style={{
      position: 'absolute',
      bottom: '40px',
      left: '10px',
      right: '10px',
      display: 'flex',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '1rem',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '780px'
      }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
          Fire Rate
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={simulation.getFireRate()}
            onChange={(e) => simulation.setFireRate(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={() => simulation.toggleRendering()}>
            {simulation.getIsRendering() ? 'Pause Rendering' : 'Resume Rendering'}
          </button>
          <button onClick={() => setShowHUD(!showHUD)}>
            {showHUD ? 'Hide HUD' : 'Show HUD'}
          </button>
          <span style={{ color: 'white' }}>Total Ships: {simulation.getTotalShipCount()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {Object.values(SHIPS).map(type => (
            <div key={type.id} style={{ textAlign: 'center' }}>
              <button onClick={() => simulation.addShip(type.id, Math.random() *800, Math.random() * 600)}>Add {type.id}</button>
              <button onClick={() => {
                const ship = simulation.ships.find(s => s.type.id === type.id);
                if (ship) simulation.removeShip(ship);
              }}>Remove {type.id}</button>
              <div style={{ color: 'white' }}>{type.id}: {simulation.getShipCount(type.id)}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: 'white', marginRight: '1rem' }}>
            Prestige Level:
            <input
              type="number"
              value={simulation.getPrestigeLevel()}
              onChange={(e) => {
                simulation.prestigeLevel = parseInt(e.target.value);
                forceUpdate({});
              }}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
          <label style={{ color: 'white' }}>
            Gold:
            <input
              type="number"
              value={simulation.getGold()}
              onChange={(e) => {
                simulation.gold = parseInt(e.target.value);
                forceUpdate({});
              }}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: 'white' }}>
            Planets Destroyed:
            <input
              type="number"
              value={simulation.getPlanetsDestroyed()}
              onChange={(e) => {
                simulation.planetsDestroyed = parseInt(e.target.value);
                forceUpdate({});
              }}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
        </div>
        <button onClick={() => simulation.prestige(true)}>Force Prestige</button>
      </div>
    </div>
  );
};

export default DebugUI;
