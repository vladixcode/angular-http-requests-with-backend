import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'

import { Place } from '../place.model'
import { PlacesComponent } from '../places.component'
import { PlacesContainerComponent } from '../places-container/places-container.component'

import { PlacesService } from '../places.service'

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined)
  isFetching = signal(false)
  error = signal('')
  private placesService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)

  // constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.isFetching.set(true)
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places)
      },
      error: (error: Error) => {
        this.error.set(error.message)
      },
      complete: () => {
        // Complete function will run once this entire process is done
        this.isFetching.set(false)
      },
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe() // Not required for HttpClient
    })
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => console.log('PUT', resData),
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })
  }
}
