<?php

namespace Modules\Wpbox\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class Chatbot extends Model
{
    protected $table = 'chatbots';
    protected $fillable = [
        'name',
        'description',
        'url',
        'documentation_url',
        'configuration',
        'active',
    ];
    
    public function sendMessageToTiledesk($message)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->configuration,
        ])->post($this->url, [
            'message' => $message,
        ]);

        return $response->successful();
    }

    public function sendMessageToFlowiseAI($message)
    {
        $response = Http::withHeaders([
            'pageId' => $this->configuration,
        ])->post($this->url, [
            'question' => $message,
        ]);

        return $text = $response['text'] ?? null;
    }
}