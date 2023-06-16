let chartData = {};

// console.log($('#stats-month-form').serializeArray());

const showStats = async () => {
  try {
    await $.ajax({
      type: 'get',
      url: '/api/stats',
      success: function (data) {
        data.data.map((item) => {
          if (item.amount > 0 && item.name !== 'income') {
            chartData[item.name] = item.amount;
          }
        });
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: 'Total',
            data: Object.values(chartData),
          },
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
};

showStats();
