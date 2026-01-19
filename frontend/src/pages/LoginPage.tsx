import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, KeyRound } from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid credential format"),
  password: z.string().min(1, "Access key is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);

    // This promise handles the full authentication handshake
    const authSequence = async () => {
      // 1. Authenticate Credentials
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.message || 'Verification failed');

      // 2. Store the Access Token
      // In production, consider a more secure state management like Zustand or Context
      localStorage.setItem('accessToken', loginData.accessToken);

      // 3. Verify Identity & Fetch Profile
      const profileRes = await fetch(`${baseUrl}/secure/me`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${loginData.accessToken}` 
        },
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error('Identity verification failed');

      return profileData; // Contains userId and other profile info
    };

    toast.promise(authSequence(), {
      loading: 'Establishing Secure Connection...',
      success: (user) => `Access Granted: Welcome back, Agent ${user.userId.slice(-4)}`,
      error: (err) => err.message,
    });

    try {
      await authSequence();
      // Brief delay to allow the "Success" toast to be read
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (error) {
      console.error('Auth sequence error:', error);
      localStorage.removeItem('accessToken'); // Clean up on failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 selection:bg-white selection:text-black">
      {/* ... Card UI remains consistent with your previous high-quality design ... */}
      <Card className="w-full max-w-md bg-[#181818] border-white/5 text-[#E0E0E0] shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-[#121212] font-black text-[10px]">N</span>
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#9CA3AF] uppercase font-mono">
              Verification Protocol
            </span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Access Vault
          </CardTitle>
          <CardDescription className="text-[#9CA3AF]">
            Please provide your credentials to unlock your financial data.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-[#9CA3AF]">Registered Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="agent@ness.private"
                className="bg-[#121212] border-white/10 focus:border-white/40 transition-all text-white placeholder:text-zinc-800"
              />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-[#9CA3AF]">Access Key</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="bg-[#121212] border-white/10 focus:border-white/40 transition-all text-white placeholder:text-zinc-800"
              />
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#E0E0E0] text-[#121212] hover:bg-white font-bold py-6 transition-all active:scale-[0.98] group"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> 
                  Confirm Identity
                </>
              )}
            </Button>
            <div className="flex flex-col items-center gap-2">
               <p className="text-xs text-[#9CA3AF]">
                Unauthorized access is strictly monitored.
              </p>
              <p className="text-xs text-[#9CA3AF]">
                New Agent? <a href="/register" className="text-white hover:underline transition-all">Request Vault Access</a>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;