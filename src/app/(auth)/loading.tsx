"use client";

import { Loader } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <Loader className="size-10 animate-spin text-muted-foreground" />
    </div>
  );
};

export default ErrorPage;
