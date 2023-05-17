'use strict';
{
  //To show and hide the input form div for adding expenses
  $('#add-expense-btn').click(function () {
    $('.add-expense-div').removeClass('hidden');
    $('#add-expense-btn').addClass('hidden');
  });

  $('#close-form-div').click(function (e) {
    $('.add-expense-div').addClass('hidden');
    $('#add-expense-btn').removeClass('hidden');
  });
}
