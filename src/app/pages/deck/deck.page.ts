import {AfterViewInit, Component} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-deck',
    templateUrl: './deck.page.html',
    styleUrls: ['./deck.page.scss'],
})
export class DeckPage implements AfterViewInit {

    constructor(private websocketService: WebsocketService,
                private router: Router) {
    }

    async ngAfterViewInit() {
        if (!this.websocketService.isConnected) {
            await this.router.navigate([''], {replaceUrl: true});
        }
    }

    async close() {
        this.websocketService.close();
    }
}
