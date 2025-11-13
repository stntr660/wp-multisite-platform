<?php

namespace Modules\OpenAI\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\MediaManager\Http\Models\ObjectFile;
use App\Traits\ModelTraits\hasFiles;
use App\Traits\ModelTraits\Metable;
use App\Traits\ModelTraits\Filterable;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ModelTrait;
use App\Models\User;

class Archive extends Model
{
    use HasFactory;
    use hasFiles;
    use Metable;
    use ModelTrait;
    use Filterable;

    /**
     * The table associated with the model's meta data.
     *
     * @var string
     */
    protected $metaTable = 'archives_meta';

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Relation with User model
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    /**
     * Clears the footprints associated with the given Archive.
     *
     * This method removes any records from the ObjectFile table where the object_type is 'archives'
     * and the object_id matches the ID of the provided Archive object.
     *
     * @param Archive $archive The Archive object for which footprints are to be cleared.
     * @return void
     */
    public static function clearFootprints(Archive $archive): void
    {
        ObjectFile::where(['object_type' => 'archives', 'object_id' => $archive->id])->delete();
    }

    /**
    * Define a relationship between Archive and ChatBot models.
    *
    * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function chatbot()
    {
        return $this->belongsTo(ChatBot::class, 'bot_id');
    }

    /**
     * Retrieve embedded resources associated with the file IDs stored in metadata.
     *
     * This method retrieves embedded resources based on the file IDs stored in the metadata
     * of the current instance. It queries the database to fetch embedded resources matching
     * the provided file IDs and returns them along with associated metadata, users, and child resources.
     *
     * @return \Illuminate\Database\Eloquent\Collection|\App\Models\EmbededResource[]
     */
    public function file()
    {
        $ids = $this->metas()->where('key', 'file_id')->first()->value ?? null;
        return EmbededResource::with(['metas', 'user', 'childs'])->whereIn('id', explode(',',  $ids))->get();
    }

    
    /**
     * DocChat list
     *
     * @return Object
     */
    public function history(): Object
    {
        $archive = Archive::with('metas')->whereNull('parent_id')->whereIn('type', ['chat', 'file', 'url']);

        $userRole = auth()->user()->roles()->first();

        if ($userRole->type == 'user') {
            $archive = $archive->where(['user_id' => auth('api')->user()->id]);
        }

        if (request('id')) {
            $archive = $archive->where('id', request('id'));
        }
        return $archive->orderBy('created_at', 'desc');
    }

    /**
     * Get content by ID.
     *
     * @param  mixed  $id The ID of the content.
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder
     */
    public function contentById($id): \Illuminate\Database\Eloquent\Builder
    {
        return $this->model()->with(['user', 'childs', 'metas'])->where(['parent_id' => $id]);
    }

    /**
     * Get model instance.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function model(): \Illuminate\Database\Eloquent\Builder
    {
        return Archive::with('metas');
    }

    /**
     * Get content by ID.
     *
     * @param  mixed  $id The ID of the content.
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder
     */
    public function contentBySlug($slug, $type = null): \Illuminate\Database\Eloquent\Builder
    {
        return $this->model()->with(['user', 'childs', 'metas'])
            ->when(auth()->user()?->role()->type === 'user', function ($query) use($type) {
                return $query->whereHas('metas', function ($q) use ($type) {
                    $q->where('key', $type. '_creator_id')->where('value', auth()->id());
                });
            })->whereHas('metas', function ($q) use ($slug) {
                $q->where('key', 'slug')->where('value', $slug);
            })->where('type', 'code_chat_reply');
    }

    // Get model instance with the new name
    public function getQueryBuilderInstance(): \Illuminate\Database\Eloquent\Builder
    {
        return Archive::with('metas');
    }

    /**
     * Define a relation with child EmbededResource models.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function childs()
    {
        return $this->hasMany('Modules\OpenAI\Entities\Archive', 'parent_id')->with(['metas']);
    }

     /**
     * Foreign key with UseCase model
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function useCase()
    {
        return $this->belongsTo('Modules\OpenAI\Entities\UseCase', 'use_case_id');
    }

    /**
     * Relation with User model
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function templateCreator()
    {
        return $this->belongsTo('App\Models\User', 'template_creator_id');
    }

    /**
     * Code list.
     *
     * @param  mixed  $id The ID of the content.
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder
     */
    public function codes($type = null): \Illuminate\Database\Eloquent\Builder
    {
        return $this->model()->with(['user', 'childs', 'codeCreator'])
            ->when(auth()->user()?->role()->type === 'user', function ($query) use ($type) {
                return $query->whereHas('metas', function ($q) use ($type) {
                    $q->where('key', $type . '_creator_id')->where('value', auth()->id());
                });
            })->where('type', 'code_chat_reply')->whereNull('user_id');
    }

    /**
     * Relation with User model
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function codeCreator(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'code_creator_id');
    }

    /**
     * Speeches list.
     *
     * @param  mixed  $id The ID of the content.
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder
     */
    public function speeches($type = null): \Illuminate\Database\Eloquent\Builder
    {
        return $this->model()->with(['childs', 'speechToTextCreator'])
            ->whereHas('metas', function ($q) use ($type) {
                $q->where('key', $type . '_creator_id')->where('value', auth()->id());
            })->where('type', 'speech_to_text_chat_reply')->whereNull('user_id');
    }

    /**
     * Relation with User model
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function speechToTextCreator(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'speech_to_text_creator_id');
    }

    /**
     * Define a relation with child Archive models that are chats.
     *
     * This method specifies a hasMany relationship with child Archive models that are considered chats,
     * based on the parent_id foreign key. It eagerly loads the 'metas' relationship for each child Archive.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function chats()
    {
        return $this->hasMany('Modules\OpenAI\Entities\Archive', 'parent_id')->with('metas');
    }
}
