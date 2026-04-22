import { useState } from "react";
import { apiFetch } from "../services/ApiService.js";
import "../assets/DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, songName, songId, onConfirm, onClose, onError, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const canConfirm = songName && songName.trim().length > 0;

    const handleConfirm = () => {
        if (!canConfirm) return;
        setLoading(true);

        apiFetch(`http://localhost:8081/api/v1.0/songs/${songId}`, {
            method: "DELETE"
        })
            .then((data) => {
                setLoading(false);
                onClose();
                if (onSuccess) onSuccess(data.message);
                onConfirm();
            })
            .catch((err) => {
                setLoading(false);
                onClose();
                if (onError) onError(err.message);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Confirmar eliminación</h2>

                {!canConfirm ? (
                    <p className="modal-warning">
                        No se puede eliminar: información de la canción no disponible.
                    </p>
                ) : (
                    <p className="modal-body">
                        Estás a punto de eliminar la canción
                        <strong> "{songName}"</strong>.
                        Esta acción no se puede deshacer.
                    </p>
                )}

                <div className="modal-actions">
                    <button
                        className="btn-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn-confirm"
                        onClick={handleConfirm}
                        disabled={!canConfirm || loading}
                    >
                        {loading ? "Eliminando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;