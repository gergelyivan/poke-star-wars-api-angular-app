import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MENU_ITEMS } from '../common/constants/menu-items.constant';
import { ApiService } from '../common/services/api-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit  {
	menuItems = MENU_ITEMS || [];
	state!: string;

	constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

	ngOnInit() {
		this.api.stateEvent
	    .subscribe((v: string) => {
	    	this.state = v;
	    	this.cd.detectChanges();
	    });
	}

	getListClicked(menuItem: any) {
		if (!this.state || this.state !== menuItem.value) {
			this.api.getListClicked(menuItem);
		}
	}

}
