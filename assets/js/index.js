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

  //show the dropdown menu on mobile resolution
  if (window.innerWidth <= 600) {
    $('#profile-image').click(function (e) {
      $('.mobile-nav').toggleClass('hidden');
    });
  }

  //show input calendar to change date on dashboard
  $('#calendar-icon').click(function (e) {
    $('#calendar-icon').css('display', 'none');
    $('#change-date-dash').css('display', 'block');
  });

  $('#credit-radio').click(function () {
    $('#tag-select').attr('disabled', true);
    $('#btn-form-ei').html('Add Income');
    $('#head-form-ei').html('Add an Income');
    $('#input-form-ei').attr('placeholder', 'Income from?');
  });

  $('#debit-radio').click(function () {
    $('#tag-select').attr('disabled', false);
    $('#btn-form-ei').html('Add Expense');
    $('#head-form-ei').html('Add an Expense');
    $('#input-form-ei').attr('placeholder', 'Spent on?');
  });
}
