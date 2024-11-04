function addGenre(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const genreId = document.getElementById('genre-id').value;
    const genreName = document.getElementById('genre-name').value;
    const genreDescription = document.getElementById('genre-description').value;

    // You can now use these values to update the genre
    // For example, you might send them to a server using an API call
    console.log('Updating genre:', { id: genreId, name: genreName, description: genreDescription });
    // Create the data object to send
    const data = {
        id: genreId,
        name: genreName,
        description: genreDescription
    };

    // Make the API call using Axios
    axios.post('http://localhost:5000/api/admin/genre', data)
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            console.error('Error updating genre:', error);
            alert('Error updating genre. Please try again.');
        });
}