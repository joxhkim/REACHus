$(window).on('load', async function () {
    $(document).on('submit', '#login_form', (e) => {
        e.preventDefault();
    })

    $(document).on('click', '#submit_button', async (e) => {
        let firstName = $(document).find('#firstname').val();
        let lastName = $(document).find('#lastname').val();
        let emailInput = $(document).find('#email').val();
        let passwordInput = $(document).find('#password').val();
        let confirmPassword = $(document).find('#confirm_password').val();

        if (passwordInput == confirmPassword) {
            let result = await registerUser(firstName, lastName, emailInput, passwordInput);
            if (result.status == true) {
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
        .then(response => response)
        .then(async res => {
            window.location.replace("main.html");
        });
}