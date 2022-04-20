$(window).on('load', async function () {
    $(document).on('submit', '#login_form', (e) => {
        e.preventDefault();
    })

    $(document).on('click', '#login_button', async (e) => {
        let emailInput = $(document).find('#email').val();
        let passwordInput = $(document).find('#password').val();

        if (emailInput.length > 0 && passwordInput.length > 0) {
            let result = await authenticateLogin(emailInput, passwordInput)
            if (result == true) {
                window.location.replace("main.html");
            }
        }
    })

    $(document).on('click', '#create_account', (e) => {
        window.location.replace("register.html");
    })

})

const authenticateLogin = async (email, password) => {
    return fetch('http://localhost:5000/user/login', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(async res => {
            return res.status;
        });
}