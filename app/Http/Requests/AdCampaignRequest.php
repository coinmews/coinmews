<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'ad_space_id' => ['required', 'exists:ad_spaces,id'],
            'advertiser_id' => ['required', 'exists:users,id'],
            'ad_content' => ['required', 'string'],
            'ad_image' => ['nullable', 'image', 'max:2048'],
            'ad_link' => ['required', 'url', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'status' => ['required', 'string', Rule::in(['pending', 'active', 'paused', 'completed', 'cancelled'])],
            'budget' => ['required', 'numeric', 'min:0'],
            'spent' => ['nullable', 'numeric', 'min:0'],
            'ctr' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_approved' => ['boolean'],
            'approved_at' => ['nullable', 'date'],
            'approved_by' => ['nullable', 'exists:users,id'],
            'impression_count' => ['nullable', 'integer', 'min:0'],
            'click_count' => ['nullable', 'integer', 'min:0'],
            'targeting_rules' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The campaign name is required.',
            'name.max' => 'The campaign name must not exceed 255 characters.',
            'ad_space_id.required' => 'Please select an ad space.',
            'ad_space_id.exists' => 'The selected ad space does not exist.',
            'advertiser_id.required' => 'Please select an advertiser.',
            'advertiser_id.exists' => 'The selected advertiser does not exist.',
            'ad_content.required' => 'The ad content is required.',
            'ad_image.image' => 'The ad image must be a valid image file.',
            'ad_image.max' => 'The ad image must not exceed 2MB.',
            'ad_link.required' => 'The ad link is required.',
            'ad_link.url' => 'Please enter a valid URL.',
            'ad_link.max' => 'The URL must not exceed 255 characters.',
            'start_date.required' => 'Please select a start date.',
            'start_date.date' => 'Please enter a valid start date.',
            'end_date.required' => 'Please select an end date.',
            'end_date.date' => 'Please enter a valid end date.',
            'end_date.after' => 'The end date must be after the start date.',
            'status.required' => 'Please select a status.',
            'status.in' => 'The selected status is invalid.',
            'budget.required' => 'Please enter a budget.',
            'budget.numeric' => 'The budget must be a number.',
            'budget.min' => 'The budget must be at least 0.',
            'spent.numeric' => 'The spent amount must be a number.',
            'spent.min' => 'The spent amount must be at least 0.',
            'ctr.numeric' => 'The CTR must be a number.',
            'ctr.min' => 'The CTR must be at least 0.',
            'ctr.max' => 'The CTR must not exceed 100.',
            'impression_count.integer' => 'The impression count must be a number.',
            'impression_count.min' => 'The impression count must be at least 0.',
            'click_count.integer' => 'The click count must be a number.',
            'click_count.min' => 'The click count must be at least 0.',
            'targeting_rules.array' => 'The targeting rules must be an array.',
        ];
    }
}
