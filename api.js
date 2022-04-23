const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'reach', // NOTE: This should be the name of your database you created
    password: 'auburn',  // NOTE: Your Postgres superuser password should be here
    port: 5432
});


const authenticateLogin = async (request, response) => {
    const { email, password } = request.body;
    pool.query("SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'", (error, results) => {
        if (error) {
            console.log('err fetching user didnt match')
        } else {
            if (results.rowCount == 0) {
                console.log('no user found');
                response.status(404).json({ status: false });
            } else {
                console.log('verified user login');
                response.status(200).json({ status: true });
            }
        }
    });
}

const registerUser = async (request, response) => {
    const { firstname, lastname, email, password } = request.body;
    pool.query("INSERT INTO users (first_name, last_name, email, password) VALUES ("
        + "'" + firstname + "',"
        + "'" + lastname + "',"
        + "'" + email + "',"
        + "'" + password + "')",
        (error, results) => {
            if (error) {
                console.log('error with registering ', error)
            } else {
                console.log('verified user creation');
                response.status(200).json({ status: true });
            }
        });
}

const getAllArticles = async (request, response) => {
    pool.query('SELECT * FROM articles', (error, results) => {
        response.status(200).json(results.rows);
    });
};

const getSearchTerms = async (request, response) => {
    pool.query('SELECT * FROM search_terms', (error, results) => {
        response.status(200).json(results.rows);
    });
};

const getAcademicJournals = async (request, response) => {
    pool.query('SELECT * FROM journal_terms', (error, results) => {
        response.status(200).json(results.rows);
    });
};

const getAuthors = async (request, response) => {
    pool.query('SELECT * FROM author_terms', (error, results) => {
        response.status(200).json(results.rows);
    });
};

const addSearchTerm = async (request, response) => {
    const { message } = request.body;
    pool.query("INSERT INTO search_terms (search_term) VALUES ('" + message + "')", (error, results) => {
        console.log('added search term successfully');
        response.status(200).json({ term: message, type: "search" });
    });
};

const addJournalTerm = async (request, response) => {
    const { message } = request.body;
    pool.query("INSERT INTO journal_terms (journal_term) VALUES ('" + message + "')", (error, results) => {
        console.log('added journal term successfully');
        response.status(200).json({ term: message, type: "journal" });
    });
};

const addAuthorTerm = async (request, response) => {
    const { message } = request.body;
    pool.query("INSERT INTO author_terms (author_term) VALUES ('" + message + "')", (error, results) => {
        console.log('added author term successfully');
        response.status(200).json({ term: message, type: "author" });
    });
};

const deleteSearchTerm = async (request, response) => {
    const { message } = request.body;
    pool.query('DELETE FROM search_terms WHERE id = ' + parseInt(message.id), (error, results) => {
        response.status(200).json({ deleted_id: message.id, type: "search" });
    });
};

const deleteJournalTerm = async (request, response) => {
    const { message } = request.body;
    pool.query('DELETE FROM journal_terms WHERE id = ' + parseInt(message.id), (error, results) => {
        response.status(200).json({ deleted_id: message.id, type: "journal" });
    });
};

const deleteAuthorTerm = async (request, response) => {
    const { message } = request.body;
    pool.query('DELETE FROM author_terms WHERE id = ' + parseInt(message.id), (error, results) => {
        response.status(200).json({ deleted_id: message.id, type: "author" });
    });
};

const getHorrorById = (request, response) => {
    const id = parseInt(request.params.id);
    if (request.treatment == 'on') {
        pool.query('SELECT * FROM horrors WHERE id = $1', [id], (error, results) => {
            response.status(200).json(results.rows);
        });
    } else {
        response.status(200).json(inMemoryHorrors[0]);
    }
};

module.exports = {
    registerUser,
    authenticateLogin,
    getAllArticles,
    getAcademicJournals,
    getSearchTerms,
    getAuthors,
    addSearchTerm,
    addJournalTerm,
    addAuthorTerm,
    deleteSearchTerm,
    deleteJournalTerm,
    deleteAuthorTerm,
};

// const inMemoryHorrors = [
//     {
//         name: 'The Hills Have Eyes',
//         rating: 7.8
//     },
//     {
//         name: 'Night of the Living Dead',
//         rating: 9.0
//     },
//     {
//         name: 'Scream',
//         rating: 7.2
//     }
// ];

// const updateHorror = (request, response) => {
//     const id = parseInt(request.params.id);
//     const { name, rating } = request.body;

//     if (request.treatment == 'on') {
//         pool.query('UPDATE horrors SET name = $1, rating = $2 WHERE id = $3', [name, rating, id], (error, results) => {
//             response.status(200).send(`Horror with id ${id} modified.`);
//         });
//     } else {
//         inMemoryHorrors[0] = { name, rating };
//         response.status(200).send(`Horror with id ${id} modified.`);
//     }
// };

// const deleteHorror = (request, response) => {
//     const id = parseInt(request.params.id);

//     if (request.treatment == 'on') {
//         pool.query('DELETE FROM horrors WHERE id = $1', [id], (error, results) => {
//             response.status(200).send(`Horror with id ${id} deleted.`);
//         });
//     } else {
//         inMemoryHorrors.shift();
//         response.status(200).send(`Horror with id ${id} deleted.`);
//     }
// };