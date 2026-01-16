import { LanguagesIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { getTranslationForLocale } from "~/i18n/ui";

type LanguageSwitcherSheetProps = {
  locale: string;
};

// Map locale codes to emoji flags
const localeFlags: Record<string, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
};

export const LanguageSwitcherSheet = ({
  locale,
}: LanguageSwitcherSheetProps) => {
  const ui = useMemo(() => getTranslationForLocale(locale), [locale]);

  return (
    <Sheet>
      <SheetTrigger className="flex items-center space-x-1">
        {/* Show flag + icon */}
        <span className="text-lg">{localeFlags[locale]}</span>
        <LanguagesIcon className="text-white w-5 h-5" />
      </SheetTrigger>

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{ui["menu.languageSwitcher"]}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-8">
          {Object.entries(localeFlags).map(([key, flag]) => {
            const names: Record<string, string> = {
              en: "English",
              de: "German",
              es: "Spanish",
              fr: "French",
              it: "Italian",
            };
            const nativeNames: Record<string, string> = {
              en: "",
              de: "Deutsch",
              es: "Español",
              fr: "Français",
              it: "Italiano",
            };
            return (
              <a key={key} href={`/${key}`} className="w-48">
                <Button
                  variant="secondary"
                  className="w-full cursor-pointer justify-start bg-transparent gap-3"
                >
                  <span className="text-lg">{flag}</span>
                  {names[key]}{" "}
                  {nativeNames[key] && (
                    <span className="italic opacity-80">
                      {nativeNames[key]}
                    </span>
                  )}
                </Button>
              </a>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
