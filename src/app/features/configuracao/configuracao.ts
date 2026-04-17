import { Component, inject, signal } from '@angular/core';
import { StorageService } from '../../core/services/storage';

@Component({
  selector: 'app-configuracao',
  standalone: true,
  template: `
    <div class="min-h-[calc(100vh-70px)] py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 bg-slate-50/50">
      <div class="max-w-5xl mx-auto animate-in fade-in duration-700">
        
        <div class="mb-8 text-center flex flex-col items-center justify-center">
          <p class="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-2">Backoffice • Cimi Supermercados</p>
          <h1 class="text-3xl sm:text-4xl lg:text-[2.5rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 uppercase tracking-[0.1em] leading-none drop-shadow-sm">
            Gestão de Base de Dados
          </h1>
          <div class="h-[3px] w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mt-4 opacity-60"></div>
        </div>

        <div class="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-inner">
              🗄️
            </div>
            <div>
              <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Produtos Ativos na Memória</h2>
              <p class="text-4xl sm:text-5xl font-black text-slate-800">{{ storage.catalogo().size }}</p>
            </div>
          </div>
          <div class="hidden sm:block text-right">
             <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest shadow-sm">
               <span class="relative flex h-2 w-2">
                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               Armazenamento Offline OK
             </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <label class="relative flex flex-col items-center justify-center p-8 sm:p-10 border-[3px] border-dashed rounded-[2rem] transition-all duration-300 cursor-pointer group"
                 [class]="arquivoCargaNome() ? 'border-emerald-400 bg-emerald-50/50 shadow-lg shadow-emerald-100/50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'">
            <input type="file" accept=".txt" (change)="lerArquivo($event, 'carga')" class="hidden">
            
            <div class="w-20 h-20 mb-4 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                 [class]="arquivoCargaNome() ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'">
              @if(arquivoCargaNome()) {
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              } @else {
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              }
            </div>
            
            <h3 class="font-black text-lg sm:text-xl text-center mb-1" [class]="arquivoCargaNome() ? 'text-emerald-800' : 'text-slate-700'">Carga Geral (Intersolid)</h3>
            
            @if(arquivoCargaNome()) {
              <p class="text-sm font-bold text-emerald-600 bg-emerald-100 px-4 py-1.5 rounded-lg mt-2 truncate max-w-[250px]">{{ arquivoCargaNome() }}</p>
              <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-3">Clique para trocar</p>
            } @else {
              <p class="text-sm font-bold text-slate-400 text-center">Arquivo <span class="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">.estoque.txt</span></p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Clique para selecionar</p>
            }
          </label>

          <label class="relative flex flex-col items-center justify-center p-8 sm:p-10 border-[3px] border-dashed rounded-[2rem] transition-all duration-300 cursor-pointer group"
                 [class]="arquivoBalancaNome() ? 'border-emerald-400 bg-emerald-50/50 shadow-lg shadow-emerald-100/50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'">
            <input type="file" accept=".txt" (change)="lerArquivo($event, 'balanca')" class="hidden">
            
            <div class="w-20 h-20 mb-4 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                 [class]="arquivoBalancaNome() ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'">
              @if(arquivoBalancaNome()) {
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              } @else {
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
              }
            </div>
            
            <h3 class="font-black text-lg sm:text-xl text-center mb-1" [class]="arquivoBalancaNome() ? 'text-emerald-800' : 'text-slate-700'">Carga Balança (Toledo)</h3>
            
            @if(arquivoBalancaNome()) {
              <p class="text-sm font-bold text-emerald-600 bg-emerald-100 px-4 py-1.5 rounded-lg mt-2 truncate max-w-[250px]">{{ arquivoBalancaNome() }}</p>
              <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-3">Clique para trocar</p>
            } @else {
              <p class="text-sm font-bold text-slate-400 text-center">Arquivo <span class="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">ITENSMGV.TXT</span></p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Clique para selecionar</p>
            }
          </label>
        </div>

        <div class="flex justify-center mb-8">
          <button (click)="processarArquivos()" 
                  [disabled]="loading() || (!conteudoCarga() && !conteudoBalanca())" 
                  class="w-full sm:w-auto min-w-[300px] px-8 py-5 rounded-[2rem] font-black text-xl sm:text-2xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-4"
                  [class]="(conteudoCarga() || conteudoBalanca()) && !loading() ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/40 hover:scale-[1.02] hover:shadow-indigo-500/60' : 'bg-slate-200 text-slate-400'">
            
            @if(loading()) {
              <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              PROCESSANDO...
            } @else {
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Sincronizar Base Local
            }
          </button>
        </div>
        
        @if(msg()) { 
          <div class="animate-in slide-in-from-bottom-4 flex flex-col items-center">
            <div class="w-full max-w-2xl bg-[#0B1511] p-6 rounded-[1.5rem] border-2 border-emerald-900/50 shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <div class="flex items-start gap-4">
                <div class="mt-1">
                  @if(msg().includes('✅')) {
                    <svg class="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  } @else {
                    <svg class="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  }
                </div>
                <div class="text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-line tracking-wide">
                  {{ msg() }}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ConfiguracaoComponent {
  storage = inject(StorageService); 
  
  msg = signal(''); 
  loading = signal(false);
  
  arquivoCargaNome = signal('');
  arquivoBalancaNome = signal('');
  
  conteudoCarga = signal('');
  conteudoBalanca = signal('');

  lerArquivo(event: any, tipo: 'carga' | 'balanca') {
    const file = event.target.files[0];
    if (!file) return;

    if (tipo === 'carga') this.arquivoCargaNome.set(file.name);
    else this.arquivoBalancaNome.set(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (tipo === 'carga') this.conteudoCarga.set(text);
      else this.conteudoBalanca.set(text);
    };
    reader.readAsText(file); 
  }

  processarArquivos() {
    this.loading.set(true);
    this.msg.set('');
    
    setTimeout(() => {
      try {
        let novoCatalogo = new Map<string, string>();
        let adcCarga = 0;
        let adcBalanca = 0;

        if (this.conteudoCarga()) {
          const linhasCarga = this.conteudoCarga().split(/\r?\n/);
          linhasCarga.forEach(linha => {
            if (/^\d{40}/.test(linha)) {
              const codInterno = linha.substring(0, 20).replace(/^0+/, '') || '0';
              const codEAN = linha.substring(20, 40).replace(/^0+/, '') || '0';
              const descricao = linha.substring(40, 80).trim();
              if (descricao) {
                if (codEAN !== '0') novoCatalogo.set(codEAN, descricao);
                if (codInterno !== '0' && codInterno !== codEAN) novoCatalogo.set(codInterno, descricao);
                adcCarga++;
              }
            }
          });
        }

        if (this.conteudoBalanca()) {
          const linhasBalanca = this.conteudoBalanca().split(/\r?\n/);
          linhasBalanca.forEach(linha => {
            if (linha.length >= 50 && /^\d{18}/.test(linha)) {
              const codBalanca = linha.substring(3, 9).replace(/^0+/, '') || '0';
              const descricao = linha.substring(18, 68).trim();
              if (codBalanca !== '0' && descricao) { 
                novoCatalogo.set(codBalanca, descricao); 
                adcBalanca++; 
              }
            }
          });
        }

        if (novoCatalogo.size > 0) {
          this.storage.atualizarCatalogo(novoCatalogo);
          this.msg.set(`✅ TERMINAL SINCRONIZADO COM SUCESSO!\n\n> [ OK ] ${adcCarga} registros processados do Intersolid\n> [ OK ] ${adcBalanca} registros processados da Toledo\n\nBase offline pronta para operação.`);
          
          // Limpa os arquivos selecionados após sucesso para não pesar a memória
          this.arquivoCargaNome.set('');
          this.arquivoBalancaNome.set('');
          this.conteudoCarga.set('');
          this.conteudoBalanca.set('');
          
        } else {
          this.msg.set(`❌ ERRO DE LEITURA.\nNenhum produto válido foi encontrado na estrutura dos arquivos.\nCertifique-se de usar os relatórios originais do ERP.`);
        }

      } catch (error) {
        this.msg.set(`❌ ERRO CRÍTICO.\nFalha ao processar os arquivos selecionados.`);
      } finally {
        this.loading.set(false);
      }
    }, 400); // Pequeno delay extra para o usuário ver o spinner girando e dar a sensação de processamento pesado
  }
}