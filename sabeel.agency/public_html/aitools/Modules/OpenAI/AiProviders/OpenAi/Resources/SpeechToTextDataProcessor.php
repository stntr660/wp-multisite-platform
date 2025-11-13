<?php

namespace Modules\OpenAI\AiProviders\OpenAi\Resources;

use App\Models\Language;

class SpeechToTextDataProcessor
{
    private $data = [];

    /**
     * Class constructor.
     *
     * Initializes the class with the provided AI options.
     *
     * @param array $aiOptions
     */
    public function __construct(array $aiOptions = [])
    {
        $this->data = $aiOptions;
    }

    public function speechToTextOptions(): array
    {
        return [
            [
                'type' => 'checkbox',
                'label' => 'Provider State',
                'name' => 'status',
                'value' => '',
                'visibility' => true
            ],
            [
                'type' => 'text',
                'label' => 'Provider',
                'name' => 'provider',
                'value' => 'OpenAi',
                'visibility' => true
            ],
            [
                'type' => 'dropdown',
                'label' => 'Models',
                'name' => 'model',
                'value' => [
                    'whisper-1',
                ],
                'visibility' => true
            ],
            [
                'type' => 'dropdown',
                'label' => 'Word Filters',
                'name' => 'word_filter',
                'value' => [
                    'Active', 'Inactive'
                ],
                'visibility' => true
            ],
            [
                'type' => 'dropdown',
                'label' => 'Languages',
                'name' => 'language',
                'value' => $this->languages(),
                'visibility' => true
            ],
            [
                'type' => 'dropdown',
                'label' => 'Temperature',
                'name' => 'temperature',
                'value' => [
                    0, 0.2, 0.5, 0.8, 1
                ],
                'default_value' => 0,
                'tooltip' => __('The temperature ranges from 0 to 1. Higher values, such as 0.8, make the output more random, while lower values, like 0.2, produce more focused and deterministic results. If the temperature is set to 0, the model will automatically adjust it using log probability until specific thresholds are reached.'),
                'visibility' => true
            ],
        ];
    }

    /**
     * Retrieves the list of valid languages for speech generation.
     *
     * @return array 
     */
    public function languages(): array
    {
        return Language::where(['status' => 'Active'])->pluck('name')->toArray();
    }

    /**
     * Prepares the options for audio data processing.
     *
     * @return array
     */
    public function audioDataOptions(): array
    {
        return [
            'temperature' => data_get($this->data, 'temperature', 1),
            'model' => data_get($this->data, 'model', 'whisper-1'),
            'file' => $this->prepareFile(),
            'response_format'=> "verbose_json",
            'language' => Language::where('name', $this->data['language'])->value('short_name') ?? 'en' ,
        ];
    }

    /**
     * Prepares a file for upload.
     *
     * @return \CURLFile The prepared `\CURLFile` instance, ready for use in a cURL request.
     *
     * @throws \Exception
     */
    public function prepareFile(): \CURLFile
    {
        $uploadedFile = $this->data['file'];
        $originalFileName = $uploadedFile->getClientOriginalName();
        return new \CURLFile($uploadedFile->getRealPath(), $uploadedFile->getMimeType(), $originalFileName);
    }

}