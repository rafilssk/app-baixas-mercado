import { Injectable, signal, computed } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, remove, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAsppVkmlk_1ernWNbl_6f_tcTs43vDdig",
  authDomain: "cimibaixas-49842.firebaseapp.com",
  databaseURL: "https://cimibaixas-49842-default-rtdb.firebaseio.com/", 
  projectId: "cimibaixas-49842",
  storageBucket: "cimibaixas-49842.firebasestorage.app",
  messagingSenderId: "420105821355",
  appId: "1:420105821355:web:610801aad2d90d29c3ebee"
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  private app = initializeApp(firebaseConfig);
  private db = getDatabase(this.app);
  
  private _baixas = signal<any[]>([]);
  baixas = computed(() => this._baixas());

  catalogo = signal(new Map([
    ['123', 'PRODUTO TESTE'],
    ['7891234567890', 'ARROZ TIO JOÃO 5KG'],
    ['7891011121314', 'FEIJÃO CAMIL 1KG']
  ]));

  constructor() {
    this.escutarBaixas();
  }

  private escutarBaixas() {
    const baixasRef = ref(this.db, 'baixas');
    onValue(baixasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, value]: [string, any]) => ({
          ...value,
          firebaseId: id
        })).reverse();
        this._baixas.set(lista);
      } else {
        this._baixas.set([]);
      }
    });
  }

  registrarBaixa(codigo: string, descricao: string, qtd: number, medida: string, setor: string, motivo: string) {
    const baixasRef = ref(this.db, 'baixas');
    const novaBaixa = {
      codigo, descricao, qtd, medida, setor, motivo,
      data: new Date().toISOString()
    };
    push(baixasRef, novaBaixa);
  }

  removerBaixa(index: number) {
    const itemParaRemover = this._baixas()[index];
    if (itemParaRemover?.firebaseId) {
      const itemRef = ref(this.db, `baixas/${itemParaRemover.firebaseId}`);
      remove(itemRef);
    }
  }

  // ESSAS FUNÇÕES RESOLVEM OS ERROS NO FISCAL E CONFIGURAÇÃO
  limparBaixas() {
    if(confirm("Deseja apagar todos os registros do banco de dados?")) {
      const baixasRef = ref(this.db, 'baixas');
      set(baixasRef, null);
    }
  }

  atualizarCatalogo(novoMapa: Map<string, string>) {
    this.catalogo.set(novoMapa);
  }
}