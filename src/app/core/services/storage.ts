import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class StorageService {
  // Configuração oficial do seu Supabase
  private supabaseUrl = 'https://esugxdlekpmjcjuxibcz.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzdWd4ZGxla3BtamNqdXhpYmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzQzMDksImV4cCI6MjA5MjAxMDMwOX0.I3C1dPynNtcUTrHzVKFPxaLDdksb3IJLXDyF0TNw40U';
  private supabase: SupabaseClient;

  private _baixas = signal<any[]>([]);
  baixas = computed(() => this._baixas());

  private _catalogoMap = signal<Map<string, string>>(new Map());
  catalogo = computed(() => this._catalogoMap());

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.carregarDadosIniciais();
    this.escutarMudancas();
  }

  private async carregarDadosIniciais() {
    try {
      // 1. Carrega o Catálogo (MGV)
      const { data: catData, error: catError } = await this.supabase
        .from('catalogo')
        .select('*');
      
      if (catData) {
        const novoMapa = new Map();
        catData.forEach(item => novoMapa.set(item.codigo, item.descricao));
        this._catalogoMap.set(novoMapa);
      }

      // 2. Carrega as Baixas do dia
      const { data: bxData, error: bxError } = await this.supabase
        .from('baixas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bxData) this._baixas.set(bxData);

    } catch (err) {
      console.error("Erro ao carregar dados do Supabase:", err);
    }
  }

  private escutarMudancas() {
    // Escuta em tempo real para sincronizar celular e notebook
    this.supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'baixas' }, () => this.carregarDadosIniciais())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'catalogo' }, () => this.carregarDadosIniciais())
      .subscribe();
  }

  async registrarBaixa(codigo: string, descricao: string, qtd: number, medida: string, setor: string, motivo: string) {
    const { error } = await this.supabase.from('baixas').insert([{
      codigo, 
      descricao, 
      qtd, 
      medida, 
      setor, 
      motivo
    }]);
    if (error) console.error("Erro ao registrar baixa:", error);
  }

  async removerBaixa(index: number) {
    const item = this._baixas()[index];
    if (item?.id) {
      await this.supabase.from('baixas').delete().eq('id', item.id);
    }
  }

  async limparBaixas() {
    if (confirm("Deseja apagar todas as baixas do banco de dados?")) {
      // Deleta todos os registros onde o ID é maior que 0
      const { error } = await this.supabase.from('baixas').delete().gt('id', 0);
      if (!error) this._baixas.set([]);
    }
  }

  async atualizarCatalogo(novoMapa: Map<string, string>) {
    // Converte o Mapa para Array de Objetos para o banco
    const dadosParaInserir = Array.from(novoMapa.entries()).map(([codigo, descricao]) => ({
      codigo,
      descricao
    }));

    // O upsert insere novos produtos ou atualiza a descrição se o código já existir
    const { error } = await this.supabase
      .from('catalogo')
      .upsert(dadosParaInserir, { onConflict: 'codigo' });

    if (!error) {
      this._catalogoMap.set(novoMapa);
      alert("Catálogo MGV atualizado com sucesso no Banco de Dados!");
    } else {
      console.error("Erro ao subir MGV:", error);
      alert("Erro ao salvar catálogo. Verifique se a tabela 'catalogo' foi criada.");
    }
  }
}