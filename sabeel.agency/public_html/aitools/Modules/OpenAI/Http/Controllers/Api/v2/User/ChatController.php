<?php

namespace Modules\OpenAI\Http\Controllers\Api\v2\User;

use Modules\OpenAI\Transformers\Api\v2\CharacterBotChat\{
    ChatDetailsResource,
    ChatResource
};
use Illuminate\Http\Resources\Json\ResourceCollection;
use Modules\OpenAI\Http\Requests\v2\ChatRequest;
use Modules\OpenAI\Resolvers\AiProviderResolver;
use Modules\OpenAI\Services\v2\ChatService;
use Modules\OpenAI\Entities\Archive;
use App\Http\Controllers\Controller;
use Illuminate\Http\{
    JsonResponse,
    Response
};
use Exception, DB;

class ChatController extends Controller
{
    /**
     * @var ChatService The instance of the chat service.
     */
    protected $chatService;

    /**
     * @var AiProvider The AI provider instance.
     */
    public $aiProvider;
    
    /**
     * Constructor method.
     *
     * Instantiates the class and sets up the AI provider and chat service.
     */
    public function __construct()
    {
        $this->chatService = new ChatService();
    }

    /**
     * Display a listing of the chat resource.
     *
     * @return ResourceCollection
     */
    public function index(): ResourceCollection
    {
        return ChatResource::collection(Archive::with('metas')->whereNull('parent_id')->whereType('chat')->orderBy('created_at', 'desc')->get());
    }

    /**
     * Display chat replies for a specific chat.
     *
     * @param  int  $chatId  The ID of the chat.
     * @return \Illuminate\Http\Resources\Json\ResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function show(int $chatId): ResourceCollection|JsonResponse
    {
        $chatReplies = Archive::with(['metas', 'chatbot', 'user', 'user.avatarFile', 'user.metas'])->where('parent_id', $chatId)->whereType('chat_reply')->orderBy('created_at', 'desc')->paginate(preference('row_per_page'));

        if (! $chatReplies->isEmpty()) {
            return ChatDetailsResource::collection($chatReplies);
        }

        return response()->json(['error' => __(':x does not exist.', ['x' => __('Chat')])], Response::HTTP_NOT_FOUND);
    }

    /**
     * Create a new chat.
     *
     * @param  \App\Http\Requests\ChatRequest  $request  The request containing chat data.
     * @return \Illuminate\Http\JsonResponse chat reply content
     */
    public function store(ChatRequest $request): JsonResponse
    {
        try {
            $chat = $this->chatService->store($request->except('_token'));
            return response()->json(['data' => $chat], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 
                $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Destroy a chat and its replies.
     *
     * @param  int  $chatId  [The ID of the chat to be destroyed.]
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $chatId): JsonResponse
    {
        DB::beginTransaction();
        try {
            // Find the chat or throw an exception if not found            
            $chat = Archive::where(['id' => $chatId, 'type' => 'chat'])->first() ?? throw new Exception(__(':x does not exist.', ['x' => __('Chat')]), Response::HTTP_NOT_FOUND);
             // Remove 'total_words' meta and save the changes
            $chat->unsetMeta(['total_words']);
            $chat->save();
            $chat->delete();

            $chatReplies = Archive::with('metas')->where(['parent_id' => $chatId, 'type' => 'chat_reply'])->get();
            if (! $chatReplies->isEmpty()) {
                foreach ($chatReplies as $reply) {
                    // Remove specified metas and save changes
                    $reply->unsetMeta(['user_reply', 'bot_id', 'bot_reply', 'total_words', 'prompt_tokens', 'completion_tokens']);
                    $reply->save();
                    $reply->delete();
                }
            }
            DB::commit();

            return response()->json(null, Response::HTTP_NO_CONTENT);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}