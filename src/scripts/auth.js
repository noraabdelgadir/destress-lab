'use strict';

$(document).ready(function () {
    $('#signup-button').on('click', function () {
        var username = $('#signup-username');
        var pwd1 = $('#pwd').val();
        var pwd2 = $('#re-enter').val();

        // Log it, in Assignment 3, we will send it to the server instead
        console.log('username: ' + $('#signup-modal #username').val());
        console.log('password: ' + pwd1);
        console.log('password: ' + pwd2);

        if (pwd1 === pwd2) {
            $.ajax({
                url: "http://localhost:3000/user",
                json: true,
                data: {username: username, password: pwd1},
                success: function(response) {
                    alert('User creation successful.');
                }
            });
        
        } else {
            alert('Sign up unsuccessful.');
        }
    });
});