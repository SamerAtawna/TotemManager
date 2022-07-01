import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodComponent } from './Components/food/food.component';

const routes: Routes = [
  { path: '', redirectTo: 'app-root', pathMatch: 'full' },
  { path: 'food', component: FoodComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
