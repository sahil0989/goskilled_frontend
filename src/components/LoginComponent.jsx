import { useState, useEffect, useRef } from "react";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { Label } from "../@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogDescription,
} from "../@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../services/backend";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const LoginComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const { login } = useAuth();

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const loginData = {};

    // Check if email or mobile is provided
    const emailOrMobile = formData.get("emailOrMobile");
    if (emailOrMobile.includes("@")) {
      loginData.email = emailOrMobile;
    } else {
      loginData.mobileNumber = emailOrMobile;
    }

    loginData.password = formData.get("password");

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error('Login Failed!!')
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage or cookies
      localStorage.setItem("token", data.data.token);

      // Store user data in AuthContext
      login(data.data);

      toast.success("Login Successfully!!")
      // Redirect to dashboard or home page
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  // Request OTP for login
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const mobileNumber = formData.get("mobileNumber");

    try {
      const response = await fetch(`${backendUrl}/api/auth/request-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error('Failed to Send OTP')
        throw new Error(data.message || "Failed to send OTP");
      } else{
        toast.info(`OTP send on ${mobileNumber}`)
      }

      // Store userId for OTP verification
      setUserId(data?.data?.userId);
      setOtpSent(true);

      // Start timer for resend OTP
      setTimer(60);
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("An error occurred while sending OTP")
      setError(error.message || "An error occurred while sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP for login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp");

    try {
      const response = await fetch(`${backendUrl}/api/auth/login-with-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Invalid OTP")
        throw new Error(data.message || "Invalid OTP");
      }

      localStorage.setItem("token", data.data.token);
      // Store user data in AuthContext
      login(data.data);
      toast.success('Login Successfully!!')
      navigate("/dashboard");
    } catch (error) {
      // setError(error.message || "An error occurred during OTP verification");
      toast.error("An error occurred during OTP verification")
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) return;

    setIsLoading(true);
    setError("");

    try {
      const mobileNumber = document.getElementById("mobileNumber").value;

      const response = await fetch(`${backendUrl}/api/auth/request-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error('Failed to resend OTP')
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Update userId if needed
      setUserId(data.data.userId);

      // Reset timer
      setTimer(60);
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('An error occurred while resending OTP')
      setError(error.message || "An error occurred while resending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex justify-center items-center p-4 bg-gray-50"
        style={{ height: "calc(100vh - 80.8px" }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <AlertDialog variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDialogDescription>{error}</AlertDialogDescription>
              </AlertDialog>
            )}

            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="password">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailOrMobile">Mobile Number</Label>
                    <Input
                      id="emailOrMobile"
                      name="emailOrMobile"
                      placeholder="Mobile Number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {/* <a
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a> */}
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                {!otpSent ? (
                  <form onSubmit={handleRequestOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        placeholder="Enter your mobile number"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the OTP sent to your mobile"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResendOTP}
                        disabled={timer > 0 || isLoading}
                        className="text-sm"
                      >
                        {timer > 0 ? `Resend OTP after ${timer}s` : "Resend OTP"}
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LoginComponent;
