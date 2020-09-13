// disable gridlines on charts
Chart.defaults.scale.gridLines.display = false;

const chart_colors = {
    suseptible: {
      fill: 'rgb(102, 255, 102, .3)',
      stroke: '#5eb84d'
    },
    infected: {
      fill: 'rgb(255, 102, 102, .3)',
      stroke: 'firebrick'
    },
    removed: {
      fill: 'rgb(192, 192, 192, .3)',
      stroke: 'black',
    }
};

// line-chart canvas
var ctx_charts = document.getElementById('myChart').getContext('2d');
// population object
var pop = new Population();
// array that holds line chart x axis labels
var labels = [];

function updateChartData(suseptible, infected, removed, frame, chart) {
  if (chart.data.datasets[0].data.length > 500) {
      chart.data.datasets[0].data.shift();
      chart.data.datasets[1].data.shift();
      chart.data.datasets[2].data.shift();
      chart.data.labels.shift();
  }
  chart.data.datasets[0].data.push(suseptible);
  chart.data.datasets[1].data.push(infected);
  chart.data.datasets[2].data.push(removed);
  chart.data.labels.push(frame);
  chart.update();
}

var chartData = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{ 
        label: "suseptible",
        fill: true,
        backgroundColor: chart_colors.suseptible.fill,
        pointBackgroundColor: chart_colors.suseptible.stroke,
        borderColor: chart_colors.suseptible.stroke,
        pointHighlightStroke: chart_colors.suseptible.stroke,
        borderCapStyle: 'butt',
        borderWidth: 1,
        pointRadius: 0,
        data: []
      },
      {
        label: "infected",
        fill: true,
        backgroundColor: chart_colors.infected.fill,
        pointBackgroundColor: chart_colors.infected.stroke,
        borderColor: chart_colors.infected.stroke,
        pointHighlightStroke: chart_colors.infected.stroke,
        borderCapStyle: 'butt',
        borderWidth: 1,
        pointRadius: 0,
        data: []
      },
      {
        label: "removed",
        fill: true,
        backgroundColor: chart_colors.removed.fill,
        pointBackgroundColor: chart_colors.removed.stroke,
        borderColor: chart_colors.removed.stroke,
        pointHighlightStroke: chart_colors.removed.stroke,
        borderCapStyle: 'butt',
        borderWidth: 1,
        pointRadius: 0,
        data: []
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Current State of Pandemic'
    },
    responsive: false,
    scales: {
      yAxes: [{
          ticks: {
              stacked: true
          }
      }]
  },
  legend: {
      display: true
  }
  }
}

var myChart = new Chart(ctx_charts, chartData);

setInterval(function(){
  if (pop.people.length > 0) {
      updateChartData(pop.currSus, pop.currInf, pop.currRem, "", myChart);
  }
}, 200);