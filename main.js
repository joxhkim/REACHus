this.articlesArray = [];
this.searchTerms = [];
this.journalTerms = [];
this.authorTerms = [];

$(window).on('load', async function () {
    console.log('All assets are loaded')


    await fetchArticles();
    await fetchSearchTerms();
    await fetchAcademicJournals();
    await fetchAuthors();


    $(document).on('click', '.article_row', (event) => {
        console.log(event);
        if (!event.currentTarget.classList.contains("expanded")) {
            event.currentTarget.classList.add("expanded")
        } else {
            event.currentTarget.classList.remove("expanded")
        }
    })

    $(document).on('click', '#search_term_title', (event) => {
        console.log(event);
        if (!event.currentTarget.classList.contains("expanded_search")) {
            event.currentTarget.classList.add("expanded_search");
        } else {
            event.currentTarget.classList.remove("expanded_search");
        }
    })

    $(document).on('click', '#journal_term_title', (event) => {
        console.log(event);
        if (!event.currentTarget.classList.contains("expanded_journal")) {
            event.currentTarget.classList.add("expanded_journal");
        } else {
            event.currentTarget.classList.remove("expanded_journal");
        }
    })


    $(document).on('click', '#author_term_title', (event) => {
        console.log(event);
        if (!event.currentTarget.classList.contains("expanded_author")) {
            event.currentTarget.classList.add("expanded_author");
        } else {
            event.currentTarget.classList.remove("expanded_author");
        }
    })

    $(document).on('click', '#author_term_title', (event) => {
        console.log(event);
        if (!event.currentTarget.classList.contains("expanded_author")) {
            event.currentTarget.classList.add("expanded_author");
        } else {
            event.currentTarget.classList.remove("expanded_author");
        }
    })

    $(document).on('click', '#author_term_title', (event) => {
        console.log(event);
        if (!event.currentTarget.classList.contains("expanded_author")) {
            event.currentTarget.classList.add("expanded_author");
        } else {
            event.currentTarget.classList.remove("expanded_author");
        }
    })

    $(document).on('click', '#search_term_expand', (event) => {
        console.log(event);
        if (!$('#more_search_terms_container').hasClass("search_more")) {
            $('#more_search_terms_container').addClass("search_more");
            $('#search_term_expand').text('Show Less')
        } else {
            $('#more_search_terms_container').removeClass("search_more");
            $('#search_term_expand').text('Show More')
        }
    })

    $(document).on('click', '#journal_term_expand', (event) => {
        console.log(event);
        if (!$('#more_journal_terms_container').hasClass("journal_more")) {
            $('#more_journal_terms_container').addClass("journal_more");
            $('#journal_term_expand').text('Show Less')
        } else {
            $('#more_journal_terms_container').removeClass("journal_more");
            $('#journal_term_expand').text('Show More')
        }
    })

    $(document).on('click', '#author_term_expand', (event) => {
        console.log(event);
        if (!$('#more_author_terms_container').hasClass("author_more")) {
            $('#more_author_terms_container').addClass("author_more");
            $('#author_term_expand').text('Show Less');
        } else {
            $('#more_author_terms_container').removeClass("author_more");
            $('#author_term_expand').text('Show More');
        }
    })

    $(document).on('click', '#add_btn', (event) => {
        let input = $('#addbar_input').val();

        if (input.trim().length > 0) {
            if ($('#search_term_button:checked').length > 0) {
                addTerm(input, "search");
            } else if ($('#journal_term_button:checked').length > 0) {
                addTerm(input, "journal");
            } else if ($('#author_term_button:checked').length > 0) {
                addTerm(input, "author");
            }
        }
    })

    $(document).on('click', '#reset_btn', (event) => {
        $('#article_container').html(null);
        buildArticles(this.articlesArray);
        $('#addbar_input').val("");
        $('input[type="radio"]').prop("checked", false);
    })

    $(document).on('click', '#sidebar_container:not(.deleted) .search_term #search_term_input', (event) => {
        let input = $(event.currentTarget).parent().find('#search_term_input_text').text().replace(/\n/g, " ").trim();
        filterArticles(input, "search");
    })

    $(document).on('click', '#sidebar_container:not(.deleted) .journal_term #journal_term_input', (event) => {
        let input = $(event.currentTarget).parent().find('#journal_term_input_text').text().replace(/\n/g, " ").trim();
        filterArticles(input, "journal");
    })

    $(document).on('click', '#sidebar_container:not(.deleted) .author_term #author_term_input', (event) => {
        let input = $(event.currentTarget).parent().find('#author_term_input_text').text().replace(/\n/g, " ").trim();
        filterArticles(input, "author");
    })

    $(document).on('click', '#delete_btn', (event) => {
        if (!$('#sidebar_container').hasClass('deleted')) {
            $('#sidebar_container').addClass('deleted');
            $('#delete_btn #search_btn_text')[0].innerText = "SAVE"
        } else {
            $('#sidebar_container').removeClass('deleted');
            $('#delete_btn #search_btn_text')[0].innerText = "DELETE TERM"
        }
    })

    $(document).on('click', '#sidebar_container.deleted .search_term_delete', (event) => {
        console.log('deleting search')
        let searchTerm = $(event.currentTarget).parent().find('#search_term_input_text').text().replace(/\n/g, " ").trim();
        let termForDeletion = searchTerms.find(s => s.search_term == searchTerm);
        deleteTerm(termForDeletion, "search");
    })

    $(document).on('click', '#sidebar_container.deleted .journal_term_delete', (event) => {
        console.log('deleting journal')
        let journalTerm = $(event.currentTarget).parent().find('#journal_term_input_text').text().replace(/\n/g, " ").trim();
        let termForDeletion = journalTerms.find(s => s.journal_term == journalTerm);
        deleteTerm(termForDeletion, "journal");
    })

    $(document).on('click', '#sidebar_container.deleted .author_term_delete', (event) => {
        console.log('deleting author')
        let authorTerm = $(event.currentTarget).parent().find('#author_term_input_text').text().replace(/\n/g, " ").trim();
        let termForDeletion = authorTerms.find(s => s.author_term == authorTerm);
        deleteTerm(termForDeletion, "author");
    })

    $(document).on('click', '#logout_button', (event) => {
        window.location.replace("index.html");
    })
})

