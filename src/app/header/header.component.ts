import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ApiService } from '../common/services/api-service.service';
import { LocalService } from '../common/services/local.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

	searchText!: string;
	localSearches!: any[]

	constructor(private api: ApiService, public localService: LocalService) {}

	ngOnInit() {
		this.localSearches = JSON.parse(this.localService.getData("searches"));
		this.localService.changes.subscribe(changes => {
			if (changes.key === "searches") {
				this.localSearches = JSON.parse(changes.value);
			}
		});
	}

	loadLastSearch(search: any) {
		if (search.search && search.menu) {
			this.api.searchClicked(search.search, search.menu);
			this.searchTextChanged("");
		}
	}

	search() {
		this.api.searchClicked(this.searchText);
	}

	searchTextChanged(value: string) {
		this.searchText = value;
		this.api.searchTextChanged(value);
	}
}
