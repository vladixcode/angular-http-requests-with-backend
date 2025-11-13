import { inject, Injectable, signal } from '@angular/core'
import { map, catchError, throwError, tap, Observable } from 'rxjs'

import { Place } from './place.model'
import { HttpClient } from '@angular/common/http'
import { ErrorService } from '../shared/error.service'

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([])
  private httpClient = inject(HttpClient)
  private errorService = inject(ErrorService)

  loadedUserPlaces = this.userPlaces.asReadonly()

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places').pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces),
      }),
    )
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces()

    if (prevPlaces.some((p) => p.id === place.id)) {
      return new Observable()
    }

    // this.userPlaces.set([...prevPlaces, place])

    return this.httpClient
      .put<{ userPlaces: Place[] }>('http://localhost:3000/user-places', {
        placeId: place.id,
      })
      .pipe(
        tap({
          next: (resData) => this.userPlaces.set(resData.userPlaces),
        }),
        catchError((error) => {
          // this.userPlaces.set(prevPlaces)
          console.error(error)
          this.errorService.showError('Failed to store selected place.')
          return throwError(() => new Error('Failed to store selected place.'))
        }),
      )
  }

  removeUserPlace(place: Place) {
    console.log(place)
  }

  private fetchPlaces(
    url: string,
    errorMessage = 'Something went wrong! Please try again later...',
  ) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.error(error)
        return throwError(() => new Error(errorMessage))
      }),
    )
  }
}
