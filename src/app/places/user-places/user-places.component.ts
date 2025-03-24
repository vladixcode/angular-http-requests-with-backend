import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { map, catchError, throwError } from 'rxjs'
import { HttpClient } from '@angular/common/http'

import { PlacesContainerComponent } from '../places-container/places-container.component'
import { PlacesComponent } from '../places.component'
import { Place } from '../place.model'

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined)
  isFetching = signal(false)
  error = signal('')
  private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.isFetching.set(true)
    const subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/user-places')
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
