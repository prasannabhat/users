define(["nimbus","lawnchair_sqllite","app"], function(Nimbus) {
    var Sync = {};
    Sync.initialize = function(){
        // create a new store
        // var store = new Lawnchair({adaptor:'dom', table:'people',name:'people'}},function(r){
        var store = Lawnchair({name:'people',adaptor:'webkit-sqlite'},function(r){
            console.log("Store created");
        });
        this.store = store;
    };

    Sync.backup_users = function(collection,options){
        var store = this.store;
        // First destroy all
        store.nuke();
        collection.forEach(function(user, index, list){
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
