# 📁 Configurações do Firebase

Esta pasta contém todas as configurações organizadas do Firebase para o projeto La Tazza.

## 📂 Estrutura

```
config/firebase/
├── client.ts          # Configuração do cliente Firebase (Auth, Firestore)
├── firestore.rules    # Regras de segurança do Firestore
└── firestore.indexes.json  # Índices compostos do Firestore
```

## 📄 Arquivos

### `client.ts`

Configuração principal do Firebase para uso no cliente:

- Inicialização do Firebase App
- Configuração do Authentication
- Configuração do Firestore
- Validação de variáveis de ambiente
- Exports das instâncias singleton

### `firebase.json`

Configuração do Firebase CLI:

- Regras do Firestore
- Configuração de emuladores
- Configuração de hosting (opcional)

### `firestore.rules`

Regras de segurança para o Firestore Database:

- Leitura pública para produtos, cursos e workshops
- Controle de escrita apenas para usuários autenticados
- Posts do blog: publicados são públicos, rascunhos são privados

### `firestore.indexes.json`

Índices compostos para otimização de consultas:

- Produtos por categoria e data
- Cursos por nível e data
- Workshops por data
- Posts por status de publicação e categoria

## 🚀 Como Usar

### Importação no código

```typescript
import { auth, db } from '@/lib/firebase';
// ou diretamente
import { auth, db } from '@/config/firebase/client';
```

### Deploy das regras

```bash
npm run firebase:deploy-rules
```

### Emuladores para desenvolvimento

```bash
npm run firebase:emulators
```

## 🔧 Manutenção

- Atualize as regras de segurança conforme necessário
- Mantenha os índices atualizados para novas consultas
- Teste as regras com emuladores antes do deploy
- Documente mudanças significativas neste README

## 📚 Referências

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI](https://firebase.google.com/docs/cli)
