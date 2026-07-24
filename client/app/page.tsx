import { Suspense } from "react";

import BrowseEquipment from "./BrowseEquipment";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>}>
      <BrowseEquipment />
    </Suspense>
  );
}
