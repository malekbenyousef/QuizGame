'use client';

import { Suspense } from 'react';
import ScanPageContent from './scanpageconte';

export default function ScanPage() {
  return (
    <Suspense fallback={<div>Loading QR Scanner...</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
