module.exports = function(app) {

    app.get("/authors", function(req, res) {
        let authors = [{
            "name": "Fito",
            "group": "Fito y los Fitipaldis",
            "rol": "cantante"
        },{
            "name": "Fito",
            "group": "Fito y los Fitipaldis",
            "rol": "cantante"
        }, {
            "name": "Fito",
            "group": "Fito y los Fitipaldis",
            "rol": "cantante"
        }];

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

    //Importante que esté al final
    app.get('/authors/*', function(req, res) {
        res.redirect('/authors/');
    });
}