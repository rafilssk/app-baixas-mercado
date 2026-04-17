import { Routes } from '@angular/router';
import { OperadorComponent } from './features/operador/operador';
import { FiscalComponent } from './features/fiscal/fiscal';
import { ConfiguracaoComponent } from './features/configuracao/configuracao';

export const routes: Routes = [
  { path: '', redirectTo: 'operador', pathMatch: 'full' },
  { path: 'operador', component: OperadorComponent },
  { path: 'fiscal', component: FiscalComponent },
  { path: 'config', component: ConfiguracaoComponent },
];