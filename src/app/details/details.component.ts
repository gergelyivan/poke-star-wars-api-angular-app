import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { KeyValue } from '@angular/common';
import { ApiService } from '../common/services/api-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent implements OnInit {
	@Input() item!: any;
	@Output() detailsOffEvent = new EventEmitter<any>();

	constructor(private api: ApiService) {}

	ngOnInit() {
		this.api.menuItemSource.asObservable()
	    .subscribe((menuItem: any) => {
	    	if (this.item) {
	    		this.back();
	    	}
	    });
	}

	back() {
		this.detailsOffEvent.emit()
	}
}
