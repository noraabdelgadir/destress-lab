'use strict';

/*
Without backend, there is no way to let user data persist
so for this assignment, we will use mock data.
*/

// The preset user for Assignment 2 frontend
var presetUser = 'DogLovingHuman';
var presetPwd = 'ILoveDogs123';
var presetBreeds = ['beagle', 'retriever'];
var presetStressors = ['work', 'school', 'deadlines', 'bad music',
    'cliffhangers', 'bills', 'responsibilities'];

var currentBreeds = null;
var currentStressors = null;
var auth = false;

$(document).ready(function () {
    var signout = "<li id='signout'><a href='#' data-toggle='modal' data-target='#signout-modal'>Sign Out</a></li>";
    var accSettings = "<li id='accsettings'><a href='#' data-toggle='modal' data-target='#settings-modal'>Account Settings</a></li>";
    var backButton = "<li id='back'><a href='#'>Back</a></li>";
    var login = "<li id='login'><a href='#' data-toggle='modal' data-target='#login-modal'>Log In</a></li>";
    var signup = "<li id='signup'><a href='#' data-toggle='modal' data-target='#signup-modal'>Sign Up</a></li>";

    // Add all available breeds from the API to the dropdown
    var availableBreeds = [];
    $.ajax({
        url: "https://dog.ceo/api/breeds/list/all",
        json: true,
        success: function(response) {
            availableBreeds = Object.keys(response.message);
            var list = document.getElementById('dropdown-menu');
            for(var i = 0; i < availableBreeds.length; i++) {
                var entry = document.createElement('li');
                entry.id = availableBreeds[i] + '-dropdown-box';
                entry.className = 'dropdown-element'
                entry.innerHTML = availableBreeds[i];
                list.append(entry);
            }
            // Change the input field to whatever is selected in dropdown
            $('#dropdown-menu li').on('click', function () {
                document.getElementById('new-breed').value = $(this).text();
            })
        }
    });

    /* Helpers */

    /**
     * Create the element representing that breed, add the remove button to it
     */
    function addBreed(newBreed) {
        var item = document.createElement('div');
        item.id = newBreed + '-wrapper';
        item.classList = ['list-group-item'];
        item.innerHTML = newBreed;
        var icon1 = document.createElement('span');
        icon1.id = newBreed.toLowerCase() + '-wrapper';
        icon1.classList = ['pull-right'];
        var icon2 = document.createElement('span');
        icon2.id = 'remove-' + item.id;
        icon2.classList = ['glyphicon  glyphicon-trash'];
        icon1.append(icon2);
        item.append(icon1);
        $('#breed-pref').append(item);
        $('#' + icon2.id).on('click',
        function () {
          $('#' + item.id).remove();
          currentBreeds.splice(currentBreeds.indexOf(newBreed), 1);
        });
    }

    /**
     * Create the element representing that stress, add the remove button to it
     */
    function addStress(newStressor) {
        var item = document.createElement('div');
        /*
        The string functions applied below here are just in case the API changes
        and allows for spacing in their names.
        */
        item.id = newStressor.toLowerCase().split(' ').join('-') + '-wrapper';
        item.classList = ['list-group-item'];
        item.innerHTML = newStressor;
        var icon1 = document.createElement('span');
        icon1.id = newStressor.toLowerCase() + '-wrapper';
        icon1.classList = ['pull-right'];
        var icon2 = document.createElement('span');
        icon2.id = 'remove-' + item.id;
        icon2.classList = ['glyphicon  glyphicon-trash'];
        icon1.append(icon2);
        item.append(icon1);
        $('#stress-list').append(item);
        $('#' + icon2.id).on('click',
        function () {
          $('#' + item.id).remove();
          currentStressors.splice(currentStressors.indexOf(newStressor), 1);
        });
    }

    /**
     * Setup the buttons and breed/stressors for logged in user
     */
    function loginSetup(username) {
        $('#login').remove();
        $('#signup').remove();
        $('#navbar-contents').append(accSettings);
        $('#navbar-contents').append(signout);

        // This will be a fetch to backend user data in Assignment 3
        currentBreeds = presetBreeds;
        currentStressors = presetStressors;

        for(var i = 0; i < currentBreeds.length; i++) {
            addBreed(currentBreeds[i]);
        }
        for(var i = 0; i < currentStressors.length; i++) {
            addStress(currentStressors[i]);
        }

        auth = true;
    }

    /* Listeners */

    /**
     * This will handle the event where the user clicks the game panel
     * and updates the view to display the game.
     */
    $('#main-screen').on('click', '#select-panel', function () {
        $('#navbar-contents').append(backButton);
        $('#login').remove();
        $('#signup').remove();
        $('#accsettings').remove();
        $('#signout').remove();
        document.getElementById('GameA').style.display = 'block';
        document.getElementById('game-panel-container').style.display = 'none';
        document.getElementById('jazz-music').play();
    });

    /**
     * This handles the event where the user clicks the back button
     * in game and updates the view to display the main menu.
     */
    $('#navbar-contents').on('click', '#back', function () {
        document.getElementById('GameA').style.display = 'none';
        document.getElementById('game-panel-container').style.display = 'flex';
        $('#back').remove();
        var music = document.getElementById('jazz-music');
        music.pause();
        music.currentTime = 0;
        var navbarContents = $('#navbar-contents');
        if(auth) {
            navbarContents.append(accSettings);
            navbarContents.append(signout);
        } else {
            navbarContents.append(login);
            navbarContents.append(signup);
        }
    });

    /**
     * This will handle login during assignment 3 but for now it will
     * print the username and password to console and allow a user
     * to log in, regardless of correct credentials.
     */
    $('#login-modal #login-button').on('click', function () {
        var username = $('#login-modal #username').val();
        var password = $('#login-modal #login-pwd').val();

        // Log it, in Assignment 3, we will send it to the server instead
        console.log('username: ' + username);
        console.log('password: ' + password);

        // Will be replaced with proper authentication in Assignment 3
        if (username === presetUser && password === presetPwd) {
            loginSetup(username);
        } else {
            alert("Login failed.");
        }
    });

    /**
     * Similar to login, a user can sign up without proper credentials,
     * as long as the two passwords match.
     */
    $('#signup-modal #signup-button').on('click', function () {
        var username = $('#signup-modal signup-username');
        var pwd1 = $('#signup-modal #pwd').val();
        var pwd2 = $('#signup-modal #re-enter').val();

        // Log it, in Assignment 3, we will send it to the server instead
        console.log('username: ' + $('#signup-modal #username').val());
        console.log('password: ' + pwd1);
        console.log('password: ' + pwd2);

        if (pwd1 === pwd2) {
            loginSetup(username);
        } else {
            alert('Sign up unsuccessful.');
        }
    });

    /**
     * Returns login and signup buttons to where they were and removes
     * the sign out button.
     */
    $('#signout-modal #signout-button').on('click', function () {
        var navbarContents = $('#navbar-contents');
        $('#signout').remove();
        $('#accsettings').remove();

        // remove from account settings modal
        var nodes = document.getElementById('breed-pref').childNodes;
        var len = nodes.length;
        for(var i = len - 1; i >= 0; i--) {
            nodes[i].remove();
        }
        nodes = document.getElementById('stress-list').childNodes;
        len = nodes.length;
        for(var i = len - 1; i >= 0; i--) {
            nodes[i].remove();
        }

        navbarContents.append(login);
        navbarContents.append(signup);

        currentBreeds = null;
        currentStressors = null;

        auth = false;
    });

    $('[data-toggle="popover"]').popover();

    /**
     * When a breed is added, attach a listener to the remove icon.
     */
    $('#addbreed-modal #save-breed').on('click', function () {
        var newBreed = $('#addbreed-modal #new-breed').val()
        if(currentBreeds.includes(newBreed)) {
            alert("We already know you love this dog! (No duplicates)");
        } else {
            addBreed(newBreed);
            currentBreeds.push(newBreed);
        }
    });

    /**
     * when a stressor is added attach a listener to the remove icon too.
     */
    $('#addstress-modal #save-stressor').on('click', function(){
        var newStress = $('#addstress-modal #new-stressor').val();
        if(currentStressors.includes(newStress)) {
            alert("We already know you're stressed about this! (No duplicates)");
        } else {
            addStress(newStress);
            currentStressors.push(newStress);
        }
    });
});
