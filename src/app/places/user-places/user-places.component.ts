import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'

import { PlacesContainerComponent } from '../places-container/places-container.component'
import { PlacesComponent } from '../places.component'
// import { Place } from '../place.model'
import { PlacesService } from '../places.service'

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  // places = signal<Place[] | undefined>(undefined)

  isFetching = signal(false)
  error = signal('')
  private placesService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)

  places = this.placesService.loadedUserPlaces

  ngOnInit(): void {
    this.isFetching.set(true)
    const subscription = this.placesService.loadUserPlaces().subscribe({
      // Moved to places Service with tap operator
      // next: (places) => {
      //   this.places.set(places)
      // },
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
}
