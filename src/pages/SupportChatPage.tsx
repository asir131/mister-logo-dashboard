import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/apiClient";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Mail, Phone, Trash2 } from "lucide-react";

type ThreadItem = {
  id: string;
  userId: string;
  status: "pending" | "solved";
  lastMessageAt: string;
  lastSubject: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    avatar: string;
    linkedPlatforms: string[];
    linkedAccounts: any[];
    totalPosts: number;
    followers: number;
    ublastBlocked: boolean;
  };
};

export function SupportChatPage() {
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [threadsPage, setThreadsPage] = useState(1);
  const [threadsTotalPages, setThreadsTotalPages] = useState(1);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState("");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotalPages, setMessagesTotalPages] = useState(1);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [clearLoading, setClearLoading] = useState(false);
  const [clearMessage, setClearMessage] = useState("");
  const limit = 20;

  useEffect(() => {
    let mounted = true;
    async function loadThreads() {
      setThreadsLoading(true);
      setThreadsError("");
      const result = await apiRequest({
        path: `/api/admin/support/threads?page=${threadsPage}&limit=${limit}`,
      });
      if (!mounted) return;
      setThreadsLoading(false);
      if (!result.ok) {
        setThreadsError(
          result.data?.error || "Failed to load support threads.",
        );
        return;
      }
      const nextThreads = Array.isArray(result.data?.threads)
        ? result.data.threads
        : [];
      setThreads(nextThreads);
      setThreadsTotalPages(Number(result.data?.totalPages || 1));
      if (nextThreads.length && !activeThreadId) {
        setActiveThreadId(nextThreads[0].id);
      }
    }
    loadThreads();
    return () => {
      mounted = false;
    };
  }, [threadsPage]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) || null,
    [threads, activeThreadId],
  );

  useEffect(() => {
    if (!activeThreadId) return;
    let mounted = true;
    async function loadMessages() {
      setMessagesLoading(true);
      setMessagesError("");
      const result = await apiRequest({
        path: `/api/admin/support/threads/${activeThreadId}/messages?page=${messagesPage}&limit=30`,
      });
      if (!mounted) return;
      setMessagesLoading(false);
      if (!result.ok) {
        setMessagesError(result.data?.error || "Failed to load messages.");
        return;
      }
      setMessages(
        Array.isArray(result.data?.messages) ? result.data.messages : [],
      );
      setMessagesTotalPages(Number(result.data?.totalPages || 1));
    }
    loadMessages();
    return () => {
      mounted = false;
    };
  }, [activeThreadId, messagesPage]);

  async function handleStatusChange(value: string) {
    if (!activeThreadId) return;
    setStatusSaving(true);
    setStatusError("");
    const result = await apiRequest({
      path: `/api/admin/support/threads/${activeThreadId}/status`,
      method: "PATCH",
      body: { status: value },
    });
    setStatusSaving(false);
    if (!result.ok) {
      setStatusError(result.data?.error || "Failed to update status.");
      return;
    }
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThreadId
          ? { ...thread, status: value as any }
          : thread,
      ),
    );
  }

  async function handleClearLinkedAccounts() {
    if (!activeThread?.user?.id) return;
    setClearLoading(true);
    setClearMessage("");
    const result = await apiRequest({
      path: `/api/admin/users/${activeThread.user.id}/linked-accounts`,
      method: "DELETE",
    });
    setClearLoading(false);
    if (!result.ok) {
      setClearMessage(
        result.data?.error || "Failed to remove linked accounts.",
      );
      return;
    }
    setClearMessage("Linked accounts removed.");
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              user: { ...thread.user, linkedPlatforms: [], linkedAccounts: [] },
            }
          : thread,
      ),
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-surface border border-slate-700 rounded-xl overflow-hidden flex fade-in">
      <div className="flex flex-col h-full bg-surface border-r border-slate-700 w-80">
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold text-text-primary">Support Messages</h2>
          <p className="text-xs text-text-secondary">
            {threadsLoading ? "Loading..." : `${threads.length} users`}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => {
                setActiveThreadId(thread.id);
                setMessagesPage(1);
              }}
              className={`
                w-full p-4 flex items-start gap-3 border-b border-slate-800 transition-colors text-left
                ${activeThreadId === thread.id ? "bg-slate-800/50" : "hover:bg-slate-800/30"}
              `}
            >
              <div className="relative">
                {thread.user.avatar ? (
                  <img
                    src={thread.user.avatar}
                    alt={thread.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-text-secondary">
                    {thread.user.name?.[0] || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-text-primary truncate">
                    {thread.user.name}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {new Date(thread.lastMessageAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm truncate text-text-secondary">
                  {thread.lastSubject || "Support message"}
                </p>
                <span
                  className={`mt-2 inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    thread.status === "solved"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {thread.status === "solved" ? "Solved" : "Pending"}
                </span>
              </div>
            </button>
          ))}
          {threadsError && (
            <div className="p-4 text-sm text-red-400">{threadsError}</div>
          )}
        </div>
        <div className="p-3 border-t border-slate-700 flex items-center justify-between text-xs text-text-secondary">
          <span>
            Page {threadsPage} of {threadsTotalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setThreadsPage(Math.max(1, threadsPage - 1))}
              disabled={threadsPage <= 1}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setThreadsPage(Math.min(threadsTotalPages, threadsPage + 1))
              }
              disabled={threadsPage >= threadsTotalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-background-start/30">
        <div className="p-4 border-b border-slate-700 bg-surface flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">
              {activeThread?.user?.name || "Select a user"}
            </h3>
            <span className="text-xs text-text-secondary">
              {activeThread?.user?.username
                ? `@${activeThread.user.username}`
                : ""}
            </span>
          </div>
          {activeThread && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                activeThread.status === "solved"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}
            >
              {activeThread.status === "solved" ? "Solved" : "Pending"}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!activeThread && (
            <div className="text-text-secondary">Select a conversation.</div>
          )}
          {activeThread &&
            messages.map((msg) => (
              <div key={msg._id} className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-surface border border-slate-700 text-text-primary rounded-bl-none">
                  {msg.subject && (
                    <div className="text-xs text-text-secondary mb-1">
                      {msg.subject}
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-[10px] mt-1 block text-text-secondary">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          {messagesLoading && (
            <div className="text-sm text-text-secondary">
              Loading messages...
            </div>
          )}
          {messagesError && (
            <div className="text-sm text-red-400">{messagesError}</div>
          )}
        </div>
        {activeThread && (
          <div className="p-4 border-t border-slate-700 bg-surface flex items-center justify-between text-xs text-text-secondary">
            <span>
              Page {messagesPage} of {messagesTotalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMessagesPage(Math.max(1, messagesPage - 1))}
                disabled={messagesPage <= 1}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setMessagesPage(
                    Math.min(messagesTotalPages, messagesPage + 1),
                  )
                }
                disabled={messagesPage >= messagesTotalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="w-72 bg-surface border-l border-slate-700 p-6 hidden xl:block overflow-y-auto">
        {!activeThread && (
          <div className="text-text-secondary">Select a user.</div>
        )}
        {activeThread && (
          <div className="space-y-6">
            <div className="text-center">
              {activeThread.user.avatar ? (
                <img
                  src={activeThread.user.avatar}
                  alt={activeThread.user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-slate-800"
                />
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-slate-800 bg-slate-700 flex items-center justify-center text-text-secondary">
                  {activeThread.user.name?.[0] || "U"}
                </div>
              )}
              <h3 className="text-lg font-bold text-text-primary">
                {activeThread.user.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {activeThread.user.username
                  ? `@${activeThread.user.username}`
                  : ""}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">
                Issue Status
              </label>
              <Select
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "solved", label: "Solved" },
                ]}
                value={activeThread.status}
                onChange={(event) => handleStatusChange(event.target.value)}
                disabled={statusSaving}
              />
              {statusError && (
                <div className="text-xs text-red-400 mt-2">{statusError}</div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">
                Contact Info
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">
                    {activeThread.user.email || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Phone className="w-4 h-4" />
                  <span>{activeThread.user.phone || "-"}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-lg font-bold text-text-primary">
                    {activeThread.user.totalPosts}
                  </p>
                  <p className="text-xs text-text-secondary">Posts</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-lg font-bold text-text-primary">
                    {activeThread.user.followers}
                  </p>
                  <p className="text-xs text-text-secondary">Followers</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-text-secondary">
                UBlast Status:{" "}
                {activeThread.user.ublastBlocked ? "Restricted" : "Active"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
