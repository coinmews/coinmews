<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch submissions of all types that belong to the current user
        $presaleSubmissions = Auth::user()->submissions()
            ->select('id', 'name', 'type', 'status', 'created_at', 'updated_at')
            ->latest()
            ->get();

        $airdropSubmissions = \App\Models\Airdrop::where('created_by', Auth::id())
            ->latest()
            ->get()
            ->map(function ($airdrop) {
                return [
                    'id' => $airdrop->id,
                    'name' => $airdrop->name,
                    'type' => 'airdrop',
                    'status' => $airdrop->status,
                    'created_at' => $airdrop->created_at,
                    'updated_at' => $airdrop->updated_at,
                    'model_type' => 'airdrop',
                    'model_id' => $airdrop->id,
                    'slug' => $airdrop->slug,
                ];
            });

        $eventSubmissions = \App\Models\Event::where('organizer_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'name' => $event->title,
                    'type' => 'event',
                    'status' => $event->status,
                    'created_at' => $event->created_at,
                    'updated_at' => $event->updated_at,
                    'model_type' => 'event',
                    'model_id' => $event->id,
                    'slug' => $event->slug,
                ];
            });

        $articleSubmissions = \App\Models\Article::where('author_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'name' => $article->title,
                    'type' => $article->content_type ?? 'article',
                    'status' => $article->status,
                    'created_at' => $article->created_at,
                    'updated_at' => $article->updated_at,
                    'model_type' => 'article',
                    'model_id' => $article->id,
                    'slug' => $article->slug,
                ];
            });

        // Create entries in the Submission table for models that don't have a corresponding entry yet
        $this->ensureSubmissionEntries($airdropSubmissions, 'airdrop');
        $this->ensureSubmissionEntries($eventSubmissions, 'event');
        $this->ensureSubmissionEntries($articleSubmissions, 'article', true);

        // Fetch all submissions again from the Submission table after ensuring entries exist
        $submissions = Auth::user()->submissions()->with('submitter')->latest()->get();
        
        // Add the is_from_influencer flag to each submission
        $submissions->each(function ($submission) {
            $submission->is_from_influencer = $submission->isFromInfluencer();
        });

        return Inertia::render('submissions/index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Ensure all polymorphic models have entries in the submissions table
     */
    private function ensureSubmissionEntries($items, string $modelType, bool $useContentType = false)
    {
        foreach ($items as $item) {
            // Check if a submission entry already exists for this model
            $exists = \App\Models\Submission::where('model_type', $modelType)
                ->where('model_id', $item['id'])
                ->exists();

            // If not, create one
            if (!$exists) {
                // Map the status from the model to a valid submission status
                $submissionStatus = match ($modelType) {
                    'airdrop' => match ($item['status']) {
                        'potential' => 'pending',
                        'upcoming' => 'pending',
                        'ongoing' => 'approved',
                        'ended' => 'rejected',
                        default => 'pending'
                    },
                    'event' => match ($item['status']) {
                        'upcoming' => 'pending',
                        'ongoing' => 'approved',
                        'completed' => 'approved',
                        'cancelled' => 'rejected',
                        default => 'pending'
                    },
                    default => match ($item['status']) {
                        'reviewing' => 'reviewing',
                        'approved', 'published' => 'approved',
                        'rejected' => 'rejected',
                        default => 'pending'
                    }
                };

                // For articles, use the content_type as submission type
                $submissionType = $useContentType ? $item['type'] : $modelType;

                \App\Models\Submission::create([
                    'name' => $item['name'],
                    'title' => $item['name'],
                    'content' => $item['description'] ?? '',
                    'type' => $submissionType,
                    'status' => $submissionStatus,
                    'model_type' => $modelType,
                    'model_id' => $item['id'],
                    'submitted_by' => Auth::id(),
                ]);
            }
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('submissions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Common validation rules for all submission types
        $commonRules = [
            'logo_image' => 'nullable|image|max:2048',
            'banner_image' => 'nullable|image|max:2048',
        ];

        // Determine submission type and apply specific validation rules
        $submissionType = $request->input('submission_type', 'presale');

        // Switch based on submission type
        switch ($submissionType) {
            case 'presale':
                $specificRules = [
                    'name' => 'required|string|min:3',
                    'description' => 'required|string|min:50',
                    'token_symbol' => 'required|string',
                    'stage' => 'required|string|in:ICO,IDO,IEO,Presale,Privatesale',
                    'launchpad' => 'nullable|string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'token_price' => 'required',
                    'token_price_currency' => 'required|string',
                    'total_supply' => 'nullable',
                    'tokens_for_sale' => 'nullable',
                    'percentage_of_supply' => 'nullable',
                    'soft_cap' => 'nullable',
                    'hard_cap' => 'nullable',
                    'fundraising_goal' => 'nullable',
                    'website_url' => 'nullable|url',
                    'whitepaper_url' => 'nullable|url',
                    'contract_address' => 'nullable|string',
                ];
                break;

            case 'airdrop':
                $specificRules = [
                    'name' => 'required|string|min:3',
                    'description' => 'required|string|min:50',
                    'token_symbol' => 'required|string',
                    'type' => 'required|string|in:token,nft,other',
                    'blockchain' => 'nullable|string',
                    'total_supply' => 'nullable',
                    'airdrop_qty' => 'nullable',
                    'winners_count' => 'nullable|integer',
                    'usd_value' => 'nullable|numeric',
                    'tasks_count' => 'nullable|integer',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ];
                break;

            case 'event':
                $specificRules = [
                    'title' => 'required|string|min:3',
                    'description' => 'required|string|min:50',
                    'type' => 'required|string|in:crypto_event,web3_event,community_event,ai_event',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'location' => 'required_if:is_virtual,false',
                    'is_virtual' => 'nullable|boolean',
                    'virtual_link' => 'required_if:is_virtual,true|nullable|url',
                    'registration_link' => 'nullable|url',
                    'max_participants' => 'nullable|integer',
                ];
                break;

            case 'press_release':
                $specificRules = [
                    'title' => 'required|string|min:5',
                    'content' => 'required|string|min:100',
                    'excerpt' => 'nullable|string',
                    'company_name' => 'required|string|min:2',
                    'contact_email' => 'required|email',
                    'contact_phone' => 'nullable|string',
                    'website_url' => 'nullable|url',
                ];
                break;

            case 'guest_post':
                $specificRules = [
                    'title' => 'required|string|min:5',
                    'content' => 'required|string|min:100',
                    'excerpt' => 'nullable|string',
                    'author_name' => 'required|string|min:2',
                    'author_bio' => 'required|string|min:50',
                    'reading_time' => 'nullable|integer',
                    'website_url' => 'nullable|url',
                ];
                break;

            case 'sponsored_content':
                $specificRules = [
                    'title' => 'required|string|min:5',
                    'content' => 'required|string|min:100',
                    'excerpt' => 'nullable|string',
                    'company_name' => 'required|string|min:2',
                    'contact_email' => 'required|email',
                    'contact_phone' => 'nullable|string',
                    'website_url' => 'nullable|url',
                ];
                break;

            default:
                return redirect()->back()->withErrors(['submission_type' => 'Invalid submission type']);
        }

        // Merge rules and validate
        $validationRules = array_merge($commonRules, $specificRules);
        $validated = $request->validate($validationRules);

        // Handle file uploads based on submission type
        if ($request->hasFile('logo_image')) {
            if ($submissionType === 'presale') {
                $validated['logo_image'] = $request->file('logo_image')->store('presales/logos', 'r2');
            } elseif ($submissionType === 'airdrop') {
                $validated['logo_image'] = $request->file('logo_image')->store('airdrops', 'r2');
            } else {
                $validated['logo_image'] = $request->file('logo_image')->store('logos', 'r2');
            }
        }

        if ($request->hasFile('banner_image')) {
            if ($submissionType === 'event') {
                $validated['banner_image'] = $request->file('banner_image')->store('events', 'r2');
            } elseif (in_array($submissionType, ['press_release', 'guest_post', 'sponsored_content'])) {
                $validated['banner_image'] = $request->file('banner_image')->store('articles', 'r2');
            } else {
                $validated['banner_image'] = $request->file('banner_image')->store('banners', 'r2');
            }
        }

        // Add default values and handle field mappings based on submission type
        switch ($submissionType) {
            case 'presale':
                $validated['status'] = 'pending';
                $validated['type'] = 'presale';
                $validated['slug'] = Str::slug($validated['name']);
                $validated['title'] = $validated['name'];
                $validated['content'] = $validated['description'];
                break;

            case 'airdrop':
                $validated['status'] = 'potential';
                $validated['is_featured'] = false;
                $validated['slug'] = Str::slug($validated['name']);
                break;

            case 'event':
                $validated['status'] = 'upcoming';
                $validated['slug'] = Str::slug($validated['title']);
                $validated['current_participants'] = 0;
                $validated['meta_title'] = $validated['title'];
                $validated['meta_description'] = substr($validated['description'], 0, 160);
                $validated['organizer_id'] = Auth::id();
                break;

            case 'press_release':
            case 'guest_post':
            case 'sponsored_content':
                $validated['status'] = 'pending';
                $validated['content_type'] = $submissionType;
                $validated['slug'] = Str::slug($validated['title']);
                $validated['is_featured'] = false;
                $validated['is_breaking_news'] = false;
                $validated['view_count'] = 0;
                $validated['author_id'] = Auth::id();
                $validated['author_bio'] = $validated['author_bio'] ?? 'Administrator of CoinMews';
                break;
        }

        // Create the submission based on type
        $submission = null;
        $submissionData = null;

        if (in_array($submissionType, ['press_release', 'guest_post', 'sponsored_content'])) {
            // Create article

            // Generate a unique slug
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;

            // Check if slug exists and increment counter until we find a unique one
            while (\App\Models\Article::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $validated['slug'] = $slug;
            $validated['status'] = 'draft';
            $validated['content_type'] = $submissionType === 'sponsored_content' ? 'sponsored' : $submissionType;
            $validated['is_featured'] = false;
            $validated['is_breaking_news'] = false;
            $validated['view_count'] = 0;
            $validated['author_id'] = Auth::id();
            $validated['author_bio'] = $validated['author_bio'] ?? 'Administrator of CoinMews';

            // Get or create a default category for submissions
            $defaultCategory = \App\Models\Category::firstOrCreate(
                ['slug' => 'user-submissions'],
                [
                    'name' => 'User Submissions',
                    'description' => 'Content submitted by our community members',
                    'meta_title' => 'User Submitted Content',
                    'meta_description' => 'Discover content submitted by our community members'
                ]
            );

            $validated['category_id'] = $defaultCategory->id;

            // Create the article with the correct content type
            $submission = \App\Models\Article::create($validated);

            // Create submission record
            $submissionData = [
                'name' => $validated['title'],
                'title' => $validated['title'],
                'content' => $validated['content'],
                'type' => $submissionType, // This will be 'sponsored_content', 'press_release', or 'guest_post'
                'status' => 'pending',
                'model_type' => 'article',
                'model_id' => $submission->id,
                'submitted_by' => Auth::id(),
            ];
        } else {
            // Create the submission using the appropriate model
            if ($submissionType === 'event') {
                $validated['organizer_id'] = Auth::id();

                // Generate a unique slug
                $baseSlug = Str::slug($validated['title']);
                $slug = $baseSlug;
                $counter = 1;

                // Check if slug exists and increment counter until we find a unique one
                while (\App\Models\Event::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }

                $validated['slug'] = $slug;
                $submission = \App\Models\Event::create($validated);
                $submissionData = [
                    'name' => $validated['title'],
                    'title' => $validated['title'],
                    'content' => $validated['description'],
                    'type' => 'event',
                    'status' => 'pending',
                    'model_type' => 'event',
                    'model_id' => $submission->id,
                    'submitted_by' => Auth::id(),
                ];
            } else if ($submissionType === 'airdrop') {
                $validated['created_by'] = Auth::id();

                // Generate a unique slug
                $baseSlug = Str::slug($validated['name']);
                $slug = $baseSlug;
                $counter = 1;

                // Check if slug exists and increment counter until we find a unique one
                while (\App\Models\Airdrop::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }

                $validated['slug'] = $slug;
                $submission = \App\Models\Airdrop::create($validated);
                $submissionData = [
                    'name' => $validated['name'],
                    'title' => $validated['name'],
                    'content' => $validated['description'],
                    'type' => 'airdrop',
                    'status' => 'pending',
                    'model_type' => 'airdrop',
                    'model_id' => $submission->id,
                    'submitted_by' => Auth::id(),
                ];
            } else {
                // This is a presale submission, directly use the Submission model

                // Generate a unique slug if not already set
                if (!isset($validated['slug']) && isset($validated['name'])) {
                    $baseSlug = Str::slug($validated['name']);
                    $slug = $baseSlug;
                    $counter = 1;

                    // Check if slug exists and increment counter until we find a unique one
                    while (\App\Models\Submission::where('slug', $slug)->exists()) {
                        $slug = $baseSlug . '-' . $counter++;
                    }

                    $validated['slug'] = $slug;
                }

                // Ensure title and content are set
                if (!isset($validated['title'])) {
                    $validated['title'] = $validated['name'];
                }
                if (!isset($validated['content'])) {
                    $validated['content'] = $validated['description'];
                }

                $submission = Auth::user()->submissions()->create($validated);
            }
        }

        // Create a record in the main submissions table for non-presale submissions
        if ($submissionType !== 'presale' && $submissionData) {
            \App\Models\Submission::create($submissionData);
        }

        return redirect()->route('submissions.index')->with('success', 'Submission created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Submission $submission)
    {
        // Ensure the user can only view their own submissions
        if ($submission->submitted_by !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403);
        }

        // If this is a polymorphic reference to another model, redirect to that model's show page
        if ($submission->model_type && $submission->model_id) {
            switch ($submission->model_type) {
                case 'airdrop':
                    $airdrop = \App\Models\Airdrop::findOrFail($submission->model_id);
                    if ($airdrop->slug) {
                        return redirect()->route('airdrops.show', $airdrop->slug);
                    }
                    return redirect()->route('airdrops.show', $airdrop->id);

                case 'event':
                    $event = \App\Models\Event::findOrFail($submission->model_id);
                    if ($event->slug) {
                        return redirect()->route('events.show', $event->slug);
                    }
                    return redirect()->route('events.show', $event->id);

                case 'article':
                    $article = \App\Models\Article::findOrFail($submission->model_id);
                    if ($article->slug) {
                        // Determine the correct route based on the content type
                        $contentType = $article->content_type ?? 'article';
                        $routeName = match ($contentType) {
                            'press_release', 'news' => 'news.show',
                            'guest_post', 'blog' => 'blog.show',
                            default => 'articles.show'
                        };
                        return redirect()->route($routeName, $article->slug);
                    }
                    return redirect()->route('articles.show', $article->id);
            }
        }

        // Otherwise show the direct submission (presale)
        // Load the submitter relationship to access the is_influencer attribute
        $submission->load('submitter');
        
        return Inertia::render('submissions/show', [
            'submission' => $submission,
            'is_from_influencer' => $submission->isFromInfluencer()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Submission $submission)
    {
        // Ensure the user can only edit their own submissions
        if ($submission->submitted_by !== Auth::id()) {
            abort(403);
        }

        // If this is a polymorphic reference to another model, redirect to appropriate edit page
        if ($submission->model_type && $submission->model_id) {
            switch ($submission->model_type) {
                case 'airdrop':
                    $airdrop = \App\Models\Airdrop::findOrFail($submission->model_id);
                    // Determine what view to render for airdrop edit
                    if (view()->exists('submissions.edit-airdrop')) {
                        return Inertia::render('submissions/edit-airdrop', [
                            'airdrop' => $airdrop,
                            'submission_id' => $submission->id
                        ]);
                    }

                    // Fallback - redirect to create page with airdrop type preselected
                    session()->flash('info', 'The edit form for this airdrop is not available. Please submit a new one if needed.');
                    return redirect()->route('submissions.create', ['type' => 'airdrop']);

                case 'event':
                    $event = \App\Models\Event::findOrFail($submission->model_id);
                    // Determine what view to render for event edit
                    if (view()->exists('submissions.edit-event')) {
                        return Inertia::render('submissions/edit-event', [
                            'event' => $event,
                            'submission_id' => $submission->id
                        ]);
                    }

                    // Fallback - redirect to create page with event type preselected
                    session()->flash('info', 'The edit form for this event is not available. Please submit a new one if needed.');
                    return redirect()->route('submissions.create', ['type' => 'event']);

                case 'article':
                    $article = \App\Models\Article::findOrFail($submission->model_id);
                    $contentType = $article->content_type ?? 'article';

                    // Determine what view to render for article edit
                    if (view()->exists('submissions.edit-' . $contentType)) {
                        return Inertia::render('submissions/edit-' . $contentType, [
                            'article' => $article,
                            'submission_id' => $submission->id
                        ]);
                    }

                    // Fallback - redirect to create page with appropriate type preselected
                    session()->flash('info', 'The edit form for this content is not available. Please submit a new one if needed.');
                    return redirect()->route('submissions.create', ['type' => $contentType]);
            }
        }

        // Otherwise edit the direct submission (presale)
        return Inertia::render('submissions/edit', [
            'submission' => $submission
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Submission $submission)
    {
        // Ensure the user can only update their own submissions
        if ($submission->submitted_by !== Auth::id()) {
            abort(403);
        }

        // If this is a polymorphic reference to another model, update that model
        if ($submission->model_type && $submission->model_id) {
            switch ($submission->model_type) {
                case 'airdrop':
                    // Perform validation for airdrop 
                    $validated = $request->validate([
                        // Airdrop specific validation rules
                        'name' => 'required|string|min:3',
                        'description' => 'required|string|min:50',
                        'token_symbol' => 'required|string',
                        'type' => 'required|string|in:token,nft,other',
                        'blockchain' => 'nullable|string',
                        'total_supply' => 'nullable',
                        'airdrop_qty' => 'nullable',
                        'winners_count' => 'nullable|integer',
                        'usd_value' => 'nullable|numeric',
                        'tasks_count' => 'nullable|integer',
                        'start_date' => 'required|date',
                        'end_date' => 'required|date|after:start_date',
                        'logo_image' => 'nullable|image|max:2048',
                    ]);

                    // Handle file upload if needed
                    if ($request->hasFile('logo_image')) {
                        $validated['logo_image'] = $request->file('logo_image')->store('airdrops', 'r2');
                    }

                    // Find and update the airdrop
                    $airdrop = \App\Models\Airdrop::findOrFail($submission->model_id);
                    $airdrop->update($validated);

                    // Also update the reference in the submission table
                    $submission->update([
                        'name' => $validated['name'],
                        'status' => $airdrop->status
                    ]);

                    break;

                case 'event':
                    // Perform validation for event
                    $validated = $request->validate([
                        // Event specific validation rules
                        'title' => 'required|string|min:3',
                        'description' => 'required|string|min:50',
                        'type' => 'required|string|in:crypto_event,web3_event,community_event,ai_event',
                        'start_date' => 'required|date',
                        'end_date' => 'required|date|after:start_date',
                        'location' => 'required_if:is_virtual,false',
                        'is_virtual' => 'nullable|boolean',
                        'virtual_link' => 'required_if:is_virtual,true|nullable|url',
                        'registration_link' => 'nullable|url',
                        'max_participants' => 'nullable|integer',
                        'banner_image' => 'nullable|image|max:2048',
                    ]);

                    // Handle file upload if needed
                    if ($request->hasFile('banner_image')) {
                        $validated['banner_image'] = $request->file('banner_image')->store('events', 'r2');
                    }

                    // Find and update the event
                    $event = \App\Models\Event::findOrFail($submission->model_id);
                    $event->update($validated);

                    // Also update the reference in the submission table
                    $submission->update([
                        'name' => $validated['title'],
                        'status' => $event->status
                    ]);

                    break;

                case 'article':
                    // Perform validation for article
                    $validated = $request->validate([
                        // Article specific validation rules
                        'title' => 'required|string|min:5',
                        'content' => 'required|string|min:100',
                        'excerpt' => 'nullable|string',
                        'company_name' => 'nullable|string',
                        'contact_email' => 'nullable|email',
                        'contact_phone' => 'nullable|string',
                        'website_url' => 'nullable|url',
                        'author_name' => 'nullable|string',
                        'author_bio' => 'nullable|string',
                        'reading_time' => 'nullable|integer',
                        'banner_image' => 'nullable|image|max:2048',
                    ]);

                    // Handle file upload if needed
                    if ($request->hasFile('banner_image')) {
                        $validated['banner_image'] = $request->file('banner_image')->store('articles', 'r2');
                    }

                    // Find and update the article
                    $article = \App\Models\Article::findOrFail($submission->model_id);
                    $article->update($validated);

                    // Also update the reference in the submission table
                    $submission->update([
                        'name' => $validated['title'],
                        'status' => $article->status
                    ]);

                    break;

                default:
                    return redirect()->back()->withErrors(['type' => 'Invalid submission type']);
            }

            return redirect()->route('submissions.index')->with('success', 'Submission updated successfully!');
        }

        // Get the submission type from the existing submission
        $submissionType = $submission->type;

        // Common validation rules for all submission types
        $commonRules = [
            'logo_image' => 'nullable|image|max:2048',
            'banner_image' => 'nullable|image|max:2048',
        ];

        // Switch based on submission type
        switch ($submissionType) {
            case 'presale':
                $specificRules = [
                    'name' => 'required|string|min:3',
                    'description' => 'required|string|min:50',
                    'token_symbol' => 'required|string',
                    'stage' => 'required|string|in:ICO,IDO,IEO,Presale,Privatesale',
                    'launchpad' => 'nullable|string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'token_price' => 'required',
                    'token_price_currency' => 'required|string',
                    'total_supply' => 'nullable',
                    'tokens_for_sale' => 'nullable',
                    'percentage_of_supply' => 'nullable',
                    'soft_cap' => 'nullable',
                    'hard_cap' => 'nullable',
                    'fundraising_goal' => 'nullable',
                    'website_url' => 'nullable|url',
                    'whitepaper_url' => 'nullable|url',
                    'contract_address' => 'nullable|string',
                ];
                break;

            case 'airdrop':
                $specificRules = [
                    'name' => 'required|string|min:3',
                    'description' => 'required|string|min:50',
                    'token_symbol' => 'required|string',
                    'type' => 'required|string|in:token,nft,other',
                    'blockchain' => 'nullable|string',
                    'total_supply' => 'nullable',
                    'airdrop_qty' => 'nullable',
                    'winners_count' => 'nullable|integer',
                    'usd_value' => 'nullable|numeric',
                    'tasks_count' => 'nullable|integer',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ];
                break;

            case 'event':
                $specificRules = [
                    'title' => 'required|string|min:3',
                    'description' => 'required|string|min:50',
                    'type' => 'required|string|in:crypto_event,web3_event,community_event,ai_event',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'location' => 'required_if:is_virtual,false',
                    'is_virtual' => 'nullable|boolean',
                    'virtual_link' => 'required_if:is_virtual,true|nullable|url',
                    'registration_link' => 'nullable|url',
                    'max_participants' => 'nullable|integer',
                ];
                break;

            case 'press_release':
            case 'guest_post':
            case 'sponsored_content':
            case 'article':
                $specificRules = [
                    'title' => 'required|string|min:5',
                    'content' => 'required|string|min:100',
                    'excerpt' => 'nullable|string',
                    'company_name' => 'nullable|string',
                    'contact_email' => 'nullable|email',
                    'contact_phone' => 'nullable|string',
                    'website_url' => 'nullable|url',
                    'author_name' => 'nullable|string',
                    'author_bio' => 'nullable|string',
                    'reading_time' => 'nullable|integer',
                ];
                break;

            default:
                return redirect()->back()->withErrors(['type' => 'Invalid submission type']);
        }

        // Merge rules and validate
        $validationRules = array_merge($commonRules, $specificRules);
        $validated = $request->validate($validationRules);

        // Handle file uploads
        if ($request->hasFile('logo_image')) {
            if ($submissionType === 'presale') {
                $validated['logo_image'] = $request->file('logo_image')->store('presales/logos', 'r2');
            } elseif ($submissionType === 'airdrop') {
                $validated['logo_image'] = $request->file('logo_image')->store('airdrops', 'r2');
            } else {
                $validated['logo_image'] = $request->file('logo_image')->store('logos', 'r2');
            }
        }

        if ($request->hasFile('banner_image')) {
            if ($submissionType === 'event') {
                $validated['banner_image'] = $request->file('banner_image')->store('events', 'r2');
            } elseif (in_array($submissionType, ['press_release', 'guest_post', 'sponsored_content'])) {
                $validated['banner_image'] = $request->file('banner_image')->store('articles', 'r2');
            } else {
                $validated['banner_image'] = $request->file('banner_image')->store('banners', 'r2');
            }
        }

        // Update the submission
        $submission->update($validated);

        return redirect()->route('submissions.index')->with('success', 'Submission updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Submission $submission)
    {
        // Ensure the user can only delete their own submissions
        if ($submission->submitted_by !== Auth::id()) {
            abort(403);
        }

        // If this is a polymorphic reference to another model, delete that model too
        if ($submission->model_type && $submission->model_id) {
            switch ($submission->model_type) {
                case 'airdrop':
                    $airdrop = \App\Models\Airdrop::findOrFail($submission->model_id);
                    $airdrop->delete();
                    break;

                case 'event':
                    $event = \App\Models\Event::findOrFail($submission->model_id);
                    $event->delete();
                    break;

                case 'article':
                    $article = \App\Models\Article::findOrFail($submission->model_id);
                    $article->delete();
                    break;
            }
        }

        // Delete the submission record
        $submission->delete();

        return redirect()->route('submissions.index')->with('success', 'Submission deleted successfully!');
    }

    /**
     * Approve the specified submission.
     */
    public function approve(Submission $submission)
    {
        // Ensure admin access
        if (!Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized action.');
        }

        // If this is a polymorphic reference to another model, update that model's status
        if ($submission->model_type && $submission->model_id) {
            switch ($submission->model_type) {
                case 'airdrop':
                    $airdrop = \App\Models\Airdrop::findOrFail($submission->model_id);
                    $airdrop->update(['status' => 'ongoing']);
                    break;

                case 'event':
                    $event = \App\Models\Event::findOrFail($submission->model_id);
                    $event->update(['status' => 'upcoming']);
                    break;

                case 'article':
                    $article = \App\Models\Article::findOrFail($submission->model_id);
                    $article->update([
                        'status' => 'published',
                        'published_at' => now()
                    ]);
                    break;
            }
        }

        // Update the submission status
        $submission->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id()
        ]);

        return redirect()->back()->with('success', 'Submission approved successfully!');
    }

    /**
     * Reject the specified submission.
     */
    public function reject(Request $request, Submission $submission)
    {
        // Ensure admin access
        if (!Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized action.');
        }

        // Validate feedback
        $validated = $request->validate([
            'feedback' => 'required|string|min:10',
        ]);

        // If this is a polymorphic reference to another model, update that model's status
        if ($submission->model_type && $submission->model_id) {
            switch ($submission->model_type) {
                case 'airdrop':
                    $airdrop = \App\Models\Airdrop::findOrFail($submission->model_id);
                    $airdrop->update(['status' => 'rejected']);
                    break;

                case 'event':
                    $event = \App\Models\Event::findOrFail($submission->model_id);
                    $event->update(['status' => 'rejected']);
                    break;

                case 'article':
                    $article = \App\Models\Article::findOrFail($submission->model_id);
                    $article->update(['status' => 'rejected']);
                    break;
            }
        }

        // Update the submission status
        $submission->update([
            'status' => 'rejected',
            'feedback' => $validated['feedback'],
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id()
        ]);

        return redirect()->back()->with('success', 'Submission rejected successfully!');
    }
}
