import "../assets/SongToast.css";

const SongToast = ({ message, onClose, type = "error" }) => {
    if (!message) return null;

    return (
        <div className={`toast-container ${type}`}>
            <div className="toast-message">
                <span>{message}</span>
                <button className="toast-close" onClick={onClose}>✕</button>
            </div>
        </div>
    );
};

export default SongToast;