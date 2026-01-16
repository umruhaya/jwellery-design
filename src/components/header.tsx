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

      <header className="relative z-20 px-4 md:px-10 pt-4 md:pt-8">
        {/* Left on mobile: Menu + Language */}
        <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 flex items-center justify-center space-x-2 md:space-x-3 w-auto">
          <MenuSheet locale={locale} />
          <div className="md:hidden">
            <LanguageSwitcherSheet locale={locale} />
          </div>
        </div>

        {/* Center Logo */}
        <a
          href={locale === "de" ? "/de" : "/"}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <CyoDesignLogo size={120} className="md:size-[150px]" />
        </a>

        {/* Right: Phone & Mail */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 md:space-x-3 md:right-10">
          <div className="hidden md:block">
            <LanguageSwitcherSheet locale={locale} />
          </div>
          <a href="tel:+4917678901234">
            <PhoneIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a href="mailto:info@cyodesign.com">
            <MailIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
          </a>
        </div>

        {/* Spacer to preserve header height */}
        <div className="h-[120px] md:h-[150px]" />
      </header>
    </>
  );
};
