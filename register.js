$(window).on('load', async function () {
    $(document).on('submit', '#register_form', (e) => {
        e.preventDefault();
    })

    $(document).on('click', '#submit_button', async (e) => {
        let firstName = $(document).find('#firstname').val();
        let lastName = $(document).find('#lastname').val();
        let emailInput = $(document).find('#email').val();
        let passwordInput = $(document).find('#password').val();
        let confirmPassword = $(document).find('#confirm_password').val();

        if (passwordInput == confirmPassword) {
            let result = await registerUser(firstName, lastName, emailInput, crypt("salt", passwordInput));
            if (result.status == true) {
                window.location.replace("main.html");
            }
        } else {
            $('#confirm_password').get(0).setCustomValidity('Passwords do not match');
        }

    })

    $(document).on('click', '#login_account', (e) => {
        window.location.replace("index.html");
    })

})

const registerUser = async (firstname, lastname, email, password) => {
    return fetch('http://localhost:5000/user/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname, lastname, email, password })
    })
        .then(response => response.json())
        .then(async res => {
            return res;
        });
}

const crypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};

