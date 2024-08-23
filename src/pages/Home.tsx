import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [size, updateSize] = useState(3);

  const startGame = () => {
    navigate("/game"); // Redirects to the "game" page
  };
  const checkHistory = () => {
    navigate("/history"); // Redirects to the "hirtory" page
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
              <select style={{ marginLeft: '1rem' }}
                id="puzzle-size"
                name="puzzlesize" value={size}
                onChange={saveSize}>
                <option value="3">3x3</option>
                <option value="4">4x4</option>
                <option value="5">5x5</option>
                <option value="6">6x6</option>
              </select>
            </label>
          </div>
          <button onClick={startGame} className="menu-btn">
            Start
          </button>
          <button onClick={checkHistory} className="menu-btn">History</button>
        </div>
      </div>
    </>
  );
}
export default Home;
