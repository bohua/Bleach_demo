/**
 * Created by Bohua on 14-3-1.
 */
var Q = require('q');

module.exports = function (input) {
	var deferred = Q.defer();
	var start_time = input.start_time;
	var end_time = input.end_time;

	input.db.DailyReport.findAll({
		where: {
			report_date: {
				between: [start_time, end_time]
			}
		},
		attributes: [
			'report_date',
			'daily_sum_inbound_total',
			'daily_sum_outbound_throughput_total'
		],
		order: 'report_date ASC'
	}).complete(function (err, dailyReport) {
			if (err) {
				deferred.reject({
					message: err.message,
					code: 'CHART_DATA_QUERY_FAIL'
				});
			} else {
				//fill in data
				for (var i = 0; i < dailyReport.length; i++) {
					var formattedD = dailyReport[i].report_date.getDate();
					input.chartData.xAxis.categories.push(formattedD + '日');
					input.chartData.series[0].data.push(dailyReport[i].daily_sum_inbound_total);
					input.chartData.series[1].data.push(dailyReport[i].daily_sum_outbound_throughput_total);
				}

				//add series name e.g 2013年5月
				var d0 = new Date(start_time);
				var d = d0.getFullYear() + "年" + (d0.getMonth() + 1) + "月";
				input.chartData.series[0].name += d;
				input.chartData.series[1].name += d;

				//add series desc e.g current, compare
				for (var s in input.chartData.series){
					input.chartData.series[s].data_desc = input.data_desc;
				}
				input.chartData.series[0].data_desc = input.data_desc;

				deferred.resolve(input.chartData);
			}
		});
	return deferred.promise;
};