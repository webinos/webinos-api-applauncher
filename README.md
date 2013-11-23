# webinos App launcher API #

**Service Type**: http://webinos.org/api/applauncher

App launcher API provides methods to determine if a webinos application is installed and launch them. 

## Installation ##

To install the app launcher API you will need to install the node module inside the webinos pzp.

For end users, you can simply open a command prompt in the root of your webinos-pzp and do: 

	npm install https://github.com/webinos/webinos-api-applauncher.git

For developers that want to tweak the API, you should fork this repository and clone your fork inside the node_module of your pzp.

	cd node_modules
	git clone https://github.com/<your GitHub account>/webinos-api-applauncher.git
	cd webinos-api-applauncher
	npm install

## Getting a reference to the service ##

To discover the service you will have to search for the "http://webinos.org/api/applauncher" type. Example:

	var serviceType = "http://webinos.org/api/applauncher";
	webinos.discovery.findServices( new ServiceType(serviceType), 
		{ 
			onFound: serviceFoundFn, 
			onError: handleErrorFn
		}
	);
	function serviceFoundFn(service){
		// Do something with the service
	};
	function handleErrorFn(error){
		// Notify user
		console.log(error.message);
	}

Alternatively you can use the webinos dashboard to allow the user choose the app launcher API to use. Example:
 	
	webinos.dashboard.open({
         module:'explorer',
	     data:{
         	service:[
            	'http://webinos.org/api/applauncher'
         	],
            select:"devices"
         }
     }).onAction(function successFn(data){
		  if (data.result.length > 0){
			// User selected some contact APIs
		  }
	 });

## Methods ##

Once you have a reference to an instance of a service you can use the following methods:

### launchApplication (successCB, errorCB, appURI)

Launches an application.

- successCB: Success callback.
- errorCb: Error callback.
- appURI: Application ID to be launched.

### appInstalled (successCB, errorCB, appURI)

Reports if an application is installed.


## Links ##

- [Specifications](http://dev.webinos.org/specifications/api/launcher.html)
- [Examples](https://github.com/webinos/webinos-api-applauncher/wiki/Examples)

