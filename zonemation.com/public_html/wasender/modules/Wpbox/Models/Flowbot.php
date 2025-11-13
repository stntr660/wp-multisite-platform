<?php

namespace Modules\Wpbox\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class Flowbot extends Model
{
    protected $table = 'flowbots';
    protected $fillable = [
        'name',
        'triggered',
        'steps_finished',
        'finished',
        'active',
    ];
  
}