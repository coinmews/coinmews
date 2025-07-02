<?php

namespace App\Filament\Widgets;

use App\Models\AuditLog;
use Filament\Widgets\Widget;

class RecentActivityWidget extends Widget
{
    protected static string $view = 'filament.widgets.recent-activity-widget';
    protected static ?int $sort = 1;

    public function getRecords()
    {
        return AuditLog::with('user')->latest()->limit(8)->get();
    }
} 