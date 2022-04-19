const express = require('express');
const app = express();
const port = 5000;
const api = require('./api');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/articles/', api.getAllArticles);
app.get('/articles/:id', api.getHorrorById);
app.post('/articles/', api.addHorror);
app.put('/articles/:id', api.updateHorror);
app.delete('/articles/:id', api.deleteHorror);