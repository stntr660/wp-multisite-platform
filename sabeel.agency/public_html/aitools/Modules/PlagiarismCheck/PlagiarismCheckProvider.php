<?php

namespace Modules\PlagiarismCheck;

use App\Lib\AiProvider;
use Modules\OpenAI\Contracts\Resources\PlagiarismContract;
use Modules\PlagiarismCheck\Traits\PlagiarismCheckApiTrait;
use Modules\PlagiarismCheck\Resources\PlagiarismDataProcessor;
use Modules\PlagiarismCheck\Responses\Plagiarism\GenerateResponse;
use Modules\PlagiarismCheck\Responses\Plagiarism\ReportResponse;
use Modules\OpenAI\Contracts\Responses\Plagiarism\GenerateResponseContract;
use Modules\OpenAI\Contracts\Responses\Plagiarism\ReportResponseContract;

class PlagiarismCheckProvider extends AiProvider implements PlagiarismContract
{
    use PlagiarismCheckApiTrait;

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
            'title' => 'Plagiarism Check',
            'description' => __("The plagiarism check helps maintain originality by analyzing writing styles and identifying external sources, thereby promoting academic integrity and authenticity. It also supports the use of AI detection tools."),
            'image' => 'Modules/PlagiarismCheck/Resources/assets/image/logo.svg',
        ];
    }

    /**
     * Retrieve plagiarism options available for admin settings.
     *
     * @return array
     */
    public function plagiarismOptions(): array
    {
        return (new PlagiarismDataProcessor)->plagiarismOptions();
    }

    /**
     * Generate plagiarism and process the result.
     *
     * @return array
     */
    public function plagiarism(array $aiOptions): GenerateResponseContract
    {
        $this->processedData = (new PlagiarismDataProcessor)->plagiarismCheck($aiOptions);
        $url = moduleConfig('plagiarismcheck.PLAGIARISMCHECK.BASE_URL');
        return new GenerateResponse($this->generate($url));
    }

    /**
     * Retrieve the detailed plagiarism report for a given ID.
     *
     * @param int $id  The ID of the plagiarism check to retrieve the report for.
     * @return mixed  The plagiarism report data.
     */
    public function getPlagiarismReport(array $data): ReportResponseContract
    {
        $id = $data['id'];
        $state = $data['state'];

        $statusUrl = moduleConfig('plagiarismcheck.PLAGIARISMCHECK.BASE_URL') . '/' . $id;
        $reportUrl = moduleConfig('plagiarismcheck.PLAGIARISMCHECK.BASE_URL') . '/report/' . $id;

        if ($state == '5') {
            return new ReportResponse($this->getReport($reportUrl));
        }

        $maxAttempts = 10;
        $attempt = 0;

        do {
            $status = $this->checkStatus($statusUrl);
        
            // Stop the loop if the state is 5
            if (isset($status['data']['state']) && $status['data']['state'] == '5') {
                break;
            }

            // Stop the loop if the state is 4
            if (isset($status['data']['state']) && $status['data']['state'] == '4') {
                throw new \Exception(__('The content could not be checked due to an error that occurred during the plagiarism check. Please try again.'));
                break;
            }
        
            usleep(500000); // Sleep for 500 milliseconds
            $attempt++;
        
            // If max attempts reached, throw an exception
            if ($attempt >= $maxAttempts) {
                throw new \Exception(__('We were unable to retrieve the report at this time. Please try again.'));
            }
        
        } while (true);

        return new ReportResponse($this->getReport($reportUrl));
    }
}
