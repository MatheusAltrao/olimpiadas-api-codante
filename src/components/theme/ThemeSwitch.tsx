import { MoonIcon, SunIcon } from "lucide-react";

interface ThemeSwitchProps {
  theme: string | undefined;
}

const ThemeSwitch = ({ theme }: ThemeSwitchProps) => {
  const themeSwitch = () => {
    switch (theme) {
      case "light":
        return (
          <div className="flex items-center justify-between gap-6">
            Light <SunIcon size={16} />
          </div>
        );
      case "dark":
        return (
          <div className="flex items-center justify-between gap-6">
            Dark <MoonIcon size={16} />
          </div>
        );
    }
  };

  return themeSwitch();
};

export default ThemeSwitch;
