const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

const login =  require("./src/router/login");
const raf =  require("./src/router/raf");
const media =  require("./src/router/media");
const user =  require("./src/router/user");

router.use("/api/login", login);
router.use("/api/raf", raf);
router.use("/api/media", media);
router.use("/api/user", user);

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(router);

// app.listen(port);

// console.log('Fabric application is started on ' + port);
// log.info('Express server listening on port ', server.address().port, " with pid ", process.pid );
var server = app.listen(port, function () {
    console.log('Express server listening on port ', server.address().port, " with pid ", process.pid);
});