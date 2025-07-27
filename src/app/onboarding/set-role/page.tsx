'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import type { Roles } from '../../../../types/globals'; // or wherever your Roles type is

const SetRolePage = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [statusMessage, setStatusMessage] = useState('Setting up your profile...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const assignRole = async () => {
      if (!isLoaded || !isSignedIn) {
        if (isLoaded && !isSignedIn) {
          router.replace('/sign-in');
        }
        return;
      }

      if (!user) {
        setErrorMessage('User data not available.');
        return;
      }

      // If role already set, redirect
      const currentRole = user.publicMetadata?.role as Roles | undefined;
      if (currentRole) {
        setStatusMessage('Role already set. Redirecting...');
        localStorage.removeItem('selectedRoleForSignup');
        router.replace(currentRole === 'vendor' ? '/vendor/dashboard' : '/supplier/orders');
        return;
      }

      // Get stored role
      const storedRole = localStorage.getItem('selectedRoleForSignup') as Roles | null;
      if (!storedRole) {
        setErrorMessage('No role selected. Please start from the landing page.');
        router.replace('/');
        return;
      }

      try {
        // Call secure server API to update metadata
        const res = await fetch('/api/set-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            role: storedRole,
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        setStatusMessage(`Role set as ${storedRole}. Redirecting...`);
        localStorage.removeItem('selectedRoleForSignup');

        router.replace(storedRole === 'vendor' ? '/vendor/dashboard' : '/supplier/orders');
      } catch (err) {
        console.error('Failed to update user role:', err);
        setErrorMessage('Failed to set your role. Please try again or contact support.');
      }
    };

    assignRole();
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {errorMessage ? 'Error!' : 'Just a moment...'}
      </h1>
      <p className={`text-center text-lg ${errorMessage ? 'text-red-600' : 'text-gray-700'}`}>
        {errorMessage ?? statusMessage}
      </p>
    </div>
  );
};

export default SetRolePage;
