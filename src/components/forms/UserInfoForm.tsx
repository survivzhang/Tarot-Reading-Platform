'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface UserInfoFormProps {
  onSubmit: (data: { email: string; question: string; language: 'EN' | 'ZH' }) => void;
  isLoading?: boolean;
}

export default function UserInfoForm({ onSubmit, isLoading = false }: UserInfoFormProps) {
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState<'EN' | 'ZH'>('EN');
  const [errors, setErrors] = useState<{ email?: string; question?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; question?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!question || question.trim().length < 10) {
      newErrors.question = 'Please enter your question (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit({ email, question: question.trim(), language });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
          Share Your Question
        </h2>
        <p className="text-gray-600 text-sm">
          The cards will provide guidance and insight
        </p>
      </div>

      {/* Email Input */}
      <Input
        type="email"
        label="Email Address"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={isLoading}
        required
      />

      {/* Question Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Question
        </label>
        <textarea
          className={`
            w-full px-4 py-2 border rounded-lg min-h-[120px]
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${errors.question ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="What guidance do you seek from the cards?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          required
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-600">{errors.question}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {question.length}/500 characters
        </p>
      </div>

      {/* Language Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interpretation Language
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="language"
              value="EN"
              checked={language === 'EN'}
              onChange={(e) => setLanguage(e.target.value as 'EN' | 'ZH')}
              disabled={isLoading}
              className="mr-2"
            />
            <span className="text-gray-700">English</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="language"
              value="ZH"
              checked={language === 'ZH'}
              onChange={(e) => setLanguage(e.target.value as 'EN' | 'ZH')}
              disabled={isLoading}
              className="mr-2"
            />
            <span className="text-gray-700">中文</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Get Reading'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to receive your tarot reading via email
      </p>
    </form>
  );
}
