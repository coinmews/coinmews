<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/settings/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'bio' => 'This is a test bio',
            'website' => 'https://example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->bio)->toBe('This is a test bio');
    expect($user->website)->toBe('https://example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('profile avatar can be updated', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'avatar' => $file,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->avatar)->not->toBeNull();
    expect(Storage::disk('public')->exists($user->avatar))->toBeTrue();
});

test('profile validation works correctly', function () {
    $user = User::factory()->create();

    // Test invalid website URL
    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'website' => 'not-a-url',
        ]);

    $response
        ->assertSessionHasErrors('website')
        ->assertRedirect(route('profile.edit'));

    // Test invalid avatar file
    $file = UploadedFile::fake()->create('document.pdf', 100);

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'avatar' => $file,
        ]);

    $response
        ->assertSessionHasErrors('avatar')
        ->assertRedirect(route('profile.edit'));
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete('/settings/profile', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/settings/profile')
        ->delete('/settings/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
