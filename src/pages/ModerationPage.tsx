import React, { useEffect, useState } from "react";
import { DataTable, Column } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { ModerationAction } from "../types";
import { Shield, Trash2, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchModerationPosts,
  fetchModerationActions,
  fetchModerationUsers,
  restrictUser,
  unrestrictUser,
  deletePost,
  deleteUsersBulk,
  toggleSelectedUser,
  setSelectedUsers,
  clearSelectedUsers,
} from "../store/slices/moderationSlice";
export function ModerationPage() {
  const [activeTab, setActiveTab] = useState<"users" | "posts" | "history">(
    "users",
  );
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const {
    users,
    usersPage,
    usersTotalPages,
    posts,
    postsPage,
    postsTotalPages,
    actions,
    actionsPage,
    actionsTotalPages,
    selectedUserIds,
    loadingUsers: usersLoading,
    loadingPosts: postsLoading,
    loadingActions,
    errorUsers: usersError,
    errorPosts: postsError,
    errorActions,
  } = useAppSelector((state) => state.moderation);
  const usersLimit = 10;
  const postsLimit = 10;
  const actionsLimit = 10;
  const userColumns: Column<any>[] = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={users.length > 0 && selectedUserIds.length === users.length}
          onChange={(event) => {
            if (event.target.checked) {
              dispatch(setSelectedUsers(users.map((user: any) => user.id)));
            } else {
              dispatch(clearSelectedUsers());
            }
          }}
        />
      ),
      render: (user) => (
        <input
          type="checkbox"
          checked={selectedUserIds.includes(user.id)}
          onChange={(event) => {
            event.stopPropagation();
            dispatch(toggleSelectedUser(user.id));
          }}
        />
      ),
    },
    {
      key: "user",
      header: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-text-secondary">
              {user.name?.[0] || "U"}
            </div>
          )}
          <div>
            <p className="font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-secondary">{user.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: "ublast",
      header: "UBlast Block",
      render: (user) => (
        <StatusBadge status={user.ublastBlocked ? "Blocked" : "Active"} />
      ),
    },
    {
      key: "followers",
      header: "Followers",
      render: (user) => {
        const count = Number(user.followers) || 0;
        return count.toLocaleString();
      },
    },
    {
      key: "lastActivity",
      header: "Last Active",
    },
  ];
  const postColumns: Column<any>[] = [
    {
      key: "post",
      header: "Post",
      render: (post) => (
        <div className="flex items-center gap-3">
          {post.mediaUrl && (
            <img
              src={post.mediaUrl}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium text-text-primary">{post.user?.name}</p>
            <p className="text-sm text-text-secondary truncate max-w-xs">
              {post.content || ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (post) => <StatusBadge status={post.status} type="post" />,
    },
    {
      key: "stats",
      header: "Engagement",
      render: (post) => `${post.stats?.views?.toLocaleString?.() || 0} views`,
    },
  ];
  const historyColumns: Column<ModerationAction>[] = [
    {
      key: "action",
      header: "Action",
      render: (action) => (
        <div>
          <p className="font-medium text-text-primary capitalize">
            {action.type.replace("_", " ")}
          </p>
          <p className="text-xs text-text-secondary">{action.targetType}</p>
        </div>
      ),
    },
    {
      key: "target",
      header: "Target",
      render: (action) => (
        <p className="text-sm text-text-primary">
          {action.targetEmail || "-"}
        </p>
      ),
    },
    {
      key: "performedBy",
      header: "Performed By",
    },
    {
      key: "performedAt",
      header: "Date",
      render: (action) => new Date(action.performedAt).toLocaleString(),
    },
  ];
  const handleAction = (actionType: string) => {
    setSelectedAction(actionType);
    setIsActionModalOpen(true);
  };

  function loadUsers(page = 1) {
    dispatch(clearSelectedUsers());
    dispatch(fetchModerationUsers({ page, limit: usersLimit }));
  }

  async function updateUserRestriction(
    userId: string,
    action: "restrict" | "unrestrict",
  ) {
    if (action === "restrict") {
      dispatch(restrictUser({ userId }));
    } else {
      dispatch(unrestrictUser({ userId }));
    }
  }

  function loadPosts(page = 1) {
    dispatch(fetchModerationPosts({ page, limit: postsLimit }));
  }

  function loadActions(page = 1) {
    dispatch(fetchModerationActions({ page, limit: actionsLimit }));
  }

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers(usersPage);
    }
    if (activeTab === "posts") {
      loadPosts(postsPage);
    }
    if (activeTab === "history") {
      loadActions(actionsPage);
    }
  }, [activeTab, usersPage, postsPage, actionsPage]);
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Moderation Center
          </h1>
          <p className="text-text-secondary mt-1">
            Manage user accounts and content moderation.
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-yellow-500 mb-1">
            Moderation Actions Are Permanent
          </h3>
          <p className="text-sm text-text-secondary">
            All moderation actions are logged and cannot be undone. Please
            review carefully before taking action.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 border-b border-slate-700">
        {[
          {
            id: "users",
            label: "User Moderation",
            icon: Shield,
          },
          {
            id: "posts",
            label: "Post Moderation",
            icon: Shield,
          },
          {
            id: "history",
            label: "Action History",
            icon: Shield,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Moderation Tab */}
      {activeTab === "users" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={selectedUserIds.length === 0}
            >
              Delete User
            </Button>
          </div>
          {usersError && (
            <div className="text-sm text-red-400">{usersError}</div>
          )}
          {usersLoading && (
            <div className="text-sm text-text-secondary">Loading users...</div>
          )}
          <DataTable
            data={users}
            columns={userColumns}
            actions={(user) => (
              <div className="flex gap-2">
                {!user.ublastBlocked && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateUserRestriction(user.id, "restrict")}
                  >
                    Restrict
                  </Button>
                )}
                {user.ublastBlocked && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateUserRestriction(user.id, "unrestrict")}
                  >
                    Unrestrict
                  </Button>
                )}
              </div>
            )}
          />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Page {usersPage} of {usersTotalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadUsers(Math.max(1, usersPage - 1))}
                disabled={usersPage <= 1 || usersLoading}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  loadUsers(Math.min(usersTotalPages, usersPage + 1))
                }
                disabled={usersPage >= usersTotalPages || usersLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Post Moderation Tab */}
      {activeTab === "posts" && (
        <>
          {postsError && (
            <div className="text-sm text-red-400">{postsError}</div>
          )}
          {postsLoading && (
            <div className="text-sm text-text-secondary">Loading posts...</div>
          )}
          <DataTable
            data={posts}
            columns={postColumns}
            actions={(post) => (
              <div className="flex gap-2">
                {post.status === "Active" && (
                  null
                )}
                {post.status === "Removed" && (
                  <Button variant="secondary" size="sm">
                    Restore
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setIsDeletePostModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Page {postsPage} of {postsTotalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadPosts(Math.max(1, postsPage - 1))}
                disabled={postsPage <= 1 || postsLoading}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  loadPosts(Math.min(postsTotalPages, postsPage + 1))
                }
                disabled={postsPage >= postsTotalPages || postsLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Action History Tab */}
      {activeTab === "history" && (
        <>
          {errorActions && (
            <div className="text-sm text-red-400">{errorActions}</div>
          )}
          {loadingActions && (
            <div className="text-sm text-text-secondary">
              Loading actions...
            </div>
          )}
          <DataTable data={actions} columns={historyColumns} />
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Page {actionsPage} of {actionsTotalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadActions(Math.max(1, actionsPage - 1))}
                disabled={actionsPage <= 1 || loadingActions}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  loadActions(Math.min(actionsTotalPages, actionsPage + 1))
                }
                disabled={actionsPage >= actionsTotalPages || loadingActions}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`Confirm ${selectedAction.replace("_", " ").toUpperCase()}`}
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-error-bg border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-error-text">
              This action will be logged and may have permanent consequences.
              Please provide a reason.
            </p>
          </div>

          <Input label="Reason for Action" placeholder="Enter reason..." />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
              placeholder="Add any additional context..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger">Confirm Action</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Users"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-error-bg border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-error-text">
              This will permanently delete {selectedUserIds.length} users and
              related data.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await dispatch(deleteUsersBulk({ userIds: selectedUserIds }));
                setIsDeleteModalOpen(false);
              }}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeletePostModalOpen}
        onClose={() => setIsDeletePostModalOpen(false)}
        title="Confirm Delete Post"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-error-bg border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-error-text">
              This will permanently delete the post and related data.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="ghost"
              onClick={() => setIsDeletePostModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (selectedPostId) {
                  await dispatch(deletePost({ postId: selectedPostId }));
                }
                setIsDeletePostModalOpen(false);
                setSelectedPostId(null);
              }}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
