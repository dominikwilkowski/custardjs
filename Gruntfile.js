'use strict';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//
//                                     ██████╗  █████╗  ███████╗ ████████╗  █████╗  ██████╗  ██████╗           ██╗ ███████╗
//                                    ██╔════╝ ██╔══██╗ ██╔════╝ ╚══██╔══╝ ██╔══██╗ ██╔══██╗ ██╔══██╗          ██║ ██╔════╝
//                                    ██║      ███████║ ███████╗    ██║    ███████║ ██████╔╝ ██║  ██║          ██║ ███████╗
//                                    ██║      ██╔══██║ ╚════██║    ██║    ██╔══██║ ██╔══██╗ ██║  ██║     ██   ██║ ╚════██║
//                                    ╚██████╗ ██║  ██║ ███████║    ██║    ██║  ██║ ██║  ██║ ██████╔╝ ██╗ ╚█████╔╝ ███████║
//                                     ╚═════╝ ╚═╝  ╚═╝ ╚══════╝    ╚═╝    ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═════╝  ╚═╝  ╚════╝  ╚══════╝
//                                                                                  Created by Dominik Wilkowski
// @desc     Custard.JS, a priority system for NodeJS
// @author   Dominik Wilkowski
// @website  https://github.com/dominikwilkowski/custardjs
// @issues   https://github.com/dominikwilkowski/custardjs/issues
// @license  https://raw.githubusercontent.com/dominikwilkowski/custardjs/master/LICENSE
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// External dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Custom functions
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
var SETTINGS = function() {
	return {
		'folder': {
			'dev': 'dev',
			'prod': 'prod',
			'Packagejson': 'package.json',
		},
	};
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Grunt module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports = function(grunt) {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Dependencies
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-wakeup');
	grunt.loadNpmTasks('grunt-font');
	require('time-grunt')(grunt);


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Grunt tasks
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	grunt.initConfig({


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Package content
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		SETTINGS: SETTINGS(),
		pkg: grunt.file.readJSON( SETTINGS().folder.Packagejson ),


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Replace version
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		replace: {
			debugDev: {
				src: [
					'<%= SETTINGS.folder.prod %>/dev.js',
				],
				overwrite: true,
				replacements: [
					{
						from: '[Debug]',
						to: 'true',
					},
					{
						from: '[Name-Version]',
						to: '<%= pkg.name %> - v<%= pkg.version %>',
					},
					{
						from: '[Version]',
						to: 'v<%= pkg.version %>',
					},
				],
			},

			debugProd: {
				src: [
					'<%= SETTINGS.folder.prod %>/prod.js',
				],
				overwrite: true,
				replacements: [
					{
						from: '[Debug]',
						to: 'false',
					},
					{
						from: '[Name-Version]',
						to: '<%= pkg.name %> - v<%= pkg.version %>',
					},
					{
						from: '[Version]',
						to: 'v<%= pkg.version %>',
					},
				],
			},
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// uglify files
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		uglify: {
			options: {
				report: 'gzip',
			},
			prod: {
				files: {
					'<%= SETTINGS.folder.prod %>/prod.js': ['<%= SETTINGS.folder.prod %>/prod.js'],
				},
			},
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Concat files
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		concat: {
			dev: {
				files: {
					'<%= SETTINGS.folder.prod %>/dev.js': ['<%= SETTINGS.folder.dev %>/*.js'],
				},
			},

			prod: {
				files: {
					'<%= SETTINGS.folder.prod %>/prod.js': ['<%= SETTINGS.folder.prod %>/*.js'],
				},
			},
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Banners
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		font: {
			options: {
				space: false,
				maxLength: 11,
				colors: ['yellow', 'gray'],
			},

			title: {
				text: '| custard.js',
			},
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Wakeup
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		wakeup: {
			wakeme: {
				options: {
					randomize: true,
					notifications: true,
				},
			},
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Watch
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		watch: {
			node: {
				files: [
					'<%= SETTINGS.folder.dev %>/*.js',
				],
				tasks: [
					'_buildNode',
					'wakeup',
				],
			},
		},

	});



	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Private tasks
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	grunt.registerTask('_buildNode', [
		'concat',
		'replace',
	]);


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Build tasks
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	grunt.registerTask('default', [ //run build with watch
		'font:title',
		'_buildNode',
		'wakeup',
		'watch',
	]);

	grunt.registerTask('prod', [ //run build and generate prod.js with watch
		'font:title',
		'_buildNode',
		'uglify',
		'wakeup',
		'watch',
	]);

};