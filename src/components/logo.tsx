import Image from "next/image";
import Link from "next/link";
import React from "react";

type LogoProps = {
  size?: number;
};

const Logo = ({ size = 40}: LogoProps) => {
  return (
    <Link href={"/"} className="flex gap-2 items-center">
      <Image src="/logo.svg" alt="Logo" width={size} height={size} />
      <span className="text-3xl font-extrabold">Jira Clone</span>
    </Link>
  );
};

export default Logo;
