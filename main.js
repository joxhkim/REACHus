$(window).on('load', async function () {
    console.log('All assets are loaded')

    await fetchArticles();

    $('.article_row').on('click', (event) => {
        console.log(event);
        if (!event.currentTarget.classList.contains("expanded")) {
            event.currentTarget.classList.add("expanded")
        } else {
            event.currentTarget.classList.remove("expanded")
        }
    })

})

const fetchArticles = async () => {
    return fetch('http://localhost:5000/articles', {
        method: 'GET',
        mode: 'cors',
    })
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            let articles = await buildArticles(data);
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
                    <div class="url_link">
                        ${article.url}
                    </div>
                </div>
            </div>
        </div>
        `
    })

    $("#article_container").append(html);

}
