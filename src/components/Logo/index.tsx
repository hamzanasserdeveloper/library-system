"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import { useTranslations } from "next-intl";

export interface LogoPropsType {
  quality?: number;
  width?: number;
  height?: number;
  size?: number;
  className?: string;
  withoutLogoTitle?: boolean;
}
const Logo = ({
  withoutLogoTitle = false,
  size = 40,
  width = size,
  quality = 80,
  height = size,
  className = "text-[23px] font-bold",
}: LogoPropsType) => {
  const t = useTranslations("logo");
  if (withoutLogoTitle) {
    return (
      <Image
        alt="logo"
        src={logo}
        width={width}
        height={height}
        quality={quality}
      ></Image>
    );
  }
  return (
    <div className={`flex items-center  ${className}`}>
      {t("prefix")}
      <Image
        alt="logo"
        src={logo}
        width={width}
        height={height}
        quality={quality}
      ></Image>
      {t("suffix")}
    </div>
  );
};
export default Logo;
