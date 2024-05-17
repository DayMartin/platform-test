import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './app/components/mapa/mapa.component';
import { LoginComponent } from './app/components/login/login.component';
import { AuthGuard } from './guard/guardRotas';
import { CadastrarUserComponent } from './app/components/cadastrar-user/cadastrar-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastrar', component: CadastrarUserComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'mapa', component: MapaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
