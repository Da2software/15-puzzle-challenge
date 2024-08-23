import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [size, updateSize] = useState(4);

  const startGame = () => {
    navigate("/game"); // Redirects to the "game" page
  };
  const saveSize = (e: any) => {
    updateSize(Number(e.currentTarget.value));
    localStorage.setItem("size", e.currentTarget.value);
  };
  useEffect(() => {
    localStorage.setItem("size", size.toString());
  }, []);
  return (
    <>
      <div className="game-container">
        <h1 className="title-game">15 Puzzle Game</h1>
        <div className="menu-container">
          <div className="size-input">
            <label htmlFor="puzzle-size">
                Puzzle Size: 
              <input
                type="number"
                style={{marginLeft: '1rem'}}
                id="puzzle-size"
                name="puzzlesize"
                min="3"
                max="6"
                value={size}
                onChange={saveSize}
              />
            </label>
          </div>
          <button onClick={startGame} className="menu-btn">
            Start
          </button>
          <button className="menu-btn">History</button>
        </div>
      </div>
    </>
  );
}
export default Home;
