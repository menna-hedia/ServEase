import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Eye,
  EyeOff,
  Loader,
  Upload,
  FileText,
  IdCard,
  X,
} from "lucide-react";
import logo from "../../../../components/images/logoWhite.png"
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import Textarea from "../../../../components/ui/Textarea";
import Card from "../../../../components/ui/Card";

import {
  getCities,
  getStates,
} from "../../../../services/locationService";

import {
  providerSignUpSchema,
  ProviderSignUpObjectType,
} from "./ProviderSignUpSchema";

import { ProviderSignUpAction } from "./ProviderSignUpActions";
import { getAllServices } from "../../../shared/Services/ServicesActions";

type StateType = {
  name: string;
  iso2: string;
};

type CityType = {
  name: string;
};

export default function ProviderSignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // ID CARD IMAGES (FRONT + BACK)
  const [idCardFrontFile, setIdCardFrontFile] = useState<File | null>(null);
  const [idCardFrontPreview, setIdCardFrontPreview] = useState<string | null>(null);
  const [idCardFrontDragActive, setIdCardFrontDragActive] = useState(false);
  const [idCardFrontError, setIdCardFrontError] = useState<string | null>(null);

  const [idCardBackFile, setIdCardBackFile] = useState<File | null>(null);
  const [idCardBackPreview, setIdCardBackPreview] = useState<string | null>(null);
  const [idCardBackDragActive, setIdCardBackDragActive] = useState(false);
  const [idCardBackError, setIdCardBackError] = useState<string | null>(null);

  const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProviderSignUpObjectType>({
    resolver: zodResolver(providerSignUpSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      dob: "",
      nationalNumber: "",
      service: "",
      specialization: "",
      writtenCv: "",
      state: "",
      city: "",
      gender: "",
      hourPrice: 0,
      password: "",
      confirmPassword: "",
    },

    mode: "onBlur",
  });

  const watchState = watch("state");

  // =========================
  // LOAD SERVICES
  // =========================
  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      const result = await getAllServices();
      setLoadingServices(false);

      if (result.success) {
        setServiceOptions([
          { value: '', label: 'Select Service' },
          ...result.data.map((s: any) => ({
            value: s._id,
            label: s.name,
          })),
        ]);
      }
    };

    loadServices();
  }, []);

  // =========================
  // LOAD STATES
  // =========================

  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingStates(true);

        const data = await getStates();

        setStates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // =========================
  // LOAD CITIES
  // =========================

  useEffect(() => {
    const loadCities = async () => {
      if (!watchState) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);

        const selectedState = states.find(
          (s) => s.name === watchState
        );

        if (!selectedState) {
          setCities([]);
          return;
        }

        const data = await getCities(selectedState.iso2);

        setCities(Array.isArray(data) ? data : []);

        setValue("city", "");
      } catch (err) {
        console.error(err);

        setCities([]);

        toast.error("Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [watchState, states, setValue]);

  // =========================
  // NORMALIZE TEXT
  // =========================

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  };

  // =========================
  // GET CURRENT LOCATION
  // =========================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await res.json();

          const address = data.address || {};

          const detectedState =
            address.state ||
            address.state_district ||
            address.region ||
            "";

          const detectedCity =
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            "";

          const matchedState = states.find((s) =>
            normalizeText(detectedState).includes(normalizeText(s.name))
          );

          if (!matchedState) {
            toast.error("State not found");
            return;
          }

          const citiesData = await getCities(matchedState.iso2);

          const safeCities = Array.isArray(citiesData) ? citiesData : [];

          setCities(safeCities);

          const matchedCity = safeCities.find((c) => {
            const apiCity = normalizeText(c.name || "");
            const detected = normalizeText(detectedCity);
            return apiCity.includes(detected) || detected.includes(apiCity);
          });

          setValue("state", matchedState.name);
          setValue("city", matchedCity?.name || "");

          toast.success("Location detected successfully");
        } catch (err) {
          console.error(err);
          toast.error("Failed to detect location");
        } finally {
          setDetectingLocation(false);
        }
      },

      () => {
        toast.error("Permission denied");
        setDetectingLocation(false);
      }
    );
  };

  // =========================
  // CV FILE HANDLING
  // =========================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // =========================
  // ID CARD IMAGE HANDLING (FRONT + BACK)
  // =========================

  const ALLOWED_ID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX_ID_IMAGE_SIZE_MB = 5;

  type IdCardSide = "front" | "back";

  const idCardSideConfig: Record<
    IdCardSide,
    {
      setFile: (f: File | null) => void;
      setPreview: (p: string | null) => void;
      setError: (e: string | null) => void;
    }
  > = {
    front: {
      setFile: setIdCardFrontFile,
      setPreview: setIdCardFrontPreview,
      setError: setIdCardFrontError,
    },
    back: {
      setFile: setIdCardBackFile,
      setPreview: setIdCardBackPreview,
      setError: setIdCardBackError,
    },
  };

  const validateAndSetIdCardImage = (side: IdCardSide, file: File) => {
    const { setFile, setPreview, setError } = idCardSideConfig[side];

    if (!ALLOWED_ID_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed");
      toast.error("Only JPG, PNG or WEBP images are allowed");
      return;
    }

    if (file.size > MAX_ID_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_ID_IMAGE_SIZE_MB}MB`);
      toast.error(`Image must be smaller than ${MAX_ID_IMAGE_SIZE_MB}MB`);
      return;
    }

    setError(null);
    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleIdCardFileChange = (
    side: IdCardSide,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSetIdCardImage(side, file);
  };

  const handleIdCardDrag = (side: IdCardSide, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const setDrag =
      side === "front" ? setIdCardFrontDragActive : setIdCardBackDragActive;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDrag(true);
    } else if (e.type === "dragleave") {
      setDrag(false);
    }
  };

  const handleIdCardDrop = (side: IdCardSide, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const setDrag =
      side === "front" ? setIdCardFrontDragActive : setIdCardBackDragActive;
    setDrag(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetIdCardImage(side, file);
    }
  };

  const idCardFrontInputRef = useRef<HTMLInputElement | null>(null);
  const idCardBackInputRef = useRef<HTMLInputElement | null>(null);

  const openIdCardFilePicker = (side: IdCardSide) => {
    if (side === "front") {
      idCardFrontInputRef.current?.click();
    } else {
      idCardBackInputRef.current?.click();
    }
  };

  const removeIdCardImage = (side: IdCardSide) => {
    const { setFile, setPreview, setError } = idCardSideConfig[side];
    setFile(null);
    setPreview(null);
    setError(null);

    const ref = side === "front" ? idCardFrontInputRef : idCardBackInputRef;
    if (ref.current) {
      ref.current.value = "";
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (data: ProviderSignUpObjectType) => {
    if (!agreeToTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (!idCardFrontFile) {
      setIdCardFrontError("Front side of national ID card is required");
      toast.error("Please upload the front side of your national ID card");
      return;
    }

    if (!idCardBackFile) {
      setIdCardBackError("Back side of national ID card is required");
      toast.error("Please upload the back side of your national ID card");
      return;
    }

    setIsSubmitting(true);

    try {
      sessionStorage.setItem("verifyEmail", data.email);
      sessionStorage.setItem("verifyRole", "provider");
      sessionStorage.setItem("verifyType", "register");

      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("dob", data.dob);
      formData.append("mobileNumber", data.mobileNumber);
      formData.append("nationalNumber", data.nationalNumber);
      formData.append("service", data.service);
      formData.append("specialization", data.specialization);
      formData.append("gender", data.gender);
      formData.append("hourPrice", String(data.hourPrice));

      const selectedStateName = data.state;
      const selectedCityName = data.city;

      formData.append("city", selectedStateName);
      formData.append("state", selectedCityName);

      const trimmedWrittenCv = data.writtenCv?.trim();

      if (trimmedWrittenCv) {
        formData.append("writtenCv", trimmedWrittenCv);
      }

      if (cvFile) {
        formData.append("cvFile", cvFile);
      }

      if (!trimmedWrittenCv && !cvFile) {
        toast.error("Please provide a written CV or upload a CV file");
        setIsSubmitting(false);
        return;
      }

      formData.append("idCardFrontFile", idCardFrontFile);
      formData.append("idCardBackFile", idCardBackFile);

      const result = await ProviderSignUpAction(formData);

      if (result.success) {
        toast.success("Account created successfully!");

        sessionStorage.setItem("verifyEmail", data.email);

        navigate("/verify-otp", {
          state: {
            email: data.email,
            type: "register",
          },
        });
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
             <img
    src={logo}
    alt="ServEase"
    className="w-10 h-10 object-contain"
  />
          </div>

          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ServEase
          </span>
        </Link>

        <Card>
          <h1 className="text-2xl font-bold text-center mb-2">
            Become a Service Provider
          </h1>

          <p className="text-center text-muted-foreground mb-6">
            Join our platform and start receiving jobs
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    label="First Name"
                    placeholder="Ahmed"
                    error={errors.firstName?.message}
                    disabled={isSubmitting}
                    {...field}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Last Name"
                    placeholder="Mohamed"
                    error={errors.lastName?.message}
                    disabled={isSubmitting}
                    {...field}
                  />
                )}
              />
            </div>

            {/* EMAIL */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  label="Email"
                  placeholder="ahmed@example.com"
                  error={errors.email?.message}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />

            {/* PHONE + DOB */}
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    type="tel"
                    label="Phone Number"
                    placeholder="01012345678"
                    error={errors.mobileNumber?.message}
                    disabled={isSubmitting}
                    {...field}
                  />
                )}
              />

              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    label="Date of Birth"
                    error={errors.dob?.message}
                    disabled={isSubmitting}
                    {...field}
                  />
                )}
              />
            </div>

            {/* NATIONAL NUMBER */}
            <Controller
              name="nationalNumber"
              control={control}
              render={({ field }) => (
                <Input
                  label="National Number"
                  placeholder="Enter national number"
                  error={errors.nationalNumber?.message}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />

            {/* NATIONAL ID CARD IMAGES - FRONT & BACK */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* FRONT */}
              <div>
                <label className="block mb-2 font-medium">
                  National ID Card (Front) <span className="text-red-500">*</span>
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    idCardFrontDragActive
                      ? "border-primary bg-primary/5"
                      : idCardFrontError
                      ? "border-red-400"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={(e) => handleIdCardDrag("front", e)}
                  onDragLeave={(e) => handleIdCardDrag("front", e)}
                  onDragOver={(e) => handleIdCardDrag("front", e)}
                  onDrop={(e) => handleIdCardDrop("front", e)}
                >
                  {idCardFrontFile ? (
                    <div className="flex flex-col items-center gap-3">
                      {idCardFrontPreview && (
                        <img
                          src={idCardFrontPreview}
                          alt="National ID front preview"
                          className="max-h-32 rounded-lg border border-border object-contain"
                        />
                      )}

                      <div className="flex items-center justify-center gap-2">
                        <IdCard className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-sm">{idCardFrontFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(idCardFrontFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeIdCardImage("front")}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Remove front ID card image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <IdCard className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag & drop front side here
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        JPG, PNG or WEBP, max {MAX_ID_IMAGE_SIZE_MB}MB
                      </p>
                      <input
                        ref={idCardFrontInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleIdCardFileChange("front", e)}
                        className="hidden"
                        id="id-card-front-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openIdCardFilePicker("front")}
                      >
                        Choose Image
                      </Button>
                    </>
                  )}
                </div>

                {idCardFrontError && (
                  <p className="text-sm text-red-500 mt-2">{idCardFrontError}</p>
                )}
              </div>

              {/* BACK */}
              <div>
                <label className="block mb-2 font-medium">
                  National ID Card (Back) <span className="text-red-500">*</span>
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    idCardBackDragActive
                      ? "border-primary bg-primary/5"
                      : idCardBackError
                      ? "border-red-400"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={(e) => handleIdCardDrag("back", e)}
                  onDragLeave={(e) => handleIdCardDrag("back", e)}
                  onDragOver={(e) => handleIdCardDrag("back", e)}
                  onDrop={(e) => handleIdCardDrop("back", e)}
                >
                  {idCardBackFile ? (
                    <div className="flex flex-col items-center gap-3">
                      {idCardBackPreview && (
                        <img
                          src={idCardBackPreview}
                          alt="National ID back preview"
                          className="max-h-32 rounded-lg border border-border object-contain"
                        />
                      )}

                      <div className="flex items-center justify-center gap-2">
                        <IdCard className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-sm">{idCardBackFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(idCardBackFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeIdCardImage("back")}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Remove back ID card image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <IdCard className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag & drop back side here
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        JPG, PNG or WEBP, max {MAX_ID_IMAGE_SIZE_MB}MB
                      </p>
                      <input
                        ref={idCardBackInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleIdCardFileChange("back", e)}
                        className="hidden"
                        id="id-card-back-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openIdCardFilePicker("back")}
                      >
                        Choose Image
                      </Button>
                    </>
                  )}
                </div>

                {idCardBackError && (
                  <p className="text-sm text-red-500 mt-2">{idCardBackError}</p>
                )}
              </div>
            </div>

            {/* SERVICE */}
            <Controller
              name="service"
              control={control}
              render={({ field }) => (
                <Select
                  label="Service"
                  error={errors.service?.message}
                  options={
                    loadingServices
                      ? [{ value: '', label: 'Loading services...' }]
                      : serviceOptions
                  }
                  disabled={isSubmitting || loadingServices}
                  {...field}
                />
              )}
            />

            {/* SPECIALIZATION */}
            <Controller
              name="specialization"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Specialization"
                  placeholder="Describe your experience..."
                  error={errors.specialization?.message}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />

            {/* HOUR PRICE */}
            <Controller
              name="hourPrice"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Hour Price (EGP)"
                  placeholder="e.g. 150"
                  error={errors.hourPrice?.message}
                  disabled={isSubmitting}
                  value={field.value === 0 ? '' : String(field.value)}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              )}
            />

            {/* STATE + CITY */}
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select
                    label="State"
                    error={errors.state?.message}
                    options={[
                      {
                        value: "",
                        label: loadingStates ? "Loading..." : "Select State",
                      },
                      ...states.map((s: any) => ({
                        value: s.name,
                        label: s.name,
                      })),
                    ]}
                    {...field}
                  />
                )}
              />

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    label="City"
                    disabled={!watchState || loadingCities}
                    error={errors.city?.message}
                    options={[
                      {
                        value: "",
                        label: loadingCities ? "Loading..." : "Select City",
                      },
                      ...cities.map((c: any) => ({
                        value: c.name,
                        label: c.name,
                      })),
                    ]}
                    {...field}
                  />
                )}
              />
            </div>

            {/* CURRENT LOCATION BUTTON */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={getCurrentLocation}
              disabled={detectingLocation}
            >
              {detectingLocation ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 mr-2" />
                  Use Current Location
                </>
              )}
            </Button>

            {/* CV FILE */}
            <div>
              <label className="block mb-2 font-medium">
                Upload CV
              </label>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {cvFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{cvFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(cvFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      Drag & drop your CV here
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openFilePicker}
                      >
                        Choose File
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* WRITTEN CV */}
            <Controller
              name="writtenCv"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Written CV (Optional)"
                  placeholder="Write your experience..."
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />

            {/* GENDER */}
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Gender
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {/* MALE */}
                    <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200">
                      <input
                        type="radio"
                        value="MALE"
                        checked={field.value === "MALE"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          field.value === "MALE"
                            ? "border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {field.value === "MALE" && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium">Male</span>
                    </label>

                    {/* FEMALE */}
                    <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200">
                      <input
                        type="radio"
                        value="FEMALE"
                        checked={field.value === "FEMALE"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          field.value === "FEMALE"
                            ? "border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {field.value === "FEMALE" && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium">Female</span>
                    </label>
                  </div>

                  {errors.gender?.message && (
                    <p className="text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* PASSWORD */}
            <div className="relative">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Enter password"
                    error={errors.password?.message}
                    disabled={isSubmitting}
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    placeholder="Confirm password"
                    error={errors.confirmPassword?.message}
                    disabled={isSubmitting}
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-11 text-muted-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* TERMS */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the Terms and Conditions
              </span>
            </label>

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
