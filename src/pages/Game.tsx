import React, { DOMElement, useEffect, useRef, useState } from "react";
import { BoxParts, IPosition2D, MoveSystem, Position2D } from "../core/engine";
import { PartNormalComponent, PartEmptyComponent } from "../core/PartComponent";
import { useNavigate } from "react-router-dom";

import PartMove from "../assets/PartMove.mp3";
import PartClick from "../assets/PartClick.mp3";

const partSound = new Audio(PartMove);
const clickSound = new Audio(PartClick);

function Game() {
  const [size, setSize] = useState<number | any>(null);
  const [boxTable, setBoxTable] = useState<BoxParts | any>(null);
  const [moveSys, setMoveSys] = useState<MoveSystem | any>(null);

  // this takes the matix of the puzzle table
  const [area, setArea] = useState<number[][]>([]);
  // this allows to know the tile/part selected, and then use some styles for that
  const [selectedPart, setSelectedPart] = useState<Position2D | any>(null);
  // here we use to set some dinamic styles for the tiles/parts, mainly to create perfect squares
  const [stylePart, setStylePart] = useState({
    height: "auto",
    fontSize: "1rem",
  });
  // save the count of the moves the player is doing
  const [movesCount, setMovesCount] = useState(0);
  // save the engine progress calculation to be render
  const [progress, setProgress] = useState(0);
  // this saves the timer
  const [timeCheck, setTimeCheck] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });
  // flags for won and a delay to render the squere
  const [won, setWon] = useState(false);
  const [onReady, setOnReady] = useState(false);
  // use this to calculate the width of the first tile then we can update the height to create the square
  const boxPartsElem = useRef(null);

  // to avoid do multiple movements at the same time
  let onMoving: boolean = false;
  // to divide the row in different columns depending on the size
  const styleBoxRow = {
    gridTemplateColumns: Array.from({ length: size }, () => "1fr").join(" "),
  };
  // here we can same the timer process, I use chatgpt for this because the normal way does not work in react (some render gliches)
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  // to change between pages
  const navigate = useNavigate();

  /**HELP I DONT LIKE THE REACT LIFE HOOKS */
  useEffect(() => {
    // we need to do this crazy process to get the size from the other page, it is the seme if we use an store library
    // first we set the default storage size
    let storaSize = 4;
    // then we try to get the size from the localstorage
    try {
      storaSize = Number(localStorage.getItem("size"));
      // then we can update the reactive value, because we use it in other pa
      setSize(storaSize > 2 ? storaSize : 4);
    } catch (error) {
      setSize(4);
    }
    // having ready the size we can use that to run the game engine
    const newBoxParts = new BoxParts(storaSize);
    setBoxTable(newBoxParts);
    // also start the movement system
    setMoveSys(new MoveSystem(newBoxParts));
  }, []);

  useEffect(() => {
    // in case the boxTable is ready we can prepare the ui
    if (!boxTable) return;
    // start prepering all and set the values in default states
    restart();
  }, [boxTable]);

  const restart = (alert: boolean = false) => {
    if (alert && !confirm("Reset Puzzle!")) return; // then in case we hit rest by error we need to ask first

    setOnReady(false);
    prepareRender();

    setWon(false);
    setSelectedPart(null);
    // here using the class engine I build we can generate the puzzle table and randomize it too
    boxTable.build();
    // we need to set the moves to zero to let the moveSystem count again
    moveSys.setMoves(0);
    setMovesCount(0);
    // then we share the engine puzzle table to the reactive value
    setArea(boxTable.area);
    /* set the default progress, note: sometimes the randomize get some parts set in the right position
    that means we can have some pregress at the start of the game*/
    setProgress(Math.round(boxTable.getProgress() * 100));
  };

  const prepareRender = () => {
    /* sets the heght as well as make time to player to be prepare to play, this because the timer can start quick 
    and with this we have time for the player to be prepare before the timer starts count*/
    setTimeout(() => {
      setOnReady(true); // prepare the loading state
    }, 500); // first timer that ends first
    setTimeout(() => {
      // get one part/tile to check the width and therefore set the height to have a perfect squere (also responsive)
      const boxPartElem: any = boxPartsElem.current;
      const boxPartCol: any =
        boxPartElem.getElementsByClassName("game-boxcol")[0];
      setStylePart({
        height: boxPartCol.clientWidth + "px",
        fontSize: boxPartCol.clientWidth / size + "px", // I just guess this value and at the end it fits well XD
      });
      setTimer();
    }, 600); // then after a milliseconds later this one renders the table
  };

  const setTimer = () => {
    // Clear any existing interval
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      setTimeCheck({ seconds: 0, minutes: 0, hours: 0 });
    }

    // Start a new interval
    timerInterval.current = setInterval(() => {
      setTimeCheck((prevTimeCheck) => {
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
    }, 1000); // 1000 equals to 1 second
  };

  const goHome = () => {
    navigate("/"); // Redirects to the "About" page
  };

  const onPartClick = (part: number, x: number, y: number) => {
    // to move the parts/tiles we need first check if there is no other actions running
    if (onMoving || won) return;
    // in case the tile/part is greater than 0 it means is not the empty space
    if (part > 0) {
      // we can play the "selection" sound
      clickSound.play();
      // set the tile position
      moveSys.setSelected({ x: x, y: y });
      // as well as update the reactive value related
      setSelectedPart({ x: x, y: y });
      return;
    }
    // if we have a selected part and move is done
    const selection = !!moveSys.getSelected(); //
    if (selection && moveSys.move({ x: x, y: y })) {
      // moveSYs-move executes the move and returns if this move was a valid one
      // if the move is valid then...
      partSound.play(); // play audio effect first
      onMoving = true; // set this flag to avoid multiple moves and also wait until time out gets finished
      moveSys.setSelected(null); // clear the selection
      setSelectedPart(null); // as well as the reactive value
      /* update the table, we use the spread operator here to make the reactive value trigger the rendering update
      other wise the ui will still without change */
      setArea(boxTable.area.map((row: any) => [...row]));
      // then get ask for the progress
      const currProgress = boxTable.getProgress();
      // we set this on the reactive value in % format
      setProgress(Math.round(currProgress * 100));
      // if the progress is 1 (100%) that means user solve the puzzle
      if (currProgress === 1) {
        setWon(true);
      }
      onMoving = false; // NOTE: maybe this is not needed because is not in the setTimeout anymore
    }
    setMovesCount(moveSys.getMoves());
  };
  return (
    <>
      {/* main game container */}
      <div className="game-container">
        <div className="game-title">
          {/* sowing Win animation */}
          {won ? <div className="you-win-text">You Win!</div> : null}
        </div>
        <div className="game-panel">
          <button className="btn-reset" onClick={() => restart(true)}>
            Reset
          </button>
          <div></div>
          <button className="btn-reset" onClick={() => goHome()}>
            Go Back
          </button>
          <span className="resolution">Resolution {progress}%</span>
          <span className="resolution">
            Time {timeCheck.hours.toString().padStart(2, "0")}:
            {timeCheck.minutes.toString().padStart(2, "0")}:
            {timeCheck.seconds.toString().padStart(2, "0")}
          </span>
          <span className="resolution">Moves {movesCount}</span>
        </div>
        <div className="game-boxparts wood-texture" ref={boxPartsElem}>
          {onReady ? (
            <div className="hollow-square">
              {area.map((row, y) => (
                <div className="game-boxrow" key={y} style={styleBoxRow}>
                  {row.map((col, x) =>
                    col > 0 ? (
                      <PartNormalComponent
                        part={col}
                        stylePart={stylePart}
                        selectedPart={selectedPart}
                        x={x}
                        y={y}
                        key={x}
                        onPartClick={onPartClick}
                      />
                    ) : (
                      <PartEmptyComponent
                        part={col}
                        stylePart={stylePart}
                        x={x}
                        y={y}
                        key={x}
                        onPartClick={onPartClick}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          ) : (
            <h4 className="loading">Loading...</h4>
          )}
        </div>
      </div>
    </>
  );
}

export default Game;
