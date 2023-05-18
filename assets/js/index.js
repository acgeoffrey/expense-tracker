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
}
