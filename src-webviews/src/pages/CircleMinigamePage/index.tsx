import { useEffect, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import './style.scss';
import failSound from './sounds/fail.ogg';
import successSound from './sounds/success.ogg';

const CircleMinigamePage = () => {
  const key = 'E';
  const circleWidth = 300;
  const circleHeight = 300;
  const perfectZoneSize = Math.PI / 18;
  let gameActive = false;
  let speed = 0.01;
  let areaSize = 0;
  let iconAngle = 0;
  let targetZoneAngle = 0;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const radius = 100;
  let quantity = 0;

  const [iconX, setIconX] = useState(0);
  const [iconY, setIconY] = useState(0);
  const [icon, setIcon] = useState('');

  useEffect(() => {
    //init(3, 0.01, 0.5, 'fa-solid fa-fish');
    configureEvent(Constants.CIRCLE_MINIGAME_PAGE_SHOW, init);

    emitEvent(Constants.CIRCLE_MINIGAME_PAGE_SHOW);

    document.addEventListener('keydown', keyDown);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === key.toUpperCase())
      checkPosition();
  };

  const checkPosition = () => {
    const tolerance = 1.0;
    const tolerance_radians = tolerance * (Math.PI / 180);
    const perfect_center = targetZoneAngle + (areaSize / 2);
    const perfect_start = perfect_center - (perfectZoneSize / 2) - tolerance_radians;
    const perfect_end = perfect_center + (perfectZoneSize / 2) + tolerance_radians;
    const target_start = targetZoneAngle - tolerance_radians;
    const target_end = targetZoneAngle + areaSize + tolerance_radians;
    if (iconAngle >= perfect_start && iconAngle <= perfect_end) {
      gameEnd('success');
    } else if (iconAngle >= target_start && iconAngle <= target_end) {
      gameEnd('success');
    } else {
      gameEnd('failed');
    }
  };

  const gameEnd = (type: string) => {
    if (type === 'success') {
      quantity--;
      generateNewIconAngle();
      new Audio(successSound).play();
    }
    else {
      new Audio(failSound).play();
    }

    if (type !== 'success' || quantity === 0)
      setTimeout(() => {
        gameActive = false;
        emitEvent(Constants.CIRCLE_MINIGAME_PAGE_END, type === 'success');
      }, 500);
  }

  const init = (setQuantity: number, setSpeed: number, size: number, icon: string) => {
    quantity = setQuantity;
    speed = setSpeed;
    areaSize = size;
    generateNewIconAngle();
    targetZoneAngle = Math.random() * Math.PI * 2;
    setIcon(icon);
    canvas = document.getElementById('skill_circle_canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d');
    gameActive = true;
    animate();
  };

  const generateNewIconAngle = () => {
    iconAngle = Math.random() * Math.PI * 2;
  };

  const drawCircle = () => {
    ctx.clearRect(0, 0, circleWidth, circleHeight);
    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 1)';
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.lineWidth = 40;
    ctx.strokeStyle = 'rgba(15, 15, 15, 1)';
    ctx.arc(circleWidth / 2, circleHeight / 2, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    const start = targetZoneAngle;
    const end = targetZoneAngle + areaSize;
    ctx.beginPath();
    ctx.lineWidth = 40;
    ctx.arc(circleWidth / 2, circleHeight / 2, radius, start, end);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
    const target_center = targetZoneAngle + areaSize / 2;
    const perfect_start_x = circleWidth / 2 + (radius - 20) * Math.cos(target_center);
    const perfect_start_y = circleHeight / 2 + (radius - 20) * Math.sin(target_center);
    const perfect_end_x = circleWidth / 2 + (radius + 20) * Math.cos(target_center);
    const perfect_end_y = circleHeight / 2 + (radius + 20) * Math.sin(target_center);
    ctx.beginPath();
    ctx.moveTo(perfect_start_x, perfect_start_y);
    ctx.lineTo(perfect_end_x, perfect_end_y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    setIconX(circleWidth / 2 + radius * Math.cos(iconAngle));
    setIconY(circleHeight / 2 + radius * Math.sin(iconAngle));
  };

  const animate = () => {
    if (!gameActive) return;
    targetZoneAngle += speed;
    if (targetZoneAngle > Math.PI * 2)
      targetZoneAngle -= Math.PI * 2;
    drawCircle();
    requestAnimationFrame(() => animate());
  };

  return <div id="circleMinigame">
    <div className="skill_circle_container">
      <canvas id="skill_circle_canvas" width={circleWidth} height={circleHeight}></canvas>
      <div className="skill_circle_icon" style={{ left: `${iconX}px`, top: `${iconY}px` }}><i className={icon} aria-hidden="true"></i></div>
      <div className="current_key_display">{key}</div>
    </div>
  </div>;
};

export default CircleMinigamePage;