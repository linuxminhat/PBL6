function register() {
    const name = $('#register-name').val();
    const username = $('#register-username').val();
    const email = $('#register-email').val();
    const DateOfBirth = $('#register-dob').val();
    const password = $('#register-password').val();

    const data = {
        name: name,
        username: username,
        email: email,
        password: password,
        date_of_birth: DateOfBirth,
    };

    // Make the API call using Axios
    axios.post('/api/auth/register/create', data)
        .then((response) => {
            const rep = response.data;
            if (rep.success === true) {
                $('#login-popup').modal('toggle');
                $('#register-popup').modal('toggle');
                $('#login-username').val(username);
                $('#login-password').val(password);
            } else {
                if (rep.error === 'email exists') {
                    alert('Email đã tồn tại');
                } else if (rep.error === 'username exists') {
                    alert('Tên người dùng đã tồn tại');
                }
            }
        })
        .catch(function (error) {
            console.error('Error register user:', error);
            alert('Lỗi đăng ký. Vui lòng thử lại.');
        });
}