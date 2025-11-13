<?php

namespace Modules\OpenAI\AiProviders\OpenAi\Traits;

trait OpenAiApiTrait
{
    private $audioUrl = 'https://api.openai.com/v1/audio/transcriptions';
    public function aiKey()
    {
    return apiKey('openai');
    }

    public function client()
    {
        return \OpenAI::client($this->aiKey());
    }

    public function chat()
    {
        return $this->client()->chat()->create($this->processedData);
    }

    public function chatStream()
    {
        return $this->client()->chat()->createStreamed($this->processedData);
    }

    public function generate($headers, $url) 
    {
        $curl = curl_init();

        // Set cURL options
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => config('openAI.ssl_verify_host'),
            CURLOPT_SSL_VERIFYPEER => config('openAI.ssl_verify_peer'),
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $this->processedData,
            CURLOPT_HTTPHEADER => array_merge($headers, [
                "Authorization: Bearer " . $this->aiKey(),
            ]),
        ));
        
        // Make API request
        $response = curl_exec($curl);
        $err = curl_error($curl);
        // Close cURL session
        curl_close($curl);

        $response = !empty($response) ? $response : $err;

        return json_decode($response, true);
    }

    public function audio()
    {
        $headers = [
            'Content-Type: multipart/form-data',
        ];

        return $this->generate($headers, $this->audioUrl);
    }
}