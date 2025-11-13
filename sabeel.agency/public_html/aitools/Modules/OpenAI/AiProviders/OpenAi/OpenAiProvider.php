<?php

namespace Modules\OpenAI\AiProviders\OpenAi;

use Modules\OpenAI\AiProviders\OpenAi\Resources\LongArticleDataProcessor;
use Modules\OpenAI\AiProviders\OpenAi\Traits\OpenAiApiTrait;
use Modules\OpenAI\AiProviders\OpenAi\Responses\LongArticle\{
    OutlineResponse,
    TitleResponse
};
use Modules\OpenAI\Contracts\Resources\LongArticleContract;
use Modules\OpenAI\Contracts\Responses\LongArticle\{
    OutlineResponseContract,
    TitleResponseContract
};
use App\Lib\AiProvider;
use Modules\OpenAI\Contracts\Resources\CodeContract;
use Modules\OpenAI\AiProviders\OpenAi\Resources\TemplateDataProcessor;
use Modules\OpenAI\Contracts\Resources\TemplateContentContract;
use Modules\OpenAI\Contracts\Responses\Code\CodeResponseContract;
use Modules\OpenAI\AiProviders\OpenAi\Responses\Code\CodeResponse;
use Modules\OpenAI\AiProviders\OpenAi\Resources\CodeDataProcessor;

use Modules\OpenAI\Contracts\Resources\SpeechToTextContract;
use Modules\OpenAI\AiProviders\OpenAi\Resources\SpeechToTextDataProcessor;
use Modules\OpenAI\AiProviders\OpenAi\Responses\SpeechToText\SpeechToTextResponse;

class OpenAiProvider extends AiProvider implements LongArticleContract, TemplateContentContract, CodeContract, SpeechToTextContract
{
    use OpenAiApiTrait;

    /**
     * Holds the processed data after it has been manipulated or transformed.
     * This property is typically used within the context of a class to store
     * data that has been modified or processed in some way.
     *
     * @var array Contains an array of data resulting from processing operations.
     */
    protected $processedData;

    public function description(): array
    {
        return [
            'title' => 'Open AI',
            'description' => __('OpenAI pioneers AI breakthroughs in chat, image, voice, and text processing. With cutting-edge models, we excel in natural language understanding, image recognition, and voice synthesis, shaping the future of AI.'),
            'image' => 'Modules/OpenAI/Resources/assets/image/openai.png',
        ];
    }

    public function longArticleOptions(): array
    {
        return (new LongArticleDataProcessor)->longarticleOptions();
    }

    /**
     * Generates titles using AI options.
     *
     * @param array $aiOptions Options for AI processing.
     * @return TitleResponseContract Response containing generated titles.
     */
    public function titles(array $aiOptions): TitleResponseContract
    {
        $this->processedData = (new LongArticleDataProcessor($aiOptions))->titleOptions();
        return new TitleResponse($this->chat());
    }

    /**
     * Generates outlines using AI options.
     *
     * @param array $aiOptions Options for AI processing.
     * @return OutlineResponseContract Response containing generated titles.
     */
    public function outlines(array $aiOptions): OutlineResponseContract
    {
        $this->processedData = (new LongArticleDataProcessor($aiOptions))->outlineOptions();
        return new OutlineResponse($this->chat());

    }

    public function fakeTitles(array $aiOptions): TitleResponseContract
    {
        $fakeResponse = json_decode('{"response":{"id":"chatcmpl-8s7P19sosJlDWvy5hsWGszO8TNFkR","object":"chat.completion","created":1707908859,"model":"gpt-4-0613","choices":[{"index":0,"message":{"role":"assistant","content":"[\n\"Unleashing AI Superpowers: Exploring the Future of AI Technology\",\n\"Unlocking the Potential: AI Integration Services for the Future of AI\",\n\"Intelligent Automation and Machine Learning on Demand: Powering the Future of AI\",\n\"The Future of AI: OpenAI Envisions On-Demand AI Superpowers\"\n]","functionCall":null},"finishReason":"stop"}],"usage":{"promptTokens":61,"completionTokens":14,"totalTokens":75}},"content":["Unleashing AI Superpowers: Exploring the Future of AI Technology","Unlocking the Potential: AI Integration Services for the Future of AI","Intelligent Automation and Machine Learning on Demand: Powering the Future of AI","The Future of AI: OpenAI Envisions On-Demand AI Superpowers"],"words":41,"expense":75}');
        $result = $fakeResponse->response;
        return TitleResponse::from($result);

    }

    public function article(array $aiOptions)
    {
        $this->processedData = (new LongArticleDataProcessor($aiOptions))->articleOptions();
        return $this->chatStream();
    }

