const {ObjectId} = require("mongodb");
module.exports = function(app, favouriteSongsRepository, songsRepository) {

    app.get('/songs/favourites', function (req, res) {
        let filter = {user: req.session.user};
        let options = {sort: {title: 1}};

        favouriteSongsRepository.getSongs(filter, options).then(songs => {
            let total = 0;
            for (let i = 0; i < songs.length; i++) {
                total += parseFloat(songs[i].price) || 0;
            }
            res.render("songs/favourites.twig", {songs: songs, total: total});
        }).catch(error => {
            res.send("Error al listar favoritos: " + error);
        });
    });

    app.get('/songs/favourites/add/:songId', function(req, res) {
        let filter = {_id: new ObjectId(req.params.songId)};
        songsRepository.findSong(filter, {}).then(song => {
            if (song == null) {
                res.send("Canción no encontrada");
                return;
            }
            let favourite = {
                songId: song._id.toString(),
                title: song.title,
                kind: song.kind,
                price: song.price,
                user: req.session.user,
                date: new Date()
            };
            favouriteSongsRepository.addSong(favourite, function(result) {
                if (result.songId !== null && result.songId !== undefined) {
                    res.redirect('/songs/favourites');
                } else {
                    res.send("Error al añadir a favoritos: " + result.error);
                }
            });
        }).catch(error => {
            res.send("Error al buscar la canción: " + error);
        });
    });

    app.get('/songs/favourites/delete/:id', function(req, res) {
        let filter = {_id: new ObjectId(req.params.id)};
        favouriteSongsRepository.removeSong(filter).then(result => {
            res.redirect('/songs/favourites');
        }).catch(error => {
            res.send("Error al eliminar de favoritos: " + error);
        });
    });
};