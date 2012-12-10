requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        lib: 'library',
        app: 'app/application',
        modules : 'app/modules',
        jquery: 'library/jquery-1.8.2',
        backbone: 'library/backbone',
        bootstrap : 'library/bootstrap',
        toastr: 'library/toastr',
        underscore: 'library/underscore',
        nimbus : 'http://nimbusbase.com/static/nimbus.min',
        lawnchair : 'library/lawnchair-0.6.1',
        lawnchair_sqllite : 'library/lawnchair-adapter-webkit-sqlite-0.6.1',
        dropbox : 'library/dropbox',
        cloudstore : 'library/cloudstore',
        // sync : 'app/modules/sync'
        sync : 'app/modules/sync-custom'
    },
    shim: {
        'jquery': {
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'jQuery'
        },
        'underscore': {
            exports: '_',
        },
        'backbone' : {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap' : {
            deps: ['jquery'],
        },
        'nimbus' : {
            deps: ['jquery'],
            exports: 'Nimbus'
        },
        'lawnchair' : {
            exports: 'Lawnchair'
        },
        'lawnchair_sqllite' : ['lawnchair'],

        'cloudstore' : {
            deps: ['lawnchair_sqllite','underscore','dropbox'],
            exports: 'CloudStore'
        },
        'toastr': ['jquery'],
        // Main application file...mention all the library dependencies here
        'app' : ['jquery','underscore','backbone','bootstrap','toastr'],
    },   
    waitSeconds: 15
});

// Start the main app logic.
requirejs(['sync', 'modules/users', 'app'],
function   (Sync,Users) {
    $(document).ready(function(){
      Users.start({});
      Sync.initialize();
    });
});