<?php 

namespace Modules\OpenAI\Services\v2;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Modules\OpenAI\Entities\Archive;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Exception;
use AiProviderManager;

class FeatureManagerService
{
    /**
     * Retrieves active providers based on the given feature name.
     *
     * @param string $featurName The name of the feature to retrieve active providers for.
     * @return array The array of active provider names.
     */
    public function getActiveProviders(string $featurName): array
    {
        $providers = AiProviderManager::databaseOptions($featurName);
        $providerName = [];

        if (count($providers) != 0) {
            foreach ($providers as $key => $provider) {
                $providerName[] = explode('_', $key , 2)[1];
            }
        }
        return $providerName;
    }

    /**
     * Method to retrieve models based on a given feature name and provider name.
     *
     * @param string $featureName The name of the feature to retrieve models for.
     * @param string $providerName The name of the provider to filter models by.
     * @return array The array of models associated with the specified feature and provider.
     */
    public function getModels(string $featureName, string $providerName): array
    {
        $providers = AiProviderManager::databaseOptions($featureName);
        $models = [];

        if (count($providers) != 0) {
            foreach ($providers as $key => $provider) {
                $name = explode('_', $key , 2)[1];

                if ($name == $providerName) {
                    foreach ($provider as $feature) {
                        if ($feature['name'] == 'model') {
                            $models = $feature['value'];
                        }
                    }
                }
                
            }
        }

        return $models;
        
    }
}
