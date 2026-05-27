import { useState } from "react";
import { useNavigate } from "react-router";
import { Camera, Star, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ProviderNavbar from "../../components/layout/ProviderNavbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Footer from '../../components/layout/Footer';
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ProfileImageUploadModal from "../../components/shared/Upload Image/ProfileImageUploadModal";

const cities = [{ value: "new-york", label: "New York" }];
const states = [{ value: "ny", label: "New York" }];
const categories = [
  { value: "electrician", label: "Electrician" },
];

export default function ProviderProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "Robert",
    lastName: "Johnson",
    phone: "+1 (555) 987-6543",
    category: "electrician",
    specialization:
      "Certified electrician with 10+ years of experience",
    city: "new-york",
    state: "ny",
  });

  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/150?img=12",
  );
  const [showImageUpload, setShowImageUpload] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully!');
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };
  
  const handleDeleteAccount = () => {
    toast.success('Account deleted successfully');
    setShowDeleteAccount(false);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            My Profile
          </h1>

          <Card className="mb-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-primary"
                />
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-bold mt-4">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-muted-foreground">
                robert.johnson@example.com
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.9</span>
                <span className="text-muted-foreground">
                  (127 reviews)
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSaveChanges}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                type="tel"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

    
              <Textarea
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="City"
                  name="city"
                  options={cities}
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="State"
                  name="state"
                  options={states}
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChangePassword(true)}
                  className="flex-1"
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>

          <Card className="border-destructive/50 bg-destructive/5">
            <h3 className="text-lg font-semibold text-destructive mb-4">
              Danger Zone
            </h3>
            <p className="text-muted-foreground mb-4">
              Once you delete your account, there is no going
              back. Please be certain.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAccount(true)}
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>

      <ProfileImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        currentImage={profileImage}
        onUpload={setProfileImage}
      />

      <Modal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <Input
              type={showPasswords.current ? 'text' : 'password'}
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="absolute right-4 top-11 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showPasswords.new ? 'text' : 'password'}
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="absolute right-4 top-11 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showPasswords.confirm ? 'text' : 'password'}
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="absolute right-4 top-11 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        title="Delete Account"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="text-destructive font-medium mb-2">
              Your account will be deleted immediately.
            </p>
            <p className="text-sm text-muted-foreground">
              If you change your mind, you can recover your
              account within 30 days by contacting the support
              team.
            </p>
            <p className="text-sm text-primary mt-2">
              Contact:{" "}
              <a
                href="mailto:support@servease.com"
                className="underline"
              >
                support@servease.com
              </a>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteAccount(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="flex-1"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}