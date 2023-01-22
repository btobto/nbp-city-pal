import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PlaceComponent } from './pages/place/place.component';
import { PersonComponent } from './pages/person/person.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './pages/search/search.component';
import { ReviewComponent } from './components/review/review.component';
import { ReviewsComponent } from './components/reviews/reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PlaceComponent,
    PersonComponent,
    RegisterComponent,
    NavbarComponent,
    NavigationComponent,
    SearchComponent,
    ReviewComponent,
    ReviewsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    {
      provide: 'POSITION_OPTIONS',
      useValue: { enableHighAccuracy: true },
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
