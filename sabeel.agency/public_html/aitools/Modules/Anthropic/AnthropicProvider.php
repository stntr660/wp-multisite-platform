<?php

namespace Modules\Anthropic;

use App\Lib\AiProvider;
use Modules\Anthropic\Traits\AnthropicApiTrait;
use Modules\Anthropic\Resources\LongArticleDataProcessor;
use Modules\OpenAI\Contracts\Resources\LongArticleContract;
use Modules\OpenAI\Contracts\Resources\TemplateContentContract;
use Modules\Anthropic\Resources\TemplateDataProcessor;
use Modules\Anthropic\Responses\LongArticle\{
    OutlineResponse,
    TitleResponse
};
use Modules\OpenAI\Contracts\Responses\LongArticle\{
    OutlineResponseContract,
    TitleResponseContract
};
use Modules\Anthropic\Responses\LongArticle\StreamResponse;

use Modules\OpenAI\Contracts\Resources\CodeContract;
use Modules\OpenAI\Contracts\Responses\Code\CodeResponseContract;
use Modules\Anthropic\Resources\CodeDataProcessor;
use Modules\Anthropic\Responses\Code\CodeResponse;

class AnthropicProvider extends AiProvider implements LongArticleContract, CodeContract, TemplateContentContract
{
    use AnthropicApiTrait;

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
            'title' => 'Anthropic',
            'description' => __('Anthropic leads the way in AI innovations for chat and text processing. Utilizing cutting-edge models, we excel in natural language understanding, contributing to the future of AI development.'),
            'image' => 'Modules/Anthropic/Resources/assets/image/anthropic.jpg',
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
        return new OutlineResponse($this->outlineChat( $aiOptions['outline_number'] ?? 1));
    }

    public function fakeTitles(array $aiOptions): TitleResponseContract
    {
        $fakeResponse = json_decode('{"response":{"id":"msg_017fk76mgw1fnTEbT5J6KGoJ","type":"message","role":"assistant","content":[{"type":"text","text":"[\"Unveiling the Benefits: How AI Technology is Shaping Our Future\"]"}],"model":"claude-3-opus-20240229","stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":66,"output_tokens":20}}}', true);
        return new TitleResponse( $fakeResponse['response']);
    }

    public function fakeOutlines(array $aiOptions): OutlineResponseContract
    {
        $fakeResponse = json_decode('{"response":{"id":"msg_01DUcMikFXqTdc1fxWS2gabN","type":"message","role":"assistant","content":[{"type":"text","text":"[\n\"Unleashing AI Superpowers: Exploring the Future of AI Technology\",\n\"Unlocking the Potential: AI Integration Services for the Future of AI\",\n\"Intelligent Automation and Machine Learning on Demand: Powering the Future of AI\",\n\"The Future of AI: OpenAI Envisions On-Demand AI Superpowers\"\n]"}],"model":"claude-3-opus-20240229","stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":98,"output_tokens":133}}}', true);
        return new OutlineResponse($fakeResponse['response']);
    }

    public function article(array $aiOptions)
    {
        $this->processedData = (new LongArticleDataProcessor($aiOptions))->articleOptions();
        return $this->chatStream();
    }

    public function streamData(array|object $streamResponse): string
    {
        if (isset($streamResponse['delta']['text'])) {
            return $streamResponse['delta']['text'];
        }
        return "";
    }

    public function expense($streamData)
    {
        $inputToken = 0;
        $outputToken = 0;
        foreach ($streamData as $response) {

            if (isset($response['type']) && $response['type'] == 'message_start') {
                $inputToken += $response['message']['usage']['input_tokens'];
                $outputToken += $response['message']['usage']['output_tokens'];
            }

            if (isset($response['type']) && $response['type'] === 'message_delta') {
                $outputToken += $response['delta']['usage']['output_tokens'];
            }

        }

        return (int) $inputToken + $outputToken;
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
    public function templateGenerate(array $aiOptions): ?StreamResponse
    {
        $this->processedData = (new TemplateDataProcessor($aiOptions))->template();
        return $this->chatStream();
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
     * Processes the stream response to extract the template content.
     *
     *
     * @param mixed $streamResponse The stream response object containing choices.
     * @return string|null The extracted content from the stream response, or null if not available.
     */
    public function templateStreamData($streamResponse): string
    {
        if (isset($streamResponse['delta']['text'])) {
            return $streamResponse['delta']['text'];
        }
        return "";
    }

    /**
     * Generates a CodeResponseContract object by processing the given $aiOptions using the CodeDataProcessor class.
     *
     * @param array $aiOptions The options for AI processing.
     *
     * @return CodeResponseContract The generated CodeResponseContract object.
     */
    public function code(array $aiOptions): CodeResponseContract
    {
        $this->processedData = (new CodeDataProcessor($aiOptions))->code();
        return new CodeResponse($this->chat());
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
}
