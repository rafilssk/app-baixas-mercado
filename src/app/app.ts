import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 inset-x-0 sm:top-4 sm:inset-x-6 z-50 bg-white/80 backdrop-blur-2xl sm:rounded-2xl border-b sm:border border-slate-200/50 shadow-xl shadow-slate-200/20 transition-all duration-500">
      <div class="max-w-[90rem] mx-auto px-4 sm:px-6 py-3">
        <div class="flex items-center justify-between">
          
          <div class="flex items-center hover:scale-[1.03] transition-transform duration-300 cursor-pointer">
            <img src="logo.png" alt="Cimi Supermercados" class="h-10 sm:h-12 object-contain drop-shadow-md">
          </div>

          <div class="hidden md:flex items-center gap-2 bg-slate-50/80 p-1 sm:p-1.5 rounded-[1rem] border border-slate-200/50 shadow-inner">
            <a routerLink="/operador" routerLinkActive="bg-white text-indigo-600 shadow-sm border-slate-200/80" [routerLinkActiveOptions]="{exact: true}" class="px-4 sm:px-6 py-2 rounded-xl font-bold text-[10px] sm:text-xs text-slate-400 hover:text-slate-700 transition-all duration-300 flex items-center gap-2 uppercase tracking-widest border border-transparent">
              <span class="text-sm sm:text-base leading-none">⚡</span> <span class="hidden sm:block mt-0.5">Operador</span>
            </a>
            <a routerLink="/fiscal" routerLinkActive="bg-white text-indigo-600 shadow-sm border-slate-200/80" class="px-4 sm:px-6 py-2 rounded-xl font-bold text-[10px] sm:text-xs text-slate-400 hover:text-slate-700 transition-all duration-300 flex items-center gap-2 uppercase tracking-widest border border-transparent">
              <span class="text-sm sm:text-base leading-none">📋</span> <span class="hidden sm:block mt-0.5">Fiscal</span>
            </a>
            <a routerLink="/config" routerLinkActive="bg-white text-indigo-600 shadow-sm border-slate-200/80" class="px-4 sm:px-6 py-2 rounded-xl font-bold text-[10px] sm:text-xs text-slate-400 hover:text-slate-700 transition-all duration-300 flex items-center gap-2 uppercase tracking-widest border border-transparent">
              <span class="text-sm sm:text-base leading-none">⚙️</span> <span class="hidden sm:block mt-0.5">Config</span>
            </a>
          </div>

          <div class="md:hidden flex items-center">
             <button (click)="toggleMenu()" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   @if(!menuAberto()) {
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                   } @else {
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                   }
                </svg>
             </button>
          </div>
          
        </div>

        @if(menuAberto()) {
          <div class="md:hidden mt-4 pb-2 flex flex-col gap-2 animate-in slide-in-from-top-4">
              <a routerLink="/operador" (click)="fecharMenu()" routerLinkActive="bg-white text-indigo-600 shadow-sm border-slate-200/80" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-3 rounded-xl font-black text-xs text-slate-500 flex items-center gap-3 uppercase tracking-widest border border-transparent bg-slate-50">
                <span class="text-lg leading-none">⚡</span> Operador
              </a>
              <a routerLink="/fiscal" (click)="fecharMenu()" routerLinkActive="bg-white text-indigo-600 shadow-sm border-slate-200/80" class="px-4 py-3 rounded-xl font-black text-xs text-slate-500 flex items-center gap-3 uppercase tracking-widest border border-transparent bg-slate-50">
                <span class="text-lg leading-none">📋</span> Fiscal
              </a>
              <a routerLink="/config" (click)="fecharMenu()" routerLinkActive="bg-white text-indigo-600 shadow-sm border-slate-200/80" class="px-4 py-3 rounded-xl font-black text-xs text-slate-500 flex items-center gap-3 uppercase tracking-widest border border-transparent bg-slate-50">
                <span class="text-lg leading-none">⚙️</span> Configuração
              </a>
          </div>
        }
      </div>
    </nav>

    <main class="pt-[80px] sm:pt-[100px] min-h-screen bg-slate-50/50">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {
  menuAberto = signal(false);

  toggleMenu() {
    this.menuAberto.update(estado => !estado);
  }

  fecharMenu() {
    this.menuAberto.set(false);
  }
}