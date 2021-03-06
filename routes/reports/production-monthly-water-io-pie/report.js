/**
 * Created by Bli on 14-3-5.
 */
var Q = require('q');

module.exports = function (input) {
	var deferred = Q.defer();
	var start_time = input.start_time;
	var end_time = input.end_time;

	input.db.DailyReport.find({
		where: {
			report_date: {
				between: [start_time, end_time]
			}
		},
		attributes: [
			'report_date',
			input.db.sequelize.fn('SUM', input.db.sequelize.col('daily_sum_inbound_total')),
			input.db.sequelize.fn('SUM', input.db.sequelize.col('daily_sum_outbound_throughput_total'))
		]
	}).complete(function (err, dailyReport) {
			if (err) {
				deferred.reject({
					message: err.message,
					code: 'CHART_DATA_QUERY_FAIL'
				});
			} else {
				if (input.data_desc === 'current') {
					input.chartData.series[0].data.push(
						{name: '总进水量', y: dailyReport.selectedValues["SUM(`daily_sum_inbound_total`)"], color:'#C22443'},
						{name: '总供水量', y: dailyReport.selectedValues["SUM(`daily_sum_outbound_throughput_total`)"], color:'#179b82'}
					);
				} else {
					input.chartData.series[0].data.push(
						{name: '对比-进水量', y: dailyReport.selectedValues["SUM(`daily_sum_inbound_total`)"], color:'#9B177B'},
						{name: '对比-供水量', y: dailyReport.selectedValues["SUM(`daily_sum_outbound_throughput_total`)"], color:'#ffa733'}
					);

					input.chartData.legend.y = 0;
				}

				//add series name e.g 2013年5月1日
				var d = dailyReport.report_date;
				//input.chartData.series[0].name = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
				input.chartData.series[0].data_desc = input.data_desc;
				if (input.data_desc === 'current') {
					input.chartData.series[0].size = '80%';
					input.chartData.series[0].innerSize = '50%';
				} else {

					//Set size of compare data
					input.chartData.series[0].size = '50%';
					input.chartData.series[0].dataLabels.formatter = function () {
						return this.point.y;
					};
				}

				deferred.resolve(input.chartData);
			}
		});

	return deferred.promise;
};
