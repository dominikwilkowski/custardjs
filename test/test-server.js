/***************************************************************************************************************************************************************
 *
 * Testing server
 *
 **************************************************************************************************************************************************************/

'use strict';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
var Fs = require('fs');
var Http = require('http');
var Chalk = require('chalk');
var Express = require('express');
var BodyParser = require('body-parser');


var App = (function Application() {

	return {
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Settings
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		DEBUG: true, //debugging infos

		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Initiate app
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		init: function Init() {
			var tester = Express();

			//starting server
			tester
				.use( BodyParser.urlencoded({ extended: false }) )
				.listen(1337, function PortListener() {
					App.debugging( 'Server started on port 1337', 'report' );
				});


			tester.get('*', function GetListener(request, response) {
				App.debugging( 'Request received!', 'receive' );

				App.random.run();
				App.random.run();
				App.random.run();
				App.random.run();
			});

		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Debugging prettiness
		//
		// @param  text  [string]   Text to be printed to debugger
		// @param  code  [string]   The urgency as a string: ['report', 'error', 'interaction', 'send', 'receive']
		//
		// @return  [output]  console.log output
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: function Debugging( text, code ) {

			if( code === 'headline' ) {
				if( App.DEBUG ) {
					var fonts = new CFonts({
						'text': text,
						'colors': ['white', 'gray'],
						'maxLength': 12,
					});
				}
			}

			if( code === 'report' ) {
				if( App.DEBUG ) console.log(Chalk.bgWhite("\n" + Chalk.bold.green(' \u2611  ') + Chalk.black(text + ' ')));
			}

			else if( code === 'error' ) {
				if( App.DEBUG ) console.log(Chalk.bgWhite("\n" + Chalk.red(' \u2612  ') + Chalk.black(text + ' ')));
			}

			else if( code === 'interaction' ) {
				if( App.DEBUG ) console.log(Chalk.bgWhite("\n" + Chalk.blue(' \u261C  ') + Chalk.black(text + ' ')));
			}

			else if( code === 'send' ) {
				if( App.DEBUG ) console.log(Chalk.bgWhite("\n" + Chalk.bold.cyan(' \u219D  ') + Chalk.black(text + ' ')));
			}

			else if( code === 'receive' ) {
				if( App.DEBUG ) console.log(Chalk.bgWhite("\n" + Chalk.bold.cyan(' \u219C  ') + Chalk.black(text + ' ')));
			}

			else if( code === 'finished' ) {
				if( App.DEBUG ) console.log(Chalk.bgGreen("\n" + Chalk.bold.cyan(' \u219C  ') + Chalk.black(text + ' ')));
			}

		},
	}

}());


//run tester
App.init();


/***************************************************************************************************************************************************************
 *
 * Random app lagger
 *
 **************************************************************************************************************************************************************/

(function randomApp(App) {

	var module = {};
	var randInstance = 0; //global counter
	var inProgress = 0;

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Count requests and execute App.random.done()
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.run = function randomRun() {
		randInstance ++;
		inProgress ++;

		App.debugging( 'random: Run random: ' + randInstance + ' with proccesses running: ' + inProgress, 'report' );

		App.random.done( randInstance );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Generate random timout(1-10sec) to report this is done
	//
	// @param   instance  [integer]  ID of module
	//
	// @return            [console]  Print done message and instance
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.done = function randomDone( instance ) {
		var timeout = Math.random() * (10000 - 100) + 100;

		setTimeout(function() {
			inProgress --;
			App.debugging( 'random: Run random: Finished: ' + instance, 'send' );

			if(inProgress === 0) {
				App.debugging( 'random: Run random: Finished: No more processes', 'finished' );
			}
		}, timeout);
	};


	App.random = module;


}(App));