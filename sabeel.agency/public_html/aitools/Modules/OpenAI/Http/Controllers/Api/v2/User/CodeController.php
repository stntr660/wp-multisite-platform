<?php
/**
 * @author TechVillage <support@techvill.org>
 *
 * @contributor Kabir Ahmed <[kabir.techvill@gmail.com]>
 *
 * @created 26-01-2024
 */

namespace Modules\OpenAI\Http\Controllers\Api\v2\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Modules\OpenAI\Services\{
    VectorService
};
use Illuminate\Support\Facades\DB;
use Modules\OpenAI\Http\Resources\v2\CodeResource;
use Modules\OpenAI\Http\Requests\EmbedRequest;
use Illuminate\Http\Response;
use Modules\OpenAI\Http\Requests\v2\CodeRequest;
use Modules\OpenAI\Services\v2\CodeService;
use Modules\OpenAI\Entities\Archive;

class CodeController extends Controller
{
    /**
     * The instance of the code service.
     *
     * @var CodeService
     */
    protected $codeService;

    /**
     * Constructor method.
     *
     * Instantiates the class and sets up the vector service.
     *
     * @param  VectorService  $vectorService
     * 
     * @return void
     */
    public function __construct(CodeService $codeService)
    {
        $this->codeService = $codeService;
    }

    /**
     * Store a newly created code.
     *
     * @param  EmbedRequest  $request
     * 
     * @return JsonResponse
     */
    public function store(CodeRequest $request): array|JsonResponse
    {
        $checkSubscription = checkUserSubscription(auth()->user()->id, 'word');

        if ($checkSubscription['status'] != 'success') {
            return response()->json(['error' => $checkSubscription['response']], Response::HTTP_FORBIDDEN);
        }

        try {
            DB::beginTransaction();
            $this->codeService->validate($request->validated());
            $id = $this->codeService->prepareData();
                
            if ($id) {
                DB::commit();
                $code = (new Archive())->contentById($id);
                $code = $code->paginate(preference('row_per_page'));
                return CodeResource::collection($code)->response()->getData(true);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
