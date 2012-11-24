(function(Sync) {

    Sync.initialize = function(){
        // Set up the application with dropbox
        Nimbus.Auth.setup("Dropbox", "ituwhb56uw9hsl1", "8o8o9s7trn5bqtb", "users");
        Sync.UserModel = Nimbus.Model.setup("UserModel", [ "name","email","phone","description"]);

    };

    Sync.backup_users = function(collection){
        var User = Sync.UserModel;
        if(!Nimbus.Auth.authorized())
        {
            Nimbus.Auth.authorize();
        }
        if(Nimbus.Auth.authorized())
        {
            // First destroy all the models
            User.destroyAll();
            collection.forEach(function(user, index, list){
                User.create({ 
                    "name" : user.get('name'),
                    "email" : user.get('email'),
                    "phone" : user.get('phone'),
                    "description" : user.get('description'),
                });
            });
        }
    };

    Sync.restore_users = function(options){
        options = options || {};
        var User = Sync.UserModel;
        User.sync_all(function(){
            var users = new Array();
            User.each(function(element){
                users.push({
                    "name" : element.name, 
                    "phone" : element.phone, 
                    "email" : element.email, 
                    "description" : element.description
                });
            });
            if(options.callback){
                options.callback(users);
            }
        });

    };

})(application.module("sync"));