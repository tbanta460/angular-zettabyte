import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { TableComponent } from './table/table.component';
const routes: Routes = [
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/table',
  },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
