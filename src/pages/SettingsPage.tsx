import React, { useEffect, useState, useCallback } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { apiRequest } from "../utils/apiClient";
import { Bell, Shield, Lock, Globe, User } from "lucide-react";
export function SettingsPage() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState("admin");
  const [shareWindowHours, setShareWindowHours] = useState("48");
  const [topTrendingHours, setTopTrendingHours] = useState("24");
  const [restrictionDays, setRestrictionDays] = useState("3");
  const [warningGraceHours, setWarningGraceHours] = useState("4");
  const [settingsStatus, setSettingsStatus] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminCreateStatus, setAdminCreateStatus] = useState("");
  const [adminToast, setAdminToast] = useState("");
  const [admins, setAdmins] = useState([]);
  const [adminsPage, setAdminsPage] = useState(1);
  const [adminsTotalPages, setAdminsTotalPages] = useState(1);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetAdminId, setResetAdminId] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      const result = await apiRequest({ path: "/api/admin/settings" });
      if (!mounted) return;
      if (result.ok) {
        setAdminEmail(result.data?.email || "");
        setAdminRole(result.data?.role || "admin");
        setShareWindowHours(String(result.data?.shareWindowHours ?? 48));
        setTopTrendingHours(String(result.data?.topTrendingHours ?? 24));
        setRestrictionDays(String(result.data?.restrictionDays ?? 3));
        setWarningGraceHours(String(result.data?.warningGraceHours ?? 4));
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const loadAdmins = useCallback(async () => {
    setAdminsLoading(true);
    const result = await apiRequest({
      path: `/api/admin/settings/admins?page=${adminsPage}&limit=5&role=admin`,
    });
    setAdminsLoading(false);
    if (result.ok) {
      setAdmins(result.data?.admins || []);
      setAdminsTotalPages(result.data?.totalPages || 1);
    }
  }, [adminsPage]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!mounted) return;
      await loadAdmins();
    }
    run();
    return () => {
      mounted = false;
    };
  }, [loadAdmins]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
      </div>

      {/* Admin Profile */}
      <section className="bg-surface border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Admin Profile
        </h2>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-800 flex items-center justify-center">
            <User className="w-10 h-10 text-text-secondary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <Input label="Email Address" value={adminEmail} disabled />
            <Input
              label="Role"
              value={adminRole === "super" ? "Super Admin" : "Admin"}
              disabled
            />
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => setPasswordOpen(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </section>

      {/* App Rules */}
      <section className="bg-surface border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          App Rules & Restrictions
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <h3 className="font-medium text-text-primary">
                24-Hour Share Rule
              </h3>
              <p className="text-sm text-text-secondary">
                Require users to share official posts within 24 hours.
              </p>
            </div>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Share Window (Hours)"
              type="number"
              value={shareWindowHours}
              onChange={(event) => setShareWindowHours(event.target.value)}
              helper="Time users have to share UNAP Blast"
            />
            <Input
              label="Top Trending Duration (Hours)"
              type="number"
              value={topTrendingHours}
              onChange={(event) => setTopTrendingHours(event.target.value)}
              helper="How long blast stays in top trending"
            />
            <Input
              label="Restriction Duration (Days)"
              type="number"
              value={restrictionDays}
              onChange={(event) => setRestrictionDays(event.target.value)}
              helper="Account restriction period for non-compliance"
            />
          </div>
          {settingsStatus && (
            <div className="text-sm text-text-secondary">{settingsStatus}</div>
          )}
        </div>
      </section>

      <section className="bg-surface border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Admin Management
        </h2>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-secondary">
            Create normal admins who can access the dashboard.
          </p>
          <Button onClick={() => setAdminModalOpen(true)}>Create Admin</Button>
        </div>
        {adminsLoading && (
          <div className="text-sm text-text-secondary">Loading admins...</div>
        )}
        <div className="space-y-3">
          {admins.map((admin: any) => (
            <div
              key={admin._id || admin.id}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div>
                <div className="text-sm text-text-primary">
                  {admin.username}
                </div>
                <div className="text-xs text-text-secondary">{admin.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Admin</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setResetAdminId(admin._id || admin.id);
                    setResetPassword("");
                    setResetStatus("");
                    setResetModalOpen(true);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    const result = await apiRequest({
                      path: `/api/admin/settings/admins/${admin._id || admin.id}`,
                      method: "DELETE",
                    });
                    if (result.ok) {
                      setAdmins((prev) =>
                        prev.filter(
                          (item: any) =>
                            (item._id || item.id) !== (admin._id || admin.id),
                        ),
                      );
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary mt-4">
          <span>
            Page {adminsPage} of {adminsTotalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAdminsPage(Math.max(1, adminsPage - 1))}
              disabled={adminsPage <= 1}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setAdminsPage(Math.min(adminsTotalPages, adminsPage + 1))
              }
              disabled={adminsPage >= adminsTotalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Change Password"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {passwordStatus && (
            <div className="text-sm text-text-secondary">{passwordStatus}</div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setPasswordOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setPasswordStatus("");
                if (!newPassword.trim() || !confirmPassword.trim()) {
                  setPasswordStatus(
                    "New password and confirm password are required.",
                  );
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setPasswordStatus("Passwords do not match.");
                  return;
                }
                setPasswordSaving(true);
                const result = await apiRequest({
                  path: "/api/admin/settings/password",
                  method: "PATCH",
                  body: {
                    newPassword,
                    confirmPassword,
                  },
                });
                setPasswordSaving(false);
                if (!result.ok) {
                  setPasswordStatus(
                    result.data?.error || "Failed to update password.",
                  );
                  return;
                }
                setPasswordStatus("Password updated.");
                setNewPassword("");
                setConfirmPassword("");
              }}
              disabled={passwordSaving}
            >
              {passwordSaving ? "Saving..." : "Update Password"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        title="Create Admin"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Username
            </label>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-surface border border-slate-700 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="username"
                value={newAdminId}
                onChange={(event) => setNewAdminId(event.target.value)}
              />
              <span className="text-sm text-text-secondary">@admin.com</span>
            </div>
          </div>
          <Input
            label="Password"
            type="password"
            value={newAdminPassword}
            onChange={(event) => setNewAdminPassword(event.target.value)}
          />
          {adminCreateStatus && (
            <div className="text-sm text-text-secondary">
              {adminCreateStatus}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setAdminModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setAdminCreateStatus("");
                if (!newAdminId.trim() || !newAdminPassword.trim()) {
                  setAdminCreateStatus("Admin ID and password are required.");
                  return;
                }
                const result = await apiRequest({
                  path: "/api/admin/settings/admins",
                  method: "POST",
                  body: {
                    adminId: newAdminId.trim(),
                    password: newAdminPassword.trim(),
                  },
                });
                if (!result.ok) {
                  setAdminCreateStatus(
                    result.data?.error || "Failed to create admin.",
                  );
                  return;
                }
                setAdminModalOpen(false);
                setAdminCreateStatus("");
                setNewAdminId("");
                setNewAdminPassword("");
                if (adminsPage !== 1) {
                  setAdminsPage(1);
                } else {
                  await loadAdmins();
                }
                setAdminToast("Admin created.");
                setTimeout(() => setAdminToast(""), 3000);
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Admin Password"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={resetPassword}
            onChange={(event) => setResetPassword(event.target.value)}
          />
          {resetStatus && (
            <div className="text-sm text-text-secondary">{resetStatus}</div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setResetStatus("");
                if (!resetPassword.trim() || !resetAdminId) {
                  setResetStatus("New password is required.");
                  return;
                }
                const result = await apiRequest({
                  path: `/api/admin/settings/admins/${resetAdminId}/password`,
                  method: "PATCH",
                  body: { newPassword: resetPassword.trim() },
                });
                if (!result.ok) {
                  setResetStatus(
                    result.data?.error || "Failed to reset password.",
                  );
                  return;
                }
                setResetStatus("Password reset.");
                setResetPassword("");
              }}
            >
              Reset Password
            </Button>
          </div>
        </div>
      </Modal>
      {adminToast && <div className="toast">{adminToast}</div>}
    </div>
  );
}
