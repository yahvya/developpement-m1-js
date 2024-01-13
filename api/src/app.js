// bibliothèques
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// configuration api
dotenv.config();

const port = process.env.PORT || 8000;
const corsConfig = {
    origin: `http://127.0.0.1:${port}`
};

const app = express();

app
    .use(cors(corsConfig) )
    .use(express.json() );

// liaison des liens
app
    .use("/produits",require("./routes/products") );

// lancement du serveur
app.listen(port,() => {
    console.log(`Serveur lancé : http://127.0.0.1:${port}"`);
});
