import { Injectable } from '@angular/core';
import {SettingsService} from "../settings/settings.service";
import {AppearanceType} from "../../enums/appearance-type";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private settingsService: SettingsService) { }

  mediaQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

  async updateTheme() {
    this.unregisterListener();
    let appearance = await this.settingsService.getAppearance();
    switch (appearance) {
      case AppearanceType.System:
        const darkModeOn =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        document.body.classList.toggle("dark", darkModeOn);
        this.registerListener();
        break;
      case AppearanceType.Dark:
        document.body.classList.toggle("dark", true);
        break;
      case AppearanceType.Light:
        document.body.classList.toggle("dark", false);
        break;
    }
  }

  private registerListener() {
    this.mediaQuery?.addEventListener("change", this.handleThemeChanged);
  }

  private unregisterListener() {
    this.mediaQuery?.removeEventListener("change", this.handleThemeChanged);
  }

  private handleThemeChanged(event: MediaQueryListEvent) {
    document.body.classList.toggle("dark", event.matches);
  }
}
