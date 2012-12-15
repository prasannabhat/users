define(["nimbus","cloudstore","app"], function(Nimbus) {
    var Sync = {};
    Sync.initialize = function(){
        CloudStore.Auth.setup("Dropbox", "by3ft00k08bpp7p", "10qi5nbciwafgjr", "pras_synctest");
        CloudStore.Auth.authorize();

        // create a new store
        // var store = new Lawnchair({adaptor:'dom', table:'people',name:'people'}},function(r){
        var store = CloudStore({name:'people',adaptor:'webkit-sqlite'},function(r){
            console.log("Store created");
        });
        this.store = store;
    };

    Sync.backup_users_dropbox = function(collection,options){
        var store = this.store;
        this.store.sync_to_cloud(function(){
            if(options.callback){
                var data = {};
                data.status = "success";
                data.result = "successfully synced to dropbox";
                options.callback(data);
            }
        });        
    };

    Sync.restore_users_dropbox = function(options){
        var store = this.store;
        options = options || {};
        store.all(function(r){
            console.log(r);
            if(options.callback){
                options.callback(r);
            }
        });
    };

    Sync.backup_users_local = function(collection,options){
        var store = this.store;
        // First destroy all
        store.nuke(function(){
            collection.forEach(function(user, index, list){
                var dummy = {};
                store.save({ 
                    "key" : user.get('id').toString(),
                    "name" : user.get('name'),
                    "email" : user.get('email'),
                    "phone" : user.get('phone'),
                    "description" : user.get('description'),
                });
            });
            var data = {};
            data.status = "success";
            data.result = "Data stored to local database";
        });
    };

    Sync.restore_users_local = function(options){
        var store = this.store;
        options = options || {};
        store.all(function(r){
            console.log(r);
            if(options.callback){
                options.callback(r);
            }
        });
    };    

    return Sync;

});
