<?php

namespace Modules\OpenAI\AiProviders\OpenAi\Resources;


class CodeDataProcessor
{
    /**
     * @var int $token which is used as default.
     *
     * This property holds an integer value used as a token identifier within the class.
     * It is initialized to 1024 by default.
     */
    private $token = 1024;

      /**
     * Prompt
     *
     * @var string
     */
    protected $prompt;

    /**
     * Description: Private property to store data.
     *
     * This property is used to store data within the class. It is intended
     * to be accessed only within the class itself and not from outside.
     *
     * @var array $data An array to store data.
     */
    private $data = [];

    public function __construct(array $aiOptions = [])
    {
        $this->data = $aiOptions;
    }

    /**
     * Returns an array of code options for the provider.
     *
     * @return array An array of code options with the following structure:
     * - type: string - The type of the option (e.g. "checkbox", "dropdown").
     * - label: string - The label of the option.
     * - name: string - The name of the option.
     * - value: mixed - The value of the option. For "dropdown" options, this is an array of values.
     */
    public function codeOptions(): array
    {
        return [
            [
                'type' => 'checkbox',
                'label' => 'Provider State',
                'name' => 'status',
                'value' => ''
            ],
            [
                'type' => 'dropdown',
                'label' => 'Language',
                'name' => 'language',
                'value' => [
                    'PHP',
                    'Java',
                    'Rubby',
                    'Python',
                    'C#',
                    'Go',
                    'Kotlin',
                    'HTML',
                    'Javascript',
                    'TypeScript',
                    'SQL',
                    'NoSQL'
                ]
            ],
            [
                'type' => 'dropdown',
                'label' => 'Models',
                'name' => 'model',
                'value' => [
                    'gpt-4',
                    'gpt-3.5-turbo',
                    'gpt-4o',
                    'gpt-4o-mini'
                ]
            ],
            [
                'type' => 'dropdown',
                'label' => 'Code Level',
                'name' => 'code_level',
                'value' => [
                    'Noob',
                    'Moderate',
                    'High'
                ]
            ],
            [
                'type' => 'integer',
                'label' => 'Max Tokens',
                'name' => 'max_tokens',
                'value' => 4096,
                'visibility' => true
            ]
        ];
    }

    /**
     * Generates a code prompt for the OpenAI model.
     *
     * @return array|string The generated code prompt.
     */
    public function codePrompt(): array|string
    {
        return $this->prompt = ([
            'model' => data_get($this->data, 'model', 'gpt-4o'),
            'messages' => [
                [
                    "role" => "system",
                    "content" => "You are a great helpful assistant that writes code."
                ],
                [
                    "role" => "user",
                    "content" => "Generate code about". $this->data['prompt'] .
                    "In " . data_get($this->data, 'language', config('openAI.codeLanguage'))
                    ."and the code level is " . data_get($this->data, 'codeLevel', config('openAI.codeLevel')),
                ],
            ],
            'temperature' => 1,
            'max_tokens' => (int) $this->maxToken(),
        ]);

    }

    /**
     * Generates a code prompt for the OpenAI model.
     *
     * @return array|string The generated code prompt.
     */
    public function code(): array|string
    {
       return $this->codePrompt();
    }

    public function maxToken(): int
    {
        $anthropicSettings = json_decode(preference('code_openai'), true);

        foreach ($anthropicSettings as $settings) {
            if ($settings['type'] == 'input' && $settings['name'] == 'max_tokens') {
                return $settings['value'];
            }
        }

        return $this->token;
    }

}
