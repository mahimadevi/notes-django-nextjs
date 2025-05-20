"use client";

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, ReactNode } from "react";
import api from "@/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/constants";

interface JwtPayload {
  exp: number;
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
          await refreshToken();
        } else {
          setIsAuthorized(true);
        }
      } catch {
        setIsAuthorized(false);
      }
    };

    auth().catch(() => setIsAuthorized(false));
  }, []);

  useEffect(() => {
    if (isAuthorized === false) {
      router.push("/login");
    }
  }, [isAuthorized, router]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : null;
}
