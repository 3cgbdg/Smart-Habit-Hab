"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FullSreenLoader from "../FullSreenLoader";
import { fetchProfile } from "@/redux/profileSlice";

// fetching data component every reload
const AuthClientUpload = () => {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state) => state.profile);
  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      try {
        // trying fetching profile with retry logic
        let retries = 3;
        let lastError;
        while (retries > 0) {
          try {
            await dispatch(fetchProfile()).unwrap();
            break;
          } catch (err) {
            lastError = err;
            retries--;
            if (retries > 0) {
              // waiting before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
        if (lastError && retries === 0) {
          throw lastError;
        }
      } catch {
        router.push("/auth/login");
      }
    };
    getData();
  }, [dispatch, router]);

  useEffect(() => {
    if (profileState.loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [profileState.loading]);

  useEffect(() => {
    if (profileState.error) {
      router.push("/auth/login");
    }
  }, [profileState.error, router]);

  if (profileState.loading) {
    <FullSreenLoader />;
  }

  return null;
};

export default AuthClientUpload;
