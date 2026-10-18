"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    if (!loading) router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [loading, isAuthenticated, router]);
  return <div className="route-loading" aria-label="Loading" />;
}