const filterArticles = (input, context) => {
    let allArticles = this.articlesArray;
    let filteredArticles = [];

    filteredArticles = allArticles.filter(article => {
        if (context == "search") {
            return (article.title.toLowerCase().search(input.toLowerCase()) !== -1
                || article.author.toLowerCase().search(input.toLowerCase()) !== -1
                || article.description.toLowerCase().search(input.toLowerCase()) !== -1)
        } else if (context == "journal") {
            // return article.journal.toLowerCase().search(input.toLowerCase()) !== -1 
        } else if (context == "author") {
            return article.author.toLowerCase().search(input.toLowerCase()) !== -1
        }
    });

    $('#article_container').html(null);
    buildArticles(filteredArticles);
}

const deleteTerm = async (input, context) => {
    return fetch('http://localhost:5000/delete/' + context + '_term', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
    })
        .then(response => response.json())
        .then(async res => {
            console.log('deleted term res here as ', res);

            if (res.type == "search") {
                this.searchTerms = this.searchTerms.filter(s => s.id != res.deleted_id);
                $('#search_term_render').children('.search_term').remove();
                $('#search_term_render #more_search_terms').children('.search_term').remove();
                buildTerms(this.searchTerms, "search")
            } else if (res.type == "journal") {
                this.journalTerms = this.journalTerms.filter(s => s.id != res.deleted_id);
                $('#journal_term_render').children('.journal_term').remove();
                $('#journal_term_render #more_journal_terms').children('.journal_term').remove();
                buildTerms(this.journalTerms, "journal");
            } else {
                this.authorTerms = this.authorTerms.filter(s => s.id != res.deleted_id);
                $('#author_term_render').children('.author_term').remove();
                $('#author_term_render #more_author_terms').children('.author_term').remove();
                buildTerms(this.authorTerms, "author")
            }

        });
}

