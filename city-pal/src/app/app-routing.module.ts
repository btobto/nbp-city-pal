import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { PersonComponent } from './pages/person/person.component';
import { PlaceComponent } from './pages/place/place.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: NavigationComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'person/:id', component: PersonComponent },
      { path: 'place/:id', component: PlaceComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '**',
    redirectTo: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
