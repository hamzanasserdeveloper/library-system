"use client";

import { useServerInsertedHTML } from "next/navigation";
import { CookieKeys } from "@/constants/SystemConfig";

const themeScript = `
  (function () {
    try {
      var stored = null;
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var pair = cookies[i].trim();
        var index = pair.indexOf('=');
        if (index === -1) continue;
        var key = pair.slice(0, index);
        var value = decodeURIComponent(pair.slice(index + 1));
        if (key === '${CookieKeys.Theme}' && (value === 'light' || value === 'dark')) {
          stored = value;
          break;
        }
      }
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = stored || (prefersDark ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: themeScript }} />
  ));

  return null;
}
