<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ env('APP_NAME', 'Artifism') }} | {{ __('Chat') }} </title>
		<link rel="shortcut icon" href="{{ $favicon }}" type="image/x-icon">
        {{-- Laravel Mix - CSS File --}}
        <link rel="stylesheet" href="{{ asset('Modules/Chat/Resources/assets/css/app.css') }}">
    </head>
    <body>
        <div id="root"></div>
    </body>
    {{-- Laravel Mix - JS File --}}
    <script>
        var accessToken = `{!! $access_token !!}`;
        var rootUrl = '{{ $base_url }}';
        var favIcon = '{{ $favicon }}';
        var routePath = '{{ $route_path }}';
        var routeHost = '{{ $route_host }}';
        var isLocal = '{{ $is_local }}';
        var logout = '{{ route('users.logout') }}';
        var userId = '{{ auth()->user()->id ?? 1 }}'
        var lang = '{{ $lang }}'
    </script>
    <script src="{{ asset('Modules/Chat/Resources/assets/js/app.js') }}"></script>
</html>
