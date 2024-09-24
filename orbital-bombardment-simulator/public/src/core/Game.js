import React, { useRef, useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Simulation } from '../simulation/simulation';
import { GameRenderer } from '../render/renderer';
import GameUI from '../ui/GameUI';
import DebugUI from '../ui/DebugUI';

const OrbitalBombardmentGame = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const simulationRef = useRef(null);
  const [showDebugUI, setShowDebugUI] = useState(false);
  const gameSetupRef = useRef(false);

  useEffect(() => {
    if (gameSetupRef.current || !containerRef.current) return;

    const width = 800;
    const height = 600;
    simulationRef.current = new Simulation(width, height);
    const initialPlanet = simulationRef.current.getCurrentPlanet();
    const renderer = new GameRenderer(containerRef.current, width, height, initialPlanet);
    rendererRef.current = renderer;
    gameSetupRef.current = true;

    let lastTime = 0;
    let animationFrameId;
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      simulationRef.current.update(deltaTime);
      if (simulationRef.current.isRendering) {
        renderer.render(simulationRef.current);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
      simulationRef.current = null;
      gameSetupRef.current = false;
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '800px',
      height: '600px',
      overflow: 'hidden'
    }}>
      <div ref={containerRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }} />
      <GameUI simulationRef={simulationRef} />
      {showDebugUI && <DebugUI simulationRef={simulationRef} />}
      <Settings
        onClick={() => setShowDebugUI(!showDebugUI)}
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          color: 'white'
        }}
      />
    </div>
  );
};

export default OrbitalBombardmentGame;