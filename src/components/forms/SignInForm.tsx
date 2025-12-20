'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface SignInFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string) => void;
  isLoading?: boolean;
}

export default function SignInForm({ isOpen, onClose, onSignIn, isLoading = false }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    onSignIn(email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-sm text-gray-600">
          This email already has an account. Please sign in to continue.
        </div>

        <Input
          type="email"
          label="Email Address"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          disabled={isLoading}
          required
          autoFocus
        />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            Sign In
          </Button>
        </div>
      </form>
    </Modal>
  );
}
