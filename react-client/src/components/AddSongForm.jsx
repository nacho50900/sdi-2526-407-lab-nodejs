import { useState } from "react";
import { apiFetch } from "../services/ApiService.js";
import "../assets/AddSongForm.css";
import SongForm from "../components/SongForm";
import SongToast from "../components/SongToast";

const AddSongForm = ({ onSongAdded }) => {
    const [title, setTitle] = useState("");
    const [kind, setKind] = useState("");
    const [price, setPrice] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setToastMessage("");

        apiFetch("http://localhost:8081/api/v1.0/songs", {
            method: "POST",
            body: JSON.stringify({ title, kind, price })
        })
            .then((data) => {
                setToastType("success");
                setToastMessage(data.message);
                setTitle("");
                setKind("");
                setPrice("");
                // quitamos onSongAdded() de aquí
            })
            .catch((err) => {
                setToastType("error");
                setToastMessage(err.message);
            });
    };
    const [toastType, setToastType] = useState("error");

    return (
        <div className="add-song-container">
            <h2>Añadir canción</h2>
            <SongForm
                title={title}
                setTitle={setTitle}
                kind={kind}
                setKind={setKind}
                price={price}
                setPrice={setPrice}
                onSubmit={handleSubmit}
            />
            <SongToast
                message={toastMessage}
                type={toastType}
                onClose={() => {
                    setToastMessage("");
                    if (toastType === "success" && onSongAdded) onSongAdded();
                }}
            />
        </div>
        //Inputs sacados a SongForm
    );
};

export default AddSongForm;