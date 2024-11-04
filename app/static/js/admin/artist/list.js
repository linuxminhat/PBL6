document.addEventListener('DOMContentLoaded', function () {
    // Select all buttons with the class 'edit-btn'
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    editButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the genre values from the button's data attributes
            var artistId = this.getAttribute('data-id');
            var artistName = this.getAttribute('data-name');
            var artistUsername = this.getAttribute('data-username')
            var artistDateOfBirth = this.getAttribute('data-dob');
            var artistEmail = this.getAttribute('data-email');
            // Now populate the modal's form fields
            var modal = document.querySelector('#edit-popup');
            modal.querySelector('#update-artist-id').value = artistId;
            modal.querySelector('#update-artist-name').value = artistName;
            modal.querySelector('#update-artist-username').value = artistUsername;
            modal.querySelector('#update-artist-dob').value = artistDateOfBirth;
            modal.querySelector('#update-artist-email').value = artistEmail;
        });
    });

    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the genre id from the button's data attribute
            var artistId = this.getAttribute('data-id');
            console.log('Deleting artist:', artistId);
            // Now display a confirmation modal
            var modal = document.querySelector('#delete-popup'); // Select your delete modal
            // console.log('Genre ID:', modal);
            modal.querySelector('#delete-artist-id').value = artistId; // Hidden input for genre id
        });
    })
});
