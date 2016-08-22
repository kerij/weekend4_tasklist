$(document).ready(function () {
  getTasks();
  document.getElementById("task").value = "";

  $('#task-submit').on('click', postTask);
  $('#task-container').on('click', '.delete', deleteTask);
  $('#task-container').on('click', '.complete-button', putTask);
});

function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function (tasks) {
      console.log('GET /tasks returns:', tasks);
      appendTasks(tasks);
    },

    error: function (response) {
      console.log('GET /tasks fail');
    },
  });
}

function appendTasks(tasks) {
  tasks.forEach(function (task) {
    var $el = $('<div class="task-line"></div>');
    var doneText = "Mark Done";
    if (task.completed == true) {
      $el = $('<div class="done task-line"></div>');
      doneText = "Mark Undone";
    }
    $el.append('<div class="task-entry">' + task.task + '</div>');
    $el.data('taskCompleted', task.completed);
    $el.data('taskId', task.id);
    $el.append('<button class="complete-button">' + doneText + '</button>');
    $el.append('<button class="delete">Delete</button>');


    $('#task-container').last().append($el);
  });
}

function postTask() {
  event.preventDefault();

    var task = {};

    $.each($('#task-entry').serializeArray(), function (i, field) {
      task[field.name] = field.value;
    });
    if (task.task == ""){
      alert("You can't enter a blank task.");
    } else {
    console.log(task);
      $.ajax({
        type: 'POST',
        url: '/tasks',
        data: task,
        success: function () {
          console.log('POST /tasks works!');
          $('#task-container').empty();
          $('#task').val('');
          getTasks();
        },
        error: function (response) {
          console.log('POST /tasks does not work...');
        },
    });
  }
}


function deleteTask () {
  console.log("this:", $(this).parent());
  var taskId = $(this).parent().data('taskId');
  console.log(taskId);
  var run = confirm("Are you sure you want to delete?");
  if (run == true) {
    $.ajax({
      type: 'DELETE',
      url: '/tasks/' + taskId,
      success: function () {
        console.log('DELETE success');
        $('#task-container').empty();
        getTasks();
      },
      error: function () {
        console.log('DELETE failed');
      }
    });
  };
}

function putTask() {

  var taskCompleted = $(this).parent().data('taskCompleted');
  var taskId = $(this).parent().data('taskId');
  console.log(taskId);
  console.log(taskCompleted);

  var task = {};
  if (taskCompleted == false) {
    task.completed = true;
  } else {
    task.completed = false;
  }

  $.ajax({
    type: 'PUT',
    url: '/tasks/' + taskId,
    data: task,
    success: function () {
      console.log('PUT success');
      $('#task-container').empty();
      getTasks();
    },
    error: function() {
      console.log('Error PUT /tasks/' + taskId);
    },
  });
}
