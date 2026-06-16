import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import ProviderNavbar from '../../../components/layout/ProviderNavbar';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Footer from '../../../components/layout/Footer';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ProfileImageUploadModal from '../../../components/shared/Upload Image/ProfileImageUploadModal';
import {
  getProviderProfile,
  updateProviderProfile,
  updateProviderPassword,
  deleteProviderAccountAction,
} from './ProviderProfileActions';
import { getStates, getCities } from '../../../services/locationService';
import { getAllServices } from '../../shared/Services/ServicesActions';

type ServiceOption = { value: string; label: string };
type StateOption  = { value: string; label: string; iso2: string };

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=12';

export default function ProviderProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName:      '',
    lastName:       '',
    email:          '',
    mobileNumber:   '',
    dob:            '',
    city:           '',
    state:          '',
    service:        '',
    specialization: '',
    writtenCv:      '',
    nationalNumber: '',
    gender:         '',
      hourPrice:      '',  
  });

  const [userEmail,     setUserEmail]     = useState('');
  const [profileImage,  setProfileImage]  = useState(DEFAULT_AVATAR);
  const [showImageUpload,    setShowImageUpload]    = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount,  setShowDeleteAccount]  = useState(false);
  const [isDeleting,         setIsDeleting]         = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving,           setIsSaving]           = useState(false);
  const [isLoading,          setIsLoading]          = useState(true);
  const [states,             setStates]             = useState<StateOption[]>([]);
  const [cities,             setCities]             = useState<{ value: string; label: string }[]>([]);
  const [loadingCities,      setLoadingCities]      = useState(false);

  const [services, setServices] = useState<ServiceOption[]>([]);
