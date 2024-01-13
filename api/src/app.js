// bibliothèques
const express = require("express");
const dotenv = require("dotenv");


// configuration
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// liaison des liens
app.use("/produits",require("./routes/products") );

// lancement du serveur
app.listen(port,() => {
    console.log(`Serveur lancé : http://127.0.0.1:${port}"`);
});
