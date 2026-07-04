import { useState } from "react";
import { Settings as SettingsIcon, LogOut, Bell, Shield, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Settings() {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-500/10 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and application settings.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Preferences */}
        <Card className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Moon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">Dark Mode</p>
                  <p className="text-xs text-gray-500">Currently locked to dark mode for best experience</p>
                </div>
              </div>
              <button 
                className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-emerald-500' : 'bg-gray-700'}`}
                onClick={() => {}}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive alerts when analyses complete</p>
                </div>
              </div>
              <button 
                className={`w-11 h-6 rounded-full transition-colors relative ${emailNotifications ? 'bg-emerald-500' : 'bg-gray-700'}`}
                onClick={() => setEmailNotifications(!emailNotifications)}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">Weekly Reports</p>
                  <p className="text-xs text-gray-500">Get a weekly summary of your profile's performance</p>
                </div>
              </div>
              <button 
                className={`w-11 h-6 rounded-full transition-colors relative ${weeklyReports ? 'bg-emerald-500' : 'bg-gray-700'}`}
                onClick={() => setWeeklyReports(!weeklyReports)}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${weeklyReports ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="flex flex-col gap-4 border-red-500/20">
          <h2 className="text-lg font-semibold text-white mb-2">Account Actions</h2>
          <p className="text-sm text-gray-400 mb-4">You can safely log out of your session here.</p>
          
          <div>
            <Button 
              variant="outline"
              className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
