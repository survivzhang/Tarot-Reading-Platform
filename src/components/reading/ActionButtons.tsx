'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import TipButton from '@/components/payment/TipButton';
import type { Region } from '@prisma/client';

interface ActionButtonsProps {
  region: Region;
  onTip: (amount: number) => void;
  hasCreditsLeft: boolean;
}

export default function ActionButtons({ region, onTip, hasCreditsLeft }: ActionButtonsProps) {
  const router = useRouter();

  const handleNextReading = () => {
    if (hasCreditsLeft) {
      router.push('/');
    } else {
      router.push('/purchase');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button
        variant="primary"
        size="lg"
        onClick={handleNextReading}
      >
        {hasCreditsLeft ? 'Next Reading' : 'Get More Readings'}
      </Button>

      <TipButton
        region={region}
        onTip={onTip}
      />
    </div>
  );
}
