import Image from "next/image";
import logo from "@/assets/logo.png";
import { getTranslations } from "next-intl/server";

export interface LogoPropsType {
  quality?: number;
  width?: number;
  height?: number;
  size?: number;
  className?: string;
  withoutLogoTitle?: boolean;
}
const Logo = async ({
  withoutLogoTitle = false,
  size = 40,
  width = size,
  quality = 80,
  height = size,
  className = "text-[23px] font-bold",
}: LogoPropsType) => {
  const t = await getTranslations("logo");
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
