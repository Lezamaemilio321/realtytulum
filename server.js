//Modules
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

//Env variables
dotenv.config({ path: "./config/config.env" });

//App
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes"));

//404 handler
app.use((req, res) => {
  return res.redirect("/");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
