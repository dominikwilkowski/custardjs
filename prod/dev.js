/***************************************************************************************************************************************************************
 *
 * CUSTARD, a simple priority system for NodeJS
 *
 * You know when you’re in one of those 5PM meetings after a long day of crazy stuff and the HIPPO (highest paid personal opinion) comes up with completely
 * arbitrary solutions to complete arbitrary problems that will mean you’ll have to stay late and you start to get angry? This is because the stress causes
 * you to sacrifice higher function like sympathy and social etiquette in order to keep lower functions like logic and speech working.
 *
 * When running a node application and your boss wants you to add funky little things that add no value but bring your applications performance down you want
 * to start sacrificing those functions when the demand gets too high in order to keep lower functions alive.
 *
 * CustardJS simply keeps track of how many requests are running and starts sacrificing sub functions you specify according to a maxCalls property set by you.
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

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRRIVATE
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	let multiplier = 0;


	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		QUEUE: 0,
		DEBUG: true,

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Running a new request with a couple tasks
//
// @param  targets  [object]    The function to be run
// @param  done     [function]  A function to be executed when nothing is in the queue anymore
//
// @return          [string]    ID of the function run
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		run: ( targets, done ) => {
			Custard.QUEUE += targets.length; //count each request

			multiplier = targets.length;

			if( typeof done === 'function' ) {
				Custard.done = done; //assign done function to global scope
			}

			targets.forEach(bit => {
				//error handling for run
				if( typeof bit.run !== 'function' ) {
					Custard.debugging( `The run bit of your sequenze must be a function! It is instead: ${typeof bit.run}`, 'error' );

					return;
				}

				//error handling for maxCalls
				if( typeof bit.maxCalls !== 'number' ) {
					if( typeof bit.maxCalls === 'undefined' ) {
						bit.maxCalls = 0; //set default to 0 (always run)
					}
					else {
						Custard.debugging( `The maxCalls bit of your sequenze must be an integer! It is instead: ${typeof bit.maxCalls}`, 'error' );

						return;
					}
				}

				let maxCalls = bit.maxCalls * targets.length; //normalizing maxCalls

				//error handling for fallback
				if( typeof bit.fallback !== 'function' ) {
					if( typeof bit.fallback === 'undefined' ) {
						bit.fallback = () => {}; //do nothing
					}
				}


				//check the maxCalls
				if( Custard.QUEUE < maxCalls || maxCalls === 0 ) {
					Custard.debugging( `Calling ${bit.run.name} and a QUEUE: ${Custard.QUEUE}`, 'report' );

					bit.run(); //run what needs to be run!
				}
				else {
					Custard.debugging( `STUFF IS BEING SACRIFICED!!!`, 'failsafe' );

					Custard.QUEUE --; //not counting this

					bit.fallback(); //run the fallback instead
				}
			});
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Finishing a queue element
//
// @return  [integer]  Amount of tasks still pending
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		finished: () => {
			Custard.QUEUE --; //remove it from the global queue

			Custard.debugging( `Current queue: ${Custard.QUEUE}`, 'report' );

			if( Custard.QUEUE < 1 ) {
				Custard.done(); //no more stuff in the queue
			}

			return Custard.getQueue(); //we return the number of remaining tasks because you might wanna do something with that…
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Getting how many tasks are in progress
//
// @return  [integer]  Amount of tasks
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		getQueue: () => {
			return Custard.QUEUE; //straight forward
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Getting how many requests are in progress
//
// @return  [integer]  Amount of requests
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		getRequest: () => {
			let queue = Custard.QUEUE;

			if( multiplier > 1 ) { //if there are more than one targets defined
				queue = Math.floor( queue / multiplier );
			}

			return queue;
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Getting how many calls are in progress
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		done: () => {
			Custard.debugging( `I got no other tasks running`, 'finished' );
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Debugging prettiness
//
// @param  text  [string]   Text to be printed to debugger
// @param  code  [string]   The urgency as a string: ['report', 'error', 'finished', 'failsafe']
//
// @return       [ansi]     console.log output
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: ( text, code ) => {

			if( code === 'headline' ) { //this is a fun bit on the top to make our debugging fun
				if( Custard.DEBUG ) {
					var fonts = new CFonts({
						'text': text,
						'colors': ['white', 'gray'],
						'maxLength': 12,
					});
				}
			}

			if( code === 'report' ) {
				if( Custard.DEBUG ) console.log(Chalk.bgWhite("\n" + Chalk.bold.green(' \u2611  ') + Chalk.black(`Custard: ${text} `)));
			}

			else if( code === 'error' ) {
				console.log(Chalk.bgWhite("\n" + Chalk.red(' \u2612  ') + Chalk.black(`Custard: ${text} `)));
			}

			else if( code === 'finished' ) {
				if( Custard.DEBUG ) console.log(Chalk.bgGreen("\n" + Chalk.bold.cyan(' \u219C  ') + Chalk.black(`Custard: ${text} `)));
			}

			else if( code === 'failsafe' ) {
				if( Custard.DEBUG ) console.log(Chalk.bgYellow("\n" + Chalk.bold.cyan(' \u2612  ') + Chalk.black(`Custard: ${text} `)));
			}

		},
	};
})();


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module export
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports = Custard;