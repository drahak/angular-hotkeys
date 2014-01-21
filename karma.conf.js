module.exports = function (config) {
	config.set({
		basePath: './',
		frameworks: ['jasmine'],
		files: [
			{pattern: 'bower_components/angular/angular.js', included: true},
			{pattern: 'bower_components/angular-mocks/angular-mocks.js', included: true},
			{pattern: 'angular-hotkeys.js', watched: true, included: true, served: true},
			{pattern: 'HotkeysSpec.js', watched: true, included: true, served: true}
		],
		plugins: [
			'karma-jasmine',
			'karma-chrome-launcher'
		],
		autoWatch: true,
		browsers: ['Chrome']
	});
};