import express from 'express';
import bodyParser from 'body-parser';
import {routes} from "./routes/routes.js";

const app = express();
const hostname = '127.0.0.1';
const port = 8000;

function notFound(req, res, next) {
    res.setHeader("Content-Type", 'text/html');
    res.status(404).send("404 - SEITE NICHT GEFUNDEN");
}

function errorHandler(err, req, res, next) {
    res.status(500).end(err.message);
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server available: http://${hostname}:${port}`);
});

