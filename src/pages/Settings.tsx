import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Download,
  Trash2,
  Moon,
  Sun,
  Volume2,
  Mail,
  Smartphone,
  LogOut,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => {
      navigate("/auth");
    }, 500);
  };

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: true,
  });

  const [preferences, setPreferences] = useState({
    currency: "UGX",
    dateFormat: "DD/MM/YYYY",
    theme: "dark",
    language: "en",
  });

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
  });

  return (
    <AppLayout>
      <div className="min-h-screen p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
                <SettingsIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your account and preferences
            </p>
          </div>
        </motion.header>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <Button variant="outline" className="border-border hover:border-primary/50">
                  Change Photo
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-muted/30 border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-10 bg-muted/30 border-border"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10 bg-muted/30 border-border"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => {
                    toast({
                      title: "Profile updated",
                      description: "Your profile information has been saved successfully.",
                    });
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Notification Preferences
                </h3>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium text-foreground">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium text-foreground">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium text-foreground">SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive SMS alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Budget Alerts</Label>
                    <p className="text-xs text-muted-foreground">Alert when approaching budget limits</p>
                  </div>
                  <Switch
                    checked={notifications.budgetAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, budgetAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Goal Reminders</Label>
                    <p className="text-xs text-muted-foreground">Reminders for goal deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.goalReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, goalReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Weekly Reports</Label>
                    <p className="text-xs text-muted-foreground">Weekly financial summary</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReports: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  App Preferences
                </h3>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, currency: value })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UGX">USh Ugandan Shilling (UGX)</SelectItem>
                      <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                      <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Date Format</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, dateFormat: value })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, language: value })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => {
                    toast({
                      title: "Preferences saved",
                      description: "Your app preferences have been updated.",
                    });
                  }}
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Security Settings
                </h3>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Change Password
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="bg-muted/30 border-border"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      className="bg-muted/30 border-border"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-muted/30 border-border"
                    />
                  </div>
                  <Button 
                    className="mt-3 bg-gradient-primary hover:opacity-90"
                    onClick={() => {
                      toast({
                        title: "Password updated",
                        description: "Your password has been changed successfully.",
                      });
                    }}
                  >
                    Update Password
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Two-Factor Authentication
                  </Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-border hover:border-primary/50"
                      onClick={() => {
                        toast({
                          title: "Two-Factor Authentication",
                          description: "2FA setup will be available in a future update.",
                        });
                      }}
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Sign Out
                  </Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You'll need to sign in again to access your account
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Data Management
                </h3>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Export Data</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Download all your financial data as JSON or CSV
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-border hover:border-primary/50"
                    onClick={() => {
                      const dataStr = JSON.stringify({ profile, preferences, notifications }, null, 2);
                      const dataBlob = new Blob([dataStr], { type: "application/json" });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `finnexus-data-${new Date().toISOString().split("T")[0]}.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                      toast({
                        title: "Data exported",
                        description: "Your financial data has been downloaded.",
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 glass-card rounded-lg border-destructive/30 border">
                  <div>
                    <Label className="text-sm font-medium text-destructive">Delete Account</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        toast({
                          title: "Account deletion",
                          description: "Account deletion feature will be available in a future update.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

