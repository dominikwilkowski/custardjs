```shell
     ██████╗  █████╗  ███████╗ ████████╗  █████╗  ██████╗  ██████╗           ██╗ ███████╗
    ██╔════╝ ██╔══██╗ ██╔════╝ ╚══██╔══╝ ██╔══██╗ ██╔══██╗ ██╔══██╗          ██║ ██╔════╝
    ██║      ███████║ ███████╗    ██║    ███████║ ██████╔╝ ██║  ██║          ██║ ███████╗
    ██║      ██╔══██║ ╚════██║    ██║    ██╔══██║ ██╔══██╗ ██║  ██║     ██   ██║ ╚════██║
    ╚██████╗ ██║  ██║ ███████║    ██║    ██║  ██║ ██║  ██║ ██████╔╝ ██╗ ╚█████╔╝ ███████║
     ╚═════╝ ╚═╝  ╚═╝ ╚══════╝    ╚═╝    ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═════╝  ╚═╝  ╚════╝  ╚══════╝
```

[![NPM](https://nodei.co/npm/custardjs.png?downloads=true)](https://nodei.co/npm/custardjs/)


> A simple priority system for NodeJS

## Why

When running a node application and your boss wants you to add funcky little things that add no value but bring your applications performance down you want to
start sacrificing those functions when the demand gets too high.
CustradJS simply keeps track of how many requests are running and starts sacrificing sub functions you specify according to a `maxCalls` property you can set.


## Installing

To install simply NPM install it and require it in your project.

```shell
$ npm install custardjs
```

```js
var Custard = require('../prod/dev.js');

Custard.run([
	{
		'run': function1,
	},{
		'run': function2,
		'maxCalls': 100,
	},{
		'run': function3,
		'maxCalls': 900,
	}
]);
```


## Usage

#### run
Type: `<method>`
Parameters: `targets <object>` and `failsafe <function> (optional)`

The main method to invoke all parts of your application and assigned priority. `maxCalls` means the method or function will only be run if there are less then
`maxCalls` processes running at the same time.
The failsafe function is optional and is run when we drop runs becasue we reached `maxCalls` capacity.

```js
Custard.run([
	{
		'run': function1, //run this always
	},{
		'run': function2,
		'maxCalls': 100, //only run this if there are less than 100 processes currently running
	},{
		'run': function3,
		'maxCalls': 900, //only run this if there are less than 900 processes currently running
	}
], function() { //run this when we start sacrificing some of our functionality
	console.log('Stuff we can do to report when things start to crack down!');

	//send email to sys-admin
	//automatically scale system
	//panik and run against a wall
});
```

#### finished
Type: `<method>`
Parameters: `none`

When all your functions completed and your promise is resloved, run this method to make sure all calls are counted correctly.

```js
Custard.finished();
```

#### get
Type: `<method>`
Parameters: `none`

If you want to know how many calls are in the queue mid-flow, run the `get` method. It returns the number of calls in queue.

```js
Custard.get()
```


## Contributing
Please look at the coding style and work with it, not against it ;)


## Release History
* 0.1.0  -  First working example
* 0.0.1  -  initial commit


## License
Copyright (c) 2016 Dominik Wilkowski. Licensed under the [GNU GPL](https://github.com/dominikwilkowski/custardjs/blob/master/LICENSE).