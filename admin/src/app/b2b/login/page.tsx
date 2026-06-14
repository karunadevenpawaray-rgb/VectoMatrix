"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

import { supabase } from "@/utils/supabase";

export default function VendorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* Original handleLogin code commented out to preserve history:
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { user, error } = await authService.login(email, password);
    
    setLoading(false);

    if (error) {
      alert("Auth Error: " + error.message);
    } else {
      router.push("/b2b/inventory");
    }
  };
  */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { user, error } = await authService.login(email, password);
    
    if (error) {
      setLoading(false);
      alert("Auth Error: " + error.message);
    } else if (user) {
      try {
        // Query the super_admins table to see if this user auth_id is a Super Admin
        const { data: superAdmin, error: superAdminError } = await supabase
          .from("super_admins")
          .select("id")
          .eq("auth_id", user.id)
          .single();

        setLoading(false);
        if (superAdmin && !superAdminError) {
          router.push("/superadmin");
        } else {
          router.push("/b2b/inventory");
        }
      } catch (err) {
        setLoading(false);
        router.push("/b2b/inventory");
      }
    } else {
      setLoading(false);
      router.push("/b2b/inventory");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Vendor Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your VectoMatrix travel packages.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
