<?php
/**
 * @package CodeFilter
 * @author TechVillage <support@techvill.org>
 * @contributor kabir Ahmed <kabir.techvill@gmail.com>
 * @created 29-03-2023
 */

namespace Modules\OpenAI\Filters;

use App\Filters\Filter;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;

class CodeFilter extends Filter
{

    /**
     * Filter by userId query string
     *
     * @param  string  $id
     * @return EloquentBuilder|QueryBuilder
     */
    public function userId($id)
    {
        return $this->query->WhereHas('metas', function($q) use ($id) {
            $q->where('key', 'code_creator_id')->Where('value', $id);
        });
    }


    /**
     * Filter by search query string
     *
     * @param  string  $value
     * @return EloquentBuilder|QueryBuilder
     */
    public function search($value)
    {
        $value = xss_clean($value['value']);

        
        return $this->query->where(function ($query) use ($value) {
            $query->OrWhereHas('metas', function($q) use ($value) {
                $q->where('key', 'code_title')->OrWhere('value', 'LIKE', "%$value%");
            })
            ->OrWhereHas('metas', function($q) use ($value) {
                $q->where('key', 'formated_code')->OrWhere('value', 'LIKE', "%$value%");
            });
        });
    }
}
