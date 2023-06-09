'use strict';

{
  //Method for submit the form data for new entry using AJAX
  let createEntry = function () {
    let newEntryForm = $('#new-entry-form');
    newEntryForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: 'post',
        url: '/create',
        data: newEntryForm.serialize(),
        success: function (data) {
          let newEntry = newEntryDOM(data.data.newEntry);
          $('#entry-container>ul').prepend(newEntry);
          $('#tt-para').text(data.data.totalExpense);
          newEntryForm[0].reset();
          new Noty({
            theme: 'relax',
            text: `${data.data.newEntry.name} is logged!`,
            type: 'success',
            layout: 'topRight',
            timeout: 5000,
          }).show();
          deleteEntry($(' .delete-entry', newEntry));
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  //Method to create a new Entry in the DOM
  let newEntryDOM = function (entry) {
    return `
    <li class="single-expense">
                        <div class="single-expense-left">
                          <div class="single-name-tag">
                            <p>
                              ${entry.name}
                            </p>
                            <p class="se-tag">
                              ${entry.tag}
                            </p>
                          </div>
                          <p class="se-notes">
                            ${entry.notes}
                          </p>
                        </div>
                        <div class="single-cost-del">
                            ${
                              entry.type == 'debit'
                                ? `<p>
                            <i class="fa-solid fa-indian-rupee-sign"></i>
                            ${entry.amount}
                              <span style="color: #cf354c; font-size: 1.5rem;" }>Dt</span>
                          </p>`
                                : `<p>
                          <i class="fa-solid fa-indian-rupee-sign"></i>
                          ${entry.amount}
                            <span style="color: green; font-size: 1.5rem;" }>Cr</span>
                        </p>`
                            }
                                <a href="/delete/${
                                  entry._id
                                }"><i class="fa-solid fa-trash"></i></a>
                        </div>
                      </li>
    `;
  };

  //Method to delete entry
  let deleteEntry = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          $(`#se-${data.data.id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  createEntry();
}
