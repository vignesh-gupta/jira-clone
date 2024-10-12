"use client";

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/hooks/use-current";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      console.log("Redirecting to sign-in");

      router.push("/sign-in");
    }
  }, [data, router, isLoading]);

  return (
    <div>
      <p>{`Hello ${data?.name}`}</p>
      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  );
}
