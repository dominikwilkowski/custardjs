```shell
     ██████╗ ██╗   ██╗ ███████╗ ████████╗  █████╗  ██████╗  ██████╗           ██╗ ███████╗
    ██╔════╝ ██║   ██║ ██╔════╝ ╚══██╔══╝ ██╔══██╗ ██╔══██╗ ██╔══██╗          ██║ ██╔════╝
    ██║      ██║   ██║ ███████╗    ██║    ███████║ ██████╔╝ ██║  ██║          ██║ ███████╗
    ██║      ██║   ██║ ╚════██║    ██║    ██╔══██║ ██╔══██╗ ██║  ██║     ██   ██║ ╚════██║
    ╚██████╗ ╚██████╔╝ ███████║    ██║    ██║  ██║ ██║  ██║ ██████╔╝ ██╗ ╚█████╔╝ ███████║
     ╚═════╝  ╚═════╝  ╚══════╝    ╚═╝    ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═════╝  ╚═╝  ╚════╝  ╚══════╝
```

[![NPM](https://nodei.co/npm/custardjs.png?downloads=true)](https://nodei.co/npm/custardjs/)


> A simple priority system for NodeJS

## Why

You know when you’re in one of those 5PM meetings after a long day of crazy stuff and the HIPPO (highest paid personal opinion) comes up with completely
arbitrary solutions to complete arbitrary problems that will mean you’ll have to stay late and you start to get angry? This is because the stress causes you
to sacrifice higher function like sympathy and social etiquette in order to keep lower functions like logic and speech working.

When running a node application and your boss wants you to add funky little things that add no value but bring your applications performance down you want to
start sacrificing those functions when the demand gets too high in order to keep lower functions alive.

CustardJS simply keeps track of how many requests are running and starts sacrificing sub functions you specify according to a `maxCalls` property set by you.


## Installing

To install simply NPM install it and require it in your project.

```shell
$ npm install custardjs
```

```js
const Custard = require('custardjs');

Custard.run([
	{
		run: function1,
	},{
		run: function2,
		maxCalls: 900,
		fallback: () => {
			console.log(`function2 has been switched off due to high traffic: (${Custard.getRequest})`);
		},
	},{
		run: function3,
		maxCalls: 100,
		fallback: fallbackFunction3,
	}
], allGood);


function function1() {
	//Do magic here you have to do regardless

	Custard.finished(); //make sure you signal to Custard that your task is finished
}

function function2() {
	//Do magic here that is totally not something we NEED but we try to get done
	//Maybe some internal analytics reporting or whatever. Anything you can handle
	//while having 900 requests in the queue.

	Custard.finished(); //make sure you signal to Custard that your task is finished
}

function function3() {
	//Do magic here that is totally icing on the cake and can easily not happen
	//Could be some meta you want to save to disk. On a work load of 100 requests
	//currently running your I/O will probably not allow you anyhow ;)

	Custard.finished(); //make sure you signal to Custard that your task is finished
}

function fallbackFunction3() {
	//This function only runs when there are more requests than 100 pending.
	//So now save your stuff you wanted to save into memory in function3
	//(hoping this isn’t much?)
}

function allGood() {
	//Now that the dust has settled and we can breath again, take those in-memory
	//things we saved in fallbackFunction3 and put them into the file
}
```


## Usage

#### run
Type: `<method>`  
Parameters: `targets <object>` and `done <function> (optional)`

The main method to invoke all parts of your application and assigned priority. `maxCalls` means the method or function will only be run if there are less then
`maxCalls` processes running at the same time that are tracked with Custard. The `fallback` function is optional and is run when we drop runs becasue we
reached `maxCalls` capacity.
There is also an optional `done` function as second parameter. This function runs when we have just gone through a request and completely cleared the queue.  
_(You can declare the done function without calling `run` by assigning your logic right to `Custard.done` if that’s easier)_

```js
Custard.run([
	{
		run: function1,               //run this always
	},{
		run: function2,               //the function in this task
		maxCalls: 900,                //run the function if there are less than 900 processes running
		fallback: fallbackFunction2,  //run this when we start sacrificing this based on your maxCalls
		                              //send panicked email to sys-admin
		                              //automatically scale system, send lease requests to AWS
		                              //scream and ask yourself how it’s gotten this for
		                              //question all life decisions so far
		                              //realize the demand means your stuff is liked
		                              //or at very least used
	},{
		run: function3,               //the function in this task
		maxCalls: 100,                //run the function if there are less than 100 processes running
		fallback: fallbackFunction3,  //run this when we start sacrificing this based on your maxCalls
	}
], () => {                        //run this when we have nothing in the queue anymore
	console.log('Done. No more requests to be processed. Ready for more all fresh and fit!');
});
```

#### finished
Type: `<method>`  
Parameters: `none`

When all your functions completed and your promise is resloved, run this method to make sure all calls are counted correctly.  
_:exclamation: Remember to do that in error handlers as well in case your function faulters and skips the `Custard.finished()` call!_

```js
Custard.finished();
```

#### getQueue
Type: `<method>`  
Parameters: `none`

If you want to know how many calls are in the queue mid-flow, run the `getQueue` method. It returns the number of calls in queue. This includes all tasks you
may have been assigning to `run`.

```js
Custard.getQueue()
```


#### getRequest
Type: `<method>`  
Parameters: `none`

If you want to know how many requests have been fired off to Custard, run the `getRequest` method. This will return the number of times you ran `run`.

```js
Custard.getRequest()
```


## Tests
The build comes with a test server that let’s you test Custard’s functionality. The server is started at [http://localhost:1337](http://localhost:1337).  
_(I know this is pretty … simple but for now it’s enough.)_

To run the current test:

```shell
node test/test-server.js
```

This starts an express app that listens to [http://localhost:1337](http://localhost:1337). When you request that URL in your browser, the app will run three
delayed methods and check if Custard keeps track of them all and recognises when the queue is empty. Stress test this by requesting it several times


## Contributing
Please look at the coding style and work with it, not against it ;)


## Release History
* 1.0.0  -  Added `getRequest` and `getQueue`, Removed `get`, added individual fallbacks to each task
* 0.2.2  -  Fixed critical count bug
* 0.2.1  -  Fixed prod concat bug
* 0.2.0  -  Converted to ES6, bumped node requirement
* 0.1.1  -  Fixed prod folder ignores
* 0.1.0  -  First working example
* 0.0.1  -  initial commit


## License
Copyright (c) 2016 Dominik Wilkowski. Licensed under the [GNU GPL](https://github.com/dominikwilkowski/custardjs/blob/master/LICENSE).