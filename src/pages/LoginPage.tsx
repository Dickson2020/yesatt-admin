
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Mail } from 'lucide-react';
import api from '@/services/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.login(email, password);
      
      if (response && response.status && response.data) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberMe', JSON.stringify({ email }));
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        toast({
          title: 'Success',
          description: 'Login successful!',
        });

        localStorage.setItem('logged_in', ''+response?.data?.id)
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">RideAdmin</h1>
          <p className="text-gray-600 mt-2">Ride-Sharing Admin Command Center</p>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember-me" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} RideAdmin. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
