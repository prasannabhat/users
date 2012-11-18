// modules/flat.js
// Module reference argument, assigned at the bottom
(function(Users) {

	Users.Router = Backbone.Router.extend({

	});

	// Function will be called after document load
    Users.start = function(params) {
        Users.params = params;
        tpl.loadTemplates(['communication', 'comm_flats', 'comm_users', 'user_list'], function() {
            app = new Users.Router();
            Backbone.history.start();
        });
    };	
 

})(application.module("users"));