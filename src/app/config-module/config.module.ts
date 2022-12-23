import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalService } from '../common/services/local.service';

export interface SearchConfig {
	storedSearches: number;
}

export interface NgxSpinnerConfig {
	type?: string;
}

export const LocalSearchConfigService = new InjectionToken<SearchConfig>("SearchConfig");

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ConfigModule {

	static forRoot(config: SearchConfig): ModuleWithProviders<ConfigModule> {
		return {
			ngModule: ConfigModule,
			providers: [
				LocalService,
				{
					provide: LocalSearchConfigService,
					useValue: config
				}
			]
		}
	}
}
