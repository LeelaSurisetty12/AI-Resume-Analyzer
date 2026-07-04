import { useState, useEffect } from "react";
import { UserCircle2, Loader2, Save, Mail, Calendar } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";

function Profile() {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me?user_id=${user?.uid || "anonymous"}&email=${encodeURIComponent(user?.email || "Unknown")}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setFullName(data.full_name || "");
          setTargetRole(data.target_role || "");
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.uid || "anonymous",
          email: user?.email || "Unknown",
          full_name: fullName || null,
          target_role: targetRole || null
        }),
      });

      if (response.ok) {
        setSaveMessage("Profile updated successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("Failed to update profile.");
      }
    } catch (e) {
      setSaveMessage("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-pink-500/10 rounded-lg">
          <UserCircle2 className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400">Manage your personal information and career goals.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Read-only Account Info */}
        <Card className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white mb-2">Account Information</h2>
          
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Email Address</p>
              <p className="font-medium">{profileData?.email || user?.email || "Unknown"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Member Since</p>
              <p className="font-medium">
                {profileData?.created_at 
                  ? new Date(profileData.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                  : "Unknown"
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Editable Profile Form */}
        <form onSubmit={handleSave}>
          <Card className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Personalization</h2>
              <p className="text-sm text-gray-400 mb-4">Set these details to help tailor your AI analysis in the future.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="e.g. Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Primary Target Role</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="e.g. Senior Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500">We'll use this to weigh your resume score more accurately in the future.</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <p className={`text-sm ${saveMessage.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                {saveMessage}
              </p>
              
              <Button 
                type="submit" 
                className="py-2.5 px-6 rounded-xl flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default Profile;
