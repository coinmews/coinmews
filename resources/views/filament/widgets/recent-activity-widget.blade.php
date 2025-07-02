<x-filament::widget>
    <div class="p-4">
        <h3 class="text-lg font-bold mb-4">Recent Activity</h3>
        <ul class="divide-y divide-gray-200">
            @foreach($this->getRecords() as $log)
                <li class="py-2 flex items-center space-x-3">
                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                        <x-heroicon-o-user class="h-5 w-5 text-gray-400" />
                    </span>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">
                            {{ $log->user?->name ?? 'System' }}
                            <span class="ml-2 px-2 py-0.5 rounded text-xs font-semibold @if($log->action === 'created') bg-green-100 text-green-800 @elseif($log->action === 'updated') bg-blue-100 text-blue-800 @elseif($log->action === 'deleted') bg-red-100 text-red-800 @else bg-gray-100 text-gray-800 @endif">
                                {{ ucfirst($log->action) }}
                            </span>
                        </p>
                        <p class="text-xs text-gray-500">
                            {{ class_basename($log->auditable_type) }} #{{ $log->auditable_id }}
                        </p>
                    </div>
                    <div class="text-xs text-gray-400 whitespace-nowrap">
                        {{ $log->created_at->diffForHumans() }}
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
</x-filament::widget> 