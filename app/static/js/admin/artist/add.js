function addArtist(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const artistId = document.getElementById('artist-id').value;
    const artistName = document.getElementById('artist-name').value;
    const artistUsername = document.getElementById('artist-username').value;
    const artistEmail = document.getElementById('artist-email').value;
    const artistPassword = document.getElementById('artist-password').value;
    const artistDateOfBirth = document.getElementById('artist-dob').value;
    // You can now use these values to update the genre
    // For example, you might send them to a server using an API call
    // Create the data object to send
    const data = {
        id: artistId,
        name: artistName,
        username: artistUsername,
        email: artistEmail,
        password: artistPassword,
        date_of_birth: artistDateOfBirth,

    };

    // Make the API call using Axios
    axios.post('http://localhost:5000/api/admin/artist/', data)
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            console.error('Error adding artist:', error);
            alert('Error adding artist. Please try again.');
        });
}