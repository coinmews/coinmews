<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditLogObserver
{
    public function created(Model $model)
    {
        $this->log('created', $model, [], $model->getAttributes());
    }

    public function updated(Model $model)
    {
        $this->log('updated', $model, $model->getOriginal(), $model->getAttributes());
    }

    public function deleted(Model $model)
    {
        $this->log('deleted', $model, $model->getOriginal(), []);
    }

    protected function log($action, Model $model, $oldValues, $newValues)
    {
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
} 