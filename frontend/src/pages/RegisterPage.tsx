import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from "sonner"; // 👈 Updated Import

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid financial-grade email"),
  password: z.string().min(8, "Password must be at least 8 characters for security"),
});

type RegisterValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    
    // Using Sonner's promise API for a high-end "loading" feel
    const registrationPromise = fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Registration failed');
      return result;
    });

    toast.promise(registrationPromise, {
      loading: 'Initializing Security Protocol...',
      success: (data) => {
        // Here you can handle redirecting
        return `Vault Created: Welcome, ${data.username || 'Agent'}`;
      },
      error: (err) => err.message,
    });

    try {
      await registrationPromise;
      // Navigate to login after a brief delay for the user to read the toast
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 selection:bg-white selection:text-black">
      <Card className="w-full max-w-md bg-[#181818] border-white/5 text-[#E0E0E0] shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-[#121212] font-black text-[10px]">N</span>
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#9CA3AF] uppercase">Security Protocol</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Create your Vault</CardTitle>
          <CardDescription className="text-[#9CA3AF]">
            Initialize your isolated data environment.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-medium text-[#9CA3AF]">Username</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="identity_01"
                className="bg-[#121212] border-white/10 focus:border-white/40 transition-all text-white placeholder:text-zinc-700"
              />
              {errors.username && <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-[#9CA3AF]">Corporate Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="name@company.com"
                className="bg-[#121212] border-white/10 focus:border-white/40 transition-all text-white placeholder:text-zinc-700"
              />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-[#9CA3AF]">Access Key</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="bg-[#121212] border-white/10 focus:border-white/40 transition-all text-white placeholder:text-zinc-700"
              />
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#E0E0E0] text-[#121212] hover:bg-white font-bold py-6 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <><ShieldCheck className="mr-2 h-4 w-4" /> Initialize Registration</>
              )}
            </Button>
            <p className="text-xs text-center text-[#9CA3AF]">
              Already have a vault? <a href="/login" className="text-white hover:underline transition-all">Verify Identity</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;