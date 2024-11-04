function updateArtist(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const artistId = document.getElementById('update-artist-id').value;
    const artistName = document.getElementById('update-artist-name').value;
    const artistUsername = document.getElementById('update-artist-username').value;
    const artistEmail = document.getElementById('update-artist-email').value;
    // const artistOldPassword = document.getElementById('update-artist-oldPassword').value;
    // const artistNewPassword = document.getElementById('update-artist-newPassword').value;
    const artistPassword = document.getElementById('update-artist-password').value;
    const artistDateOfBirth = document.getElementById('update-artist-dob').value;
    // Create the data object to send
    const data = {
        id: artistId,
        name: artistName,
        username: artistUsername,
        email: artistEmail,
        password: artistPassword,
        date_of_birth: artistDateOfBirth
    };

    // Make the API call using Axios
    axios.put('http://localhost:5000/api/admin/artist/', data)
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            console.error('Error updating artist:', error);
            alert('Error updating artist. Please try again.');
        });

}