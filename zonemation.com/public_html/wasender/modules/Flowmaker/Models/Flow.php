<?php

namespace Modules\Flowmaker\Models;

use Illuminate\Database\Eloquent\Model;
use App\Scopes\CompanyScope;


class Flow extends Model
{
    protected $table = 'flows';
    public $guarded = [];

    // Define relationships with other models here
    //Has many replies
    public function replies(){
        return $this->hasMany('Modules\Wpbox\Models\Reply');
    }

    // Define any custom methods or scopes here
    protected static function booted(){
        static::addGlobalScope(new CompanyScope);

        static::creating(function ($model){
           $company_id=session('company_id',null);
            if($company_id){
                $model->company_id=$company_id;
            }
        });
    }
}