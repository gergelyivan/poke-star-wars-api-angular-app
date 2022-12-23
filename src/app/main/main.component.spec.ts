import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LocalSearchConfigService } from '../config-module/config.module';

import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';
import { DetailsComponent } from '../details/details.component';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainComponent, HeaderComponent, MenuComponent, DetailsComponent ],
      imports: [ HttpClientTestingModule, FormsModule ], 
      providers: [
        { provide: LocalSearchConfigService, useValue: {storedSearches: 3} }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#detailsOff() should set detailsItem to null', () => {
    component.detailsOff();
    expect(component.detailsItem).toBe(null);
  });

  it('#detailsOn(value: any) should set detailsItem to value', () => {
    let value = {"name":"Tatooine","rotation_period":"23","orbital_period":"304","diameter":"10465","climate":"arid","gravity":"1 standard","terrain":"desert","surface_water":"1","population":"200000","residents":["https://swapi.dev/api/people/1/","https://swapi.dev/api/people/2/","https://swapi.dev/api/people/4/","https://swapi.dev/api/people/6/","https://swapi.dev/api/people/7/","https://swapi.dev/api/people/8/","https://swapi.dev/api/people/9/","https://swapi.dev/api/people/11/","https://swapi.dev/api/people/43/","https://swapi.dev/api/people/62/"],"films":["https://swapi.dev/api/films/1/","https://swapi.dev/api/films/3/","https://swapi.dev/api/films/4/","https://swapi.dev/api/films/5/","https://swapi.dev/api/films/6/"],"created":"2014-12-09T13:50:49.641000Z","edited":"2014-12-20T20:58:18.411000Z","url":"https://swapi.dev/api/planets/1/"};
    component.detailsOn(value);
    expect(component.detailsItem).toBe(value);
  });

});
