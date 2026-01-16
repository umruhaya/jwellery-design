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

export const LanguageSwitcherSheet = ({
  locale,
}: LanguageSwitcherSheetProps) => {
  const ui = useMemo(() => getTranslationForLocale(locale), [locale]);
  return (
    <Sheet>
      <SheetTrigger>
        <LanguagesIcon className="text-white" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{ui["menu.languageSwitcher"]}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <a href="/en" className="w-48">
            <Button
              variant="secondary"
              className="w-full cursor-pointer justify-start bg-transparent gap-3"
            >
              <span className="text-lg">🇬🇧</span>
              English
            </Button>
          </a>

          <a href="/de" className="w-48">
            <Button
              variant="secondary"
              className="w-full cursor-pointer justify-start bg-transparent gap-3"
            >
              <span className="text-lg">🇩🇪</span>
              German <span className="italic opacity-80">Deutsch</span>
            </Button>
          </a>

          <a href="/es" className="w-48">
            <Button
              variant="secondary"
              className="w-full cursor-pointer justify-start bg-transparent gap-3"
            >
              <span className="text-lg">🇪🇸</span>
              Spanish <span className="italic opacity-80">Español</span>
            </Button>
          </a>

          <a href="/fr" className="w-48">
            <Button
              variant="secondary"
              className="w-full cursor-pointer justify-start bg-transparent gap-3"
            >
              <span className="text-lg">🇫🇷</span>
              French <span className="italic opacity-80">Français</span>
            </Button>
          </a>

          <a href="/it" className="w-48">
            <Button
              variant="secondary"
              className="w-full cursor-pointer justify-start bg-transparent gap-3"
            >
              <span className="text-lg">🇮🇹</span>
              Italian <span className="italic opacity-80">Italiano</span>
            </Button>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
};
