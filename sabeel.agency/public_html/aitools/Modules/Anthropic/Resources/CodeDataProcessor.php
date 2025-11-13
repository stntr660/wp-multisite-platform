<?php

namespace Modules\Anthropic\Resources;


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
                    'claude-3-opus-20240229',
                    'claude-3-sonnet-20240229',
                    'claude-3-haiku-20240307',
                    'claude-2.1',
                    'claude-2.0',
                    'claude-instant-1.2'
                ],
                'visibility' => true
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
     * Generates a code generation prompt based on stored data.
     *
     * This method constructs a code generation prompt based on the stored data
     * within the class. It combines the prompt with the specified programming
     * language and code level, if available, or uses default values if not provided.
     *
     * @return string A string representing the code generation prompt.
     */
    public function articlePrompt(): string
    {
        return  "Generate code about". $this->data['prompt'] .
        "In " . data_get($this->data, 'language', config('openAI.codeLanguage'))
        ."and the code level is " . data_get($this->data, 'codeLevel', config('openAI.codeLevel'));
    }

    /**
     * Generates a code prompt for the OpenAI model.
     *
     * @return array The generated code prompt.
     */
    public function codePrompt(): array
    {
       return [
            'model' => data_get($this->data, 'model', 'claude-3-sonnet-20240229'),
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $this->articlePrompt()
                ]
            ],
            'temperature' => (int) data_get($this->data, 'model', 1),
            'max_tokens' => $this->maxToken()
            ,
        ];
    }

    /**
     * Retrieves the maximum token setting for code generation.
     *
     * This method retrieves the maximum token setting for code generation from
     * the preference settings. If a specific setting is found, it returns the
     * value of the 'max_tokens' input type. If no such setting is found, it falls
     * back to the default value specified in the module configuration.
     *
     * @return int The maximum token value for code generation.
     */
    public function maxToken(): int
    {
        $anthropicSettings = json_decode(preference('code_anthropic'), true);

        foreach ($anthropicSettings as $settings) {
            if ($settings['type'] == 'input' && $settings['name'] == 'max_tokens') {
                return $settings['value'];
            }
        }

        return $this->token;
    }

    /**
     * Generates a code prompt for the OpenAI model.
     *
     * @return array The generated code prompt.
     */
    public function code(): array
    {
       return $this->codePrompt();
    }

}
