// bibliothèques
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

// configuration api
dotenv.config();

const port = process.env.PORT || 8000;
const corsConfig = {
    origin: `http://127.0.0.1:${port}`
};
const sess = {
    cookie: {},
    resave: false,
    saveUninitialized: true,
    secret: "master-1-developpement-web-partie-js-api"
};

const app = express();

if(app.get("env") === "production"){
    app.set("trust proxy",1);
    sess.cookie.secure = true;
}

app
    .use(cors(corsConfig) )
    .use(session(sess) )
    .use(express.json() );

// liaison des liens
app
    .use("/produits",require("./routes/products") )
    .use("/categories",require("./routes/categories") )
    .use("/compte/administrateur",require("./routes/admin-account") )
    .use("/compte",require("./routes/user-account") );

// lancement du serveur
app.listen(port,() => {
    console.log(`Serveur lancé : http://127.0.0.1:${port}"`);
});
