import React, { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { apiRequest } from '../utils/apiClient';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchOffersSummary,
  fetchRewardedData,
  fetchUsers,
  setFilter,
  setPage,
  setRewardedPage,
  setOffersPage,
} from '../store/slices/usersSlice';
export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();
  const {
    filter,
    page,
    totalPages,
    users,
    loading: usersLoading,
    error: usersError,
    offersSummary,
    offers,
    rewarded,
    rewardedPage,
    rewardedTotalPages,
    offersPage,
    offersTotalPages,
  } = useAppSelector((state) => state.users);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerUser, setOfferUser] = useState<any | null>(null);
  const [ublasts, setUblasts] = useState<any[]>([]);
  const [offerError, setOfferError] = useState('');
  const [offerForm, setOfferForm] = useState({
    ublastId: '',
    priceCents: '',
    mode: 'reward',
    createNew: false
  });
  const [newBlastForm, setNewBlastForm] = useState({
    title: '',
    content: '',
    media: null as File | null
  });
  const limit = 10;

  const columns: Column<any>[] = [{
    key: 'name',
    header: 'User',
    render: user => <div className="flex items-center gap-3">
          {user.avatar ? <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-text-secondary">
              {user.name?.[0] || 'U'}
            </div>}
          <div>
            <div className="font-medium text-text-primary">{user.name}</div>
            <div className="text-xs text-text-secondary">{user.username}</div>
          </div>
        </div>
  }, {
    key: 'contact',
    header: 'Contact',
    render: user => <div className="text-sm text-text-secondary">
          <div>{user.email}</div>
          <div className="text-xs">{user.phone}</div>
        </div>
  }, {
    key: 'followers',
    header: 'Followers',
    render: user => {
      const count = Number(user.followers) || 0;
      return count.toLocaleString();
    },
    sortable: true
  }, {
    key: 'status',
    header: 'Status',
    render: user => <StatusBadge status={user.status} />
  }, {
    key: 'isOnline',
    header: 'Active Now',
    render: user => <span className={`text-xs font-semibold ${user.isOnline ? 'text-green-400' : 'text-text-secondary'}`}>
          {user.isOnline ? 'Online' : 'Offline'}
        </span>
  }, {
    key: 'ublastStreakMonths',
    header: 'UBlast Streak (Months)',
    render: user => <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">
            {user.ublastStreakMonths || 0}
          </span>
          <Button variant="secondary" size="sm" onClick={() => {
        setOfferUser(user);
        setOfferForm(prev => ({
          ...prev,
          ublastId: '',
          priceCents: '',
          mode: 'reward'
        }));
        setIsOfferModalOpen(true);
      }}>
            Offer
          </Button>
        </div>
  }, {
    key: 'lastActivity',
    header: 'Last Active',
    render: user => user.isOnline ? 'Active now' : new Date(user.lastActivity).toLocaleString()
  }, {
    key: 'offerStatus',
    header: 'Offer Status',
    render: user => <span className="text-sm text-text-secondary">
          {user.offerStatus || '—'}
        </span>
  }];

  useEffect(() => {
    if (filter === 'rewarded') return;
    dispatch(fetchUsers({ page, filter, limit }));
  }, [dispatch, page, filter]);

  useEffect(() => {
    dispatch(fetchOffersSummary());
  }, [dispatch]);

  useEffect(() => {
    async function loadUblasts() {
      const result = await apiRequest({ path: '/api/admin/ublasts?limit=200' });
      if (result.ok) {
        setUblasts(result.data?.ublasts || []);
      }
    }
    loadUblasts();
  }, []);

  useEffect(() => {
    if (filter !== 'rewarded') return;
    dispatch(fetchRewardedData({ rewardedPage, offersPage }));
  }, [dispatch, filter, rewardedPage, offersPage]);

  const filteredUsers = useMemo(() => users.filter(user => user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase())), [users, searchTerm]);
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage creators and influencers.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <SearchBar onSearch={setSearchTerm} className="w-full sm:w-64" />
          <Button>Export CSV</Button>
        </div>
      </div>

      <div className="bg-surface border border-slate-700 rounded-lg p-4 flex gap-4 overflow-x-auto">
        {/* Quick Filters */}
        {[{
        id: 'all',
        label: 'All Users'
      }, {
        id: 'active',
        label: 'Active Users'
      }, {
        id: 'restricted',
        label: 'Restricted'
      }, {
        id: 'rewarded',
        label: 'Rewarded Ublasty'
      }].map(item => <button key={item.id} onClick={() => {
        dispatch(setFilter(item.id as any));
        if (item.id === 'rewarded') {
          dispatch(setRewardedPage(1));
        }
      }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === item.id ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-text-secondary hover:bg-slate-700 hover:text-text-primary'}`}>
            {item.label}
          </button>)}
        {filter === 'rewarded' && <div className="flex items-center gap-3 px-2 text-xs text-text-secondary">
            <span>Offers:</span>
            <span>Pending {offersSummary.statusCounts.pending}</span>
            <span>Paid {offersSummary.statusCounts.paid}</span>
            <span>Cancelled {offersSummary.statusCounts.cancelled}</span>
            <span>Expired {offersSummary.statusCounts.expired}</span>
          </div>}
      </div>

      {filter === 'rewarded' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              Admin Earnings From UBlasts
            </h3>
            <p className="text-3xl font-bold text-text-primary">
              ${(offersSummary.totalEarningsCents / 100).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
            </p>
          </div>
          <div className="bg-surface border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4">
              Earnings By UBlast
            </h3>
            {offersSummary.perUblast.length === 0 ? <div className="text-sm text-text-secondary">
                No earnings yet.
              </div> : <div className="space-y-2">
                {offersSummary.perUblast.map((entry: any) => <div key={entry.ublastId} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{entry.title}</span>
                    <span className="text-text-secondary">
                      ${(entry.totalCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ({entry.count})
                    </span>
                  </div>)}
              </div>}
          </div>
        </div>}

      {filter !== 'rewarded' && <>
          {usersError && <div className="text-sm text-red-400">{usersError}</div>}
          {usersLoading && <div className="text-sm text-text-secondary">Loading users...</div>}
          <DataTable data={filteredUsers} columns={columns} />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => dispatch(setPage(Math.max(1, page - 1)))} disabled={page <= 1 || usersLoading}>
                Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))} disabled={page >= totalPages || usersLoading}>
                Next
              </Button>
            </div>
          </div>
        </>}
      {filter === 'rewarded' && <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Rewarded UBlasts</h3>
            <DataTable data={rewarded} columns={[{
          key: 'title',
          header: 'UBlast',
          render: item => <div>
                    <div className="text-text-primary font-medium">{item.title}</div>
                    <div className="text-xs text-text-secondary">{item.rewardLabel}</div>
                  </div>
        }, {
          key: 'user',
          header: 'User',
          render: item => <div className="text-sm text-text-secondary">
                    <div>{item.user?.name || 'Unknown'}</div>
                    <div className="text-xs">{item.user?.email || ''}</div>
                  </div>
        }, {
          key: 'status',
          header: 'Status'
        }, {
          key: 'expiresAt',
          header: 'Expires',
          render: item => item.expiresAt ? new Date(item.expiresAt).toLocaleString() : '--'
        }]} />
            <div className="flex items-center justify-between text-sm text-text-secondary mt-3">
              <span>
                Page {rewardedPage} of {rewardedTotalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => dispatch(setRewardedPage(Math.max(1, rewardedPage - 1)))} disabled={rewardedPage <= 1}>
                  Previous
                </Button>
                <Button variant="ghost" size="sm" onClick={() => dispatch(setRewardedPage(Math.min(rewardedTotalPages, rewardedPage + 1)))} disabled={rewardedPage >= rewardedTotalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">UBlast Offers</h3>
            <DataTable data={offers} columns={[{
          key: 'ublast',
          header: 'UBlast',
          render: item => <div className="text-text-primary">{item.ublast?.title || 'UBlast'}</div>
        }, {
          key: 'user',
          header: 'User',
          render: item => <div className="text-sm text-text-secondary">
                    <div>{item.user?.name || 'Unknown'}</div>
                    <div className="text-xs">{item.user?.email || ''}</div>
                  </div>
        }, {
          key: 'status',
          header: 'Status'
        }, {
          key: 'price',
          header: 'Price',
          render: item => `$${(Number(item.priceCents || 0) / 100).toFixed(2)}`
        }, {
          key: 'createdAt',
          header: 'Created',
          render: item => item.createdAt ? new Date(item.createdAt).toLocaleString() : '--'
        }]} />
            <div className="flex items-center justify-between text-sm text-text-secondary mt-3">
              <span>
                Page {offersPage} of {offersTotalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => dispatch(setOffersPage(Math.max(1, offersPage - 1)))} disabled={offersPage <= 1}>
                  Previous
                </Button>
                <Button variant="ghost" size="sm" onClick={() => dispatch(setOffersPage(Math.min(offersTotalPages, offersPage + 1)))} disabled={offersPage >= offersTotalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>}
      <Modal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} title="UBlast Reward or Offer" size="lg">
        <div className="space-y-6">
          <div className="text-sm text-text-secondary">
            User: <span className="text-text-primary">{offerUser?.name || '—'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant={offerForm.mode === 'reward' ? 'primary' : 'secondary'} onClick={() => setOfferForm(prev => ({
            ...prev,
            mode: 'reward'
          }))}>
              Reward UBlast
            </Button>
            <Button variant={offerForm.mode === 'offer' ? 'primary' : 'secondary'} onClick={() => setOfferForm(prev => ({
            ...prev,
            mode: 'offer'
          }))}>
              Sell UBlast
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Select UBlast
            </label>
            <select className="w-full bg-surface border border-slate-700 rounded-lg px-3 py-2 text-text-primary" value={offerForm.ublastId} onChange={event => setOfferForm(prev => ({
            ...prev,
            ublastId: event.target.value
          }))} disabled={offerForm.createNew}>
              <option value="">Select a blast</option>
              {ublasts.map((blast: any) => <option key={blast._id} value={blast._id}>
                  {blast.title}
                </option>)}
            </select>
            <label className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={offerForm.createNew} onChange={event => setOfferForm(prev => ({
            ...prev,
            createNew: event.target.checked,
            ublastId: event.target.checked ? '' : prev.ublastId
          }))} />
              Create a new UBlast for this user
            </label>
          </div>
          {offerForm.createNew && <div className="space-y-4">
              <Input label="Blast Title" placeholder="Enter blast title" value={newBlastForm.title} onChange={event => setNewBlastForm(prev => ({
          ...prev,
          title: event.target.value
        }))} />
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Content
                </label>
                <textarea className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]" placeholder="What's the message?" value={newBlastForm.content} onChange={event => setNewBlastForm(prev => ({
          ...prev,
          content: event.target.value
        }))}></textarea>
              </div>
              <Input type="file" label="Media Attachment" className="pt-1.5" onChange={event => setNewBlastForm(prev => ({
          ...prev,
          media: event.target.files?.[0] || null
        }))} />
            </div>}
          {offerForm.mode === 'offer' && <Input label="Price (USD)" placeholder="5.00" value={offerForm.priceCents} onChange={event => setOfferForm(prev => ({
          ...prev,
          priceCents: event.target.value
        }))} />}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsOfferModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
            setOfferError('');
            if (!offerUser?.id) return;
            if (!offerForm.createNew && !offerForm.ublastId) {
              setOfferError('Select an existing UBlast or create a new one.');
              return;
            }
            let ublastId = offerForm.ublastId;
            if (offerForm.createNew) {
              if (!newBlastForm.title) {
                setOfferError('Blast title is required.');
                return;
              }
              const formData = new FormData();
              formData.append('title', newBlastForm.title);
              if (newBlastForm.content) formData.append('content', newBlastForm.content);
              if (newBlastForm.media) formData.append('media', newBlastForm.media);
              const created = await apiRequest({
                path: '/api/admin/ublasts',
                method: 'POST',
                body: formData
              });
              if (!created.ok) {
                setOfferError(created.data?.error || 'Failed to create UBlast.');
                return;
              }
              ublastId = created.data?.ublast?._id || '';
            }
            if (!ublastId) {
              setOfferError('UBlast creation failed.');
              return;
            }
            if (offerForm.mode === 'reward') {
              const rewardResult = await apiRequest({
                path: `/api/admin/ublasts/${ublastId}/reward`,
                method: 'POST',
                body: {
                  userId: offerUser.id
                }
              });
              if (!rewardResult.ok) {
                setOfferError(rewardResult.data?.error || 'Failed to send reward.');
                return;
              }
            } else {
              const offerResult = await apiRequest({
                path: `/api/admin/ublasts/${ublastId}/offer`,
                method: 'POST',
                body: {
                  userId: offerUser.id,
                  priceDollars: Number(offerForm.priceCents) || 0,
                  currency: 'usd'
                }
              });
              if (!offerResult.ok) {
                setOfferError(offerResult.data?.error || 'Failed to send offer.');
                return;
              }
            }
            setIsOfferModalOpen(false);
          }}>
              Send
            </Button>
          </div>
          {offerError && <div className="text-sm text-red-400">{offerError}</div>}
        </div>
      </Modal>
    </div>;
}
