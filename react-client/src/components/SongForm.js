import "../assets/SongForm.css";

const SongForm = ({ title, setTitle, kind, setKind, price, setPrice, onSubmit }) => {

    const titleValid = title.trim().length >= 5;
    const kindValid = kind.trim().length >= 3;
    const priceValid = !isNaN(price) && price !== "" && parseFloat(price) > 0;
    const formValid = titleValid && kindValid && priceValid;

    const getTitleError = () => {
        if (title.trim().length === 0) return "El título es obligatorio";
        if (title.trim().length < 5) return "El título debe tener al menos 5 caracteres";
        return "";
    };

    const getKindError = () => {
        if (kind.trim().length === 0) return "El género es obligatorio";
        if (kind.trim().length < 3) return "El género debe tener al menos 3 caracteres";
        return "";
    };

    const getPriceError = () => {
        if (price === "") return "El precio es obligatorio";
        if (isNaN(price)) return "El precio debe ser un número";
        if (parseFloat(price) <= 0) return "El precio debe ser mayor que cero";
        return "";
    };

    return (
        <form onSubmit={onSubmit} className="song-form">
            <div className="field-group">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={title.length > 0 && !titleValid ? "input-error" : ""}
                />
                {title.length > 0 && !titleValid && (
                    <span className="field-error">{getTitleError()}</span>
                )}
            </div>

            <div className="field-group">
                <input
                    type="text"
                    placeholder="Género"
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                    className={kind.length > 0 && !kindValid ? "input-error" : ""}
                />
                {kind.length > 0 && !kindValid && (
                    <span className="field-error">{getKindError()}</span>
                )}
            </div>

            <div className="field-group">
                <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={price.length > 0 && !priceValid ? "input-error" : ""}
                />
                {price.length > 0 && !priceValid && (
                    <span className="field-error">{getPriceError()}</span>
                )}
            </div>

            <button
                type="submit"
                disabled={!formValid}
                className={!formValid ? "btn-disabled" : ""}
            >
                Añadir
            </button>
        </form>
    );
};

export default SongForm;