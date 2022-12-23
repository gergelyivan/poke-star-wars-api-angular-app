import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { ApiService } from '../common/services/api-service.service';
import { MENU_ITEMS } from '../common/constants/menu-items.constant';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
	@Output() detailsOnEvent = new EventEmitter<any>();

	currentMenuItem!: any;
	listItems!: any[];
	listItemsEmitter$ = new BehaviorSubject<any[]>(this.listItems);
	menuItems = MENU_ITEMS;
	searchText!: string;
	state!: string;

	constructor(public api: ApiService, private cd: ChangeDetectorRef, private spinner: NgxSpinnerService) {}

	ngOnInit() {
		this.api.menuItemSource
	    .subscribe((menuItem: any) => {
	    	if (Object.keys(menuItem).length) {
	    		this.spinner.show();
	    		this.api.getList(menuItem.value)
				.subscribe(li => {
					setTimeout(() => {
						this.listItems = li;
						this.listItemsEmitter$.next(this.listItems)
						this.spinner.hide();
					}, 500);
				});
	    	}
	    });
	    this.api.searchTextEvent
	    .subscribe((value: string) => {
	    	this.searchText = value;
	    	if (this.listItems) {
	    		this.listItemsEmitter$.next(this.filterList(this.listItems))
			}
	    });
	    this.api.stateEvent
	    .subscribe((v: string) => {
	    	this.state = v;
	    	this.currentMenuItem = this.menuItems.filter(item => item.value === v)[0];
	    });
	    this.api.searchEvent
	    .subscribe((e: any) => {
	    	if ((this.currentMenuItem && Object.keys(this.currentMenuItem).length) || e.menu) {
	    		this.spinner.show();
	    		let requestData : any = { menuItemValue: this.currentMenuItem.value, searchText: e.search };
	    		if (e.menu) {
	    			requestData = { menuItemValue: e.menu, searchText: e.search, fromStoredSearches: true };
	    			this.currentMenuItem = this.menuItems.filter(item => item.value === e.menu)[0];
	    			this.api.getListClicked(this.currentMenuItem, e.search);
	    		}
	    		this.api.search(requestData)
				.subscribe(li => {
					setTimeout(() => {
						this.listItemsEmitter$.next(this.filterList(li))
						this.spinner.hide();
					}, 500);
				});
	    	}
	    	
	    });
	}

	detailsClicked(item: any) {
		this.detailsOnEvent.emit(item);
	}

	filterList(list: any[]) {
		let copy = JSON.parse(JSON.stringify(list));
		if (this.searchText !== "") {
	    	copy = list.filter((item: any) => {
				return this.currentMenuItem.keys.some((key: any) => {
					return String(item[key]).toLowerCase().includes(this.searchText.toLowerCase());
				});
			})
		}
		return copy;
	}

	getHeight(value: number) {
		if (value < 100) {
			return 'low';
		} else if (value >= 100 && value <= 200) {
			return 'normal';
		} else {
			return 'high';
		}
	}

	getInformation(item: any, key: string) {
		if (key === 'height' && this.state === 'people') {
			return this.getHeight(item[key]);
		} else if (key === 'length' && this.state === 'starships') {
			return this.getLength(item[key]);
		}
		return item[key];
	}

	getLength(value: number) {
		if (value < 100) {
			return 'small';
		} else if (value >= 100 && value <= 1000) {
			return 'normal';
		} else {
			return 'large';
		}
	}

	getMoreData(direction: string) {
		let apiDirection = direction === 'next' ? this.api.next : this.api.prev;
		if (apiDirection) {
			let page: number = parseInt( apiDirection.match(/\/\?page=(\d*)/)![1] );
			this.spinner.show();
			this.api.getList(this.currentMenuItem.value, page)
			.subscribe(li => {
				setTimeout(() => {
					this.listItems = li;
					if (this.searchText) {
						this.listItemsEmitter$.next(this.filterList(this.listItems))
					} else {
						this.listItemsEmitter$.next(this.listItems);
					}
					this.spinner.hide();
				}, 500);
			});
		}
	}

	
}
