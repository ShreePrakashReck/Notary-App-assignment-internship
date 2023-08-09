const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const app = express();
const UserRoutes = require("./routers/UserRouters");

//bodyparser middleware
app.use(express.json());

//define routes
app.get("/", (req, res) => {
  res.status(200).send("All is well");
});

app.use("/api/v1", UserRoutes);
//access environment variable
const PORT = process.env.PORT || 4000;

//server listen PORT
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
