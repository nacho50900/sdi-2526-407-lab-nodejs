const {ObjectId} = require("mongodb");

module.exports = function (app, songsRepository, usersRepository) {

    /**
     * @swagger
     * /api/v1.0/songs:
     *   get:
     *     summary: Obtener lista de canciones
     *     description: Retorna todas las canciones almacenadas en el sistema.
     *     tags:
     *       - Songs
     *     responses:
     *       200:
     *         description: Lista obtenida correctamente.
     */
    app.get("/api/v1.0/songs", function (req, res) {
        let filter = {};
        let options = {};
        songsRepository.getSongs(filter, options).then(songs => {
            res.status(200).json({songs: songs})
        }).catch(() => {
            res.status(500).json({ error: "Se ha producido un error al recuperar las canciones." })
        });
    });

    /**
     * @swagger
     * /api/v1.0/songs/{id}:
     *   get:
     *     summary: Obtener una canción por ID
     *     tags:
     *       - Songs
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Canción encontrada.
     *       404:
     *         description: No encontrada.
     */
    app.get("/api/v1.0/songs/:id", function (req, res) {
        try {
            let songId = new ObjectId(req.params.id);
            songsRepository.findSong({_id: songId}, {}).then(song => {
                if (song) res.status(200).json({song: song});
                else res.status(404).json({error: "No existe la canción"});
            });
        } catch (e) {
            res.status(500).json({error: "ID inválido"});
        }
    });

    /**
     * @swagger
     * /api/v1.0/songs/{id}:
     *   delete:
     *     summary: Eliminar una canción
     *     description: Elimina una canción del sistema a partir de su identificador.
     *     tags:
     *       - Songs
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Identificador único de la canción.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Canción eliminada correctamente.
     *       404:
     *         description: ID inválido o canción no encontrada.
     *       500:
     *         description: Error interno del servidor.
     */
    app.delete('/api/v1.0/songs/:id', function (req, res) {
        try {
            let songId = new ObjectId(req.params.id)
            let filter = {_id: songId}
            songsRepository.deleteSong(filter, {}).then(result => {
                if (result === null || result.deletedCount === 0) {
                    res.status(404).json({error: "ID inválido o no existe, no se ha borrado el registro."});
                } else {
                    res.status(200).send(JSON.stringify(result));
                }
            }).catch(error => {
                res.status(500).json({error: "Se ha producido un error:" + error.message})
            });
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    });

    /**
     * @swagger
     * /api/v1.0/songs:
     *   post:
     *     summary: Crear una nueva canción
     *     description: Añade una nueva canción al sistema.
     *     tags:
     *       - Songs
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SongRequest'
     *     responses:
     *       201:
     *         description: Canción creada correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Canción añadida correctamente.
     *                 _id:
     *                   type: string
     *       409:
     *         description: Conflicto, la canción ya existe.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No se ha podido crear la canción. El recurso ya existe.
     *       500:
     *         description: Error interno del servidor.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    app.post('/api/v1.0/songs', function (req, res) {
        try {
            let song = {
                title: req.body.title,
                kind: req.body.kind,
                price: req.body.price,
                author: req.res.user
            }
            songsRepository.insertSong(song, function (songId) {
                if (songId === null) {
                    res.status(409).json({error: "No se ha podido crear la canción. El recurso ya existe."});
                } else {
                    res.status(201).json({
                        message: "Canción añadida correctamente.",
                        _id: songId
                    })
                }
            });
        } catch (error) {
            res.status(500).json({error: "Se ha producido un error al intentar crear la canción: " +
                    error.message})
        }
    });

    /**
     * @swagger
     * /api/v1.0/songs/{id}:
     *   put:
     *     summary: Modificar una canción
     *     description: Actualiza los datos de una canción existente mediante su identificador.
     *     tags:
     *       - Songs
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Identificador único de la canción.
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SongRequest'
     *     responses:
     *       200:
     *         description: Canción modificada correctamente.
     *       404:
     *         description: ID inválido o canción no encontrada.
     *       409:
     *         description: No se ha realizado ninguna modificación.
     *       500:
     *         description: Error interno del servidor.
     */
    app.put('/api/v1.0/songs/:id', function (req, res) {
        try {
            let songId = new ObjectId(req.params.id);
            let filter = {_id: songId};
            const options = {upsert: false};
            let song = {
                author: req.res.user
            }
            if (typeof req.body.title !== "undefined" && req.body.title !== null)
                song.title = req.body.title;
            if (typeof req.body.kind !== "undefined" && req.body.kind !== null)
                song.kind = req.body.kind;
            if (typeof req.body.price !== "undefined" && req.body.price !== null)
                song.price = req.body.price;
            songsRepository.updateSong(song, filter, options).then(result => {
                if (result === null) {
                    res.status(404).json({error: "ID inválido o no existe, no se ha actualizado la canción."});
                } else if (result.modifiedCount === 0) {
                    res.status(409).json({error: "No se ha modificado ninguna canción."});
                } else {
                    res.status(200).json({
                        message: "Canción modificada correctamente.",
                        result: result
                    })
                }
            }).catch(error => {
                res.status(500)
                    .json({error: "Se ha producido un error al modificar la canción: " + error.message})
            });
        } catch (error) {
            res.status(500)
                .json({error: "Se ha producido un error al intentar modificar la canción: " + error.message})
        }
    });

    /**
     * @swagger
     * /api/v1.0/users/login:
     *   post:
     *     summary: Login de usuario
     *     description: Autentica un usuario y devuelve un token JWT.
     *     tags:
     *       - Users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: usuario@ejemplo.com
     *               password:
     *                 type: string
     *                 example: miPassword123
     *     responses:
     *       200:
     *         description: Usuario autenticado correctamente.
     *       401:
     *         description: Usuario no autorizado.
     *       500:
     *         description: Error interno del servidor.
     */
    app.post('/api/v1.0/users/login', async function (req, res) {
        try {
            const securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            const filter = {
                email: req.body.email,
                password: securePassword
            };
            const user = await usersRepository.findUser(filter, {});
            if (user == null) {
                return res.status(401).json({
                    message: "usuario no autorizado",
                    authenticated: false
                });
            }
            const token = app.get('jwt').sign(
                { user: user.email, time: Date.now() / 1000 },
                "secreto"
            );
            res.status(200).json({
                message: "usuario autorizado",
                authenticated: true,
                token: token
            });
        } catch (e) {
            res.status(500).json({
                message: "Se ha producido un error al verificar credenciales",
                authenticated: false
            });
        }
    });

}