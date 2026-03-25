const {ObjectId} = require("mongodb");

module.exports = function(app, commentsRepository, songsRepository) {

    app.post('/comments/:song_id', function (req, res) {
        if (req.session.user == null || req.session.user == undefined) {
            res.send("Error: Debe estar identificado para comentar.");
            return;
        }
        let comment = {
            author: req.session.user,
            text: req.body.text,
            song_id: new ObjectId(req.params.song_id) // Usamos song_id como pide el enunciado
        };
        commentsRepository.addComment(comment, function (result) {
            // Ajustamos a 'insertedId' que es lo que suele devolver el repo
            if (result.commentId) {
                res.redirect('/songs/' + req.params.song_id);
            } else {
                res.send("Error al añadir comentario: " + result.error);
            }
        });
    });

};