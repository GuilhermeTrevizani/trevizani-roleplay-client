import { useEffect, useRef } from 'react';
import { Constants } from '../../../../src/base/constants';
import { configureEvent, emitEvent } from '../../services/util';
import './style.scss';
import breakSound from './sounds/break.wav';
import clickSound from './sounds/click.wav';
import tapSound from './sounds/tap.wav';
import unlockSound from './sounds/unlock.mp3';
import gsap from 'gsap';

const PickLockPage = () => {
  useEffect(() => {
    configureEvent(Constants.PICK_LOCK_PAGE_SHOW, (difficulty: number, pins: number, attempts: number) => {
      setUpGame(difficulty, pins, attempts);
    });

    lockContainer.current.addEventListener('mousemove', moveHook);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    emitEvent(Constants.PICK_LOCK_PAGE_SHOW);

    return () => {
      if (lockContainer?.current)
        lockContainer.current.removeEventListener('mousemove', moveHook);
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
    };
  }, []);

  const keyDown = (event: KeyboardEvent) => {
    if (event.key === 'd' && !isPinning) {
      applyTension();
    } else if (event.key === 'Escape') {
      lockContainer.current.classList.add('hide');
      close(false);
    }
  };

  const keyUp = (event: KeyboardEvent) => {
    if (event.key === 'd' && isPinning) {
      releaseTension();
    }
  };

  const close = (success: boolean) => {
    emitEvent(Constants.PICK_LOCK_PAGE_CLOSE, success);
  }

  const end = useRef<HTMLDivElement>(null);
  const hook = useRef<HTMLDivElement>(null);
  const wrench = useRef<HTMLDivElement>(null);
  const lockContainer = useRef<HTMLDivElement>(null);

  let difficulty = 2;
  let attempts = 3;
  let pinAmt = 9;
  let pins = [];
  let correctOrder = shuffleArray(pins.slice());
  let currentPin = 0;
  let isPinning = false;
  let cooldown = false;

  function showGame() {
    lockContainer.current.classList.remove('hide');
  }

  function setUpGame(diff: number, pinsNo: number, attemptsCount: number) {
    const currentPins = document.querySelectorAll("#lock-container .pin-slide")
    for (let i = 0; i < currentPins.length; i++) {
      currentPins[i].parentNode.removeChild(currentPins[i]);
    }
    currentPin = 0;
    releaseTension();
    pins = [];
    difficulty = (diff <= 5 ? (diff > 0 ? diff : 1) : 5);
    pinAmt = (pinsNo <= 9 ? (pinsNo > 2 ? pinsNo : 3) : 9);
    attempts = attemptsCount;
    createPins();
    positionPins();
    showGame();
  }

  function createPins() {
    for (let i = 0; i < pinAmt; i++) {
      pins.push(`pin${i + 1}`)
    }
    correctOrder = shuffleArray(pins.slice());
    pins.forEach(pinId => {
      const pinElement = document.createElement('div');
      pinElement.id = pinId;
      pinElement.classList.add('pin');
      const pinElementContainer = document.createElement('div');
      pinElementContainer.classList.add('pin-container');
      pinElementContainer.appendChild(pinElement)
      const pinElementSlide = document.createElement('div');
      pinElementSlide.classList.add('pin-slide');
      const pinSpring = document.createElement('div');
      pinSpring.classList.add('spring');
      pinElementSlide.appendChild(pinSpring)
      pinElementSlide.appendChild(pinElementContainer)
      lockContainer.current.appendChild(pinElementSlide);
    });
  }

  function moveHook(event: MouseEvent) {
    const rect = lockContainer.current.getBoundingClientRect();
    const hookRect = end.current.getBoundingClientRect();
    const x = event.clientX - rect.left - end.current.offsetWidth - 5 / 2;
    const y = event.clientY - rect.top - end.current.offsetHeight - 37 / 2;

    const minX = 0;
    const maxX = rect.width - hookRect.width;
    const minY = (rect.height / 2) - 40;
    const maxY = rect.height - hookRect.height - 80;
    const rotY = (rect.height / 2) + 20;

    hook.current.style.left = `${Math.max(minX, Math.min(x, maxX))}px`;
    hook.current.style.top = `${Math.max(rotY, Math.min(y, maxY))}px`;

    if (y < rotY && y > minY) {
      hook.current.style.transform = `rotate(${- (y - rotY) / 8}deg)`;
    } else if (y > rotY) {
      hook.current.style.transform = ``;
    }

    checkPinCollision();
  }

  function checkPinCollision() {
    const endRect = end.current.getBoundingClientRect();
    const pins = document.getElementsByClassName('pin');
    const lockRect = lockContainer.current.getBoundingClientRect();

    for (let i = 0; i < pins.length; i++) {
      const pinRect = pins[i].getBoundingClientRect();
      const diff = 145 + (6 - difficulty);
      const pinParentNode = pins[i].parentNode as HTMLDivElement;
      const spring = pins[i].parentNode.parentNode.querySelector('.spring') as HTMLDivElement;

      if (
        endRect.left < pinRect.right &&
        endRect.right > pinRect.left &&
        endRect.top - 3 < pinRect.bottom &&
        endRect.bottom > pinRect.top
      ) {
        if (!isPinning) {
          spring.style.transform = `scaleY(${((parseInt(pinParentNode.style.top) + 20) - (lockRect.top - 12)) / 135 + 0.23}`;
          pinParentNode.style.top = endRect.top - 126 + "px";
        } else {
          if (parseInt(pinParentNode.style.top) > 145) {
            spring.style.transform = `scaleY(${((parseInt(pinParentNode.style.top) + 20) - (lockRect.top - 12)) / 135 + 0.23}`;
            pinParentNode.style.top = endRect.top - 126 + "px";
            if (parseInt(pinParentNode.style.top) < diff && !pins[i].classList.contains('shake')) {
              const pinId = pins[i].id;
              if (pinId !== correctOrder[currentPin] && !pins[i].classList.contains('correct')) {
                pins[i].classList.add('shake');
              }
            }
          } else {
            if (!cooldown) {
              selectPin(pins[i]);
            }
          }
        }
      } else {
        if (pins[i].classList.contains('shake')) {
          pins[i].classList.remove('shake');
        }
        spring.style.transform = ``;
        pinParentNode.style.top = (lockRect.height / 2) + "px";
      }
    }
  }

  function breakHook() {
    const hookTop = hook.current.querySelector('#top');
    const hookBott = hook.current.querySelector('#bottom');
    const tl = gsap.timeline();
    tl.to(hookTop, {
      duration: 0.7,
      rotationZ: -400,
      x: -200,
      y: -100,
      opacity: 0
    });
    tl.to(hookBott, {
      duration: 0.7,
      rotationZ: 400,
      x: 200,
      y: 100,
      opacity: 0,
      onComplete: function () {
        gsap.to(hookTop, {
          duration: 0,
          rotationZ: 0,
          x: 4,
          y: 11,
          opacity: 1
        });
        gsap.to(hookBott, {
          duration: 0,
          rotationZ: 0,
          x: 0,
          y: 0,
          opacity: 1
        });
      }
    }, 0)
    new Audio(breakSound).play();
    tl.play();
  }

  function resetPins() {
    const pins = document.getElementsByClassName('pin');
    for (let i = 0; i < pins.length; i++) {
      if (pins[i].classList.contains('correct')) {
        pins[i].classList.remove('correct');
      }
    }
    currentPin = 0;
  }

  function applyTension() {
    isPinning = true;
    wrench.current.classList.add('shake-small');
  }

  function releaseTension() {
    isPinning = false;
    wrench.current.classList.remove('shake-small');
    resetPins();
  }

  function selectPin(pinElement) {
    const pinId = pinElement.id;
    if (pinElement.classList.contains('correct')) {
      return;
    }
    if (pinId === correctOrder[currentPin]) {
      currentPin++;
      pinElement.classList.add('correct');
      new Audio(clickSound).play();
      if (currentPin === correctOrder.length) {
        setTimeout(() => {
          new Audio(unlockSound).play();
          wrench.current.classList.remove('shake-small');
          setTimeout(() => {
            wrench.current.classList.add('rotate');
            setTimeout(() => {
              lockContainer.current.classList.add('hide');
              close(true);
              wrench.current.classList.remove('rotate');
            }, 1000);
          }, 50);
        }, 250);
      }
    } else {
      if (!cooldown) {
        if (pinElement.classList.contains('shake')) {
          pinElement.classList.remove('shake');
        }
        cooldown = true;
        attempts--;
        pinElement.classList.add('incorrect');
        new Audio(tapSound).play();
        if (attempts === 0) {
          breakHook();
          setTimeout(() => {
            lockContainer.current.classList.add('hide');
            close(false);
          }, 500);
        } else {
        }
        setTimeout(() => {
          cooldown = false;
          pinElement.classList.remove('incorrect');
        }, 700);
      }
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function positionPins() {
    const lockRect = lockContainer.current.getBoundingClientRect();
    const containerWidth = lockRect.width;
    const pinWidth = 20;
    const spacing = (containerWidth - pins.length * pinWidth) / (pins.length + 1);
    let leftOffset = spacing;

    for (let i = 0; i < pins.length; i++) {
      const pin = document.getElementById(pins[i]).parentNode.parentNode as HTMLDivElement;
      pin.style.left = leftOffset + 'px';
      pin.style.top = '0px';
      (pin.querySelector('.pin-container') as HTMLDivElement).style.top = (lockRect.height / 2) + 'px';
      leftOffset += pinWidth + spacing;
    }
  }

  return <div id="lockPick">
    <div ref={lockContainer} id="lock-container" className="hide">
      <div ref={hook} id="hook">
        <div ref={end} id="end"></div>
        <div id="top"></div>
        <div id="bottom"></div>
      </div>
      <div ref={wrench} id="tension-wrench"></div>
    </div>
  </div>
};

export default PickLockPage;