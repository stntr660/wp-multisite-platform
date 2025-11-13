<?php

namespace Modules\OpenAI\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmbedQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'prompt' => 'required',
            'chunk' => 'sometimes|integer|nullable',
            'parent_id' => 'sometimes|integer|nullable|exists:archives,id',
            'file_id' => ['required', 'array', 'exists:embeded_resources,id'],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'file_id' => __('The chat is unable to continue due to unavailable of files.'),
        ];
    }
}
