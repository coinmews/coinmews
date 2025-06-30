<?php

namespace App\Http\Controllers;

use App\Services\SearchService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $type = $request->input('type', 'all');

        if (empty($query)) {
            return response()->json(['results' => []]);
        }

        $results = $this->searchService->search($query, $type);

        return response()->json([
            'results' => $results,
            'query' => $query
        ]);
    }
}
