import React, { DOMElement, useEffect, useRef, useState } from 'react';
import { BoxParts, IPosition2D, MoveSystem, Position2D } from '../core/engine';
import { PartNormalComponent, PartEmptyComponent } from '../core/PartComponent';
import { useNavigate } from 'react-router-dom';

import PartMove from '../assets/PartMove.mp3';
import PartClick from '../assets/PartClick.mp3';

const size = 4;
const boxTable: BoxParts = new BoxParts(size);
const moveSys: MoveSystem = new MoveSystem(boxTable);
const partSound = new Audio(PartMove);
const clickSound = new Audio(PartClick);

function Game() {
  const [area, setArea] = useState<number[][]>([]);
  const [selectedPart, setSelectedPart] = useState<Position2D | any>(null);
  const [stylePart, setStylePart] = useState({ height: 'auto', fontSize: '1rem' });
  const [movesCount, setMovesCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeCheck, setTimeCheck] = useState({ seconds: 0, minutes: 0, hours: 0 });
  const [won, setWon] = useState(false);
  const [onReady, setOnReady] = useState(false);
  const boxPartsElem = useRef(null);

  let onMoving: boolean = false;
  const styleBoxRow = {
    gridTemplateColumns: Array.from({ length: size }, () => '1fr').join(' ')
  };
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    restart();
  }, []);

  const restart = (alert: boolean = false) => {
    if (alert && !confirm("Reset Puzzle!")) return; // then in case we hit rest by error we need to ask first

    setOnReady(false);
    prepareRender();

    setWon(false);
    setSelectedPart(null);
    boxTable.build();
    moveSys.setMoves(0);
    setMovesCount(0);
    setArea(boxTable.area);
    // set the default progress, sometimes the randomize get some parts set in the right position
    setProgress(Math.round(boxTable.getProgress() * 100));

  };

  const prepareRender = () => {
    // sets the heght as well as make time to player to be prepare to play
    setTimeout(() => {
      setOnReady(true);
    }, 500);
    setTimeout(() => {
      const boxPartElem: any = boxPartsElem.current;
      const boxPartCol: any = boxPartElem.getElementsByClassName('game-boxcol')[0];
      setStylePart({ height: boxPartCol.clientWidth + 'px', fontSize: (boxPartCol.clientWidth / size) + 'px' });
      setTimer();
    }, 600);
  };


  const setTimer = () => {
    // Clear any existing interval
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      setTimeCheck({ seconds: 0, minutes: 0, hours: 0 });
    }

    // Start a new interval
    timerInterval.current = setInterval(() => {
      setTimeCheck(prevTimeCheck => {
        let { seconds, minutes, hours } = prevTimeCheck;

        seconds += 1;
        if (seconds === 60) {
          seconds = 0;
          minutes += 1;
        }
        if (minutes === 60) {
          minutes = 0;
          hours += 1;
        }

        return { seconds, minutes, hours };
      });
    }, 1000);
  };

  const goHome = () => {
    navigate('/'); // Redirects to the "About" page
  };

  const onPartClick = (part: number, x: number, y: number) => {
    if (onMoving || won) return;
    if (part > 0) {
      clickSound.play();
      moveSys.setSelected({ x: x, y: y });
      setSelectedPart({ x: x, y: y });
      return;
    }
    // if we have a selected part and move is done
    const selection = !!moveSys.getSelected();
    if (selection && moveSys.move({ x: x, y: y })) {
      // play audio effect first
      partSound.play();
      onMoving = true; // set this flag to avoid multiple moves and also wait until time out gets finished
      moveSys.setSelected(null);
      setSelectedPart(null);
      setArea(boxTable.area.map(row => [...row]));
      const currProgress = boxTable.getProgress();
      setProgress(Math.round(currProgress * 100));
      if (currProgress === 1) {
        setWon(true);
      }
      onMoving = false;

    }
    setMovesCount(moveSys.getMoves());
  };
  return (
    <>
      {/* main game container */}
      <div className='game-container'>
        <div className='game-title'>
          {/* sowing Win animation */}
          <h2>15 Puzzle Game</h2>
          {won ? (<div className="you-win-text">You Win!</div>) : null}
        </div>
        <div className='game-panel'>
          <button className='btn-reset' onClick={() => restart(true)}>Reset</button>
          <div></div>
          <button className='btn-reset' onClick={() => goHome()}>Go Back</button>
          <span className='resolution'>Resolution {progress}%</span>
          <span className='resolution'>Time {timeCheck.hours}:{timeCheck.minutes}:{timeCheck.seconds}</span>
          <span className='resolution'>Moves {movesCount}</span>
        </div>
        <div className='game-boxparts wood-texture' ref={boxPartsElem} >
          {onReady ? (
            <div className="hollow-square">
              {area.map((row, y) => (
                <div className='game-boxrow' key={y} style={styleBoxRow} >
                  {row.map((col, x) => (
                    col > 0 ? <PartNormalComponent part={col} stylePart={stylePart} selectedPart={selectedPart} x={x} y={y}
                      key={x} onPartClick={onPartClick} /> :
                      <PartEmptyComponent part={col} stylePart={stylePart} x={x} y={y}
                        key={x} onPartClick={onPartClick} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <h4 className='loading'>Loading...</h4>
          )}
        </div>
      </div >
    </>
  )
}

export default Game;