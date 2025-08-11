'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cognitoAuth } from '@/lib/auth';

const confirmationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().min(6, 'Confirmation code must be at least 6 characters'),
});

type ConfirmationFormData = z.infer<typeof confirmationSchema>;

interface ConfirmationFormProps {
  onConfirmed?: () => void;
  onBackToLogin?: () => void;
}

export function ConfirmationForm({ onConfirmed, onBackToLogin }: ConfirmationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ConfirmationFormData>({
    resolver: zodResolver(confirmationSchema),
  });

  const onSubmit = async (data: ConfirmationFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await cognitoAuth.confirmSignUp(data.email, data.code);
      setSuccess(true);
      setTimeout(() => {
        onConfirmed?.();
      }, 2000);
    } catch (error: any) {
      let errorMessage = 'Confirmation failed';
      
      if (error.name === 'CodeMismatchException') {
        errorMessage = 'Invalid confirmation code';
      } else if (error.name === 'ExpiredCodeException') {
        errorMessage = 'Confirmation code has expired';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const email = getValues('email');
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await cognitoAuth.resendConfirmationCode(email);
      setError(null);
      alert('Confirmation code resent to your email!');
    } catch (error: any) {
      setError(error.message || 'Failed to resend confirmation code');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-600">
            Account Confirmed! ✅
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Your account has been successfully confirmed. Redirecting to login...
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Confirm Your Account</CardTitle>
        <p className="text-center text-muted-foreground">
          Please enter the confirmation code sent to your email
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Confirmation Code
            </label>
            <input
              {...register('code')}
              type="text"
              id="code"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter confirmation code"
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Confirming...' : 'Confirm Account'}
          </Button>

          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-primary hover:underline"
            >
              Resend Code
            </button>
            
            {onBackToLogin && (
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-primary hover:underline"
              >
                Back to Login
              </button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
