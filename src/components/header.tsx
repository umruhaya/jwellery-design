import { MailIcon, PhoneIcon } from "lucide-react";
import FixedTopBar from "./FixedTopBar";
import { LanguageSwitcherSheet } from "./language-switcher-sheet";
import { CyoDesignLogo } from "./logo";
import { MenuSheet } from "./menu-sheet";

type HeaderProps = {
  locale: string;
};

export const Header = ({ locale }: HeaderProps) => {
  return (
    <>
      <FixedTopBar />

      <header className="relative z-20 px-4 md:px-10 pt-8">
        {/* Left */}
        <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2">
          <MenuSheet locale={locale} />
        </div>

        {/* Center Logo */}
        <a
          href={locale === "de" ? "/de" : "/"}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <CyoDesignLogo size={150} />
        </a>

        {/* Right */}
        <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 flex items-center space-x-3">
          <LanguageSwitcherSheet locale={locale} />
          <a href="tel:+4917678901234">
            <PhoneIcon className="text-white" />
          </a>
          <a href="mailto:info@cyodesign.com">
            <MailIcon className="text-white" />
          </a>
        </div>

        {/* Spacer to preserve header height */}
        <div className="h-[150px]" />
      </header>
    </>
  );
};
