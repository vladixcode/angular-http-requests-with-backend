import { Injectable, signal } from '@angular/core'

import { Place } from './place.model'

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([])

  loadedUserPlaces = this.userPlaces.asReadonly()

  loadAvailablePlaces() {
    console.log('loadAvailablePlaces')
  }

  loadUserPlaces() {
    console.log('loadUserPlaces')
  }

  addPlaceToUserPlaces(place: Place) {
    console.log(place)
  }

  removeUserPlace(place: Place) {
    console.log(place)
  }
}
