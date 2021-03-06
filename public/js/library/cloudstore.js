(function(window){
	// Dropbox client for later use
	var client;
	var CloudStore;
	__hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

  CloudStore = (function(){
  	var CloudStore;
  	CloudStore = function(options,callback){
	  	// ensure CloudStore was called as a constructor
		if (!(this instanceof CloudStore)) return new CloudStore(options, callback);
		var store = new Lawnchair(options,callback);
		_.extend(this,store);
		this._store = store;
		this._sync_store = Lawnchair(_.extend(options, {name : options.name + "_sync"}),sync_callback);
		// Use the custom save method
		this.save = CloudStore.prototype.save;
		// Use the custom remove method
		this.remove = CloudStore.prototype.remove;
  	};

  	return CloudStore;
  })();



	// var CloudStore = function(options,callback){
	// 	// ensure Lawnchair was called as a constructor
	// 	if (!(this instanceof CloudStore)) return new CloudStore(options, callback);
	
	// 	// Call the parent prototype's (Lawnchair) constructore, to create the Lawnchai object.
	// 	this.parent.constructor.apply(this,arguments);
		
	// 	var defaults = {};

	// 	// Create a corresponding store to keep track of the synced items
	// 	this._sync_store = Lawnchair(_.extend(options, {name : options.name + "_sync"}),sync_callback);
	// 	// Extend the options
	// 	options = _.extend(defaults, options);

	// 	this._options = options;

	// };


	// CloudStore inherits from Lawnchair
	// CloudStore.inheritsFrom(Lawnchair);

	CloudStore.prototype.save = function(obj,callback){
		var user_cb = callback, _this = this;
		this._store.save(obj,function(obj_with_key){
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

	CloudStore.prototype.remove = function(obj,callback){
		var user_cb = callback, _this = this, sync_obj = {};
		
		// Prepare the object , that represents the deleted to be deleted in the sync table
		sync_obj.key = (typeof obj === "string") ? obj : obj.key;
		sync_obj.state = "delete";
		sync_obj.modified_at = new Date().toStorageString();
		// Update the entry in sync table
		_this._sync_store.save(sync_obj);

		this._store.remove(obj,function(obj){
			if(callback){
				callback.call(_this,obj);
			}
		});
	};

	// Sync the local changes to cloud
	CloudStore.prototype.sync_to_cloud = function(callback){
		var _this = this;
		// Check the objects to be synced
		this._sync_store.each(function(sync_record){
		    console.log(sync_record);
		    var cloud_callback = function(error, stat) {
			  if (error) {
			    return showError(error);  // Something went wrong.
			  }
			  console.log(stat);
			};
		    // modified objects
		    _this._store.get(sync_record.key, function(record){
		    	var file_path = _this.name + "/" + sync_record.key + ".txt";
		    	if(sync_record.state === "modify"){
					client.writeFile(file_path, JSON.stringify(record), cloud_callback);
		    	}

		    	if(sync_record.state === "delete"){
		    		client.remove(file_path,cloud_callback);
		    	}

		    });
			// Delete the sync record, after performing the sync
		    _this._sync_store.remove(sync_record);
		});
		if(callback){
			callback();
		}

	};

	// Sync from the cloud database
	CloudStore.prototype.sync_from_cloud = function(callback){
		var last_sync = localStorage.getItem("last_sync"), _this = this;
		// Get the last sync date , if not store epoch date
		last_sync = last_sync ? Date.parseStorageString(last_sync) : new Date(0);
		client.readdir(this.name + "/", function(error, entries,stat_floder,stat_files) {
			if (error) {
				return showError(error);  // Something went wrong.
			}

			var changed_files = _.filter(stat_files,function(stat){
				return (Date.parse(stat.modifiedAt) > last_sync.getTime());
			});

			_.each(changed_files,function(file){
				client.readFile(file.path, function(error, data) {
					if (error) {
						return showError(error);  // Something went wrong.
					}
					// Store the updated contents in database
					var record = JSON.parse(data);
					_this._store.save(record);
					console.log(file.path + "contents are");
					console.log(data);
				});

			});
			
			console.log("Directory entries are\n");
			console.log(stat_files);

			console.log("Changed files are\n");
			console.log(changed_files);
		});
		
		// Store the sync time
		localStorage.setItem("last_sync", new Date().toStorageString());

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
