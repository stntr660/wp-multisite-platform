<?php 

namespace Modules\OpenAI\Services\v2;

use Modules\OpenAI\Entities\ChatBot;

class CharacterChatBotService
{
    public function bots()
    {
        $systemBots = ChatBot::with('chatCategory')->get();
        $availableBots = \Modules\OpenAI\Services\ChatService::getBotPlan();
        $userSubscribedBots = \Modules\OpenAI\Services\ChatService::getAccessibleBots();

        $bots = [];
        foreach ($systemBots as $systemBot) {
            if (!isset($availableBots[$systemBot->code]) && !in_array($systemBot->code, json_decode($userSubscribedBots) ?? [])) {
                continue;
            }
            if (!in_array($systemBot->code, json_decode($userSubscribedBots) ?? [])) {
                $systemBot->bot_plan = $availableBots[$systemBot->code];
            }
            $bots[] = $systemBot;
        }
        
        return $bots;
    }
}