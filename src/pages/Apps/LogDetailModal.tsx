import { IActivityLogAttributes } from "../../types/logType";
import IconX from "../../components/Icon/IconX";

interface LogDetailModalProps {
  log: IActivityLogAttributes;
  onClose: () => void;
}

const LogDetailModal = ({ log, onClose }: LogDetailModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatJSON = (data: any) => {
    if (!data) return "-";
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Detail Aktivitas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Info Dasar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <span className="text-xs text-gray-500">Waktu</span>
              <p className="text-sm font-medium">{formatDate(log.created_at)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <span className="text-xs text-gray-500">Aktor</span>
              <p className="text-sm font-medium">
                {log.actor_type === "ADMIN"
                  ? (log.actor_name || log.actor_email || "Admin")
                  : "System"}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200">
                  {log.actor_type}
                </span>
              </p>
              {log.actor_name && log.actor_email && (
                <p className="text-xs text-gray-500 mt-0.5">{log.actor_email}</p>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <span className="text-xs text-gray-500">Aksi</span>
              <p className="text-sm font-medium">{log.action}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <span className="text-xs text-gray-500">Entity</span>
              <p className="text-sm font-medium">{log.entity_type}</p>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <span className="text-xs text-gray-500">Deskripsi</span>
            <p className="text-sm font-medium">{log.description}</p>
          </div>

          {/* Before & After */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200 dark:border-red-800">
              <h3 className="text-red-600 dark:text-red-400 font-semibold mb-2 text-sm">
                Before (Old Values)
              </h3>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
                {formatJSON(log.old_values)}
              </pre>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
              <h3 className="text-green-600 dark:text-green-400 font-semibold mb-2 text-sm">
                After (New Values)
              </h3>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
                {formatJSON(log.new_values)}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t">
          <button className="btn btn-outline-primary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
