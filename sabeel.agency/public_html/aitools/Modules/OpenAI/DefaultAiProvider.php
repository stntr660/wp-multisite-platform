<?php

namespace Modules\OpenAI;

use App\Facades\AiProviderManager;
use Illuminate\Support\ServiceProvider;

class DefaultAiProvider extends ServiceProvider
{
        
    /**
     * Default providers registered 
     *
     * @return void
     */
    public function register()
    {
        AiProviderManager::add(\Modules\OpenAI\AiProviders\OpenAi\OpenAiProvider::class, 'openai');
    }
    
}