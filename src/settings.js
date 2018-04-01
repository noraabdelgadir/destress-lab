
$( document ).ready(function() {

  function addBreed(newBreed) {
    var item = document.createElement('div');
    item.id = newBreed.toLowerCase().split(' ').join('-') + '-wrapper';
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
      console.log("Removing " + item.id);
      $('#' + item.id).remove();
    });
  }

  function addStress(newStressor) {
    var item = document.createElement('div');
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
      console.log("Removing " + item.id);
      $('#' + item.id).remove();
    });
  }

  // When a breed is added, attach a listener to the remove icon

  $.ajax({
    url: "/addBreed",
    json: true,
    data: {username: username, newBreed: breed},
    success: function(response) {
      $('#addbreed-modal #save-breed').on('click', function () {
          var newBreed = $('#addbreed-modal #new-breed').val()
          if(currentBreeds.includes(newBreed)) {
              alert("We already know you love this dog! (No duplicates)");
          } else {
              addBreed(newBreed);
              currentBreeds.push(newBreed);
          }
      });
    }
  });

  $.ajax({
    url: "/removeBreed",
    json: true,
    data: {username: username, toRemove: breed},
    success: function(response) {

    }
  });

  $.ajax({
    url: "/addStressor",
    json: true,
    data: {username: username, newStressor: stressor},
    success: function(response) {
      $('#addstress-modal #save-stressor').on('click', function(){
          var newStress = $('#addstress-modal #new-stressor').val();
          if(currentStressors.includes(newStress)) {
              alert("We already know you're stressed about this! (No duplicates)");
          } else {
              addStress(newStress);
              currentStressors.push(newStress);
          }
      });

    }
  });

  $.ajax({
    url: "/removeStressor",
    json: true,
    data: {username: username, toRemove: stressor},
    success: function(response) {

    }
  });

  $.ajax({
    url: "/changeUsername",
    json: true,
    data: {username: username, newUsername: username},
    success: function(response) {

    }
  });

  $.ajax({
    url: "/changePassword",
    json: true,
    data: {username: username, newPwd: pwd},
    success: function(response) {

    }
  });

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


  // $('#addbreed-modal #save-breed').on('click', function () {
  //   addBreed($('#addbreed-modal #new-breed').val());
  // });
  //
  // //when a stressor is added attach a listener to the remove icon too
  // $('#addstress-modal #save-stressor').on('click', function(){
  //   addStress($('#addstress-modal #new-stressor').val());
  // });
});
