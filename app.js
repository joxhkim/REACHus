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

app.post('/user/register/', api.registerUser)
app.put('/user/login/', api.authenticateLogin)
app.get('/articles/', api.getAllArticles);
app.get('/search_terms/', api.getSearchTerms);
app.get('/author_terms/', api.getAuthors);
app.get('/journal_terms/', api.getAcademicJournals);
app.post('/add/search_term/', api.addSearchTerm);
app.post('/add/journal_term/', api.addJournalTerm);
app.post('/add/author_term/', api.addAuthorTerm);
app.put('/delete/search_term/', api.deleteSearchTerm);
app.put('/delete/journal_term/', api.deleteJournalTerm);
app.put('/delete/author_term/', api.deleteAuthorTerm);
