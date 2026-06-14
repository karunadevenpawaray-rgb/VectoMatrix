"use client";

import { useState } from "react";
import Link from "next/link";
import { mockEngine } from "@vectormatrix/mock-engine";

export default function AgencyOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [agencyName, setAgencyName] = useState("");
  const [brn, setBrn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await mockEngine.createAgency({
        name: agencyName,
        brn,
        email,
        phone
      });
      setStep(3); // Go to success step
    } catch (error) {
      alert("Failed to register agency.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Partner with VectoMatrix
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Reach thousands of Mauritian travelers and manage your packages effortlessly.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-200">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Step 1: Business Details</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                <input 
                  type="text" required 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. BlueSky Travel Ltd"
                  value={agencyName} onChange={(e) => setAgencyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Registration Number (BRN)</label>
                <input 
                  type="text" required 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. C12345678"
                  value={brn} onChange={(e) => setBrn(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!agencyName || !brn}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Step 2: Admin Contact & Auth</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Official Email</label>
                <input 
                  type="email" required 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="admin@agency.mu"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Admin Phone Number</label>
                <input 
                  type="tel" required 
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="+230 5..."
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading || !email || !phone}
                  className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? "Verifying..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h3>
              <p className="text-gray-500 mb-8">
                Your application for {agencyName} (BRN: {brn}) is currently under review. Our team will contact you at {email} within 24 hours to activate your vendor dashboard.
              </p>
              <Link href="/b2b" className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black">
                Return to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
