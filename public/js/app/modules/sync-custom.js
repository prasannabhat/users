define(["nimbus","cloudstore","app"], function(Nimbus) {
    var Sync = {};
    Sync.initialize = function(){
        CloudStore.Auth.setup("Dropbox", "by3ft00k08bpp7p", "10qi5nbciwafgjr", "pras_synctest");

        // create a new store
        // var store = new Lawnchair({adaptor:'dom', table:'people',name:'people'}},function(r){
        var store = CloudStore({name:'people',adaptor:'webkit-sqlite'},function(r){
            console.log("Store created");
        });
        this.store = store;
    };

    Sync.backup_users = function(collection,options){
        var store = this.store;
        // First destroy all
        store.nuke();
        collection.forEach(function(user, index, list){
            var dummy = {};
            store.save({ 
                "name" : user.get('name'),
                "email" : user.get('email'),
                "phone" : user.get('phone'),
                "description" : user.get('description'),
            });
        });

    };

    Sync.restore_users = function(options){
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
