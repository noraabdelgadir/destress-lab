
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
    url: '/'
  });

  $('#addbreed-modal #save-breed').on('click', function () {
    addBreed($('#addbreed-modal #new-breed').val());
  });

  //when a stressor is added attach a listener to the remove icon too
  $('#addstress-modal #save-stressor').on('click', function(){
    addStress($('#addstress-modal #new-stressor').val());
  });
});
