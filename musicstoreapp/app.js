let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();
let jwt = require('jsonwebtoken');
app.set('jwt', jwt);

let expressSession = require('express-session');
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  // Debemos especificar todas las headers que se aceptan. Content-Type , token
  next();
});

const userSessionRouter = require('./routes/userSessionRouter');
const userAudiosRouter = require('./routes/userAudiosRouter');
app.use("/songs/add",userSessionRouter);
const userAuthorRouter = require('./routes/userAuthorRouter');
app.use("/songs/edit",userAuthorRouter);
app.use("/songs/delete",userAuthorRouter);
app.use("/publications",userSessionRouter);
app.use("/purchases",userSessionRouter);
app.use("/songs/buy",userSessionRouter);
app.use("/audios/",userAudiosRouter);
app.use("/shop/",userSessionRouter)

const userTokenRouter = require('./routes/userTokenRouter');
app.use("/api/v1.0/songs/", userTokenRouter);

let crypto = require('crypto');
let fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  createParentPath: true
}));
app.set('uploadPath', __dirname)
app.set('clave','abcdefg');
app.set('crypto',crypto);

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { MongoClient } = require("mongodb");
const connectionStrings = 'mongodb+srv://admin:sdi@cluster0.5qxy6r5.mongodb.net/?appName=Cluster0';
const dbClient = new MongoClient(connectionStrings);
//app.set('connectionStrings', url);

const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, dbClient);
require("./routes/users.js")(app, usersRepository);

let indexRouter = require('./routes/index');
require("./routes/authors.js")(app);

let favoriteSongsRepository = require("./repositories/favouriteSongsRepository.js");
favoriteSongsRepository.init(app, dbClient);

let commentsRepository = require("./repositories/commentsRepository.js");
commentsRepository.init(app, dbClient);

let songsRepository = require("./repositories/songsRepository.js");
songsRepository.init(app, dbClient);

require("./routes/favourites.js")(app, favoriteSongsRepository, songsRepository);
require("./routes/comments.js")(app, commentsRepository, songsRepository);
require("./routes/songs.js")(app, songsRepository, commentsRepository);
require("./routes/api/songsAPIv1.0.js")(app, songsRepository, usersRepository);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//app.get("/error", function (req, res) {
//  res.render('error.twig', {
//    message: req.query.message,
//    error: {
//      status: req.query.status,
//      stack: req.query.stack
//    }
//  });
//});

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler (ahora funciona)
app.use(function(err, req, res, next) {
  console.log("Error detectado: " + err.message);

  // Si la ruta empieza por /api, devolvemos JSON
  if (req.originalUrl.includes("/api/")) {
    res.status(500).json({ error: err.message });
  } else {
    // Si es una ruta web normal, mostramos la página de error
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  }
});
module.exports = app;