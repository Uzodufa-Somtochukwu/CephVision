"use client";

import { Suspense } from "react";
import ConfirmPasswordForm from "@/components/auths/confirmPasswordForm";

const ConfirmPasswordPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2">
    <div className="w-full max-w-md">
      {/* useSearchParams needs a Suspense boundary during static build */}
      <Suspense fallback={null}>
        <ConfirmPasswordForm />
      </Suspense>
    </div>
  </div>
);

export default ConfirmPasswordPage;
