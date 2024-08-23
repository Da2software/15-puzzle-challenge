import { HistoryRecord, Timer, useHistoryStore } from "../core/storages";
import { useNavigate } from "react-router-dom";

function HistoryPage() {
    const navigate = useNavigate();

    const { history } = useHistoryStore();
    const goHome = () => {
        navigate("/"); // Redirects to the "game" page
    };
    return <>
        <h1>History</h1>
        <div className="game-container">
            {history.map(record => (
                <div className="game-record">
                    <span className="resolution">Size {record.size}</span>
                    <span className="resolution">Moves {record.moves}</span>
                    <span className="resolution">
                        Time {record.time.hours.toString().padStart(2, "0")}:
                        {record.time.minutes.toString().padStart(2, "0")}:
                        {record.time.seconds.toString().padStart(2, "0")}
                    </span>
                </div>
            ))}
        </div>
        <button onClick={goHome} className="menu-btn">
            Back to Home
        </button>
    </>;
}
export default HistoryPage;