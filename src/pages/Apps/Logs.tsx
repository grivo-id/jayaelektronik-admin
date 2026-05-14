import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetAllActivityLogs } from '../../services/logService';
import { IActivityLogAttributes } from '../../types/logType';
import IconSearch from '../../components/Icon/IconSearch';
import IconEye from '../../components/Icon/IconEye';
import Pagination from '../../components/Pagination';
import LogDetailModal from './LogDetailModal';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-success/10 text-success',
  UPDATE: 'bg-info/10 text-info',
  DELETE: 'bg-danger/10 text-danger',
  CRON_RUN: 'bg-purple-500/10 text-purple-500',
  POINTS_ADJUST: 'bg-warning/10 text-warning',
};

const Logs = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [actorType, setActorType] = useState('');
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [selectedLog, setSelectedLog] = useState<IActivityLogAttributes | null>(null);

  const { data, isLoading } = useGetAllActivityLogs({
    page,
    limit,
    actor_type: actorType,
    action,
    entity_type: entityType,
    search,
  });

  const logs = data?.data || [];
  const pagination = data?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-gray-500">Track all admin and system activities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="panel mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Actor Type</label>
            <select className="form-select mt-1" value={actorType} onChange={(e) => { setActorType(e.target.value); setPage(1); }}>
              <option value="">All</option>
              <option value="ADMIN">Admin</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Action</label>
            <select className="form-select mt-1" value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }}>
              <option value="">All</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="CRON_RUN">Cron Run</option>
              <option value="POINTS_ADJUST">Points Adjust</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Entity Type</label>
            <select className="form-select mt-1" value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }}>
              <option value="">All</option>
              <option value="PRODUCT">Product</option>
              <option value="BRAND">Brand</option>
              <option value="ORDER">Order</option>
              <option value="COUPON">Coupon</option>
              <option value="CUSTOMER_TIER">Customer Tier</option>
              <option value="CUSTOMER_LOYALTY">Customer Loyalty</option>
              <option value="BIRTHDAY_BONUS">Birthday Bonus</option>
              <option value="POINTS_EXPIRATION">Points Expiration</option>
              <option value="TIER_DOWNGRADE">Tier Downgrade</option>
              <option value="TIER_RECALCULATION">Tier Recalculation</option>
            </select>
          </div>
          <div>
            <form onSubmit={handleSearch} className="flex gap-2 mt-6">
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <IconSearch className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="panel">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table-striped">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Aktor</th>
                    <th>Aksi</th>
                    <th>Entity</th>
                    <th>Deskripsi</th>
                    <th className="text-center">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        Tidak ada log aktivitas
                      </td>
                    </tr>
                  ) : (
                    logs.map((log: IActivityLogAttributes) => (
                      <tr key={log.activity_log_id}>
                        <td>{formatDate(log.created_at)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${log.actor_type === 'ADMIN' ? 'bg-info/10 text-info' : 'bg-purple-500/10 text-purple-500'}`}>
                              {log.actor_type}
                            </span>
                            <div className="text-sm">
                              {log.actor_name ? (
                                <span className="font-medium">{log.actor_name}</span>
                              ) : log.actor_email ? (
                                <span>{log.actor_email}</span>
                              ) : (
                                <span className="text-gray-400">System</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm font-medium">{log.entity_type}</span>
                          {log.entity_id && (
                            <span className="text-xs text-gray-400 block">{log.entity_id}</span>
                          )}
                        </td>
                        <td className="max-w-xs">
                          <p className="text-sm truncate">{log.description}</p>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <IconEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalData > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, pagination.totalData)} dari {pagination.totalData} data
                  </span>
                  <select
                    className="form-select text-sm py-1 px-2 w-20"
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-500">per halaman</span>
                </div>

                <Pagination
                  activePage={page}
                  itemsCountPerPage={limit}
                  totalItemsCount={pagination.totalData}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default Logs;
