// modules/flat.js
// Module reference argument, assigned at the bottom
(function(Users, Sync) {

	// Models
	Users.User = Backbone.Model.extend({
        // urlRoot : function(){ return location.href;},
        urlRoot : "./users",
        defaults: {
            "name": "",
            "email" : "",
            "phone": "",
            "description": ""
        }		
	});
    
    Users.Users = Backbone.Collection.extend({
        url : "./users",
        model : Users.User,
        destroy : function(options){
            options = options || {};
            $.ajax({
                url: this.url,
                type: 'DELETE',
                success: function(data, textStatus, jqXHR) {
                    if(options.callback){
                        options.callback(data);
                    }
                }
            });

        },
    });

	// Views
	Users.EditUserView = Backbone.View.extend({
		id 		: "edit_user",
		className: "modal hide fade",

		events : {
            "click .action" : "save",
            "hidden" : function(){
                this.trigger("hidden");
                this.close();
            }			
		},
		
		initialize: function() {
            this.template = _.template(tpl.get('user_form'));
            this.action = (this.model.id) ? "update" : "create";
        },

        beforeClose : function(){

        },

        save : function(){
        	form_json = this.$el.find("form").first().serializeObject({
                include_disabled: true
            });
            this.model.set(form_json);
            this.model.save({},{success : _.bind(this.success,this), error : _.bind(this.error,this)});
        },

        error : function(model, xhr, options){
            var response = JSON.parse(xhr.responseText);
            this.render(response.messages);

        },

        success : function(model, response, options){
            this.model.trigger(this.action);
            this.$el.modal('hide');
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

    Users.UserListView = Backbone.View.extend({
        initialize: function() {
            this.template = _.template(tpl.get('users'));
            this.collection.on("reset add",this.render,this);
        },

        beforeClose : function(){

        },
        
        render: function() {
            $(this.el).html(this.template());
            $tbody = this.$el.find("tbody").first();
            _.each(this.collection.models, function (item) {
                $tbody.append(new Users.UserView({model:item}).render().el);
            }, this);
            return this;
        }         

    });

    Users.UserView = Backbone.View.extend({
        tagName: "tr",

        events : {
            "click button" : "action_handler",
        },        

        initialize: function() {
            this.template = _.template(tpl.get('user'));
            this.model.on("update",this.render,this);
            this.model.on("destroy",function(){
                this.close();
            },this);
        },

        beforeClose : function(){

        },

        action_handler : function(e){
            var action = $(e.target).data("action");
            if(action == "delete"){
                if(confirm('Are you sure?')){
                    this.model.destroy({wait: true});
                }
            }
            if(action == "edit"){
                var view = new Users.EditUserView({
                    model : this.model
                }).render();
                view.$el.modal('toggle');
            }            
        },
        
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }         

    });

    Users.SyncView = Backbone.View.extend({
        tagName : "div",
        className : "btn-group",

        events : {
            "click button" : "action_handler",
        },         
        
        initialize : function(){

        },

        render : function(){
            this.$el.html("<button class='btn' data-action='backup'>Backup to Dropbox</button>" + 
                "<button class='btn' data-action='restore'>Restore From Dropbox</button>");
            return this;
        },

        action_handler : function(e){
            var action = $(e.target).data("action"),
                collection = Users.user_collection;
            if(action == "backup")
            {
                Sync.backup_users(Users.user_collection.models,{
                    callback : function(data){
                        if(data.status == "success"){
                            toastr.success(data.result);
                        }
                        if(data.status == "error"){
                            toastr.error(data.result);                            
                        }
                    }
                });
                // Sync.backup_users(Users.Users);
            }
            if(action == "restore")
            {
                // Destroy all the users in the server
                collection.destroy({callback : function(){
                    // Remove all the models from the collection
                    while (model = collection.models.pop()) {
                    }
                    Sync.restore_users({callback : function(users){
                        _.each(users,function(element, index, list){
                            collection.create(element,{silent : true});
                        });
                        collection.trigger("reset");
                        toastr.success("Restored data from dropbox");
                    }});

                }});
                // Users.user_collection.models.forEach(function(user, index, list){

                // });
                // Sync.backup_users(Users.user_collection.models);
                // Sync.backup_users(Users.Users);
            }            
        },

    }); 

	Users.Router = Backbone.Router.extend({
		initialize: function() {
            var collection;
            this.$container = $("#users_content");
            collection = Users.user_collection = new Users.Users();
            collection.fetch();
        },
  		
  		routes: {
             "":"list",
            "new": "showNewUser",
        },

        list : function(){
            var listView = new Users.UserListView({collection : Users.user_collection}).render();
            var syncview = new Users.SyncView().render();
            this.$container.append(listView.$el);
            this.$container.append(syncview.$el);
        },

        showNewUser : function(){
            var user = new Users.User();
            var view = new Users.EditUserView({
            	model : user
            }).render();
            view.$el.modal('toggle');
            view.on("hidden",function(){
                // Remove the #new hash from the URL..ugly way of doing it
                this.navigate("");
            },this);
            user.on("create",function(){
                Users.user_collection.add(user);
            });
        }

	});

	// Function will be called after document load
    Users.start = function(params) {
        Users.params = params;
        tpl.loadTemplates(['user_form','users','user'], function() {
            app = new Users.Router();
            Backbone.history.start();
        });

    };	
 

})(application.module("users"), application.module("sync"));