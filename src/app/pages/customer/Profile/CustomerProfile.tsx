import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import CustomerNavbar from '../../../components/layout/CustomerNavbar';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Footer from '../../../components/layout/Footer';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ProfileImageUploadModal from '../../../components/shared/Upload Image/ProfileImageUploadModal';
import {
  getCustomerProfile,
  updatePasswordAction,
  deleteAccountAction,
  updateCustomerProfile,
} from './CustomerProfileActions';
import { getStates, getCities } from '../../../services/locationService';

type StateOption = { value: string; label: string; iso2: string };

const DEFAULT_AVATAR = 'https://tse4.mm.bing.net/th/id/OIP.23wzRzOwtSR-WAQZM4mWzAHaHa?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3';

export default function CustomerProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    state: '',
    gender: '',
    userName: '',
  });

  const [userEmail, setUserEmail] = useState('');
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  // ============ LOAD STATES + PROFILE ============
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingStates(true);

        const [statesData, profileResult] = await Promise.all([
          getStates(),
          getCustomerProfile(),
        ]);

        const mappedStates: StateOption[] = Array.isArray(statesData)
          ? statesData.map((s: any) => ({
            value: s.name,
            label: s.name,
            iso2: s.iso2,
          }))
          : [];

        setStates(mappedStates);

        if (!profileResult.success) {
          toast.error('Failed to load profile');
          return;
        }

        const user = profileResult.data;
        setUserEmail(user.email || '');

        const serverImage =
          user.profileURL ||
          user.profileImage ||
          user.imageUrl ||
          user.photo ||
          user.avatar ||
          null;
        if (serverImage) {
          setProfileImage(serverImage);
        }

        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.mobileNumber || '',
          age: user.age ? String(user.age) : '',
          city: user.city || '',
          state: user.state || '',
          gender: user.gender || '',
          userName: user.userName || '',
        });
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoadingStates(false);
      }
    };

    loadData();
  }, []);

  // ============ LOAD CITIES WHEN STATE CHANGES ============
  useEffect(() => {
    if (!formData.state || states.length === 0) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        setLoadingCities(true);

        const stateObj = states.find((s) => s.value === formData.state);
        if (!stateObj) return;

        const data = await getCities(stateObj.iso2);
        const mapped = Array.isArray(data)
          ? data.map((c: any) => ({ value: c.name, label: c.name }))
          : [];
        setCities(mapped);
      } catch {
        toast.error('Failed to load cities');
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [formData.state, states]);

  // ============ HANDLERS ============
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData({ ...formData, state: value, city: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await updateCustomerProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobileNumber: formData.phone,
      city: formData.state,
      state: formData.city,
      gender: formData.gender,
    });

    if (response.success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(response.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);

    const result = await updatePasswordAction(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    setIsChangingPassword(false);

    if (result.success) {
      toast.success(result.message || 'Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      toast.error(result.error || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    const result = await deleteAccountAction();

    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Account deleted successfully');
      setShowDeleteAccount(false);
      setTimeout(() => navigate('/'), 1000);
    } else {
      toast.error(result.error || 'Failed to delete account');
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setProfileImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <Card className="mb-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
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
              <p className="text-muted-foreground">{userEmail}</p>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4">
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

              <Input
                type="number"
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  options={[
                    {
                      value: '',
                      label: loadingStates ? 'Loading...' : 'Select State',
                    },
                    ...states,
                  ]}
                />
                <Select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.state || loadingCities}
                  options={[
                    {
                      value: '',
                      label: loadingCities ? 'Loading...' : 'Select City',
                    },
                    ...cities,
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Gender
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {/* MALE */}
                  <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={formData.gender === 'MALE'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${formData.gender === 'MALE' ? 'border-primary' : 'border-muted-foreground'}`}
                    >
                      {formData.gender === 'MALE' && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Male</span>
                  </label>

                  {/* FEMALE */}
                  <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={formData.gender === 'FEMALE'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${formData.gender === 'FEMALE' ? 'border-primary' : 'border-muted-foreground'}`}
                    >
                      {formData.gender === 'FEMALE' && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Female</span>
                  </label>
                </div>
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
              Once you delete your account, it is hard to go back. Please be
              certain.
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

      {/* ✅ Image upload modal — onUpload receives the real API URL */}
      <ProfileImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        currentImage={profileImage}
        onUpload={handleImageUploaded}
      />

      {/* CHANGE PASSWORD MODAL */}
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
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  current: !showPasswords.current,
                })
              }
              className="absolute right-4 top-11 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showPasswords.new ? 'text' : 'password'}
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
              }
              className="absolute right-4 top-11 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showPasswords.confirm ? 'text' : 'password'}
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  confirm: !showPasswords.confirm,
                })
              }
              className="absolute right-4 top-11 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </Modal>

      {/* DELETE ACCOUNT MODAL */}
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
              If you change your mind, you can recover your account within 30
              days by contacting the support team.
            </p>
            <p className="text-sm text-primary mt-2">
              Contact:{' '}
              <a href="mailto:support@servease.com" className="underline">
                support@servease.com
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteAccount(false)}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="flex-1"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

