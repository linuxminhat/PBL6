function deleteArtist() {
    // Get the values from the form
    const artistId = document.getElementById('delete-artist-id').value;


    // Create the data object to send
    const data = {
        id: artistId
    };
    console.log('Deleting artist:', data);
    // Make the API call using Axios
    axios.delete('http://localhost:5000/api/admin/artist/', {
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            console.error('Error deleting artist:', error);
            alert('Error deleting artist. Please try again.');
        });
}