<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('name can be updated individually', function () {
    $user = User::factory()->create();
    $newName = 'Updated Name';

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $newName,
            'email' => $user->email, // Keep existing email
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    expect($user->name)->toBe($newName);
    expect($user->email)->toBe($user->email); // Email should remain unchanged
});

test('email can be updated individually', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $newEmail = 'newemail@example.com';

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name, // Keep existing name
            'email' => $newEmail,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    expect($user->email)->toBe($newEmail);
    expect($user->email_verified_at)->toBeNull(); // Should be reset when email changes
});

test('bio can be updated individually', function () {
    $user = User::factory()->create();
    $newBio = 'This is my new bio';

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'bio' => $newBio,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    expect($user->bio)->toBe($newBio);
});

test('website can be updated individually', function () {
    $user = User::factory()->create();
    $newWebsite = 'https://example.com';

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'website' => $newWebsite,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    expect($user->website)->toBe($newWebsite);
});

test('avatar can be updated without changing other fields', function () {
    Storage::fake('public');

    $user = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
        'bio' => 'Original bio',
        'website' => 'https://original.com',
    ]);

    $file = UploadedFile::fake()->image('new-avatar.jpg');

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    // Check that only avatar changed
    expect($user->name)->toBe('Original Name');
    expect($user->email)->toBe('original@example.com');
    expect($user->bio)->toBe('Original bio');
    expect($user->website)->toBe('https://original.com');
    expect($user->avatar)->not->toBeNull();
    expect(Storage::disk('public')->exists($user->avatar))->toBeTrue();
});

test('form validation handles empty optional fields', function () {
    $user = User::factory()->create([
        'bio' => 'Original bio',
        'website' => 'https://original.com',
    ]);

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'bio' => '', // Empty bio
            'website' => '', // Empty website
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    expect($user->bio)->toBeNull();
    expect($user->website)->toBeNull();
});
