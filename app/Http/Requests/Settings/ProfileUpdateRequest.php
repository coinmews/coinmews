<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\UploadedFile;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // You can add your authorization logic here if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $user = Auth::user();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:500'],
            'website' => ['nullable', 'url', 'max:255'],
            'twitter' => ['nullable', 'string', 'max:255'],
            'telegram' => ['nullable', 'string', 'max:255'],
            'discord' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'birthday' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:1024'], // Max 1MB
        ];
    }

    /**
     * Handle a passed validation attempt.
     */
    protected function passedValidation(): void
    {
        if ($this->hasFile('avatar')) {
            $file = $this->file('avatar');
            if ($file instanceof UploadedFile) {
                // Log the file to see if it's being uploaded correctly
                \Illuminate\Support\Facades\Log::info('Avatar file uploaded: ', [$file]);

                $path = $file->store('avatars', 'public');
                $this->merge([
                    'avatar' => $path,
                ]);
            }
        }
    }
}
