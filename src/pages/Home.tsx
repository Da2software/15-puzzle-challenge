import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const startGame = () => {
        navigate('/game'); // Redirects to the "About" page
      };
    return <>
        <div className='game-container'>
            <h1 className="title-game">15 Puzzle Game</h1>
            <div className="menu-container">
                <button onClick={startGame} className="menu-btn" >Start</button>
                <button className="menu-btn">History</button>
            </div>
        </div>
    </>
}
export default Home;