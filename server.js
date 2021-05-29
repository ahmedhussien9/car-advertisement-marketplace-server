const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  config = require("./DB");

const sellerController = require("./controllers/sellerController");
const itemsController = require("./controllers/itemsController");
const timeSlotController = require("./controllers/timeSlotController");
const userController = require("./controllers/userController");

const auth = require("./middleware/check-auth-seller");
const { handleError } = require("./helper/validationError");

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
  },
  (err) => {
    console.log("Can not connect to the database" + err);
  }
);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  //doesn't send response just adjusts it
  res.header("Access-Control-Allow-Origin", "*"); //* to give access to any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); //to give access to all the methods provided
    return res.status(200).json({});
  }
  next(); //so that other routes can take over
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use("/api/users", userController);
app.use("/api/sellers", sellerController);
app.use("/api/items", itemsController);
app.use("/api/timeslot", timeSlotController);

app.get("/", (req, res) => res.send("NodeJs Web Api working!!!"));
app.use((err, req, res, next) => {
  handleError(err, res);
});
const port = process.env.PORT || 4000;

const server = app.listen(port, function () {
  console.log("Listening on port " + port);
});
