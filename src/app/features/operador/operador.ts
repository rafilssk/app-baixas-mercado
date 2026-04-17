import { Component, ElementRef, ViewChild, inject, signal, computed, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { StorageService } from '../../core/services/storage';

@Component({
  selector: 'app-operador',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <style>
      @keyframes scanLaser {
        0%, 100% { top: 5%; opacity: 0; }
        15%, 85% { opacity: 1; }
        50% { top: 95%; }
      }
      .laser-line { animation: scanLaser 2.5s ease-in-out infinite; }
      
      input[type="number"]::-webkit-inner-spin-button, 
      input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      input[type="number"] { -moz-appearance: textfield; }

      .bip-input::placeholder {
        font-size: clamp(0.6rem, 2.5vw, 1.25rem);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      }
    </style>

    <div class="min-h-[calc(100dvh-80px)] lg:h-[calc(100dvh-100px)] flex flex-col pt-2 pb-6 lg:pb-2 px-3 sm:px-4 lg:px-6 font-sans transition-colors duration-200 relative overflow-x-hidden overflow-y-auto lg:overflow-hidden custom-scrollbar"
         [class]="flashSucesso() ? 'bg-emerald-50' : 'bg-transparent'">
         
      @if(flashSucesso()) {
        <div class="fixed inset-0 bg-emerald-400/10 pointer-events-none z-50 animate-in fade-in duration-100"></div>
      }

      <div class="w-full max-w-[90rem] mx-auto flex flex-col h-full animate-in fade-in duration-700">
        
        <div class="shrink-0 mb-4 grid grid-cols-1 md:grid-cols-3 items-center gap-2 sm:gap-4">
          
          <div class="hidden md:flex flex-col items-start">
             <p class="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">Terminal Ativo</p>
          </div>
          
          <div class="flex flex-col items-center justify-center text-center w-full">
            <h1 class="whitespace-nowrap text-xl sm:text-2xl lg:text-[1.8rem] font-bold text-slate-800 uppercase tracking-[0.3em] leading-none lg:ml-2">
              Controle de Baixas
            </h1>
          </div>
          
          <div class="flex items-center justify-center md:justify-end z-10">
            <div class="flex items-center gap-3 bg-white/90 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-4 rounded-[1rem] border border-slate-200 shadow-sm">
              <div class="flex items-center gap-2 border-r border-slate-200 pr-3">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Online</span>
              </div>
              <div class="flex items-center gap-2 font-mono tracking-widest mt-0.5">
                <span class="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">{{ dataAtual() }}</span>
                <span class="text-slate-300 font-black hidden sm:inline">•</span>
                <span class="text-xs sm:text-sm font-black text-slate-800">{{ horaAtual() }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4">
          
          <div class="lg:col-span-7 flex flex-col bg-white rounded-[1.5rem] p-4 sm:p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden transition-all duration-500">
            <div class="absolute top-0 left-0 w-full h-1.5 transition-colors duration-500" 
                 [class]="medidaSelecionada === 'UN' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-rose-400 to-red-500'"></div>

            <div class="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 mt-2">
              <div class="space-y-1.5">
                <label class="text-[10px] sm:text-xs uppercase font-black tracking-widest text-slate-400 ml-1">Setor de Origem</label>
                <div class="relative group">
                  <select [(ngModel)]="setorSelecionado" class="w-full appearance-none bg-slate-50 border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-black p-3 sm:p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer text-sm sm:text-lg shadow-sm">
                    <option value="" disabled selected>Selecione o setor...</option>
                    <option value="Hortifruti">Hortifruti</option>
                    <option value="Laticínios">Laticínios</option>
                    <option value="Controle de Produção">Controle de Produção</option>
                    <option value="Triagem">Triagem</option>
                    <option value="Prevenção">Prevenção</option>
                    <option value="Baixas Recepção">Baixas Recepção</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] sm:text-xs uppercase font-black tracking-widest text-slate-400 ml-1">Motivo da Baixa</label>
                <div class="relative group">
                  <select [(ngModel)]="motivoSelecionado" class="w-full appearance-none bg-slate-50 border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-black p-3 sm:p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer text-sm sm:text-lg shadow-sm">
                    <option value="" disabled selected>Selecione o motivo...</option>
                    <option value="Avaria">Avaria (Quebra)</option>
                    <option value="Aproveitamento">Aproveitamento</option>
                    <option value="Consumo">Consumo Interno</option>
                    <option value="Descarte">Descarte (Lixo)</option>
                    <option value="Outros">Outros</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div class="shrink-0 bg-slate-100 p-1.5 rounded-xl flex mb-5 shadow-inner">
              <button (click)="mudarMedida('UN')" class="relative flex-1 py-3 sm:py-4 rounded-lg font-black text-xs sm:text-sm md:text-base tracking-wide transition-all duration-300" 
                      [class]="medidaSelecionada === 'UN' ? 'bg-white shadow-md text-emerald-600 border border-emerald-100 scale-[1.01]' : 'text-slate-400 hover:text-slate-600'">
                📦 UNIDADE <span class="absolute top-1 right-2 text-[8px] sm:text-[9px] opacity-50 hidden sm:inline">F2</span>
              </button>
              <button (click)="mudarMedida('KG')" class="relative flex-1 py-3 sm:py-4 rounded-lg font-black text-xs sm:text-sm md:text-base tracking-wide transition-all duration-300" 
                      [class]="medidaSelecionada === 'KG' ? 'bg-white shadow-md text-rose-600 border border-rose-100 scale-[1.01]' : 'text-slate-400 hover:text-slate-600'">
                ⚖️ QUILO (KG) <span class="absolute top-1 right-2 text-[8px] sm:text-[9px] opacity-50 hidden sm:inline">F3</span>
              </button>
            </div>

            <div class="shrink-0 flex items-center justify-center sm:justify-between gap-2 mb-4 py-4 px-3 sm:px-8 overflow-hidden rounded-2xl bg-slate-50 border-2 border-slate-100 transition-colors"
                 [class]="medidaSelecionada === 'UN' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'">
              
              <div class="hidden sm:flex flex-col items-center justify-center transition-all duration-500 w-28"
                   [class]="medidaSelecionada === 'UN' ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-30 grayscale scale-90'">
                <div class="text-5xl drop-shadow-lg mb-2">📦</div>
                <div class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center leading-tight" [class]="medidaSelecionada === 'UN' ? 'text-emerald-600' : 'text-slate-400'">
                  Caixas / Itens<br><span class="opacity-60">Tecla [F2]</span>
                </div>
              </div>

              <div class="flex items-center gap-3 sm:gap-6 z-10 shrink-0">
                <button (click)="alterarQtd(-1)" class="w-12 h-12 sm:w-16 sm:h-16 bg-white border-2 border-slate-200 rounded-xl font-black text-3xl sm:text-4xl text-slate-400 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-500 active:scale-95 transition-all focus:outline-none flex items-center justify-center pb-1">
                  -
                </button>
                <div class="relative group">
                  <input type="number" [(ngModel)]="quantidadeAtual" 
                         class="w-32 sm:w-56 bg-transparent text-center text-4xl sm:text-6xl font-black focus:outline-none transition-colors duration-500 tracking-tight" 
                         [class]="medidaSelecionada === 'UN' ? 'text-emerald-600' : 'text-rose-600'">
                </div>
                <button (click)="alterarQtd(1)" class="w-12 h-12 sm:w-16 sm:h-16 text-white rounded-xl font-black text-3xl sm:text-4xl shadow-md active:scale-95 transition-all duration-300 focus:outline-none flex items-center justify-center pb-1" 
                        [class]="medidaSelecionada === 'UN' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-400 shadow-rose-200'">
                  +
                </button>
              </div>

              <div class="hidden sm:flex flex-col items-center justify-center transition-all duration-500 w-28"
                   [class]="medidaSelecionada === 'KG' ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-30 grayscale scale-90'">
                <div class="text-5xl drop-shadow-lg mb-2">⚖️</div>
                <div class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center leading-tight" [class]="medidaSelecionada === 'KG' ? 'text-rose-600' : 'text-slate-400'">
                  Pesagem (KG)<br><span class="opacity-60">Tecla [F3]</span>
                </div>
              </div>
            </div>

            <div class="relative group mt-1 flex-1 min-h-[120px] sm:min-h-[160px] rounded-[1.5rem] overflow-hidden border-[4px] transition-all duration-500 shadow-inner flex flex-col justify-center"
                 [class]="medidaSelecionada === 'UN' ? 'bg-[#050f0a] border-emerald-900/80 shadow-emerald-900/30' : 'bg-[#0f0505] border-rose-900/80 shadow-rose-900/30'">
              
              <div class="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-500"
                   [class]="medidaSelecionada === 'UN' ? 
                   'bg-[linear-gradient(rgba(16,185,129,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.3)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:linear-gradient(to_bottom,black,transparent)]' : 
                   'bg-[linear-gradient(rgba(244,63,94,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.3)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:linear-gradient(to_bottom,black,transparent)]'">
              </div>

              <div class="laser-line absolute left-0 right-0 h-[3px] shadow-[0_0_15px_3px] pointer-events-none z-0"
                   [class]="medidaSelecionada === 'UN' ? 'bg-emerald-400 shadow-emerald-400/70' : 'bg-rose-400 shadow-rose-400/70'">
              </div>

              <div class="absolute left-4 sm:left-6 opacity-40 pointer-events-none transition-transform duration-300 group-focus-within:scale-110 z-10"
                   [class]="medidaSelecionada === 'UN' ? 'text-emerald-400' : 'text-rose-400'">
                <svg class="w-8 h-8 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
              </div>
              
              <input #scannerInput type="text" [(ngModel)]="codigoAtual" (keyup.enter)="processarBip()"
                     class="bip-input relative z-10 w-full bg-transparent text-center text-3xl sm:text-5xl md:text-6xl font-mono font-black py-4 sm:py-8 px-12 sm:px-24 lg:px-28 focus:outline-none tracking-[0.15em] transition-colors drop-shadow-lg"
                     [class]="medidaSelecionada === 'UN' ? 'text-emerald-400 placeholder:text-emerald-900/50' : 'text-rose-400 placeholder:text-rose-900/50'"
                     placeholder="Bipe aqui" autocomplete="off">

              @if(alertaErro()) {
                <div class="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 px-3 sm:px-4 py-2 sm:py-3 bg-rose-600/95 backdrop-blur text-white rounded-xl font-bold text-[10px] sm:text-sm flex items-center justify-center gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 shadow-2xl border border-rose-400 z-50">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span class="truncate mt-0.5 tracking-wide">{{ alertaErro() }}</span>
                </div>
              }
            </div>
          </div>

          <div class="lg:col-span-5 flex flex-col gap-3 sm:gap-4 h-[450px] lg:h-auto lg:min-h-0">
            
            <div class="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
              <div class="bg-white p-3 sm:p-5 rounded-[1.2rem] shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                <div class="absolute -right-2 -bottom-2 text-emerald-500/10">
                  <svg class="w-16 h-16 sm:w-20 sm:h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 14H4V9h16v10z"/></svg>
                </div>
                <span class="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest z-10 mb-0.5">Total Volumes</span>
                <span class="text-xl sm:text-3xl font-black text-slate-700 z-10">{{ totalUnidades() }} <span class="text-[10px] sm:text-xs text-emerald-500">UN</span></span>
              </div>
              <div class="bg-white p-3 sm:p-5 rounded-[1.2rem] shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                <div class="absolute -right-2 -bottom-2 text-rose-500/10">
                  <svg class="w-16 h-16 sm:w-20 sm:h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <span class="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest z-10 mb-0.5">Total Peso</span>
                <span class="text-xl sm:text-3xl font-black text-slate-700 z-10">{{ totalPeso() | number:'1.3-3' }} <span class="text-[10px] sm:text-xs text-rose-500">KG</span></span>
              </div>
            </div>

            <div class="flex-1 min-h-0 flex flex-col bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-3 sm:p-4 overflow-hidden">
              <div class="flex justify-between items-center mb-3 shrink-0">
                 <h3 class="font-black text-sm sm:text-base text-slate-800 flex items-center gap-1.5">Últimas Baixas</h3>
                 <span class="bg-indigo-50 text-indigo-600 text-[8px] sm:text-[9px] px-2 py-1 rounded font-black tracking-widest uppercase border border-indigo-100">Reg: {{ storage.baixas().length }}</span>
              </div>
              
              <div class="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                @for(item of storage.baixas().slice(0, 50); track $index; let i = $index) {
                  <div class="group flex items-center justify-between p-2.5 sm:p-3 bg-white/60 hover:bg-white rounded-xl border border-slate-100 shadow-sm transition-colors duration-200 hover:border-indigo-100 animate-in slide-in-from-left-2">
                    <div class="flex items-center gap-2 sm:gap-3 overflow-hidden">
                      <div class="w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex flex-col items-center justify-center rounded-lg border bg-slate-50 shadow-inner" 
                           [class]="item.medida === 'UN' ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'">
                        <span class="font-black text-base sm:text-lg leading-none">{{ item.qtd }}</span>
                        <span class="text-[6px] sm:text-[7px] font-bold mt-0.5">{{ item.medida }}</span>
                      </div>
                      <div class="truncate">
                        <div class="font-bold text-[10px] sm:text-xs text-slate-700 truncate mb-1">{{ item.descricao }}</div>
                        <div class="flex flex-wrap gap-1 sm:gap-1.5">
                          <span class="text-[7px] sm:text-[8px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{{ item.setor }}</span>
                          <span class="text-[7px] sm:text-[8px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{{ item.motivo }}</span>
                        </div>
                      </div>
                    </div>
                    <button (click)="excluir(i)" class="p-1.5 sm:p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100" title="Remover Produto">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                }
                
                @if(storage.baixas().length === 0) {
                  <div class="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-50">
                    <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    <p class="font-bold text-[9px] sm:text-[11px] uppercase tracking-widest text-center">Nenhuma leitura<br>hoje</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OperadorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scannerInput') scannerInput!: ElementRef<HTMLInputElement>;
  storage = inject(StorageService);
  
  codigoAtual = ''; 
  quantidadeAtual = 1; 
  medidaSelecionada: 'UN' | 'KG' = 'UN';
  setorSelecionado = ''; 
  motivoSelecionado = ''; 
  alertaErro = signal('');
  flashSucesso = signal(false); 
  
  horaAtual = signal('');
  dataAtual = signal('');
  private timerRelogio: any;

  totalUnidades = computed(() => {
    return this.storage.baixas().filter(b => b.medida === 'UN').reduce((acc, curr) => acc + curr.qtd, 0);
  });
  totalPeso = computed(() => {
    return this.storage.baixas().filter(b => b.medida === 'KG').reduce((acc, curr) => acc + curr.qtd, 0);
  });

  ngOnInit() {
    this.atualizarRelogio();
    this.timerRelogio = setInterval(() => this.atualizarRelogio(), 1000);
  }

  ngAfterViewInit() { this.focarScanner(); }
  
  ngOnDestroy() {
    if (this.timerRelogio) clearInterval(this.timerRelogio);
  }

  atualizarRelogio() {
    const agora = new Date();
    this.horaAtual.set(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    this.dataAtual.set(agora.toLocaleDateString('pt-BR'));
  }

  focarScanner() { setTimeout(() => this.scannerInput?.nativeElement.focus(), 50); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const ignoreTags = ['SELECT', 'OPTION', 'BUTTON', 'INPUT'];
    if (!ignoreTags.includes(target.tagName)) {
      this.focarScanner();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      event.preventDefault();
      this.mudarMedida('UN');
    } else if (event.key === 'F3') {
      event.preventDefault();
      this.mudarMedida('KG');
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.codigoAtual = '';
      this.quantidadeAtual = 1;
      this.alertaErro.set('');
      this.focarScanner();
    }
  }

  tocarBip(tipo: 'sucesso' | 'erro') {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (tipo === 'sucesso') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime); 
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1); 
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("Áudio não suportado.");
    }
  }

  mudarMedida(tipo: 'UN' | 'KG') {
    this.medidaSelecionada = tipo;
    if (tipo === 'UN') {
      this.quantidadeAtual = Math.floor(this.quantidadeAtual) || 1;
      if(this.quantidadeAtual <= 0) this.quantidadeAtual = 1;
    }
    this.tocarBip('sucesso');
    this.focarScanner();
  }

  alterarQtd(v: number) {
    this.quantidadeAtual = Number((this.quantidadeAtual + (this.medidaSelecionada === 'KG' ? v * 0.1 : v)).toFixed(3));
    if (this.quantidadeAtual < 0) this.quantidadeAtual = 0;
    this.focarScanner();
  }
  
  excluir(i: number) {
    if(confirm('Deseja remover este registro?')) {
      this.storage.removerBaixa(i);
      this.tocarBip('erro'); 
    }
    this.focarScanner();
  }

  processarBip() {
    if (!this.setorSelecionado || !this.motivoSelecionado) {
      this.tocarBip('erro');
      this.alertaErro.set("⚠️ SELECIONE O SETOR E O MOTIVO ACIMA.");
      this.codigoAtual = ''; return;
    }
    let cod = this.codigoAtual.replace(/\D/g, '');
    if(!cod) return;
    if (cod.length === 14 && cod.startsWith('02')) cod = cod.substring(1);
    
    let desc = this.storage.catalogo().get(cod);
    let codParaSalvar = cod;
    
    if (!desc && !isNaN(Number(cod))) {
      const semZero = parseInt(cod, 10).toString().trim();
      if (this.storage.catalogo().has(semZero)) {
        codParaSalvar = semZero; desc = this.storage.catalogo().get(semZero);
      }
    }

    if (!desc && cod.startsWith('2') && cod.length >= 12) {
       const plus = [parseInt(cod.substring(1, 5), 10).toString(), parseInt(cod.substring(1, 6), 10).toString(), parseInt(cod.substring(1, 7), 10).toString()];
       for (let p of plus) {
         if (this.storage.catalogo().has(p)) { desc = this.storage.catalogo().get(p); codParaSalvar = p; break; }
       }
    }

    if (desc) {
      this.storage.registrarBaixa(codParaSalvar, desc, this.quantidadeAtual, this.medidaSelecionada, this.setorSelecionado, this.motivoSelecionado);
      this.alertaErro.set('');
      
      this.tocarBip('sucesso');
      this.flashSucesso.set(true);
      setTimeout(() => this.flashSucesso.set(false), 150); 
      
      this.quantidadeAtual = 1;

    } else {
      this.tocarBip('erro');
      this.alertaErro.set(`PRODUTO NÃO ENCONTRADO (${cod}).`);
    }
    this.codigoAtual = ''; 
    this.focarScanner();
  }
}