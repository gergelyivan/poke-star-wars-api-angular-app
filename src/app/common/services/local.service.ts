import { Injectable, Inject, InjectionToken } from '@angular/core';
import { LocalSearchConfigService, SearchConfig } from '../../config-module/config.module';
import { BehaviorSubject, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  private onSubject = new BehaviorSubject<any>({});
  public changes = this.onSubject.asObservable().pipe(share());

  constructor(@Inject(LocalSearchConfigService) public config: SearchConfig) {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  public saveData(key: string, value: any) {
    localStorage.setItem(key, value);
    this.onSubject.next({ key: key, value: value})
  }

  public getData(key: string): any {
    return localStorage.getItem(key);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
    this.onSubject.next({ key: key, value: null });
  }

  public clearData() {
    localStorage.clear();
    this.onSubject.next({});
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      let v;
      try { v = JSON.parse(event.newValue as string); }
      catch (e) { v = event.newValue; }
      this.onSubject.next({ key: event.key, value: v });
    }
  }

}