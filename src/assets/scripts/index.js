$(document).ready(function () {
    var navbarContents = $('#navbar-contents');
    var signout = "<li id='signout'><a href='#' data-toggle='modal' data-target='#signout-modal'>Sign Out</a></li>";
    var accSettings = "<li id='accsettings'><a href='#' data-toggle='modal' data-target='#settings-modal'>Account Settings</a></li>";
    var backButton = "<li id='back'><a href='#'>Back</a></li>";
    var login = "<li id='login'><a href='#' data-toggle='modal' data-target='#login-modal'>Log In</a></li>";
    var signup = "<li id='signup'><a href='#' data-toggle='modal' data-target='#signup-modal'>Sign Up</a></li>";
    var currentBreeds = [];
    var currentStressors = [];

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
            $.post("/user/removeBreed", {toRemove: item.innerHTML}, (data, status) => {
                console.log(data);
            });
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
            $.post("/user/removeStressor", {toRemove: item.innerHTML}, (data, status) => {
                console.log(data);
            });
        });
    }

    /**
     * Setup the buttons and breed/stressors for logged in user
     */
    function loginSetup() {
        $('#login').remove();
        $('#signup').remove();
        $('#navbar-contents').append(accSettings);
        $('#navbar-contents').append(signout);

        var promise = new Promise((resolve, reject) => {
            $.get('/game/breeds', (breeds, status) => {
            currentBreeds = JSON.parse(breeds);
            }).then(() => {
            $.get('/game/stressors', (stressors, status) => {
                currentStressors = JSON.parse(stressors);
            }).then(() => {
                resolve();
            });
            });
        });

        promise.then(() => {
            for(var i = 0; i < currentBreeds.length; i++) {
            addBreed(currentBreeds[i]);
            }
            for(var i = 0; i < currentStressors.length; i++) {
            addStress(currentStressors[i]);
            }
        });
    }

    function logoutSetup() {
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
    }

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

        $.post("/user/login", {username: username, password: password}, (data, status) => {
            console.log(data)
            loginSetup();
        });
    });

    /**
     * Similar to login, a user can sign up without proper credentials,
     * as long as the two passwords match.
     */
    $('#signup-modal #signup-button').on('click', function () {
        var username = $('#signup-modal #signup-username').val();
        var pwd1 = $('#signup-modal #pwd').val();
        var pwd2 = $('#signup-modal #re-enter').val();

        // Log it, in Assignment 3, we will send it to the server instead
        console.log('username: ' + username);
        console.log('password: ' + pwd1);
        console.log('password: ' + pwd2);

        if (pwd1 === pwd2) {
            $.post("/user", {username: username, password: pwd1}, (data, status) => {
            console.log(data)
            loginSetup(username, JSON.parse(data));
            });
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
        $.get('/user/logout', (data, status) => {
            console.log(data);
        });
        logoutSetup();
        auth = false;
    });

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
            });
        }
    });

    $('#addbreed-modal #save-breed').on('click', function () {
        var breed = $('#addbreed-modal #new-breed').val();

        if(currentBreeds.includes(breed)) {
            alert("Breed already exists in your saved breeds");
        } else {
            addBreed(breed);
            currentBreeds.push(breed);
            $.post("/user/addBreed", {newBreed: breed}, (data, status) => {
            console.log(data);
            });
        }
    });

    //when a stressor is added attach a listener to the remove icon too
    $('#addstress-modal #save-stressor').on('click', function(){
        var stress = $('#addstress-modal #new-stressor').val();
        if(currentStressors.includes(stress)) {
            alert("Stressor already exists in your saved stressors");
        } else {
            addStress(stress);
            currentStressors.push(stress);
            $.post("/user/addStressor", {newStressor: stress}, (data, status) => {
            console.log(data);
            });
        }
    });

    $('#confirm-modal #c-delete-acc').on('click', function () {
        console.log('delete')
        $.ajax({
        url: '/user',
        type: 'DELETE',
        success: (data, status) => {
            console.log(data);
        }
        });
        logoutSetup();
    });

    $('#pop-game').on('click', function () {
        location.href = "/game/pop";
    });

    $('#shooter-game').on('click', function () {
        location.href = "/game/shooter";
    });

    $('[data-toggle="popover"]').popover();

    $.get('user/isauth', (data, status) => {
        var isAuth = JSON.parse(data);
        if (isAuth) {
            loginSetup();
        } else {
            logoutSetup();
        }
    });
});