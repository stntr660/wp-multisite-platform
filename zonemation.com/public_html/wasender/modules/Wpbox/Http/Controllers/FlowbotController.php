<?php

namespace Modules\Wpbox\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Wpbox\Models\Flowbot;

class FlowbotController extends Controller
{
    /**
     * Provide class.
     */
    private $provider = Flowbot::class;

    /**
     * Web RoutePath for the name of the routes.
     */
    private $webroute_path = 'flowbots.';

    /**
     * View path.
     */
    private $view_path = 'wpbox::flowbots.';

    /**
     * Parameter name.
     */
    private $parameter_name = 'flowbots';

    /**
     * Title of this crud.
     */
    private $title = 'flowbot';

    /**
     * Title of this crud in plural.
     */
    private $titlePlural = 'flowbots';

    private function getFields($class='col-md-4')
    {
        $fields=[];

        //Add name field
        $fields[0]=['class'=>$class, 'ftype'=>'input', 'name'=>'Name', 'id'=>'name', 'placeholder'=>'Enter name', 'required'=>true];

        //Triggered
        $fields[1]=['class'=>$class, 'ftype'=>'input', 'name'=>'triggered', 'id'=>'triggered', 'placeholder'=>'triggered', 'required'=>true];

        //Steps Finished
        $fields[2]=['class'=>$class, 'ftype'=>'input', 'name'=>'steps_finished', 'id'=>'steps_finished', 'placeholder'=>'Enter steps_finished', 'required'=>true];

        //Finished
        $fields[3]=['class'=>$class, 'ftype'=>'input', 'name'=>'finished', 'id'=>'finished', 'placeholder'=>'Enter finished', 'required'=>true];

        //active
        $fields[4]=['class'=>$class, 'ftype'=>'input', 'name'=>'active', 'id'=>'active', 'placeholder'=>'Enter active', 'required'=>true];

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
            'triggered' => $request->triggered,
            'steps_finished' => $request->steps_finished,
            'finished' => $request->finished,
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
    public function edit(Flowbot $chat)
    {
        $this->authChecker();

        $fields = $this->getFields('col-md-6');
        $fields[0]['value'] = $chat->name;
        $fields[1]['value'] = $chat->triggered;
        $fields[2]['value'] = $chat->steps_finished;
        $fields[3]['value'] = $chat->finished;
        $fields[4]['value'] = $chat->active;

        $parameter = [];
        $parameter[$this->parameter_name] = $chat->id;

        return view($this->view_path.'edit', ['setup' => [
            'title'=>__('crud.edit_item_name', ['item'=>__($this->title), 'name'=>$chat->name]),
            'action_link'=>route($this->webroute_path.'index'),
            'action_name'=>__('crud.back'),
            'iscontent'=>true,
            'isupdate'=>true,
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
    public function update(Request $request, Flowbot $chat)
    {
        $this->authChecker();
        $chat->name = $request->name;
        $chat->triggered = $request->triggered;
        $chat->steps_finished = $request->steps_finished;
        $chat->finished = $request->finished;
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
