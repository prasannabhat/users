// modules/flat.js
// Module reference argument, assigned at the bottom
(function(Users) {

	// Models
	Users.User = Backbone.Model.extend({
        // urlRoot : function(){ return Settings.params.base_url + "/gateway";},
        defaults: {
            "name": "",
            "email" : "",
            "phone": "",
            "description": ""
        }		
	});

	// Views
	Users.EditUserView = Backbone.View.extend({
		id 		: "edit_user",
		className: "modal hide fade",

		events : {
            "click .action" : "save",
            "hidden" : function(){
                this.close();
            }			
		},
		
		initialize: function() {
            this.template = _.template(tpl.get('user_form'));
        },

        beforeClose : function(){

        },

        save : function(){
        	alert("save");
        },

        render: function(errors) {
            // Default options, unless specified.
            errors || (errors = {});
            $(this.el).html(this.template({
                user : this.model.toJSON(),
                errors : errors
            }));
            return this;
        }        
	});

	Users.Router = Backbone.Router.extend({
		initialize: function() {
        },
  		
  		routes: {
            "new": "showNewUser",
        },

        showNewUser : function(){
            var user = new Users.User();
            var view = new Users.EditUserView({
            	model : user
            }).render();
            view.$el.modal('toggle');
        }

	});

	// Function will be called after document load
    Users.start = function(params) {
        Users.params = params;
        tpl.loadTemplates(['user_form'], function() {
            app = new Users.Router();
            Backbone.history.start();
        });
    };	
 

})(application.module("users"));