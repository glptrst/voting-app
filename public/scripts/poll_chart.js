let chartLabels = [ 'test 0', 'test 1', 'test 2'];
let chartData = [ 1 , 2 , 3];

// TODO: user real data
// let elements = this.document.getElementsByClassName('chartData');

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
