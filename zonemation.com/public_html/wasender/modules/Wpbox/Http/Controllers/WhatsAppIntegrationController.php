<?php

namespace Modules\Wpbox\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Laravel\Sanctum\PersonalAccessToken;

class WhatsAppIntegrationController extends Controller
{
    public function showStep1()
    {
        $token = PersonalAccessToken::where('tokenable_id',auth()->user()->id)->where('tokenable_type','App\Models\User')->first();
        $planText="";
        $company= $this->getCompany();

        //In case, we are in company 1, and we are in demo mode, don't allow this
        if($company->id==1&&config('settings.is_demo',false)){
            return redirect(route('campaigns.index'))->withStatus(__('This view is not allowed for the Demo company. Please create your account, so you can see the WhatsApp Cloud Setup view.'));
        }

        if(!$token){
            $token=auth()->user()->createToken("Whatstapp");
            $parts = explode('|', $token->plainTextToken);
            $planText = $parts[1]; // Get the first part after the '|'
            $company->setConfig('plain_token',$planText);
        }else{
            //Get old config
            $planText=$company->getConfig('plain_token','');
        }
        return view('wpbox::whatsIntegration.step1',['token'=>$planText,'company'=>$company]);
    }

    public function processStep1(Request $request)
    {
        // Process step 1 data, validate, and store in session or database
        // Redirect to step 2
        return redirect()->route('wpbox::whatsIntegration.step2');
    }

    public function showStep2()
    {
        return view('wpbox::whatsIntegration.step2');
    }

    public function processStep2(Request $request)
    {
        // Process step 2 data, validate, and store in session or database
        // Redirect to step 3
        return redirect()->route('wpbox::whatsIntegration.step3');
    }

    // Repeat for each wizard step

    public function showStep3()
    {
        return view('wpbox::whatsIntegration.step3');
    }

    public function processStep3(Request $request)
    {
        // Process step 3 data, validate, and store in session or database
        // Redirect to step 4
        return redirect()->route('wpbox::whatsIntegration.step4');
    }

    public function showStep4()
    {
        return view('wpbox::whatsIntegration.step4');
    }

    public function processStep4(Request $request)
    {
        // Process step 4 data, validate, and store in session or database
        // Redirect to step 5
        return redirect()->route('wpbox::whatsIntegration.step5');
    }

    public function showStep5()
    {
        return view('wpbox::whatsIntegration.step5');
    }

    public function processStep5(Request $request)
    {
        // Process step 5 data, validate, and store in session or database
        // Redirect to step 6
        return redirect()->route('wpbox::whatsIntegration.step6');
    }

    public function showStep6()
    {
        return view('wpbox::whatsIntegration.step6');
    }

    public function processStep6(Request $request)
    {
        // Process step 6 data, validate, and store in session or database
        // Redirect to completion
        return redirect()->route('wpbox::whatsIntegration.complete');
    }

    public function completeIntegration()
    {
        // Final step: Integrate with WhatsApp API, configure SaaS, display success message
        return view('wpbox::whatsIntegration.success');
    }
}