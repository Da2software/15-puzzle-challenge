import React, { DOMElement, useEffect, useRef, useState } from 'react';
import { BoxParts, IPosition2D, MoveSystem, Position2D } from '../core/engine';
import { PartNormalComponent, PartEmptyComponent } from '../core/PartComponent';
const size = 4;
const boxTable: BoxParts = new BoxParts(size);
const moveSys: MoveSystem = new MoveSystem(boxTable);

function Game() {
  const [area, setArea] = useState<number[][]>([]);
  const [selectedPart, setSelectedPart] = useState<Position2D | any>(null);
  const [stylePart, setStylePart] = useState({ height: 'auto', fontSize: '1rem' });
  const [progress, setProgress] = useState(0);
  const boxPartsElem = useRef(null);

  const styleBoxRow = {
    gridTemplateColumns: Array.from({ length: size }, () => '1fr').join(' ')
  };
  useEffect(() => {
    restart();

    return () => {
      console.log('Game End');
    };
  }, []);
  const restart = (alert: boolean = false) => {
    if (alert && !confirm("Reset Puzzle!")) return; // then in case we hit rest by error we need to ask first
    setSelectedPart(null);
    boxTable.build();
    setArea(boxTable.area);
    // set the default progress, sometimes the randomize get some parts set in the right position
    setProgress(Math.round(boxTable.getProgress() * 100));
    // set parts height
    setTimeout(() => {
      const boxPartElem: any = boxPartsElem.current;
      const boxPartCol: any = boxPartElem.getElementsByClassName('game-boxcol')[0];
      setStylePart({ height: boxPartCol.clientWidth + 'px', fontSize: (boxPartCol.clientWidth / size) + 'px' });
    }, 100); // wait until render is done
  };

  const onPartClick = (part: number, x: number, y: number) => {
    if (part > 0) {
      moveSys.setSelected({ x: x, y: y });
      setSelectedPart({ x: x, y: y });
      return;
    }
    // if we have a selected part and move is done 
    const selection = !!moveSys.getSelected();
    if (selection && moveSys.move({ x: x, y: y })) {
      moveSys.setSelected(null);
      setSelectedPart(null);
      setArea(boxTable.area.map(row => [...row]));
      setProgress(Math.round(boxTable.getProgress() * 100));
    }
  };
  return (
    <>
      <div className='game-container'>
        <div className='game-title'>
          <h2>15 Puzzle Game</h2>
        </div>
        <div className='game-panel'>
          <span className='resolution'>{progress}%</span>
          <button className='btn-reset' onClick={() => restart(true)}>Reset</button>
        </div>
        <div className='game-boxparts' ref={boxPartsElem} >
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
      </div >
    </>
  )
}

export default Game;