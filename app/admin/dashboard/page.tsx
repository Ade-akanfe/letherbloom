"use client";

import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";


function AdminDashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // Detailed loading states
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const [admin, setAdmin] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [addingEmails, setAddingEmails] = useState<string[]>([""]);
    const [removeEmails, setRemoveEmails] = useState<string[]>([]);
    const [purchaseSeatCount, setPurchaseSeatCount] = useState(1);
    const [message, setMessage] = useState("");

    const addEmailField = () => {
        setAddingEmails([...addingEmails, ""]);
    };

    const removeEmailField = (index: number) => {
        setAddingEmails(addingEmails.filter((_, i) => i !== index));
    };

    const updateAddEmail = (index: number, value: string) => {
        const updated = [...addingEmails];
        updated[index] = value;
        setAddingEmails(updated);
    };

    // Function to fetch fresh admin data from server
    const refreshAdminData = async (organizationId: string, email: string) => {
        try {
            // We can reuse the login endpoint or create a 'me' endpoint. 
            // For simplicity and reusing existing logic without new endpoints, we'll assume the session verification
            // should ideally happen via a dedicated route. However, to refresh 'max_seats', we need to fetch org details.
            // Let's use the 'list' endpoint which returns member count, but maybe not max_seats explicitly if not added?
            // Actually, we need to re-fetch the admin object. 
            // A secure way is to call login with stored credentials? No, we don't have password.
            // We should trust the client session for ID but verify/refresh data.
            // Let's create a partial fetch or just update the max_seats by fetching organization public info if possible? No.
            // Best pattern: A '/api/organizations/me' endpoint using the admin ID/Email.
            // But since I can't easily add new endpoints without context switch, I will try to use `handleLogin` logic
            // but I can't without password.
            // Wait, I can try to fetch the organization details if I have the ID.
            // Accessing 'organizations' table via Supabase client client-side is restricted usually.
            // Let's assume for now we rely on the localStorage, BUT update it if we can.
            // Actually, 'purchase-seats' success should trigger a refresh.
            // Let's just create a simple 'refresh' action if possible or rely on the previous 'login' response structure.
            // Temporarily, let's trust we can fetch members.

            // To update 'max_seats' (which is inside admin.organization), we really need to re-fetch that data.
            // Ideally, we move `max_seats` to a separate fetch or use a new endpoint.
            // I'll create a lightweight function to fetch organization details if possible.
            // Or I can add a `get-organization` route.
            // Let's stick to what we have:
            // Since we can't easily refresh specific org data without auth, and we are using client-side "auth" (insecure for this demo but functional),
            // we will fetch members. 

            // Wait, the user specifically complained data is not updated.
            // I MUST fetch fresh data. I will modify `loadMembers` to also return organization details including max_seats?
            // Yes, let's modify `loadMembers` API to return org details.
            loadMembers(organizationId, email); // This loads members.

            // We need to update `admin.organization.max_seats`.
            // I will update the `loadMembers` function below to handle this side-effect if I modify the API.
        } catch (err) {
            console.error(err);
        }
    };

    // Check session on mount
    useEffect(() => {
        const initSession = async () => {
            setIsCheckingSession(true);
            const storedSession = localStorage.getItem("adminSession");

            if (storedSession) {
                try {
                    const session = JSON.parse(storedSession);
                    if (session && session.email && session.organizationId) {
                        setAdmin(session);
                        setIsLoggedIn(true);
                        // Refresh data from server to ensure it's up to date (e.g. seats)
                        await loadMembers(session.organizationId, session.email);
                    }
                } catch (e) {
                    console.error("Session parse error", e);
                    localStorage.removeItem("adminSession");
                }
            }
            setIsCheckingSession(false);
        };

        initSession();
    }, []);

    // Handle payment return
    useEffect(() => {
        if (sessionId && isLoggedIn && admin) { // Ensure we are logged in before handling success fully
            setMessage("Payment successful! Seats have been updated.");
            // Refresh data to show new seats
            loadMembers(admin.organizationId, admin.email);
            // Clean URL
            router.replace("/admin/dashboard");
        }
    }, [sessionId, isLoggedIn, admin]); // Depend on admin being loaded

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError("");

        try {
            const res = await fetch("/api/organizations/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            setAdmin(data.admin);
            setIsLoggedIn(true);
            localStorage.setItem("adminSession", JSON.stringify(data.admin));

            loadMembers(data.admin.organizationId, loginEmail);
        } catch (err: any) {
            setLoginError(err.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminSession");
        setAdmin(null);
        setIsLoggedIn(false);
        setMembers([]);
        setMessage("");
        // No loading state needed for logout really, instantaneous
    };

    const loadMembers = async (orgId: string, adminEmail: string) => {
        try {
            const res = await fetch("/api/organizations/members/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organizationId: orgId,
                    adminEmail: adminEmail,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMembers(data.members || []);

                // If the API returns updated organization info, update local state
                if (data.organization) {
                    setAdmin((prev: any) => {
                        const newAdmin = { ...prev, organization: data.organization };
                        // Update local storage to persist the new seat count
                        localStorage.setItem("adminSession", JSON.stringify(newAdmin));
                        return newAdmin;
                    });
                }
            }
        } catch (err) {
            console.error("Failed to load members:", err);
        }
    };

    const handleAddMembers = async () => {
        // Filter out empty emails
        const emailList = addingEmails.filter((e) => e.trim());

        if (emailList.length === 0) return;

        setIsAddingMember(true);
        setMessage("");

        try {
            const res = await fetch("/api/organizations/members/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organizationId: admin.organizationId,
                    adminEmail: admin.email,
                    emails: emailList,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to add members");

            setMessage(`Successfully added ${data.addedCount} member(s).`);
            setAddingEmails([""]); // Reset loop
            loadMembers(admin.organizationId, admin.email);
        } catch (err: any) {
            setMessage("Error: " + err.message);
        } finally {
            setIsAddingMember(false);
        }
    };

    const handleRemoveMembers = async () => {
        if (removeEmails.length === 0) return;

        setIsRemovingMember(true);
        setMessage("");

        try {
            const res = await fetch("/api/organizations/members/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organizationId: admin.organizationId,
                    adminEmail: admin.email,
                    emails: removeEmails,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to remove members");

            toast.success(`Successfully removed ${data.removedCount} member(s)`);
            setRemoveEmails([]);
            loadMembers(admin.organizationId, admin.email);
        } catch (err: any) {
            toast.error("Error: " + err.message);
        } finally {
            setIsRemovingMember(false);
        }
    };

    const handlePurchaseSeats = async () => {
        if (purchaseSeatCount < 1) return;

        setIsPurchasing(true); // Separate loading state
        setMessage("");

        try {
            const res = await fetch("/api/organizations/purchase-seats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organizationId: admin.organizationId,
                    adminEmail: admin.email,
                    additionalSeats: purchaseSeatCount,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to initiate purchase");

            if (data.url) {
                window.location.href = data.url;
            } else {
                setMessage("Error: No checkout URL returned");
            }
        } catch (err: any) {
            setMessage("Error: " + err.message);
        } finally {
            // Note: If redirecting, this might not run or matter, but good practice
            setIsPurchasing(false);
        }
    };

    const toggleRemoveEmail = (email: string) => {
        if (removeEmails.includes(email)) {
            setRemoveEmails(removeEmails.filter((e) => e !== email));
        } else {
            setRemoveEmails([...removeEmails, email]);
        }
    };

    // Initial Loading State to prevent flash
    if (isCheckingSession) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent mx-auto mb-4" />
                    <p className="text-zinc-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="bg-white min-h-screen">
                <Navigation />
                <main className="max-w-md mx-auto px-4 py-16">
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl p-8">
                        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Admin Login</h1>
                        <p className="text-zinc-600 mb-8">Access your organization dashboard</p>

                        {message && (
                            <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-600">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>
                            {loginError && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{loginError}</div>}
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full rounded-xl bg-rose-600 px-6 py-3 font-bold text-white hover:bg-rose-700 transition disabled:opacity-50"
                            >
                                {isLoggingIn ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <Navigation />
            <main className="max-w-6xl mx-auto px-4 py-16">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-zinc-900 mb-2">
                            {admin.organization.name}
                        </h1>
                        <p className="text-zinc-600">Organization Dashboard</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Organization Info */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-zinc-200 p-6">
                        <h3 className="text-sm font-semibold text-zinc-500 mb-2">
                            Organization Code
                        </h3>
                        <p className="text-2xl font-bold text-rose-600">
                            {admin.organization.code}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-zinc-200 p-6">
                        <h3 className="text-sm font-semibold text-zinc-500 mb-2">
                            Seats Used
                        </h3>
                        <p className="text-2xl font-bold text-zinc-900">
                            {members.length} / {admin.organization.max_seats}
                        </p>
                        <div className="mt-2 w-full bg-zinc-100 rounded-full h-2">
                            <div
                                className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        (members.length / admin.organization.max_seats) * 100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-zinc-200 p-6">
                        <h3 className="text-sm font-semibold text-zinc-500 mb-2">
                            Subscription Status
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-green-600">
                                {admin.organization.is_active ? "Active" : "Inactive"}
                            </p>
                            {admin.organization.is_active && (
                                <span className="text-sm text-zinc-500">
                                    • {Math.max(0, Math.ceil((new Date(admin.organization.subscription_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
                        {message}
                    </div>
                )}

                {/* Purchase Seats */}
                <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                        Purchase Additional Seats
                    </h2>
                    <p className="text-sm text-zinc-600 mb-4">
                        Need more capacity? Purchase additional member seats instantly.
                    </p>

                    <div className="flex items-end gap-4 max-w-md">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Number of Seats
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={purchaseSeatCount}
                                onChange={(e) => setPurchaseSeatCount(parseInt(e.target.value) || 1)}
                                className="w-full rounded-lg border border-zinc-200 px-4 py-2 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                            />
                        </div>
                        <button
                            onClick={handlePurchaseSeats}
                            disabled={isPurchasing}
                            className="rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50 h-full"
                        >
                            {isPurchasing ? "Processing..." : "Purchase Seats"}
                        </button>
                    </div>
                </div>

                {/* Add Members */}
                <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-zinc-900">
                            Add Members
                        </h2>
                        <button
                            type="button"
                            onClick={addEmailField}
                            className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                        >
                            + Add Member
                        </button>
                    </div>
                    <p className="text-sm text-zinc-600 mb-4">
                        Enter email addresses to invite new members
                    </p>

                    <div className="space-y-3 mb-6">
                        {addingEmails.map((email, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => updateAddEmail(index, e.target.value)}
                                    placeholder="member@company.com"
                                    className="flex-1 rounded-lg border border-zinc-200 px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                                {addingEmails.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeEmailField(index)}
                                        className="px-4 py-2 text-zinc-400 hover:text-red-600"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleAddMembers}
                        disabled={isAddingMember || addingEmails.every(e => !e.trim())}
                        className="rounded-lg bg-rose-600 px-6 py-2 font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50"
                    >
                        {isAddingMember ? "Adding..." : "Add Members"}
                    </button>
                </div>

                {/* Members List */}
                <div className="bg-white rounded-xl border border-zinc-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-zinc-900">
                            Current Members
                        </h2>
                        {removeEmails.length > 0 && (
                            <button
                                onClick={handleRemoveMembers}
                                disabled={isRemovingMember}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {isRemovingMember ? "Removing..." : `Remove Selected (${removeEmails.length})`}
                            </button>
                        )}
                    </div>

                    {members.length === 0 ? (
                        <p className="text-zinc-500 text-center py-8">
                            No members added yet
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-zinc-100 hover:bg-zinc-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={removeEmails.includes(member.email)}
                                            onChange={() => toggleRemoveEmail(member.email)}
                                            className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                                        />
                                        <div>
                                            <p className="font-medium text-zinc-900">
                                                {member.email}
                                            </p>
                                            <p className="text-sm text-zinc-500">
                                                Added {new Date(member.added_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminDashboardContent />
        </Suspense>
    );
}
