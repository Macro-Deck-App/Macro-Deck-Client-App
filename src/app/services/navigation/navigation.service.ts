import {Injectable} from '@angular/core';
import {NavigationDestination} from "../../enums/navigation-destination";
import {DeckPage} from "../../pages/deck/deck.page";
import {ConnectionLostPage} from "../../pages/connection-lost/connection-lost.page";
import {HomePage} from "../../pages/home/home.page";
import {environment} from "../../../environments/environment";
import {WebHomePage} from "../../pages/web-home/web-home.page";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  homePage = environment.webVersion ? WebHomePage : HomePage;
  deckPage = DeckPage;
  connectionLostPage = ConnectionLostPage;



  public async navigateTo(destination: NavigationDestination) {
    const nav = document.querySelector('ion-nav');
    if (nav === null) {
      return;
    }

    switch (destination) {
      case NavigationDestination.Home:
        await nav.setRoot(this.homePage, {animated: false});
        break;
      case NavigationDestination.Deck:
        await nav.setRoot(this.deckPage, {animated: false});
        break;
      case NavigationDestination.ConnectionLost:
        await nav.setRoot(this.connectionLostPage, {animated: false});
        break;
    }
  }
}
