import { useEffect, useState } from "react";
import "../assets/SongDetails.css";
import Portada from "../assets/logo.svg";
import { apiFetch } from "../services/ApiService.js";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import SongToast from "../components/SongToast";


const SongDetails = ({ songId, onBack, onDeleted }) => {
    const [song, setSong] = useState(null);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("error");

    useEffect(() => {
        if (!songId) return;

        apiFetch(`http://localhost:8081/api/v1.0/songs/${songId}`)
            .then(data => {
                setSong(data?.song);
            })
            .catch(err => {
                setError(err.message);
            });
    }, [songId]);

    if (error) return <div className="error">{error}</div>;
    if (!song) return <p>Cargando canción...</p>;

    return (
        <div className="song-details">
            <img src={Portada} alt="Portada de la canción" />

            <div className="song-info">
                <h2>{song.title}</h2>
                <p><strong>Autor:</strong> {song.author}</p>
                <p><strong>Género:</strong> {song.kind}</p>
                <p className="precio">{song.price} €</p>

                <div className="song-actions">
                    <button
                        className="delete"
                        onClick={() => setModalOpen(true)}
                    >
                        Eliminar
                    </button>
                    <button className="back" onClick={onBack}>
                        Volver
                    </button>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={modalOpen}
                songName={song?.title}
                songId={songId}
                onConfirm={() => {
                    setModalOpen(false);
                }}
                onClose={() => setModalOpen(false)}
                onError={(msg) => { setToastType("error"); setToastMessage(msg); }}
                onSuccess={(msg) => { setToastType("success"); setToastMessage(msg); }}
            />

            <SongToast
                message={toastMessage}
                type={toastType}
                onClose={() => {
                    setToastMessage("");
                    if (toastType === "success" && onDeleted) onDeleted();
                }}
            />
        </div>
    );
};

export default SongDetails;