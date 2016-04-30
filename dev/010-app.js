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
var Promise = require("bluebird");

function promisify(fn, obj) {
	if (typeof fn !== "function") {
		throw new Error("fn argument to promisify() must be function");
	}
	// obj is optional and may be undefined
	// if present, it will be used as context to call fn as in obj.fn()
	return function(/* args */) {
		// make copy of arguments object into a real array in a way that
		// does not prevent interpreter optimizations
		var args = new Array(arguments.length);
		for (var i = 0; i < args.length; i++) {
			args[i] = arguments[i];
		}
		return new Promise(function(resolve, reject) {
			// add our callback function at the end of the args list
			var resultMany;
			args.push(function(err, result) {
				if (err) {
					reject(err);
				} else {
					// if 0 or 1 result, then just return it as a simple value
					if (arguments.length <= 2) {
						resolve(result);
					} else {
						// if more than one result came with the callback function,
						// then put it into an array so we can resolve with a single value (the array of results)
						// skip the first argument which is the err value
						resultMany = new Array(arguments.length - 1);
						for (var i = 0; i < arguments.length - 1; i++) {
							resultMany[i] = arguments[i + 1];
						}
						resolve(resultMany);
					}
				}
			});
			// call original function with our callback as last argument
			fn.apply(obj, args);
		});
	}
}


var Custard = (function Application() {

	return {
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Adding
		//
		// @param  text  [string]   Text to be printed to debugger
		// @param  code  [string]   The urgency as a string: ['report', 'error', 'interaction', 'send', 'receive']
		//
		// @return  [output]  console.log output
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		add: function Adding( functions ) {
			functions.forEach(function iterateArguments( bit ) {
				console.log('iteration');
				//error handling
				if( typeof bit.run !== 'function' ) {
					console.log('Error dude!: ' + typeof bit.run);

					return;
				}

				if( typeof bit.priority !== 'number' ) {
					if( typeof bit.priority !== 'undefined' ) {
						bit.priority = 0;
					}
					else {
						console.log('Error dude!: ' + typeof bit.priority);
						return;
					}
				}

				var myObjAsync = promisify( bit.run );

				myObjAsync().then(function(data) {
					console.log("%j", data);
					console.log('???');
					return data;
				});

				// PW( bit.run ).then(function( data ) {
				// 	console.log('done');
				// }).error(function( err ) {
				// 	console.log('ERROR!');
				// });

				console.log('end!');
			});
		},
	};
}());


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module export
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports = Custard;