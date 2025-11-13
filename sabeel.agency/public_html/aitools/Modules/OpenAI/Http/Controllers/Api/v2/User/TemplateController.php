<?php
/**
 * @author TechVillage <support@techvill.org>
 *
 * @contributor Kabir Ahmed <[kabir.techvill@gmail.com]>
 *
 * @created 26-01-2024
 */

namespace Modules\OpenAI\Http\Controllers\Api\v2\User;


use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Modules\OpenAI\Http\Requests\v2\TemplateRequest;
use Modules\OpenAI\Services\v2\TemplateService;


class TemplateController extends Controller
{
    /**
     * The instance of the code service.
     *
     * @var TemplateService
     */
    protected $templateService;

    /**
     * Constructor method.
     *
     * Instantiates the class and sets up the vector service.
     *
     * @param  TemplateService  $templateService
     * 
     * @return void
     */
    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    /**
     * Generate template data based on the provided request.
     *
     *
     * @param  TemplateRequest  $request The request containing the template data.
     * @return \Illuminate\Http\JsonResponse The response containing the status, success flag, message, and template ID.
     */

    public function generate(TemplateRequest $request): \Illuminate\Http\JsonResponse
    {
        $checkSubscription = checkUserSubscription(auth()->user()->id, 'word');

        if ($checkSubscription['status'] != 'success') {
            return response()->json(['error' => $checkSubscription['response']], Response::HTTP_FORBIDDEN);
        }

        try {
            \DB::beginTransaction();
            $this->templateService->initiate($request->validated());
            $id = $this->templateService->prepareData();
            if ($id) {
                \DB::commit();
                return response()->json(['data' => [
                    'templateId' => $id 
                ]], Response::HTTP_OK);
            }

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Process the streaming template data.
     *
     * This method initiates the template service with the request data, retrieves template data, and processes it.
     *
     * @return mixed The processed template data.
     */
    public function process()
    {
        $this->templateService->initiate(request()->all());
        $this->templateService->templateData();
        return $this->templateService->processData();
    }

}
