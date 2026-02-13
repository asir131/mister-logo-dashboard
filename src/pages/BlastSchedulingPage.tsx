import React, { useEffect, useState } from "react";
import { DataTable, Column } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Plus, Calendar, Edit, Trash2, Send } from "lucide-react";
import { apiRequest } from "../utils/apiClient";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchScheduling,
  fetchSchedulingUsers,
} from "../store/slices/schedulingSlice";
export function BlastSchedulingPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBlast, setAssignBlast] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBlast, setEditBlast] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    scheduledFor: "",
    media: null as File | null,
  });
  const dispatch = useAppDispatch();
  const {
    scheduledBlasts,
    proposedSubmissions,
    users,
    loading,
    error,
    blastsPage,
    blastsTotalPages,
    submissionsPage,
    submissionsTotalPages,
  } = useAppSelector((state) => state.scheduling);
  const [localBlastsPage, setLocalBlastsPage] = useState(1);
  const [localSubmissionsPage, setLocalSubmissionsPage] = useState(1);
  const blastsLimit = 10;
  const submissionsLimit = 10;
  const [form, setForm] = useState({
    title: "",
    content: "",
    scheduledFor: "",
    media: null as File | null,
  });
  const [assignForm, setAssignForm] = useState({
    userId: "",
    mode: "reward",
    priceCents: "",
  });

  useEffect(() => {
    dispatch(
      fetchScheduling({
        blastsPage: localBlastsPage,
        blastsLimit,
        submissionsPage: localSubmissionsPage,
        submissionsLimit,
      }),
    );
    dispatch(fetchSchedulingUsers());
  }, [dispatch, localBlastsPage, localSubmissionsPage]);

  async function handleCreateBlast() {
    const formData = new FormData();
    formData.append("title", form.title);
    if (form.content) formData.append("content", form.content);
    if (form.scheduledFor) formData.append("scheduledFor", form.scheduledFor);
    if (form.media) formData.append("media", form.media);

    const result = await apiRequest({
      path: "/api/admin/ublasts",
      method: "POST",
      body: formData,
    });
    if (result.ok) {
      setIsCreateModalOpen(false);
      setForm({ title: "", content: "", scheduledFor: "", media: null });
      dispatch(
        fetchScheduling({
          blastsPage: localBlastsPage,
          blastsLimit,
          submissionsPage: localSubmissionsPage,
          submissionsLimit,
        }),
      );
    }
  }

  async function handleRelease(ublastId: string) {
    const result = await apiRequest({
      path: `/api/admin/ublasts/${ublastId}/release`,
      method: "POST",
    });
    if (result.ok) {
      dispatch(
        fetchScheduling({
          blastsPage: localBlastsPage,
          blastsLimit,
          submissionsPage: localSubmissionsPage,
          submissionsLimit,
        }),
      );
    }
  }

  async function handleDelete(ublastId: string) {
    const result = await apiRequest({
      path: `/api/admin/ublasts/${ublastId}`,
      method: "DELETE",
    });
    if (result.ok) {
      dispatch(
        fetchScheduling({
          blastsPage: localBlastsPage,
          blastsLimit,
          submissionsPage: localSubmissionsPage,
          submissionsLimit,
        }),
      );
    }
  }

  async function handleUpdateBlast() {
    if (!editBlast?._id) return;
    const formData = new FormData();
    if (editForm.title !== undefined) formData.append("title", editForm.title);
    if (editForm.content !== undefined)
      formData.append("content", editForm.content);
    if (editForm.scheduledFor)
      formData.append("scheduledFor", editForm.scheduledFor);
    if (editForm.media) formData.append("media", editForm.media);

    const result = await apiRequest({
      path: `/api/admin/ublasts/${editBlast._id}`,
      method: "PATCH",
      body: formData,
    });
    if (result.ok) {
      setIsEditModalOpen(false);
      setEditBlast(null);
      dispatch(
        fetchScheduling({
          blastsPage: localBlastsPage,
          blastsLimit,
          submissionsPage: localSubmissionsPage,
          submissionsLimit,
        }),
      );
    }
  }

  const columns: Column<any>[] = [
    {
      key: "title",
      header: "Blast Title",
      render: (blast) => (
        <div className="flex items-center gap-3">
          {blast.mediaUrl && (
            <img
              src={blast.mediaUrl}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium text-text-primary">{blast.title}</p>
            <p className="text-xs text-text-secondary">
              {blast.mediaType || "Text"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      header: "Content",
      render: (blast) => (
        <p className="text-sm text-text-secondary truncate max-w-xs">
          {blast.content || "No content"}
        </p>
      ),
    },
    {
      key: "platforms",
      header: "Platforms",
      render: (blast) => (
        <div className="flex gap-1">
          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-text-secondary">
            All
          </span>
        </div>
      ),
    },
    {
      key: "scheduledFor",
      header: "Scheduled For",
      render: (blast) => (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {blast.scheduledFor
              ? new Date(blast.scheduledFor).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-xs text-text-secondary">
            {blast.scheduledFor
              ? new Date(blast.scheduledFor).toLocaleTimeString()
              : "--"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (blast) => <StatusBadge status={blast.status} />,
    },
  ];
  const submissionColumns: Column<any>[] = [
    {
      key: "title",
      header: "User UBlast",
      render: (submission) => (
        <div className="flex items-center gap-3">
          {submission.mediaUrl && (
            <img
              src={submission.mediaUrl}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium text-text-primary">
              {submission.title || "Untitled"}
            </p>
            <p className="text-xs text-text-secondary">
              {submission.userId?.name || "Unknown"} •{" "}
              {submission.userId?.email || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "proposedDate",
      header: "Proposed For",
      render: (submission) =>
        submission.proposedDate
          ? new Date(submission.proposedDate).toLocaleString()
          : "N/A",
    },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (submission) => new Date(submission.createdAt).toLocaleString(),
    },
  ];
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            UNAP Blast Scheduling
          </h1>
          <p className="text-text-secondary mt-1">
            Schedule and manage future UNAP Social Media Blasts.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
          Schedule New Blast
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary-gradient/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Automatic Delivery System
            </h3>
            <p className="text-sm text-text-secondary">
              Scheduled UNAP Blasts are automatically delivered to every user's
              account at the specified time. Users will have{" "}
              <strong className="text-text-primary">48 hours</strong> to share
              the blast across their platforms. The blast will remain in the{" "}
              <strong className="text-text-primary">
                Top Trending section for 24 hours
              </strong>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">
              Scheduled
            </h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {scheduledBlasts.filter((b) => b.status === "scheduled").length}
          </p>
        </div>
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">Sent</h3>
            <Send className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {scheduledBlasts.filter((b) => b.status === "released").length}
          </p>
        </div>
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-secondary">
              Next Blast
            </h3>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-text-primary">
            {scheduledBlasts.length > 0 && scheduledBlasts[0].scheduledFor
              ? new Date(scheduledBlasts[0].scheduledFor).toLocaleDateString()
              : "None scheduled"}
          </p>
        </div>
      </div>

      {/* Scheduled Blasts Table */}
      {loading && (
        <div className="text-text-secondary">Loading scheduled blasts...</div>
      )}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {!loading && (
        <DataTable
          data={scheduledBlasts}
          columns={columns}
          actions={(blast) => (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                title="Edit"
                disabled={!blast.isEditable}
                onClick={() => {
                  if (!blast.isEditable) return;
                  setEditBlast(blast);
                  setEditForm({
                    title: blast.title || "",
                    content: blast.content || "",
                    scheduledFor: blast.scheduledFor
                      ? new Date(blast.scheduledFor).toISOString().slice(0, 16)
                      : "",
                    media: null,
                  });
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                title="Delete"
                onClick={() => handleDelete(blast._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              {blast.status === "scheduled" && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Send Now"
                    onClick={() => handleRelease(blast._id)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        />
      )}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-text-secondary mt-3">
          <span>
            Page {blastsPage} of {blastsTotalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setLocalBlastsPage((prev) => Math.max(1, prev - 1))
              }
              disabled={blastsPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setLocalBlastsPage((prev) =>
                  Math.min(blastsTotalPages, prev + 1),
                )
              }
              disabled={blastsPage >= blastsTotalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Proposed User Blasts */}
      {!loading && (
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              User-Submitted Proposed Blasts
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                dispatch(
                  fetchScheduling({
                    blastsPage: localBlastsPage,
                    blastsLimit,
                    submissionsPage: localSubmissionsPage,
                    submissionsLimit,
                  }),
                )
              }
            >
              Refresh
            </Button>
          </div>
          {proposedSubmissions.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No pending submissions with proposed dates.
            </p>
          ) : (
            <DataTable
              data={proposedSubmissions}
              columns={submissionColumns}
              actions={(submission) => (
                <div className="text-xs text-text-secondary">
                  Status: {submission.status}
                </div>
              )}
            />
          )}
          {proposedSubmissions.length > 0 && (
            <div className="flex items-center justify-between text-sm text-text-secondary mt-3">
              <span>
                Page {submissionsPage} of {submissionsTotalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setLocalSubmissionsPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={submissionsPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setLocalSubmissionsPage((prev) =>
                      Math.min(submissionsTotalPages, prev + 1),
                    )
                  }
                  disabled={submissionsPage >= submissionsTotalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Blast Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule UNAP Social Media Blast"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Blast Title"
            placeholder="Enter blast title"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Content
            </label>
            <textarea
              className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]"
              placeholder="What's the message?"
              value={form.content}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  content: event.target.value,
                }))
              }
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Content Type"
              options={[
                {
                  value: "Text",
                  label: "Text",
                },
                {
                  value: "Image",
                  label: "Image",
                },
                {
                  value: "Video",
                  label: "Video",
                },
                {
                  value: "Audio",
                  label: "Audio",
                },
              ]}
            />
            <Input
              type="file"
              label="Media Attachment"
              className="pt-1.5"
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  media: event.target.files?.[0] || null,
                }))
              }
            />
          </div>

          <Input label="Hashtags" placeholder="#official #update" />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Schedule Date & Time"
              value={form.scheduledFor}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  scheduledFor: event.target.value,
                }))
              }
            />
            <Select
              label="Target Platforms"
              options={[
                {
                  value: "all",
                  label: "All Platforms",
                },
                {
                  value: "instagram",
                  label: "Instagram Only",
                },
                {
                  value: "tiktok",
                  label: "TikTok Only",
                },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button icon={Calendar} onClick={handleCreateBlast}>
              Schedule Blast
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit UNAP Blast"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Blast Title"
            placeholder="Enter blast title"
            value={editForm.title}
            onChange={(event) =>
              setEditForm((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Content
            </label>
            <textarea
              className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]"
              placeholder="What's the message?"
              value={editForm.content}
              onChange={(event) =>
                setEditForm((prev) => ({
                  ...prev,
                  content: event.target.value,
                }))
              }
            ></textarea>
          </div>

          <Input
            type="file"
            label="Media Attachment"
            className="pt-1.5"
            onChange={(event) =>
              setEditForm((prev) => ({
                ...prev,
                media: event.target.files?.[0] || null,
              }))
            }
          />

          <Input
            type="datetime-local"
            label="Schedule Date & Time"
            value={editForm.scheduledFor}
            onChange={(event) =>
              setEditForm((prev) => ({
                ...prev,
                scheduledFor: event.target.value,
              }))
            }
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button icon={Edit} onClick={handleUpdateBlast}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign UBlast to User"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-sm text-text-secondary">
            Blast:{" "}
            <span className="text-text-primary">
              {assignBlast?.title || "—"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={assignForm.mode === "reward" ? "primary" : "secondary"}
              onClick={() =>
                setAssignForm((prev) => ({
                  ...prev,
                  mode: "reward",
                }))
              }
            >
              Reward UBlast
            </Button>
            <Button
              variant={assignForm.mode === "offer" ? "primary" : "secondary"}
              onClick={() =>
                setAssignForm((prev) => ({
                  ...prev,
                  mode: "offer",
                }))
              }
            >
              Sell UBlast
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Select User
            </label>
            <select
              className="w-full bg-surface border border-slate-700 rounded-lg px-3 py-2 text-text-primary"
              value={assignForm.userId}
              onChange={(event) =>
                setAssignForm((prev) => ({
                  ...prev,
                  userId: event.target.value,
                }))
              }
            >
              <option value="">Select a user</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          {assignForm.mode === "offer" && (
            <Input
              label="Price (USD)"
              placeholder="5.00"
              value={assignForm.priceCents}
              onChange={(event) =>
                setAssignForm((prev) => ({
                  ...prev,
                  priceCents: event.target.value,
                }))
              }
            />
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!assignBlast?._id || !assignForm.userId) return;
                if (assignForm.mode === "reward") {
                  await apiRequest({
                    path: `/api/admin/ublasts/${assignBlast._id}/reward`,
                    method: "POST",
                    body: {
                      userId: assignForm.userId,
                    },
                  });
                } else {
                  await apiRequest({
                    path: `/api/admin/ublasts/${assignBlast._id}/offer`,
                    method: "POST",
                    body: {
                      userId: assignForm.userId,
                      priceDollars: Number(assignForm.priceCents) || 0,
                      currency: "usd",
                    },
                  });
                }
                setIsAssignModalOpen(false);
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
