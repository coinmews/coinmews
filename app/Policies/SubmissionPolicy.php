<?php

namespace App\Policies;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SubmissionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Any authenticated user can view their submissions
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Submission $submission): bool
    {
        // Users can view their own submissions
        return $user->id === $submission->submitted_by || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create submissions
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Submission $submission): bool
    {
        // Users can update their own submissions
        return $user->id === $submission->submitted_by;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Submission $submission): bool
    {
        // Users can delete their own submissions, admins can delete any
        return $user->id === $submission->submitted_by || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Submission $submission): bool
    {
        // Only admins can restore
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Submission $submission): bool
    {
        // Only admins can force delete
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can approve the model.
     */
    public function approve(User $user, Submission $submission): bool
    {
        // Only admins can approve submissions
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can reject the model.
     */
    public function reject(User $user, Submission $submission): bool
    {
        // Only admins can reject submissions
        return $user->hasRole('admin');
    }
}
