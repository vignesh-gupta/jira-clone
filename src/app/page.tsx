import UserButton from "@/components/user-button";
import { getCurrentUser } from "@/features/auth/action";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    const pathname = headers().get("x-pathname") || "/";
    const currentEncodedURL = encodeURIComponent(pathname);
    redirect("/sign-in?q=" + currentEncodedURL);
  }

  return (
    <div>
      <UserButton />
    </div>
  );
}
