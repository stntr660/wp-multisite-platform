<?php

namespace Modules\Wpbox\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Wpbox\Models\Chatbot;

class ChatbotController extends Controller
{
    /**
     * Provide class.
     */
    private $provider = Chatbot::class;

    /**
     * Web RoutePath for the name of the routes.
     */
    private $webroute_path = 'chatbots.';

    /**
     * View path.
     */
    private $view_path = 'wpbox::chatbots.';

    /**
     * Parameter name.
     */
    private $parameter_name = 'chatbot';

    /**
     * Title of this crud.
     */
    private $title = 'chatbot';

    /**
     * Title of this crud in plural.
     */
    private $titlePlural = 'chatbots';

    private function getFields($class='col-md-4')
    {
        $fields=[];

        //Add name field
        $fields[0]=['class'=>$class, 'ftype'=>'input', 'name'=>'Name', 'id'=>'name', 'placeholder'=>'Enter name', 'required'=>true];

        //Add description field
        $fields[1]=['class'=>$class, 'ftype'=>'textarea', 'name'=>'description', 'id'=>'description', 'placeholder'=>'Enter description text', 'required'=>false,'additionalInfo'=>__('')];

        //url
        $fields[2]=['class'=>$class, 'ftype'=>'input', 'name'=>'url', 'id'=>'url', 'placeholder'=>'Enter url', 'required'=>true];
        
        //documentation_url
        $fields[3]=['class'=>$class, 'ftype'=>'input', 'name'=>'documentation_url', 'id'=>'documentation_url', 'placeholder'=>'Enter documentation url', 'required'=>false];
        
        //configuration
        $fields[4]=['class'=>$class, 'ftype'=>'input', 'name'=>'configuration', 'id'=>'configuration', 'placeholder'=>'Enter configuration', 'required'=>true];
        
        //active
        $fields[5]=['class'=>$class, 'ftype'=>'input', 'name'=>'active', 'id'=>'active', 'placeholder'=>'Enter active', 'required'=>true];

        //Return fields
        return $fields;
    }

    /**
     * Auth checker functin for the crud.
     */
    private function authChecker()
    {
        $this->ownerAndStaffOnly();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authChecker();

        $items=$this->provider::orderBy('id', 'desc');
        if(isset($_GET['name'])&&strlen($_GET['name'])>1){
            $items=$items->where('name',  'like', '%'.$_GET['name'].'%');
        }
        $items=$items->paginate(config('settings.paginate'));

        return view($this->view_path.'index', ['setup' => [
            'title'=> $this->titlePlural,
            'action_link'=>route($this->webroute_path.'create'),
            'action_name'=>__('crud.add_new_item', ['item'=>__($this->title)]),
            'items'=>$items,
            'item_names'=>$this->titlePlural,
            'webroute_path'=>$this->webroute_path,
            'fields'=>$this->getFields(),
            'custom_table'=>true,
            'parameter_name'=>$this->parameter_name,
            'parameters'=>count($_GET) != 0
        ]]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authChecker();


        return view('general.form', ['setup' => [
            'title'=>__('crud.new_item', ['item'=>__($this->title)]),
            'action_link'=>route($this->webroute_path.'index'),
            'action_name'=>__('crud.back'),
            'iscontent'=>true,
            'action'=>route($this->webroute_path.'store')
        ],
        'fields'=>$this->getFields() ]);
    }

        /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authChecker();
        
        //Create new field
        $field = $this->provider::create([
            'name' => $request->name,
            'description' => $request->description,
            'url' => $request->url,
            'documentation_url' => $request->documentation_url,
            'configuration' => $request->configuration,
            'active' => $request->active,
        ]);
        $field->save();

        return redirect()->route($this->webroute_path.'index')->withStatus(__('crud.item_has_been_added', ['item'=>__($this->title)]));
    }



    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Contact  $contacts
     * @return \Illuminate\Http\Response
     */
    public function edit(Chatbot $chat)
    {
        $this->authChecker();

        $fields = $this->getFields('col-md-6');
        $fields[0]['value'] = $chat->name;
        $fields[1]['value'] = $chat->description;
        $fields[2]['value'] = $chat->url;
        $fields[3]['value'] = $chat->documentation_url;
        $fields[4]['value'] = $chat->configuration;
        $fields[5]['value'] = $chat->active;

        $parameter = [];
        $parameter[$this->parameter_name] = $chat->id;

        return view($this->view_path.'edit', ['setup' => [
            'title'=>__('crud.edit_item_name', ['item'=>__($this->title), 'name'=>$chat->name]),
            'action_link'=>route($this->webroute_path.'index'),
            'action_name'=>__('crud.back'),
            'iscontent'=>true,
            'isupdate'=>true,
            'action'=>route($this->webroute_path.'update', ['chat' => $chat->id]),
        ],
        'fields'=>$fields, ]);
    }

 /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Contact  $contacts
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Chatbot $chat)
    {
        $this->authChecker();
        $chat->name = $request->name;
        $chat->description = $request->description;
        $chat->url = $request->url;
        $chat->documentation_url = $request->documentation_url;
        $chat->configuration = $request->configuration;
        $chat->active = $request->active;
        $chat->update();
    
        return redirect()->route($this->webroute_path.'index')->withStatus(__('crud.item_has_been_updated', ['item'=>__($this->title)]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Contact  $contacts
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->authChecker();
        $item = $this->provider::findOrFail($id);
        $item->delete();
        return redirect()->route($this->webroute_path.'index')->withStatus(__('crud.item_has_been_removed', ['item'=>__($this->title)]));
    }
    
}
