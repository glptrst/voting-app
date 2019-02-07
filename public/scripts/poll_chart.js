let chartLabels = [];
let chartData = [];

let labelsElements = this.document.getElementsByClassName('chartLabels');
for (let i = 0; i < labelsElements.length; i++) {
    chartLabels.push(labelsElements[i].innerText);
}
let dataElements = this.document.getElementsByClassName('chartData');
for (let i = 0; i < dataElements.length; i++) {
    chartData.push(dataElements[i].innerText);
}
console.log(chartLabels);
console.log(chartData);

let elements = this.document.getElementsByClassName('chartData');

var ctx = this.document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'pie',
    data: {
	labels: chartLabels,
	datasets: [{
	    data: chartData,
	    backgroundColor: [
		'red',
		'blue',
		'orange',
		'black',
		'yellow',
		'green',
		'white',
		'grey',
		'magenta'
	    ]
	}],
	options: {
	    responsive: true
	}
    }
});
