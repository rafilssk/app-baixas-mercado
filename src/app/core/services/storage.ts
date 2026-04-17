import { Injectable, signal, computed } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, remove, set } from 'firebase/database';

// ⚠️ COLE AQUI AS SUAS CREDENCIAIS DO FIREBASE 
// (Você as encontra em: Configurações do Projeto > Seus Aplicativos > Configuração)
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
  
  // Signals para manter a interface reativa
  private _baixas = signal<any[]>([]);
  baixas = computed(() => this._baixas());

  // Catálogo (mantivemos estático por enquanto para simplificar)
  catalogo = signal(new Map([
    ['7891234567890', 'ARROZ TIO JOÃO 5KG'],
    ['7891011121314', 'FEIJÃO CAMIL 1KG'],
    ['123', 'PRODUTO TESTE'],
    ['2000000', 'PRODUTO PESADO (EXEMPLO)']
  ]));

  constructor() {
    this.escutarBaixas();
  }

  // ESSA É A MÁGICA: Ele fica "ouvindo" o banco. 
  // Se mudar no celular, o notebook recebe a atualização sozinho!
  private escutarBaixas() {
    const baixasRef = ref(this.db, 'baixas');
    onValue(baixasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Converte o objeto do Firebase em array e inverte para o mais novo ficar no topo
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
      codigo,
      descricao,
      qtd,
      medida,
      setor,
      motivo,
      data: new Date().toISOString()
    };
    // Salva no Firebase
    push(baixasRef, novaBaixa);
  }

  removerBaixa(index: number) {
    // No Firebase, precisamos do ID gerado por ele para deletar
    const itemParaRemover = this._baixas()[index];
    if (itemParaRemover && itemParaRemover.firebaseId) {
      const itemRef = ref(this.db, `baixas/${itemParaRemover.firebaseId}`);
      remove(itemRef);
    }
  }

  // Função para limpar tudo no final do dia
  limparTudo() {
    if(confirm("Deseja realmente apagar todos os registros do dia?")) {
      const baixasRef = ref(this.db, 'baixas');
      set(baixasRef, null);
    }
  }
}