import { Suspense } from 'react';
import Designer from './designer';

export default function DesignerPage() {

  return (
    <Suspense fallback={<div>Loading map designer...</div>}>
      <Designer />
    </Suspense>
  );
}