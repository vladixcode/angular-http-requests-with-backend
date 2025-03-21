import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { catchError, map, throwError } from 'rxjs'

import { Place } from '../place.model'
import { PlacesComponent } from '../places.component'
import { PlacesContainerComponent } from '../places-container/places-container.component'
import { HttpClient } from '@angular/common/http'

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
  private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  // constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.isFetching.set(true)
    const subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map((resData) => resData.places),
        catchError((error) => {
          console.error(error)
          return throwError(() => new Error('Something went wrong! Please try again later...'))
        }),
      )
      .subscribe({
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
}
