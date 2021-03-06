/**
 * Created by bli on 14-2-28.
 */
var Q = require('q');
var extend = require('extend');

var db = require(__dirname + '/../../models'),
	schemaReader = require(__dirname + '/../platform').readJsonSchema;

module.exports = function (req, res) {
	var requstedReport = require(__dirname + '/' + req.query.reportId + '/report.js');
	var schemJsonFile = __dirname + '/' + req.query.reportId + '/schema.json';

	var schema = schemaReader(schemJsonFile, function (chartData, err) {
		if (err) {
			res.statusCode = "400";
			res.end({
				message: err.message,
				code: 'CHART_SCHEMA_LOAD_FAIL'
			});
		} else {
			var promises = [];

			var series = JSON.parse(req.query.series)

			for (var arg in series) {
				var input = {
					data_desc: series[arg].data_desc,
					start_time: series[arg].start_time,
					end_time: series[arg].end_time,
					db: db,
					chartData: extend(true, {}, chartData)
				}

				if(series[arg].show_max !== undefined){
					input.show_max = series[arg].show_max;
				}
				if(series[arg].show_min !== undefined){
					input.show_min = series[arg].show_min;
				}
				if(series[arg].throughput_type !== undefined){
					input.throughput_type = series[arg].throughput_type;
				}
				if(series[arg].medicine_type !== undefined){
					input.medicine_type = series[arg].medicine_type;
				}

				promises.push(requstedReport(input));
			}

			Q.allSettled(promises)
				.then(function (results) {
					var response;

					for (var i in results) {
						if (results[i].state === "fulfilled") {
							if (!response) {
								response = results[i].value;
							}else{
								var tmpS = [];

								if (results[i].value.series[0].data_desc === "current") {
									tmpS = results[i].value.series.concat(response.series);
								}else{
									tmpS = response.series.concat(results[i].value.series);
								}

								response.series = tmpS;
							}
						}
					}

					res.contentType('json');
					res.json(response);
				});
		}
	});
}