var application = {
 // Create this closure to contain the cached modules
 module: function() {
    // Internal module cache.
    var modules = {};
  
    // Create a new module reference scaffold or load an
    // existing module.
    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      return modules[name] = { };
    };
  }()
};

tpl = {
 
    // Hash of preloaded templates for the app
    templates: {},
 
    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment:
    // All the template files should be concatenated in a single file.
    loadTemplates: function(names, callback) {
 
        var that = this;
 
        var loadTemplate = function(index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('tpl/' + name + '.html', function(data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }
 
        loadTemplate(0);
    },
 
    // Get template by name from hash of preloaded templates
    get: function(name) {
        return this.templates[name];
    }
};

Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

$(document).ready(function(){
  Users = application.module("users");
  Users.start({});
  Sync = application.module("sync");
  Sync.initialize();
});


jQuery.fn.serializeObject = function(options) {
  var defaults = {include_disabled : false};
  var opts = $.extend(defaults, options);
  var arrayData, objectData,disabled;
  if(opts.include_disabled){
  	  // Find disabled inputs, and remove the "disabled" attribute
  	  disabled = this.find(':input:disabled').removeAttr('disabled');
  }
  arrayData = this.serializeArray();
  if(opts.include_disabled){
	// re-disabled the set of inputs that you previously enabled
	disabled.attr('disabled','disabled');
  }
  objectData = {};

  $.each(arrayData, function() {
    var value;

    if (this.value != null) {
      value = this.value;
    } else {
      value = '';
    }

    if (objectData[this.name] != null) {
      if (!objectData[this.name].push) {
        objectData[this.name] = [objectData[this.name]];
      }

      objectData[this.name].push(value);
    } else {
      objectData[this.name] = value;
    }
  });

  return objectData;
};