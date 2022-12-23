import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, mergeMap, forkJoin, shareReplay, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { People, Film, Starship, Vehicle, Species, Planet } from '../interfaces/api.models';
import { LocalService } from '../services/local.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	menuItemSource = new BehaviorSubject<any>({});
	searchTextEvent = new BehaviorSubject<string>("");
	searchEvent = new BehaviorSubject<any>({});
	stateEvent = new BehaviorSubject<string>("");

  TAG = 'SW Api Service : ';
  swapiUrl = 'https://swapi.dev/api/';

  list$!: Observable<any>;
  next!: string;
  prev!: string;

  constructor(private _http: HttpClient, private localService: LocalService) {}

  getListClicked(menuItem: any, search?: string) {
  	if (!search) {
  		this.menuItemSource.next(menuItem);
  	}
	  this.stateEvent.next(menuItem.value);
	}

  getList(menuItemValue: string, page?: number): Observable<any[]> {
  	switch (menuItemValue) {
			case "films":
				this.list$ = this.getFilms(page).pipe(shareReplay(1));
				break;
			case "people":
				this.list$ = this.getPeople(page).pipe(shareReplay(1));
				break;
			case "starships":
				this.list$ = this.getStarships(page).pipe(shareReplay(1));
				break;
			case "vehicles":
				this.list$ = this.getVehicles(page).pipe(shareReplay(1));
				break;
			case "species":
				this.list$ = this.getSpecies(page).pipe(shareReplay(1));
				break;
			case "planets":
				this.list$ = this.getPlanets(page).pipe(shareReplay(1));
				break;
		}
		return this.list$;
	}

	handleLocalStorage(menuItemValue: string, searchText: string) {
		if (!menuItemValue || !searchText) {
			return;
		}
		let searches: any[] = JSON.parse(this.localService.getData('searches')) === null ? [] : JSON.parse(this.localService.getData('searches'));
		let currentSearch = { menu: menuItemValue, search: searchText };
		if (searches.length === this.localService.config.storedSearches) {
			searches.splice(0, 1);
		} 
		searches.push(currentSearch);
		this.localService.saveData('searches', JSON.stringify(searches));
	}

	search( data: any ) {
		switch (data.menuItemValue) {
			case "films":
				this.list$ = this.searchFilms(data.searchText).pipe(shareReplay(1));
				break;
			case "people":
				this.list$ = this.searchPeople(data.searchText).pipe(shareReplay(1));
				break;
			case "starships":
				this.list$ = this.searchStarships(data.searchText).pipe(shareReplay(1));
				break;
			case "vehicles":
				this.list$ = this.searchVehicles(data.searchText).pipe(shareReplay(1));
				break;
			case "species":
				this.list$ = this.searchSpecies(data.searchText).pipe(shareReplay(1));
				break;
			case "planets":
				this.list$ = this.searchPlanets(data.searchText).pipe(shareReplay(1));
				break;
		}
		if (!data.fromStoredSearches) {
			this.handleLocalStorage(data.menuItemValue, data.searchText);
		}
		return this.list$;
	}

	searchClicked(searchText: string, menuItemValue?: string) {
		this.searchEvent.next({search: searchText, menu: menuItemValue});
	}

	searchTextChanged(value: any) {
		this.searchTextEvent.next(value);
	}

  /**
   * Add page value url param
   */
  getByPage(page?: number): string {
    if (page) { return '&page=' + page; } else { return ''; }
  }

  /**
   * Return list of people as observable
   */
  getPeople(page?: number): Observable<People[]> {
    return this._http.get<People[]>(`${this.swapiUrl}people?format=json${this.getByPage(page)}`)
              .pipe(
              	map((resp: any) => {
              		this.next = resp['next'];
              		this.prev = resp['previous'];
              		return resp['results']
              	}),
              	mergeMap((characters: any[]) => {
              		const ids = [...new Set(characters.map(character => parseInt(character.homeworld.match(/[^\/]+(?=\/[^\/]*$)/)) ))];
              		let planets: any = {}
              		ids.forEach((id:any) => {
              			planets[id] = this.getPlanet(id).pipe(shareReplay(1));
              		});
              		return forkJoin(
              			characters.map((character: any) => {
              				let currentId = parseInt(character.homeworld.match(/[^\/]+(?=\/[^\/]*$)/));
              				return planets[currentId].pipe(
              					map((planet: any) => {
              						character.homeworld = planet.name;
              						return character;
              					})
              				)
              			})
              		)
              	}),
                catchError(this.handleError)
              );
  }

  /**
   * Return people by id
   */
  getPeopleById(id: number): Observable<People> {
    return this._http.get<People>(`${this.swapiUrl}people/${id}?format=json`)
              .pipe(
                catchError(this.handleError)
              );
  }

  /**
   * Search people by name
   */
  searchPeople(name: string): Observable<People[]> {
    return this._http.get<People[]>(`${this.swapiUrl}people?search=${name}`)
              .pipe(
                map((resp: any) => resp['results']),
                catchError(this.handleError)
              );
  }

  /**
   * Return list of films as observable
   */
  getFilms(page?: number): Observable<Film[]> {
    return this._http.get<Film[]>(`${this.swapiUrl}films?format=json${this.getByPage(page)}`)
              .pipe(
                map((resp: any) => {
              		this.next = resp['next'];
              		this.prev = resp['previous'];
              		return resp['results']
              	}),
                catchError(this.handleError)
              );
  }

  /**
   * Return film by id
   */
  getFilm(id: number): Observable<Film> {
    return this._http.get<Film>(`${this.swapiUrl}films/${id}?format=json`)
              .pipe(
                catchError(this.handleError)
              );
  }

  /**
   * Search films by title
   */
  searchFilms(title: string): Observable<Film[]> {
    return this._http.get<Film[]>(`${this.swapiUrl}films?search=${title}`)
    .pipe(
      map((resp: any) => resp['results']),
      catchError(this.handleError)
    );
  }

	/**
	 * Return list of starships
	 */
	getStarships(page?: number): Observable<Starship[]> {
    return this._http.get<Starship[]>(`${this.swapiUrl}starships?format=json${this.getByPage(page)}`)
    .pipe(
      map((resp: any) => {
              		this.next = resp['next'];
              		this.prev = resp['previous'];
              		return resp['results']
              	}),
      catchError(this.handleError)
    );
  }

  /**
   * Return starship by id
   */
  getStarship(id: number): Observable<Starship> {
    return this._http.get<Starship>(`${this.swapiUrl}starships/${id}?format=json`)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search starships by name
   */
  searchStarships(name: string): Observable<Starship[]> {
    return this._http.get<Starship[]>(`${this.swapiUrl}starships?search=${name}`)
    .pipe(
      map((resp: any) => resp['results']),
      catchError(this.handleError)
    );
  }

  /**
   * Return list of vehicles as observable
   */
  getVehicles(page?: number): Observable<Vehicle[]> {
    return this._http.get<Vehicle[]>(`${this.swapiUrl}vehicles?format=json${this.getByPage(page)}`)
      .pipe(
        map((resp: any) => {
              		this.next = resp['next'];
              		this.prev = resp['previous'];
              		return resp['results']
              	}),
        catchError(this.handleError)
      );
    }

  /**
   * Return vehicle by id
   */
  getVehicle(id: number): Observable<Vehicle> {
    return this._http.get<Vehicle>(`${this.swapiUrl}vehicles/${id}?format=json`)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search vehicles by name
   */
  searchVehicles(name: string): Observable<Vehicle[]> {
    return this._http.get<Vehicle[]>(`${this.swapiUrl}vehicles?search=${name}`)
    .pipe(
      map((resp: any) => resp['results']),
      catchError(this.handleError)
    );
  }

  /**
   * Retrun list of species as observable
   */
  getSpecies(page?: number): Observable<Species[]> {
    return this._http.get<Species[]>(`${this.swapiUrl}species?format=json${this.getByPage(page)}`)
      .pipe(
        map((resp: any) => {
              		this.next = resp['next'];
              		this.prev = resp['previous'];
              		return resp['results']
              	}),
        catchError(this.handleError)
      );
    }

  /**
   * Return species by id
   */
  getSpeciesById(id: number): Observable<Species> {
    return this._http.get<Species>(`${this.swapiUrl}species/${id}?format=json`)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search species by name
   */
  searchSpecies(name: string): Observable<Species[]> {
    return this._http.get<Species[]>(`${this.swapiUrl}species?search=${name}`)
    .pipe(
      map((resp: any) => resp['results']),
      catchError(this.handleError)
    );
  }

  /**
   *  Return list od planets as observable
   */
  getPlanets(page?: number): Observable<Planet[]> {
    return this._http.get<Planet[]>(`${this.swapiUrl}planets?format=json${this.getByPage(page)}`)
      .pipe(
        map((resp: any) => {
              		this.next = resp['next'];
              		this.prev = resp['previous'];
              		return resp['results']
              	}),
        catchError(this.handleError)
      );
  }

  /**
   * Return planet by id
   */
  getPlanet(id: number): Observable<Planet> {
    return this._http.get<Planet>(`${this.swapiUrl}planets/${id}?format=json`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Search planets by name
   */
  searchPlanets(name: string): Observable<Planet[]> {
    return this._http.get<Planet[]>(`${this.swapiUrl}planets?search=${name}`)
    .pipe(
      map((resp: any) => resp['results']),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP Errors
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(`${this.TAG} An error occurred:`, error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `${this.TAG} Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      `${this.TAG} Something bad happened; please try again later.`);
  }

}