const [loadingServices, setLoadingServices] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new:     false,
    confirm: false,
  });


  useEffect(() => {
  const loadServices = async () => {
    setLoadingServices(true);
    const result = await getAllServices();
    setLoadingServices(false);

    if (result.success) {
      setServices(
        result.data.map((s: any) => ({
          value: s._id,
          label: s.name,
        }))
      );
    }
  };
  loadServices();
}, []);

  // ============ LOAD STATES ON MOUNT ============
  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await getStates();
        const mapped = Array.isArray(data)
          ? data.map((s: any) => ({
              value: s.name,
              label: s.name,
              iso2:  s.iso2,
            }))
          : [];
        setStates(mapped);
      } catch {
        toast.error('Failed to load states');
      }
    };
    loadStates();
  }, []);

  // ============ LOAD PROFILE ============
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const profileResult = await getProviderProfile();

        if (!profileResult.success) {
          toast.error('Failed to load profile');
          return;
        }

        const provider = profileResult.data;
        setUserEmail(provider.email || '');

        const serverImage =
          provider.profileURL   ||
          provider.profileImage ||
          provider.imageUrl     ||
          provider.photo        ||
          provider.avatar       ||
          null;

        if (serverImage) setProfileImage(serverImage);

        let dobString = '';
        if (provider.dob) {
          dobString = new Date(provider.dob).toISOString().split('T')[0];
        }

        setFormData({
          firstName:      provider.firstName      || '',
          lastName:       provider.lastName       || '',
          email:          provider.email          || '',
          mobileNumber:   provider.mobileNumber   || '',
          dob:            dobString,
          city:           provider.city           || '',
          state:          provider.state          || '',
           service:        typeof provider.service === 'object'
                    ? provider.service?._id || '' 
                    : provider.service || '',
          specialization: provider.specialization || '',
          writtenCv:      provider.writtenCv      || '',
          nationalNumber: provider.nationalNumber || '',
          gender:         provider.gender         || '',
          hourPrice: provider.hourPrice ? String(provider.hourPrice) : '',
        });

        toast.success('Profile loaded successfully');
      } catch (error) {
        toast.error('Failed to load data');
        console.error('Load error:', error);
      } finally {
        setIsLoading(false);
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

        const data   = await getCities(stateObj.iso2);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    if (!formData.mobileNumber.trim()) {
      toast.error('Mobile number is required');
      return;
    }

    // Gender validation
    if (!formData.gender || !['MALE', 'FEMALE'].includes(formData.gender)) {
  toast.error('Please select a gender');
  return;
}

    setIsSaving(true);

    const response = await updateProviderProfile({
  firstName:      formData.firstName,
  lastName:       formData.lastName,
  mobileNumber:   formData.mobileNumber,
  city:           formData.city,
  state:          formData.state,
  service:        formData.service,
  specialization: formData.specialization,
  writtenCv:      formData.writtenCv,
  gender:         formData.gender,  
  hourPrice:      formData.hourPrice ? Number(formData.hourPrice) : undefined,
});

    setIsSaving(false);

    if (response.success) {
      toast.success(response.message || 'Profile updated successfully');
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

    const result = await updateProviderPassword(
      passwordData.currentPassword,
      passwordData.newPassword,
    );

    setIsChangingPassword(false);

    if (result.success) {
      toast.success(result.message || 'Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(result.error || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await deleteProviderAccountAction();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <Card className="mb-6">
            {/* Avatar */}
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

              {/* PERSONAL INFO */}
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
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />

              {/* DOB — read-only */}
              <Input
                type="date"
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled
                className="opacity-60 cursor-not-allowed"
              />

              {/* National Number — read-only */}
              <Input
                label="National Number"
                name="nationalNumber"
                value={formData.nationalNumber}
                onChange={handleChange}
                disabled
                className="opacity-60 cursor-not-allowed"
                placeholder="e.g., 12345678912345"
              />

              {/* SERVICE INFO */}
             <Select
  label="Service / Category"
  name="service"
  value={formData.service}
  onChange={handleChange}
  disabled={loadingServices}
  options={[
    { value: '', label: loadingServices ? 'Loading...' : 'Select Service' },
    ...services,
  ]}
/>
              <Textarea
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Describe your specialization and experience"
              />

              <Textarea
                label="Written CV"
                name="writtenCv"
                value={formData.writtenCv}
                onChange={handleChange}
                placeholder="Write your CV or professional summary"
              />

              {/* LOCATION */}
              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select State' },
                    ...states,
                  ]}
                />
                <Select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loadingCities || cities.length === 0}
                  options={
                    loadingCities
                      ? [{ value: '', label: 'Loading cities…' }]
                      : [{ value: '', label: 'Select City' }, ...cities]
                  }
                />
              </div>
{/* Hourly Rate */}
<div>
  <Input
    type="number"
    label="Hourly Rate (EGP)"
    name="hourPrice"
    value={formData.hourPrice}
    onChange={handleChange}
    placeholder="e.g. 150"
  />
  <p className="text-xs text-muted-foreground mt-1">
    This rate is used for hourly broadcast requests. Minimum 150 EGP.
  </p>
</div>
              {/* GENDER */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Gender <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['MALE', 'FEMALE'] as const).map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${formData.gender === g ? 'border-primary' : 'border-muted-foreground'}`}
                      >
                        {formData.gender === g && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium capitalize">
                        {g.charAt(0) + g.slice(1).toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
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

          {/* DANGER ZONE */}
          <Card className="border-destructive/50 bg-destructive/5">
            <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
            <p className="text-muted-foreground mb-4">
              Once you delete your account, it is hard to go back. Please be certain.
            </p>
            <Button variant="destructive" onClick={() => setShowDeleteAccount(true)}>
              Delete Account
            </Button>
          </Card>
        </div>
      </div>

      {/* IMAGE UPLOAD MODAL */}
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
          {(
            [
              { key: 'current', label: 'Current Password', field: 'currentPassword' },
              { key: 'new',     label: 'New Password',     field: 'newPassword'     },
              { key: 'confirm', label: 'Confirm Password', field: 'confirmPassword' },
            ] as const
          ).map(({ key, label, field }) => (
            <div key={key} className="relative">
              <Input
                type={showPasswords[key] ? 'text' : 'password'}
                label={label}
                value={passwordData[field]}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, [field]: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })
                }
                className="absolute right-4 top-11 text-muted-foreground hover:text-foreground"
              >
                {showPasswords[key] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isChangingPassword}>
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
              If you change your mind, you can recover your account within 30 days
              by contacting the support team.
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
