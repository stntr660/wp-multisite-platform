<div class="card shadow max-height-vh-70 overflow-auto overflow-x-hidden">
    <div class="card-header shadow-lg">
        <b>{{ __('Facebook Login for Business Configuration & WhatsApp Cloud API Setup') }}</b>
    </div>
    <div class="card-body overflow-auto overflow-x-hidden scrollable-div" ref="scrollableDiv" >
      @if ($company->getConfig('whatsapp_webhook_verified','no')=='yes')
        <div class="alert alert-success fade show" role="alert">
          {{__('Congratulation. Webhook is succesfullly verified.')}}
        </div>
      @endif
    <p>
        Upon clicking "Login with Facebook", you will gain access to the functionality of sending messages to your contacts through WhatsApp. This feature allows you to easily connect with your audience and communicate effectively.
    </p>
    <p>
        To get started, make sure you have a Facebook account and grant the necessary permissions. Once logged in, you can utilize the power of Facebook's API to seamlessly integrate WhatsApp messaging into your business workflow.
    </p>
    <button onclick="launchWhatsAppSignup(event)" style="background-color: #1877f2; border: 0; border-radius: 4px; color: #fff; cursor: pointer; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; height: 40px; padding: 0 24px;">
        Login with Facebook
    </button>
    </div>
</div>

<script>
    window.fbAsyncInit = function() {
        FB.init({
            appId: '708340567877119',
            autoLogAppEvents: true,
            xfbml: true,
            cookie: true,
            version: 'v18.0'
        });
    };
</script>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
<script>
    // Facebook Login with JavaScript SDK
    function launchWhatsAppSignup() {
        event.preventDefault();
        // Launch Facebook login
        console.log('Initiating Facebook login...');
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Facebook login successful. Retrieving authorization code...');
                const code = response.authResponse.code;
                console.log('Authorization code retrieved:', code);
                
                // Transmit the code to your backend for server-to-server call
                console.log('Transmitting authorization code to backend...');

                fetch("https://zonemation.com/performAccessTokenExchange", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: code })
                })
                .then("fetching")
                .then(response => {
                    if (response.ok) {
                        console.log('Backend response received. Status:', response.json(), response.status);
                        // Redirect or perform any other action upon successful response
                    } else {
                        console.error('Error:', response.json(), response.status);
                        // Handle error response from the backend
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {
            config_id: '1105374287329862', // Replace with your actual Config ID
            response_type: 'code',
            override_default_response_type: true,
            extras: {
                setup: {
                    // Prefilled data can go here
                }
            }
        });
    }
</script>
