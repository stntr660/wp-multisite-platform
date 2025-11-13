<?php

namespace Modules\Chat\Http\Controllers;

use App\Models\Preference;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Renderable
     */
    public function index()
    {
        $data['access_token'] = auth()->check() ? auth()->user()->createToken('authToken')->accessToken : null;
        $data['favicon'] = str_replace('\\', '/', Preference::getFavicon());
        $data['base_url'] = route('frontend.index').'/api/V1';
        $path = parse_url(route('frontend.index'));
        $data['route_path'] = $path['path'] ?? '/';
        $data['route_host'] = $path['host'];
        $data['is_local'] = isset($path['path']) ? 1 : 0;
        $data['lang'] = \App::getLocale();
        return view('chat::index', $data);
    }
}
