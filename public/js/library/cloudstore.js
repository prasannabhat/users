(function(window){
	// Dropbox client for later use
	var client;
	var showError = function(error) {
	  if (window.console) {  // Skip the "if" in node.js code.
	    console.error(error);
	  }

	  switch (error.status) {
	  case 401:
	    // If you're using dropbox.js, the only cause behind this error is that
	    // the user token expired.
	    // Get the user through the authentication flow again.
	    break;

	  case 404:
	    // The file or folder you tried to access is not in the user's Dropbox.
	    // Handling this error is specific to your application.
	    break;

	  case 507:
	    // The user is over their Dropbox quota.
	    // Tell them their Dropbox is full. Refreshing the page won't help.
	    break;

	  case 503:
	    // Too many API requests. Tell the user to try again later.
	    // Long-term, optimize your code to use fewer API calls.
	    break;

	  case 400:  // Bad input parameter
	  case 403:  // Bad OAuth request.
	  case 405:  // Request method not expected
	  default:
	    // Caused by a bug in dropbox.js, in your application, or in Dropbox.
	    // Tell the user an error occurred, ask them to refresh the page.
	  }
	};

	var sync_callback = function(r){
		console.log("Sync callback called");
		console.log(r);
	};

	var CloudStore = function(options,callback){
		// ensure Lawnchair was called as a constructor
		if (!(this instanceof CloudStore)) return new CloudStore(options, callback);
		var defaults = {};
		// Create corresponding lawnchair object, store the original lawnchair object
		this._lawnchair = Lawnchair(options,callback);
		_.extend(this,this._lawnchair);
		delete this.save;
		// Create a corresponding store to keep track of the synced items
		this._sync_store = Lawnchair(_.extend(options, {name : options.name + "_sync"}),sync_callback);
		// Extend the options
		options = _.extend(defaults, options);

		this._options = options;

	};

	CloudStore.prototype.save = function(obj,callback){
		var user_cb = callback, _this = this;
		this._lawnchair.save(obj,function(obj_with_key){
			var sync_obj = {};
			sync_obj.key = obj_with_key.key;
			sync_obj.state = "modify";
			sync_obj.modified_at = new Date().toStorageString();
			_this._sync_store.save(sync_obj);
			if(callback){
				callback.call(_this,obj_with_key);
			}
		});


	};

	var Auth = {};
	Auth.setup = function(sync_service, key, secret, app_name){
		var options = {
			sync_service : sync_service,
			key : key,
			secret : secret,
			app_name : app_name
		};
		this.options = options;
		client = new Dropbox.Client({
		    key: key, secret: secret, sandbox: true
		});
		client.authDriver(new Dropbox.Drivers.Redirect({
			rememberUser: true
		}));
		this.authorize();
	};

	Auth.authorize = function(){
		var storage = window.localStorage;
		storage.setItem('state','working');
		client.authenticate(function(error, auth_client) {
		  if (error) {
		    // Replace with a call to your own error-handling code.
		    //
		    // Don't forget to return from the callback, so you don't execute the code
		    // that assumes everything went well.
		    return showError(error);
		  }

		  // Replace with a call to your own application code.
		  //
		  // The user authorized your app, and everything went well.
		  // auth_client is a Dropbox.Client instance that you can use to make API calls.
		  client = auth_client;
			client.getUserInfo(function(error, userInfo) {
			  if (error) {
			    return showError(error);  // Something went wrong.
			  }

			  alert("Hello, " + userInfo.name + "!");
			});		  
		});		

	};

	Auth.authorized = function(){
		// var storage = window.localStorage;
		// return (storage.getItem('state') === 'working');
		return false;
	};

	CloudStore.Auth = Auth;

	window.CloudStore = CloudStore;

})(window);
