import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../common/services/api-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

	detailsItem!: any;

	constructor(private api: ApiService) {}

	ngOnInit() {}

	detailsOn(item: any) {
		this.detailsItem = item;
	}

	detailsOff() {
		this.detailsItem = null;
	}
}
