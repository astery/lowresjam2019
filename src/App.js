import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stage, Layer, Rect, Sprite } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image'
import sprites from './sprites.png'

const frameDelay = 1000 / 60;
const scale = 10;
const width = 64;
const realWidth = scale * width;
const bgColor = '#5D1D45';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }
}

function Hero({position, color}) {
  const w = width/6
  const x = position.x - w/2
  const y = position.y - w/2

  const [image, st] = useImage(sprites);

  return (
    <Sprite
      x={x}
      y={y}
      image={image}
      animation='standing'
      animations={{
        standing: [
          3, 32, 10, 20,
          13, 32, 10, 20,
          23, 32, 10, 20,
        ],
      }}
      frameRate={7}
      frameIndex={0}
    />
  );
}

function Background() {
  return (
    <Rect
      x={0}
      y={0}
      width={width}
      height={width}
      fill={bgColor}
    />
  );
}

function App() {
  const [tick, setTick] = useState(0)
  const [heroPosition, setHeroPosition] = useState(new Vector(width/2, width/2))
  const [heroMove, setHeroMove] = useState(new Vector(0, 0))
  const [heroColor, _] = useState(Konva.Util.getRandomColor())

  const onKey = useCallback((e) => {
    const keyName = e.key;
    const force = 1;
    console.log(e.type, keyName)

    if (e.type === 'keydown') {
      switch (keyName) {
        case 'ArrowUp':
          setHeroMove(new Vector(0, -force))
          return;
        case 'ArrowDown':
          setHeroMove(new Vector(0, force))
          return;
        case 'ArrowLeft':
          setHeroMove(new Vector(-force, 0))
          return;
        case 'ArrowRight':
          setHeroMove(new Vector(force, 0))
          return;
        default:
          return;
      }
    } else if (e.type === 'keyup') {
      switch (keyName) {
        case 'ArrowUp':
          setHeroMove(new Vector(0, 0))
          return;
        case 'ArrowDown':
          setHeroMove(new Vector(0, 0))
          return;
        case 'ArrowLeft':
          setHeroMove(new Vector(0, 0))
          return;
        case 'ArrowRight':
          setHeroMove(new Vector(0, 0))
          return;
        default:
          return;
      }
    }
  }, [setHeroMove]);

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
  }, [])

  const updateTick = useCallback(() => setTick(tick + 1), [tick])

  useInterval(updateTick, frameDelay)

  useEffect(() => {
    setHeroPosition(heroPosition.add(heroMove))
  }, [tick]);

  return (
    <Stage width={realWidth} height={realWidth} scaleX={scale} scaleY={scale}>
      <Layer>
        <Background />
        <Hero position={heroPosition} color={heroColor} />
      </Layer>
    </Stage>
  );
}

export default App;
