<?php

namespace Modules\OpenAI\Http\Controllers\Admin;

use App\Facades\AiProviderManager;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Models\Preference;
use Session;

class ProviderManageController extends Controller
{
    public function providers(Request $request, $segment = null)
    {
        $data['features'] = AiProviderManager::features();
        $data['featureName'] = $segment === null ? $data['features'][0]['key'] : $segment;
        $data['providers'] = AiProviderManager::featureSupportedProviders($data['featureName']);

        return view('openai::admin.manage-providers.index', $data);
    }

    public function manageProvider(Request $request)
    {
        $urlSegements = $request->segments();

        $providerName = str_replace(['_', '-'], '' , $urlSegements[count($urlSegements) - 1 ]);
        $featureName = str_replace(['_', '-'], '' , $urlSegements[count($urlSegements) - 2 ]);

        $data = ['status' => 'error', 'message' => __('The :x options for :y could not be updated. Please try again.', ['x' => $featureName, 'y' => $providerName])];

        $data['featureOptions'] = ($providerInstance = AiProviderManager::find($providerName))
            &&
            method_exists(
                $providerInstance,
                $featureMethod = $featureName . 'Options'
            )
            ? $providerInstance->$featureMethod()
            : [];

        // Update feature options with the request values
        if ($request->isMethod('POST')) {

            if (config('openAI.is_demo')) {
                return redirect()->back()->withErrors(__("Demo Mode! This action can't be perform."));
            }

            $temp = [];
            foreach ($data['featureOptions'] as $fields) {
                if ($request[$fields['name']]) {

                    $fields['value'] = is_array($fields['value']) ? array_intersect($fields['value'], $request[$fields['name']]) : $request[$fields['name']];
                    
                } else {
                    $fields['value'] = is_array($fields['value']) ? [] : '';
                }
                $temp[] = $fields;
            }
            $preference = [
                'category' => $featureName,
                'field' => $featureName .'_'. $providerName,
                'value' => json_encode($temp)
            ];

            if (Preference::storeOrUpdate($preference)) {
                $data = ['status' => 'success', 'message' => __('The :x options for :y has been successfully updated.', ['x' => $featureName, 'y' => $providerName])];
            }

            Session::flash($data['status'], $data['message']);
            return back();
        }

        // Feature menu list
        $data['features'] = AiProviderManager::features(); 
        
        $data['featureName'] = $featureName;
        $data['providerName'] = $providerName;

        // Saved options
        $data['fields'] = json_decode(preference($featureName . '_' . $providerName), true) ?? [];

        return view('openai::admin.manage-providers.feature_options', $data);
    }
}
