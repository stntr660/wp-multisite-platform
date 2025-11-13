<?php

namespace Modules\Anthropic\Resources;

use Str;

class LongArticleDataProcessor
{
    private $token = 1024;
    private $data = [];

    public function __construct(array $aiOptions = [])
    {
        $this->data = $aiOptions;
    }

    public function longarticleOptions(): array
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
                'value' => 'Anthropic',
                'visibility' => true
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
                'label' => 'Tones',
                'name' => 'tone',
                'value' => [
                    'Normal', 'Formal', 'Casual', 'Professional', 'Serious', 'Friendly', 'Playful', 'Authoritative', 'Empathetic', 'Persuasive', 'Optimistic', 'Sarcastic', 'Informative', 'Inspiring', 'Humble', 'Nostalgic', 'Dramatic'
                ],
                'visibility' => true
            ],
            [
                'type' => 'dropdown',
                'label' => 'Languages',
                'name' => 'language',
                'value' => [
                    'English', 'French', 'Arabic', 'Byelorussian', 'Bulgarian', 'Catalan', 'Estonian', 'Dutch'
                ],
                'visibility' => true
            ],
            [
                'type' => 'dropdown',
                'label' => 'Temperature',
                'name' => 'temperature',
                'value' => [
                    0, 0.25, 0.50, 0.75, 1
                ],
                'default_value' => 1,
                'visibility' => true
            ],
            [
                'type' => 'integer',
                'label' => 'Max Tokens',
                'name' => 'max_tokens',
                'value' => 4096,
                'visibility' => true
            ],
        ];
    }

    public function titlePrompt(): string
    {
        return filteringBadWords("Generate " . ($this->data['number_of_title'] == '1' ? 'only one' :  $this->data['number_of_title']) ." seo friendly ". Str::plural('title', $this->data['number_of_title']) ." in " . ($this->data['options']['language'] ?? 'English'). " language based on this topic & keywords in " . ($this->data['options']['tone'] ?? 'Normal') . " tone. Topic: " . $this->data['topic'] . ", Keywords: " . $this->data['keywords'] . ". ". ($this->data['number_of_title'] == '1' ? "The title" : "Each titles") ." must be an array element, give the output as an array. No addtional text before and after array [] brackets.");
    }

    public function titleDataOptions(): array
    {
        return [
            'model' => $this->data['options']['model'] ?? 'claude-3-sonnet-20240229',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $this->titlePrompt()
                ]
            ],
            'temperature' => (float) $this->data['options']['temperature'] ?? 1,
            'max_tokens' => $this->maxToken()
        ];
    }

    public function titleOptions(): array
    {
        return $this->titleDataOptions();
    }

    public function outlinePrompt(): string
    {
        return filteringBadWords("Generate section headings only to write a blog in " . ($this->data['options']['language'] ?? 'English') . " language in " . ($this->data['options']['tone'] ?? 'Normal') . " tone based on this title & keywords, Title: " . $this->data['title'] . ", Keywords: " . $this->data['keywords'] . ". Each section headings must be an array element, giving the output as an array. No additional text before and after array [] brackets. Please not prefix array elements with numbers and enclose array elements in double-quotes.");

    }

    public function outlineDataOptions(): array
    {
        return [
            'model' => $this->data['options']['model'] ?? 'claude-3-sonnet-20240229',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $this->outlinePrompt()
                ]
            ],
            'temperature' => (float) $this->data['options']['temperature'] ?? 1,
            'max_tokens' => $this->maxToken()
        ];
    }

    public function outlineOptions(): array
    {
        return $this->outlineDataOptions();
    }
    
    public function articlePrompt(): string
    {
        return filteringBadWords("This is the title: " . $this->data['title'] . ". These are the keywords: " . $this->data['keywords'] . ". This is the Heading list: " . $this->data['outlines'] . ". Expand each Heading section to generate article in " . ($this->data['options']['language'] ?? 'English') . " language in ". ($this->data['options']['tone'] ?? 'Normal') ." tone. Do not add other Headings or write more than the specific Headings in Heading list. Give the Heading output in bold font.");

    }

    public function articleDataOptions(): array
    {
        return [
            'model' => $this->data['options']['model'] ?? 'claude-3-sonnet-20240229',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $this->articlePrompt()
                ]
            ],
            'temperature' => (float) $this->data['options']['temperature'] ?? 1,
            'max_tokens' => $this->maxToken(),
            'stream' => true
        ];
    }

    public function articleOptions(): array
    {
        return $this->articleDataOptions();
    }

    public function maxToken(): int
    {
        $anthropicSettings = json_decode(preference('longarticle_anthropic'), true);

        foreach ($anthropicSettings as $settings) {
            if ($settings['type'] == 'input' && $settings['name'] == 'max_tokens') {
                return $settings['value'];
            }
        }

        return $this->token;
    }

}