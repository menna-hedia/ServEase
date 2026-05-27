import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Home, MapPin, Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import Card from "../../../../components/ui/Card";
import { getCities, getStates } from "../../../../services/locationService";
import { customerSignUpSchema, CustomerSignUpObjectType } from "./CustomerSignUpSchema";
import { CustomerSignUpAction } from './CustomerSignUpActions';

export default function CustomerSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [detectingLocation, setDetectingLocation] =useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerSignUpObjectType>({
    resolver: zodResolver(customerSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      dob: "",
      state: "",
      city: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const watchState = watch("state");

  // =========================
  // LOAD STATES ON MOUNT
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
  // LOAD CITIES WHEN STATE CHANGES
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
          (s: any) => s.name === watchState
        );

        if (!selectedState) return;

        const data = await getCities(selectedState.iso2);
        setCities(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error(err);
        setCities([]);
        toast.error("Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [watchState]);

  // =========================
  // NORMALIZE TEXT (for location matching)
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

          const matchedState = states.find((s) => {
            return normalizeText(detectedState).includes(
              normalizeText(s.name)
            );
          });

          if (!matchedState) {
            toast.error("State not found");

            return;
          }

          const citiesData = await getCities(
  matchedState.name
);

          const safeCities = Array.isArray(citiesData)
            ? citiesData
            : [];

          const matchedCity = safeCities.find((c) => {
            const apiCity = normalizeText(c.name || "");

            const detected = normalizeText(detectedCity);

            return (
              apiCity.includes(detected) ||
              detected.includes(apiCity)
            );
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
  // FORM SUBMISSION
  // =========================
  const onSubmit = async (data: CustomerSignUpObjectType) => {
    if (!agreeToTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await CustomerSignUpAction(data);

      if (result.success) {
        toast.success("Account created successfully!");
        sessionStorage.setItem("verifyEmail", data.email);
        sessionStorage.setItem("verifyType", "register");
        sessionStorage.setItem("verifyRole", "customer");
        navigate("/verify-otp", {
          state: {
            email: data.email,
            type: "register",
            role: "customer",
          },
        });
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* LOGO */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ServEase
          </span>
        </Link>

        <Card>
          <h1 className="text-2xl font-bold text-center mb-2">
            Create Customer Account
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            Join ServEase to book trusted home services
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* FIRST & LAST NAME */}
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      label="First Name"
                      placeholder="Ahmed"
                      error={errors.firstName?.message}
                      {...field}
                    />
                  </div>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      label="Last Name"
                      placeholder="Mohamed"
                      error={errors.lastName?.message}
                      {...field}
                    />
                  </div>
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
                  {...field}
                />
              )}
            />

            {/* PHONE */}
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field }) => (
                <Input
                  type="tel"
                  label="Mobile Number"
                  placeholder="01012345678"
                  error={errors.mobileNumber?.message}
                  {...field}
                />
              )}
            />

            {/* DATE OF BIRTH */}
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  label="Date of Birth"
                  error={errors.dob?.message}
                  {...field}
                />
              )}
            />

            {/* STATE & CITY */}
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
                    <label
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200
          ${field.value === "MALE"
                        }`}
                    >
                      <input
                        type="radio"
                        value="MALE"
                        checked={field.value === "MALE"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="hidden"
                      />

                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
            ${field.value === "MALE"
                            ? "border-primary"
                            : "border-muted-foreground"
                          }`}
                      >
                        {field.value === "MALE" && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>

                      <span className="text-sm font-medium">
                        Male
                      </span>
                    </label>

                    {/* FEMALE */}
                    <label
                      className={`flex items-center gap-3 rounded-xl  px-4 py-3 cursor-pointer transition-all duration-200
          ${field.value === "FEMALE"}`}
                    >
                      <input
                        type="radio"
                        value="FEMALE"
                        checked={field.value === "FEMALE"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="hidden"
                      />

                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
            ${field.value === "FEMALE"
                            ? "border-primary"
                            : "border-muted-foreground"
                          }`}
                      >
                        {field.value === "FEMALE" && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>

                      <span className="text-sm font-medium">
                        Female
                      </span>
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
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-muted-foreground hover:text-foreground transition"
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
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-11 text-muted-foreground hover:text-foreground transition"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* TERMS AGREEMENT */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* SIGN IN LINK */}
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
