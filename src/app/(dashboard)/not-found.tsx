"use client";

import { SearchSlash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="h-[70dvh] flex items-center justify-center flex-col gap-3">
      <SearchSlash className="size-10" />
      <p className="text-sm">Looks like, someone landed on wrong page</p>
      <Button variant="secondary" size="sm" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
