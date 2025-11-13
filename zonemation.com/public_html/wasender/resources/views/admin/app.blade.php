<style>
    .navbar.navbar-vertical.fixed-left.navbar-expand-md.navbar-light.bg-dark::-webkit-scrollbar {
        width: 0px;
        /* For Chrome, Safari, and Opera */
    }

    .nav-item .nav-link.active {
        background-color: #A7D26D !important;
        border-radius: 5px !important;
        margin: 5px !important;
        color: #181A0F !important;
        /* Active text color */
    }

    .nav-item .nav-link {
        color: #969890 !important;
        /* Inactive text color */
    }


    body {
        font-family: "Space Grotesk", sans-serif !important;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    a,
    span,
    div,
    .nav-link {
        font-family: "Space Grotesk", sans-serif !important;
    }






    .card-header {
        background: #F6F9FC !important;
    }



    .card .badge-success {
        color: white !important;
    }


    .card {
        background-color: #212529 !important;

    }

    .nav-icon {
        width: 20px !important;
        /* Adjust size as needed */
        height: auto !important;
        margin: 15px !important;
        /* Adjust spacing as needed */
        filter: invert(56%) sepia(1%) saturate(6952%) hue-rotate(26deg) brightness(109%) contrast(77%) !important;
    }

    #extra-menus {
        margin-left: 0%;
    }

    .collapse a {
        color: white !important;
    }


    .card .card-title {
        color: white !important;
    }

    .card .h2 {
        color: #A7D26D;
    }

    .table-flush {
        color: #95987C !important;
    }

    .navbar-collapse {
        background: #181A0F !important;
    }

    .navbar-collapse a {
        color: white !important;
    }
</style>
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    @yield('title')
    <title>{{ config('app.name', 'Site') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com/">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600..700&display=swap" rel="stylesheet">




    <!-- Icons -->
    <link href="{{ asset('vendor/argon') }}/vendor/nucleo/css/nucleo.css" rel="stylesheet">
    <link type="text/css" href="{{ asset('vendor/argon') }}/css/argon.css?v=1.0.0" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('vendor') }}/jasny/css/jasny-bootstrap.min.css">


    @yield('head')

    @include('layouts.rtl')

    <!-- Custom CSS defined by admin -->
    <link type="text/css" href="{{ asset('byadmin') }}/back.css" rel="stylesheet">

    <!-- Select2  -->
    <link type="text/css" href="{{ asset('vendor') }}/select2/select2.min.css" rel="stylesheet">

    <!-- Custom CSS defined by user -->
    <link type="text/css" href="{{ asset('custom') }}/css/custom.css?id={{ config('version.version')}}" rel="stylesheet">

    <!-- Flags -->
    <link type="text/css" href="{{ asset('vendor') }}/flag-icons/css/flag-icons.min.css" rel="stylesheet" />

    <!-- Bootstap VUE -->
    <link type="text/css" href="{{ asset('vendor') }}/vue/bootstrap-vue.css" rel="stylesheet" />

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">


</head>

<body class="{{ $class ?? '' }}">
    @auth()
    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
        @csrf
    </form>
    @include('admin.navbars.sidebar')
    @endauth

    <div class="main-content">
        @include('admin.navbars.navbar')
        @yield('content')
    </div>

    @guest()

    @endguest

    <!-- Commented because navtabs includes same script -->


    @yield('topjs')

    <script>
        var t = "<?php echo 'translations' . App::getLocale() ?>";
        window.translations = {
            !!Cache::get('translations'.App::getLocale(), "[]") !!
        };
    </script>

    <!-- Navtabs -->
    <script src="{{ asset('vendor') }}/jquery/jquery.min.js" type="text/javascript"></script>
    <script src="{{ asset('vendor/argon') }}/js/popper.min.js" type="text/javascript"></script>


    <script src="{{ asset('vendor/argon') }}/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>

    <!-- Nouslider -->
    <script src="{{ asset('vendor/argon') }}/vendor/nouislider/distribute/nouislider.min.js" type="text/javascript"></script>

    <!-- Latest compiled and minified JavaScript -->
    <script src="{{ asset('vendor') }}/jasny/js/jasny-bootstrap.min.js"></script>


    <!-- All in one -->
    <script src="{{ asset('custom') }}/js/js.js?id={{ config('version.version')}}"></script>

    <!-- Notify JS -->
    <script src="{{ asset('custom') }}/js/notify.min.js"></script>

    <!-- Argon JS -->
    <script src="{{ asset('vendor/argon') }}/js/argon.js?v=1.0.0"></script>



    <script>
        var ONESIGNAL_APP_ID = "{{ config('settings.onesignal_app_id') }}";
        var USER_ID = '{{  auth()->user()&&auth()->user()?auth()->user()->id:"" }}';
        var PUSHER_APP_KEY = "{{ config('broadcasting.connections.pusher.key') }}";

        var PUSHER_APP_CLUSTER = "{{ config('broadcasting.connections.pusher.options.cluster') }}";
    </script>
    @if (auth()->user()!=null&&auth()->user()->hasRole('staff'))
    <script>
        //When staff, use the owner
        USER_ID = '{{ auth()->user()->company->user_id }}';
    </script>
    @endif


    <!-- OneSignal -->
    @if(strlen( config('settings.onesignal_app_id'))>4)
    <script src="{{ asset('vendor') }}/OneSignalSDK/OneSignalSDK.js" async=""></script>
    <script src="{{ asset('custom') }}/js/onesignal.js"></script>
    @endif

    @stack('js')
    @yield('js')



    <!-- Pusher -->
    @if(strlen(config('broadcasting.connections.pusher.app_id'))>2)
    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    @if (config('settings.app_code_name','')=="qrpdf")
    <script src="{{ asset('custom') }}/js/pusher.js"></script>
    @endif
    @endif

    <!-- Import Select2 --->
    <script src="{{ asset('vendor') }}/select2/select2.min.js"></script>

    <!-- Custom JS defined by admin -->
    <script src="{{ asset('byadmin') }}/back.js"></script>

    <!-- Import Moment -->
    <script type="text/javascript" src="{{ asset('vendor') }}/moment/moment.min.js"></script>
    <script type="text/javascript" src="{{ asset('vendor') }}/moment/momenttz.min.js"></script>
    <script src="{{ asset('vendor/argon') }}/js/bootstrap.min.js" type="text/javascript"></script>

    <!-- Import Vue -->
    <script src="{{ asset('vendor') }}/vue/vue.js"></script>
    <script src="{{ asset('vendor') }}/vue/bootstrap-vue.min.js"></script>



    <!-- Import AXIOS --->
    <script src="{{ asset('vendor') }}/axios/axios.min.js"></script>

    <?php
    echo file_get_contents(base_path('public/byadmin/back.js'))
    ?>
</body>

</html>