    public function streamData(object|array $streamResponse): ?string
    {
        if (isset($streamResponse->choices)) {
            $content = $streamResponse->choices[0]->toArray();
            if (isset($content['delta']['content'])) {
                return $content['delta']['content'];
            }
        }
        return null;
    }

    /**
     * Generates template options by calling the templateOptions method of the TemplateDataProcessor class.
     *
     * @return array The array of code options.
     */
    public function templatecontentOptions(): array
    {
        return (new TemplateDataProcessor)->templatecontentOptions();
    }

    /**
     * Generates a template using the provided AI options.
     *
     * This method processes the given AI options through the TemplateDataProcessor
     * to generate the necessary template data. After processing, it initiates 
     * a chat stream.
     *
     * @param array $aiOptions An associative array of AI options to be used for template generation.
     * @return mixed The result of the chat stream.
     */
    public function templateGenerate(array $aiOptions)
    {
        $this->processedData = (new TemplateDataProcessor($aiOptions))->template();
        return $this->chatStream();
    }

    /**
     * Processes the stream response to extract the template content.
     *
     *
     * @param mixed $streamResponse The stream response object containing choices.
     * @return string|null The extracted content from the stream response, or null if not available.
     */
    public function templateStreamData($streamResponse): ?string
    {
        if (isset($streamResponse->choices)) {
            $content = $streamResponse->choices[0]->toArray();
            if (isset($content['delta']['content'])) {
                return $content['delta']['content'];
            }
        }
        return null;
    }
    public function prepareChatOptions(array $options)
    {
        $model = '';
        if (isset($options['model']) && !empty($options['model'])) {

            if ($options['model'] == 'gpt-3.5-turbo') {
                $model = 'gpt-3.5-turbo';
            } elseif ($options['model'] == 'gpt-4') {
                $model = 'gpt-4';
            }
        }

        $this->processedData = [
            'model' => !empty($model) ? $model : preference('long_article_model', 'gpt-3.5-turbo'),
            'messages' => $options['message'],
            "temperature" =>  1,
            "n" => $options['n'] ?? preference('n', 1),
            "max_tokens" => preference('max_token', 2046),
            "frequency_penalty" => preference('frequency_penalty', 0),
            "presence_penalty" => preference('presence_penalty', 0),
        ];

        return $this->chat();
    }

    /**
     * Get the generated content from OpenAI provider and return after processing.
     *
     * @param object $result [OpenAI response]
     *
     * @return array
     */
    public function getChatContent(object $result): array
    {
        $data = [];
        $outputContents = [];

        if (isset($result->choices)) {

            if (count($result->choices) > 1) {
                $totalWords = 0;
                $totalCharacters = 0;
                foreach ($result->choices as $choice) {
                    $outputContents[] = $choice->message->content; 
                    $totalWords += countWords($choice->message->content);
                    $totalCharacters += strlen($choice->message->content);
                }
            } else {
                $outputContents = $result->choices[0]->message->content;
                $totalWords = countWords($result->choices[0]->message->content);
                $totalCharacters = strlen($result->choices[0]->message->content);
            }

            $data = [
                'outputContents' => $outputContents,
                'promptTokens' => $result->usage->promptTokens,
                'completionTokens' => $result->usage->completionTokens,
                'totalTokens' => $result->usage->totalTokens,
                'totalWords' => preference('word_count_method') == 'token' ? subscription('tokenToWord', $result->usage->completionTokens) : $totalWords,
                'totalCharacters' => $totalCharacters,
            ];
        }

        return $data;
    }

      /**
     * Generates a CodeResponseContract object by processing the given $aiOptions using the CodeDataProcessor class.
     *
     * @param array $aiOptions The options for AI processing.
     * @return CodeResponseContract The generated CodeResponseContract object.
     */
    public function code(array $aiOptions): CodeResponseContract
    {
        $this->processedData = (new CodeDataProcessor($aiOptions))->code();
        return new CodeResponse($this->chat()->toArray());
    }

     /**
     * Generates code options by calling the codeOptions method of the CodeDataProcessor class.
     *
     * @return array The array of code options.
     */
    public function codeOptions(): array
    {
        return (new CodeDataProcessor)->codeOptions();
    }

    public function speechToTextOptions(): array
    {
       return (new SpeechToTextDataProcessor)->speechToTextOptions();
    }

    /**
     * Generates titles using AI options.
     *
     */
    public function speechToText(array $aiOptions)
    {
        $this->processedData = (new SpeechToTextDataProcessor($aiOptions))->audioDataOptions();
        return new SpeechToTextResponse($this->audio());
    }
}
