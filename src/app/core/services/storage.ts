import { Injectable, signal } from '@angular/core';

export interface Baixa { 
  codigo: string; descricao: string; qtd: number; medida: string; 
  setor: string; motivo: string; dataHora: string; 
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  catalogo = signal<Map<string, string>>(new Map());
  baixas = signal<Baixa[]>([]);

  constructor() {
    const dbProdutos = localStorage.getItem('db_produtos');
    if (dbProdutos) this.catalogo.set(new Map(JSON.parse(dbProdutos)));
    const dbBaixas = localStorage.getItem('db_baixas');
    if (dbBaixas) this.baixas.set(JSON.parse(dbBaixas));
  }

  atualizarCatalogo(novoCatalogo: Map<string, string>) {
    this.catalogo.set(novoCatalogo);
    localStorage.setItem('db_produtos', JSON.stringify(Array.from(novoCatalogo.entries())));
  }

  registrarBaixa(codigo: string, descricao: string, qtd: number, medida: string, setor: string, motivo: string) {
    const novaBaixa: Baixa = { codigo, descricao, qtd, medida, setor, motivo, dataHora: new Date().toLocaleString('pt-BR') };
    this.baixas.update(atuais => {
      const atualizado = [novaBaixa, ...atuais];
      localStorage.setItem('db_baixas', JSON.stringify(atualizado));
      return atualizado;
    });
  }

  removerBaixa(index: number) {
    this.baixas.update(atuais => {
      const novaLista = atuais.filter((_, i) => i !== index);
      localStorage.setItem('db_baixas', JSON.stringify(novaLista));
      return novaLista;
    });
  }

  limparBaixas() {
    this.baixas.set([]);
    localStorage.removeItem('db_baixas');
  }
}