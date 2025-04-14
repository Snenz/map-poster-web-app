import { Suspense } from 'react';
import Designer from './designer';

export default function DesignerPage() {

  // implement a suspense boundary to allow useSearchParams to be used in the designer component
  return (
    <Suspense fallback={<div>Loading map designer...</div>}>
      <Designer />
    </Suspense>
  );
}