function updateGenre(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const genreId = document.getElementById('update-genre-id').value;
    const genreName = document.getElementById('update-genre-name').value;
    const genreDescription = document.getElementById('update-genre-description').value;

    // Create the data object to send
    const data = {
        id: genreId,
        name: genreName,
        description: genreDescription
    };

    // Make the API call using Axios
    axios.put('http://localhost:5000/api/admin/genre/', data)
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            console.error('Error updating genre:', error);
            alert('Error updating genre. Please try again.');
        });

}