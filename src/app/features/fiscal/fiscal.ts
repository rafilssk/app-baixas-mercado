import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';
import { StorageService } from '../../core/services/storage';

@Component({
  selector: 'app-fiscal',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  template: `
    <div class="min-h-[calc(100vh-70px)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 bg-slate-50/50">
      <div class="max-w-[90rem] mx-auto animate-in fade-in duration-700 flex flex-col h-full">
        
        <div class="shrink-0 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-center md:text-left">
            <h1 class="text-2xl sm:text-3xl lg:text-[2rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 uppercase tracking-[0.15em] leading-none drop-shadow-sm">
              Relatório Fiscal
            </h1>
            <p class="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mt-2">Painel de Auditoria • Cimi Supermercados</p>
          </div>

          <div class="flex gap-3">
            <div class="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-w-[100px]">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registros</span>
              <span class="text-lg font-black text-slate-700 leading-none mt-0.5">{{ baixasFiltradas().length }}</span>
            </div>
            <div class="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-w-[100px] relative overflow-hidden">
              <div class="absolute -right-2 -bottom-2 text-emerald-500/10"><svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 14H4V9h16v10z"/></svg></div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">Volumes</span>
              <span class="text-lg font-black text-slate-700 leading-none mt-0.5 z-10">{{ totalUn() }} <span class="text-[10px] text-emerald-500">UN</span></span>
            </div>
            <div class="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-w-[100px] relative overflow-hidden">
              <div class="absolute -right-2 -bottom-2 text-rose-500/10"><svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">Peso Total</span>
              <span class="text-lg font-black text-slate-700 leading-none mt-0.5 z-10">{{ totalKg() | number:'1.3-3' }} <span class="text-[10px] text-rose-500">KG</span></span>
            </div>
          </div>
        </div>
        
        <div class="shrink-0 bg-white/80 backdrop-blur-xl p-3 sm:p-4 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div class="w-full lg:w-auto relative group">
            <select [(ngModel)]="filtroSetor" class="w-full lg:w-[300px] appearance-none bg-slate-50 border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer shadow-sm text-sm">
              <option value="Todos">📑 Filtro: Todos os Setores</option>
              <option value="Hortifruti">Hortifruti</option>
              <option value="Laticínios">Laticínios</option>
              <option value="Controle de Produção">Controle de Produção</option>
              <option value="Triagem">Triagem</option>
              <option value="Prevenção">Prevenção</option>
               <option value="Padaria">Padaria</option>
                <option value="Confeitaria">Confeitaria</option>
              <option value="Baixas Recepção">Baixas Recepção</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row items-center w-full lg:w-auto gap-3">
            <button (click)="limparTela()" class="w-full sm:w-auto px-5 py-3 rounded-xl font-black text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-colors flex items-center justify-center gap-2 border border-rose-100 shadow-sm uppercase tracking-widest">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Limpar Base
            </button>
            <div class="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>
            @if(filtroSetor !== 'Todos') {
              <button (click)="exportarTxt(true)" class="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-indigo-400/50">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Baixar {{ filtroSetor }}
              </button>
            }
            <button (click)="exportarTxt(false)" class="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-emerald-400/50">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Baixar Tudo
            </button>
          </div>
        </div>

        <div class="flex-1 min-h-0 bg-white rounded-[1.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col">
          <div class="flex-1 overflow-auto custom-scrollbar relative">
            <table class="w-full text-left min-w-[800px] border-collapse">
              <thead class="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                <tr class="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">
                  <th class="px-6 py-4 border-b-2 border-slate-200">Produto</th>
                  <th class="px-6 py-4 border-b-2 border-slate-200 text-center w-32">Medida</th>
                  <th class="px-6 py-4 border-b-2 border-slate-200 w-48">Setor</th>
                  <th class="px-6 py-4 border-b-2 border-slate-200 w-32">Motivo</th>
                  <th class="px-6 py-4 border-b-2 border-slate-200 w-48">Data e Hora</th>
                  <th class="px-6 py-4 border-b-2 border-slate-200 text-right w-20">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for(item of baixasFiltradas(); track item.id || $index) {
                  <tr class="hover:bg-slate-50/80 transition-colors group">
                    <td class="px-6 py-3.5">
                      <span class="block font-black text-slate-700 text-[13px] leading-tight mb-0.5 truncate max-w-[350px]" title="{{ item.descricao }}">{{ item.descricao }}</span>
                      <span class="text-[10px] text-slate-400 font-mono font-bold tracking-widest">CÓD: {{ item.codigo }}</span>
                    </td>
                    <td class="px-6 py-3.5 text-center">
                      <span class="inline-block px-3 py-1.5 rounded-lg font-black text-xs border shadow-sm" 
                            [class]="item.medida === 'UN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'">
                        {{ item.qtd }} <span class="text-[9px] opacity-70">{{ item.medida }}</span>
                      </span>
                    </td>
                    <td class="px-6 py-3.5">
                      <span class="inline-block text-[10px] text-slate-600 font-black bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 uppercase tracking-wider">{{ item.setor }}</span>
                    </td>
                    <td class="px-6 py-3.5">
                      <span class="inline-block text-[10px] text-slate-500 font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm uppercase tracking-wider">{{ item.motivo }}</span>
                    </td>
                    <td class="px-6 py-3.5">
                      <div class="flex items-center gap-2 text-slate-500 font-mono text-xs font-bold">
                        <svg class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {{ (item.created_at || item.dataHora) | date:'dd/MM/yyyy HH:mm' }}
                      </div>
                    </td>
                    <td class="px-6 py-3.5 text-right">
                      <button (click)="excluirReal(item)" class="p-2 bg-white border border-slate-200 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 shadow-sm transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                }
                @if(baixasFiltradas().length === 0) {
                  <tr>
                    <td colspan="6" class="py-20 text-center text-slate-400">
                      <div class="flex justify-center mb-4">
                        <div class="p-6 bg-slate-50 rounded-full border-2 border-dashed border-slate-200">
                          <svg class="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                      </div>
                      <p class="font-black text-lg uppercase tracking-widest text-slate-500">Tabela Vazia</p>
                      <p class="text-xs font-bold mt-1 opacity-70">Nenhuma baixa corresponde ao filtro atual.</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FiscalComponent {
  storage = inject(StorageService);
  filtroSetor = 'Todos';

  baixasFiltradas() {
    if (this.filtroSetor === 'Todos') return this.storage.baixas();
    return this.storage.baixas().filter(b => b.setor === this.filtroSetor);
  }

  totalUn() {
    return this.baixasFiltradas().filter(b => b.medida === 'UN').reduce((a, b) => a + (b.qtd || 0), 0);
  }
  
  totalKg() {
    return this.baixasFiltradas().filter(b => b.medida === 'KG').reduce((a, b) => a + (b.qtd || 0), 0);
  }

  excluirReal(item: any) {
    if (confirm(`Confirmar exclusão definitiva de "${item.descricao}"?`)) {
      this.storage.removerBaixa(item.id);
    }
  }

  limparTela() {
    if (confirm('⚠️ ATENÇÃO: Esta ação apagará permanentemente TODAS as baixas. Deseja prosseguir?')) {
      this.storage.limparBaixas();
    }
  }

  exportarTxt(apenasFiltrado: boolean) {
    const dados = apenasFiltrado ? this.baixasFiltradas() : this.storage.baixas();
    if (!dados || dados.length === 0) { alert('Tabela vazia. Nada para exportar!'); return; }

    const titulo = apenasFiltrado ? `SETOR: ${this.filtroSetor.toUpperCase()}` : 'TODOS OS SETORES';
    let txt = "CIMI SUPERMERCADOS - RELATÓRIO DE BAIXAS\n";
    txt += `GERADO EM: ${new Date().toLocaleString('pt-BR')} | ${titulo}\n`;
    txt += "=".repeat(125) + "\n";
    // Cabeçalho ajustado
    txt += "COD".padEnd(10) + "DESCRIÇÃO".padEnd(35) + "SETOR".padEnd(20) + "MOTIVO".padEnd(16) + "QTD".padEnd(10) + "UN".padEnd(5) + "DATA/HORA\n";
    txt += "-".repeat(125) + "\n";

    dados.forEach(b => {
      const cod = (b.codigo || '').toString().padEnd(10);
      const desc = (b.descricao || '').substring(0, 33).padEnd(35);
      const setor = (b.setor || '').substring(0, 18).padEnd(20);
      const motivo = (b.motivo || '').substring(0, 14).padEnd(16);
      const qtd = (b.qtd || 0).toString().padEnd(10);
      const med = (b.medida || 'UN').padEnd(5);
      
      // Construção manual e garantida da Data e Hora para o TXT
      let dataFormatada = '-';
      const dataBruta = b.created_at || b.dataHora;
      
      if (dataBruta) {
        try {
          const dt = new Date(dataBruta);
          if (!isNaN(dt.getTime())) {
            const dia = dt.getDate().toString().padStart(2, '0');
            const mes = (dt.getMonth() + 1).toString().padStart(2, '0');
            const ano = dt.getFullYear();
            const hora = dt.getHours().toString().padStart(2, '0');
            const min = dt.getMinutes().toString().padStart(2, '0');
            dataFormatada = `${dia}/${mes}/${ano} ${hora}:${min}`;
          } else {
            dataFormatada = dataBruta.substring(0, 16);
          }
        } catch(e) {
          dataFormatada = dataBruta;
        }
      }

      txt += `${cod}${desc}${setor}${motivo}${qtd}${med}${dataFormatada}\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    const nomeBase = apenasFiltrado ? this.filtroSetor.replace(/\s+/g, '_') : 'COMPLETAS';
    a.download = `BAIXAS_CIMI_${nomeBase}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (!apenasFiltrado) {
      setTimeout(() => { 
        if (confirm('Arquivo Completo baixado!\nDeseja limpar a tela para iniciar uma nova sessão?')) {
          this.storage.limparBaixas(); 
        }
      }, 500);
    }
  }
}