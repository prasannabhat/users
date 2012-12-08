<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Laravel Backbone example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    {{ Asset::styles() }}
  <!--     {{ Asset::scripts() }} -->
    <!-- data-main attribute tells require.js to load
             scripts/main.js after require.js loads. -->
    
    <script data-main="js/main" src="js/require.js"></script>
    @yield('header-include')

    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
      .sidebar-nav {
        padding: 9px 0;
      }
    </style>
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container-fluid">
           <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <span class="brand">User example</span>
          <div class="nav-collapse collapse">
            <p class="navbar-text pull-right">
              Logged in as Guest
            </p>
            <ul class="nav" id="app-top-nav">
                <li>{{HTML::link('users', 'Users');}}</li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span2">
             @yield('nav-sidebar')
        </div><!--/span-->
        <div class="span10">
            @yield('content')
        </div><!--/span-->
      </div><!--/row-->

      <hr>

      <footer>
        <p class="navbar-fixed-bottom">&copy; Prasanna 2012</p>
      </footer>

    </div><!--/.fluid-container-->
  </body>
</html>
