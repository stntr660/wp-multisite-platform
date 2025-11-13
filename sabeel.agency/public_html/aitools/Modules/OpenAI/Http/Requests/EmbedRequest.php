<?php

namespace Modules\OpenAI\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmbedRequest extends FormRequest
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
            'chunk' => 'sometimes|integer',
            'type' => 'required|in:url,file',
            'url' => ['required_if:type,url', 'url'],
            'file' => ['required_if:type,file', 'array'],
            'file.*' => ['mimes:pdf,doc,docx'],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'file.*.required' => __('Each document file is required.'),
            'file.*.mimes' => __('Each document must be in PDF, DOC, or DOCX format.'),
        ];
    }
}
