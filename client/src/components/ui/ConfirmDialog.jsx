import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog — modal-based confirmation with danger variant
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title       = 'Are you sure?',
  message     = 'This action cannot be undone.',
  confirmLabel= 'Confirm',
  cancelLabel = 'Cancel',
  isLoading   = false,
  danger      = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={null} hideClose>
      <div className="flex flex-col items-center text-center py-4 gap-5">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          danger
            ? 'bg-danger-100 dark:bg-danger-900/30'
            : 'bg-warning-100 dark:bg-warning-900/30'
        }`}>
          {danger
            ? <Trash2 size={28} className="text-danger-600 dark:text-danger-400" />
            : <AlertTriangle size={28} className="text-warning-600 dark:text-warning-400" />
          }
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <p className="text-sm text-[var(--text-muted)] max-w-xs">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            size="md"
            fullWidth
            loading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
