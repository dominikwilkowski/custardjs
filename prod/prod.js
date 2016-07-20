/***************************************************************************************************************************************************************
 *
 * Testing server
 *
 **************************************************************************************************************************************************************/

'use strict';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const CFonts = require('cfonts');
const Chalk = require('chalk');
const Fs = require('fs');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Constructor factory
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Custard = (() => {

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		QUEUE: 0,
		DEBUG: false,

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Running a new request
//
// @param  targets   [function]   The function to be run
// @param  failsafe  [function]   A function to be executed when bits start to be sacrificed
//
// @return           [string]     ID of the function run
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		run: ( targets, failsafe ) => {
			Custard.QUEUE ++;

			targets.forEach(function iterateArguments( bit ) {
				//error handling
				if( typeof bit.run !== 'function' ) {
					Custard.debugging( 'The run bit of your sequenze must be a function! It is instead: ' + typeof bit.run, 'error' );

					return;
				}

				if( typeof bit.maxCalls !== 'number' ) {
					if( typeof bit.maxCalls === 'undefined' ) {
						bit.maxCalls = 0; //set default to 0 (always run)
					}
					else {
						Custard.debugging( 'The maxCalls bit of your sequenze must be an integer! It is instead: ' + typeof bit.maxCalls, 'error' );

						return;
					}
				}

				//check the maxCalls
				if( Custard.QUEUE < bit.maxCalls || bit.maxCalls === 0 ) {
					Custard.debugging( 'Calling ' + bit.run.name + ' and a QUEUE: ' + Custard.QUEUE, 'report' );

					bit.run(); //run what needs to be run!
				}
				else {
					Custard.debugging( 'STUFF IS BEING SACRIFICED!!!', 'failsafe' );

					if( typeof failsafe === 'function' ) {
						failsafe(); //run failsafe if specified
					}
				}
			});
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Finishing a queue element
//
// @return  [integer]  Amount of calls still pending
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		finished: () => {
			Custard.QUEUE --;

			Custard.debugging('Current queue: ' + Custard.QUEUE);

			if( Custard.QUEUE < 1 ) {
				Custard.debugging( 'I got no other tasks running', 'finished' );
			}

			return Custard.get();
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Getting how many calls are in progress
//
// @return  [integer]  Amount of calls
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		get: () => {
			return Custard.QUEUE;
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Debugging prettiness
//
// @param  text  [string]   Text to be printed to debugger
// @param  code  [string]   The urgency as a string: ['report', 'error', 'interaction', 'send', 'receive']
//
// @return       [ansi]     console.log output
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: ( text, code ) => {

			if( code === 'headline' ) {
				if( Custard.DEBUG ) {
					var fonts = new CFonts({
						'text': text,
						'colors': ['white', 'gray'],
						'maxLength': 12,
					});
				}
			}

			if( code === 'report' ) {
				if( Custard.DEBUG ) console.log(Chalk.bgWhite("\n" + Chalk.bold.green(' \u2611  ') + Chalk.black( 'Custard: ' + text + ' ')));
			}

			else if( code === 'error' ) {
				console.log(Chalk.bgWhite("\n" + Chalk.red(' \u2612  ') + Chalk.black( 'Custard: ' + text + ' ')));
			}

			else if( code === 'finished' ) {
				if( Custard.DEBUG ) console.log(Chalk.bgGreen("\n" + Chalk.bold.cyan(' \u219C  ') + Chalk.black( 'Custard: ' + text + ' ')));
			}

			else if( code === 'failsafe' ) {
				if( Custard.DEBUG ) console.log(Chalk.bgYellow("\n" + Chalk.bold.cyan(' \u2612  ') + Chalk.black( 'Custard: ' + text + ' ')));
			}

		},
	};
})();


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module export
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports = Custard;