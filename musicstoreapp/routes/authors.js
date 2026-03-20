module.exports = function(app) {

    app.get("/authors", function(req, res) {
        let authors = [
            { name: "Fito", group: "Fito y los Fitipaldis", rol: "cantante" },
            { name: "Juan", group: "Los Panchos", rol: "trompetista" },
            { name: "Maria", group: "Solo", rol: "violinista" },
            { name: "Carlos", group: "Jazz Band", rol: "saxofonista" },
            { name: "Pedro", group: "Piano Bar", rol: "pianista" }
        ];

        let response = {
            seller: 'Tienda de canciones',
            authors: authors
        };
        res.render("authors/authors.twig", response);
    });

    app.get('/authors/add', function (req, res) {
        let roles = ['cantante', 'trompetista', 'violinista', 'saxofonista', 'pianista'];
        res.render("authors/add.twig", { roles: roles });
    });

    app.post('/authors/add', function(req, res) {
        let response= "Autor agregado: " + req.body.name + "<br>"
            + " grupo: " + req.body.group + "<br>"
            + " rol: " + req.body.rol

        res.send(response);
    })
    app.get('/authors/filter/:rol', function(req, res) {
        let authors = [
            { name: "Fito", group: "Fito y los Fitipaldis", rol: "cantante" },
            { name: "Juan", group: "Los Panchos", rol: "trompetista" },
            { name: "Maria", group: "Solo", rol: "violinista" },
            { name: "Carlos", group: "Jazz Band", rol: "saxofonista" },
            { name: "Pedro", group: "Piano Bar", rol: "pianista" }
        ];
        let filtered = [];
        for (let i = 0; i < authors.length; i++) {
            if (authors[i].rol === req.params.rol) {
                filtered.push(authors[i]); //QUE SEA ROL DADO
            }
        }

        res.render("authors/authors.twig", { authors: filtered });
    });

    //Importante que esté al final
    app.get('/authors/*', function(req, res) {
        res.redirect('/authors/');
    });
}