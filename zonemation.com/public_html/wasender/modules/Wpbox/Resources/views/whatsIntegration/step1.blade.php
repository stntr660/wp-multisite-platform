@extends('layouts.app', ['title' => 'Step 1'])
@section('content')
<div class="header pb-8 pt-2 pt-md-7">
    <div class="container-fluid">
        <div class="header-body">
            <h1 class="mb-3 mt--3">💬 Step 1: Create Developer Account and Facebook App</h1>
            <div class="row align-items-center pt-2">
                <p class="lead">Let's get started by creating your developer account and setting up a new Facebook app.</p>
            </div>
        </div>
    </div>
</div>
<div class="container-fluid mt--8">  
<div class="card shadow max-height-vh-70 overflow-auto overflow-x-hidden">
    <div class="card-header shadow-lg">
        <b>{{ __('Step 1: Create developer account and a new Facebook app') }}</b>
    </div>
    <div class="card-body overflow-auto overflow-x-hidden scrollable-div" ref="scrollableDiv">
        @if ($company->getConfig('whatsapp_webhook_verified','no')=='yes')
            <div class="alert alert-success fade show" role="alert">
                {{__('Congratulations. Webhook is successfully verified.')}}
            </div>
        @endif

        <p>
            1. {{__('Click the button below to grant authorization for your Facebook app.')}} 
            <button onclick="launchWhatsAppSignup()" style="background-color: #1877f2; border: 0; border-radius: 4px; color: #fff; cursor: pointer; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; height: 40px; padding: 0 24px;">Login with Facebook</button>

            <br />
            2. {{ __('Once authorized, your Facebook app will be automatically configured for WhatsApp integration.')}}
            
        </p>
    </div>
</div>

</div>
@endsection

@section('js')
<script>
  window.fbAsyncInit = function () {
    // JavaScript SDK configuration and setup
    FB.init({
      appId:    '253333847812934', // Meta App ID
      cookie:   true, // enable cookies
      xfbml:    true, // parse social plugins on this page
      version:  'v18.0' //Graph API version
    });
  };

  window.fbAsyncInit = function () {
    // JavaScript SDK configuration and setup
    FB.init({
      appId:    '253333847812934', // Facebook App ID
      cookie:   true, // enable cookies
      xfbml:    true, // parse social plugins on this page
      version:  'v18.0' //Graph API version
    });
  };

  // Load the JavaScript SDK asynchronously
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Facebook Login with JavaScript SDK
  function launchWhatsAppSignup() {
    // Conversion tracking code
    //fbq && fbq('trackCustom', 'WhatsAppOnboardingStart', {appId: '253333847812934', feature: 'whatsapp_embedded_signup'});
    
    // Launch Facebook login
    FB.login(function (response) {
      if (response.authResponse) {
        const code = response.authResponse.code;
        // The returned code must be transmitted to your backend, 
  // which will perform a server-to-server call from there to our servers for an access token
        console.log('User granted authorization and received code: ' + code);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      config_id: '3701612363499108', // configuration ID goes here
      response_type: 'code',    // must be set to 'code' for System User access token
      override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types
      extras: {
        setup: {
        }
      }
    });
  }
</script>
@endsection