const addTerm = async (input, context) => {
    return fetch('http://localhost:5000/add/' + context + '_term', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
    })
        .then(response => response.json())
        .then(async res => {
            console.log('add term res here as ', res);

            if (res.type == "search") {
                this.searchTerms.push({ search_term: res.term });
                $('#search_term_render').children('.search_term').remove();
                $('#search_term_render #more_search_terms').children('.search_term').remove();
                buildTerms(this.searchTerms, "search")
            } else if (res.type == "journal") {
                this.journalTerms.push({ journal_term: res.term });
                $('#journal_term_render').children('.journal_term').remove();
                $('#journal_term_render #more_journal_terms').children('.journal_term').remove();
                buildTerms(this.journalTerms, "journal");
            } else {
                this.authorTerms.push({ author_term: res.term });
                $('#author_term_render').children('.author_term').remove();
                $('#author_term_render #more_author_terms').children('.author_term').remove();
                buildTerms(this.authorTerms, "author")
            }

        });
}

const fetchArticles = async () => {
    return fetch('http://localhost:5000/articles', {
        method: 'GET',
        mode: 'cors',
    })
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            data = data.reverse();
            articles = await buildArticles(data);
            this.articlesArray = data;
            return articles;
        });
}

const fetchAcademicJournals = async () => {
    return fetch('http://localhost:5000/journal_terms', {
        method: 'GET',
        mode: 'cors',
    })
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            let articles = await buildTerms(data, "journal");
            this.journalTerms = data;
            return articles;
        });
}

const fetchAuthors = async () => {
    return fetch('http://localhost:5000/author_terms', {
        method: 'GET',
        mode: 'cors',
    })
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            let articles = await buildTerms(data, "author");
            this.authorTerms = data;
            return articles;
        });
}

const fetchSearchTerms = async () => {
    return fetch('http://localhost:5000/search_terms', {
        method: 'GET',
        mode: 'cors',
    })
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            let articles = await buildTerms(data, "search");
            this.searchTerms = data;
            return articles;
        });
}

const buildArticles = async (articles) => {
    let html = "";
    articles.forEach(article => {
        html +=
            `
        <div class="article_row">
            <div class="article_title">
                <span class="article_title_text">
                    ${article.title}
                </span>
            </div>
            <div class="article_content">
                <span style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: bold;">
                    Abstract:
                </span>
                <p class="article_abstract_text">
                ${article.description}
                </p>
                <div style="display:flex;flex-direction: row" ;>
                    <span class="url_link_text">
                        URL Link:
                    </span>
                    &nbsp;
                    <a href="${article.url}" target="_blank" class="url_link">
                    ${article.url}    
                    </a>
                </div>
            </div>
        </div>
        `
    })

    $("#article_container").append(html);

}

const buildTerms = async (terms, context) => {
    let html = "";
    let excessTermsHtml = "";
    terms.forEach((term, index) => {
        if (index < 5) {
            html +=
                `
            <div class="${context}_term">
                <div id="${context}_term_input_container">    
                    <input id="${context}_term_input" name="radio_term" type="radio" id="${term[context + "_term"]}" />
                    <label id="${context}_term_input_text" for="${term[context + "_term"]}">
                        ${term[context + "_term"]}
                    </label>
                </div>
                <div class="${context}_term_delete">
                    <i class="fa-solid fa-xmark" style="cursor: pointer; flex:0.2"></i>
                </div>
            </div>
            `
        } else {
            excessTermsHtml +=
                `
            <div class="${context}_term">
                <div id="${context}_term_input_container">    
                    <input id="${context}_term_input" name="radio_term" type="radio" id="${term[context + "_term"]}" />
                    <label id="${context}_term_input_text" for="${term[context + "_term"]}">
                        ${term[context + "_term"]}
                    </label>
                </div>
                <div class="${context}_term_delete">
                    <i class="fa-solid fa-xmark" style="cursor: pointer; flex:0.2"></i>
                </div>
            </div>
        `
        }

    })

    if (context == "search") {
        $("#search_term_render").prepend(html);
        $("#more_search_terms").append(excessTermsHtml);
    } else if (context == "author") {
        $("#author_term_render").prepend(html);
        $("#more_author_terms").append(excessTermsHtml);
    } else {
        $("#journal_term_render").prepend(html);
        $("#more_journal_terms").append(excessTermsHtml);
    }

}

// window.onload = function () {
//     document.getElementById("dropdown-arrow").addEventListener('click',
//         () => {
//             console.log('HELLO WORLD');
//         }
//     )
// }

