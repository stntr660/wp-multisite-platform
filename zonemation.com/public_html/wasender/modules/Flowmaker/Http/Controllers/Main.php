<?php

namespace Modules\Flowmaker\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Modules\Flowmaker\Models\Flow;
use Modules\Wpbox\Models\Reply;

class Main extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function edit(Flow $flow)
    {
        $data=[
            'flow'=>$flow,
        ];
        return view('flowmaker::index')->with('data', json_encode($data));
    }
   

    public function script()
    {
        // Find the first .js file in the public/build/assets directory
        $files = glob(__DIR__.'/../../public/build/assets/*.js');
        $script = file_get_contents($files[0]);
        return response($script)->header('Content-Type', 'application/javascript');
    }

    public function updateFlow(Request $request, Flow $flow)
    {
        //Set the flow nodes
        $flow->nodes = $request->nodes;

        //Set the flow connections
        $flow->connections = $request->connections;

        //Delete all replies with flow_id $flow->id
        Reply::where('flow_id', $flow->id)->delete();

        //Get all the replies
        $replies = $request->nodes;

        //Associative array to have the id of the reply as the key
        $repliesAsso = [];
        foreach($replies as $reply){
            $repliesAsso[$reply['id']] = $reply;
        }
       


        //Make the Replies for the flow
        $replies = $request->nodes;
        foreach($replies as $reply){
            $r = new Reply();
            $r->type=3;
            $r->trigger = "INITIAL_SET_TO_NONE";
            $r->flow_id = $flow->id;
            $r->name = $reply['id'];

            //Save header, text, footer, button1, button1_id, button2, button2_id, button3, button3_id, button_name, button_url
            //Header
            if(isset($reply['data']['header']))
                $r->header = $reply['data']['header'];
            //Text
            if(isset($reply['data']['value']))
                $r->text = $reply['data']['value'];
            //Footer
            if(isset($reply['data']['footer']))
                $r->footer = $reply['data']['footer'];

            //Buttons
            if(isset($reply['data']['button1'])){
                $r->button1 = $reply['data']['button1'];
                $r->button1_id = $reply['id']."_btn1";
            }
            if(isset($reply['data']['button2'])){
                $r->button2 = $reply['data']['button2'];
                $r->button2_id = $reply['id']."_btn2";
            }
            if(isset($reply['data']['button3'])){
                $r->button3 = $reply['data']['button3'];
                $r->button3_id = $reply['id']."_btn3";
            }
            if(isset($reply['data']['button'])){
                $r->button_name = $reply['data']['button'];
            }
            if(isset($reply['data']['url'])){
                $r->button_url = $reply['data']['url'];
            }

            $r->save();

          
        }

        //Now we need to go over the connections and set the next_reply_id
        foreach($request->connections as $connection){
            $source= $connection['source'];
            $target= $connection['target'];
            $reply = Reply::where('name',$source)->where('flow_id', $flow->id)->first();
            $next_reply = Reply::where('name', $target)->where('flow_id', $flow->id)->first();
            $sourceOutput= $connection['sourceOutput'];
            $targetInput= $connection['targetInput'];

            if($sourceOutput=="consequent"){
                //Start
                $next_reply->trigger =$repliesAsso[$source]['data']['message'];
                $next_reply->save();
            }else if($sourceOutput=="always"){
                //Always
                $reply->next_reply_id =$next_reply->id;
                $reply->save();
            }else if($sourceOutput=="buttton1ID"){
                //buttton1ID
                $next_reply->trigger =$reply->button1_id;
                $next_reply->save();
            }else if($sourceOutput=="buttton2ID"){
                //buttton2ID
                $next_reply->trigger =$reply->button2_id;
                $next_reply->save();
            }else if($sourceOutput=="buttton3ID"){
                //buttton3ID
                $next_reply->trigger =$reply->button3_id;
                $next_reply->save();
            }
        }
        

        //Respond ok
        $flow->save();
        return response()->json(['status'=>'ok']);
    }
}
