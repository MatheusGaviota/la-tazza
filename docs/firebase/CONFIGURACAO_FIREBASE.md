# 🚀 Configuração do Firebase - La Tazza

Este documento explica como configurar completamente o Firebase para o projeto La Tazza.

## 📋 Pré-requisitos

1. **Conta Google**: Acesse [Firebase Console](https://console.firebase.google.com/)
2. **Node.js**: Versão 18 ou superior
3. **Firebase CLI**: Instalar globalmente

   ```bash
   npm install -g firebase-tools
   ```

## 🔧 Configuração Inicial

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto" ou "Add project"
3. Nomeie o projeto como `la-tazza`
4. Ative o Google Analytics (opcional)
5. Escolha uma conta Google Analytics ou crie uma nova

### 2. Configurar Authentication

1. No menu lateral, clique em **Authentication**
2. Vá para a aba **Sign-in method**
3. Ative os provedores desejados:
   - **Email/Password** (recomendado)
   - **Google** (opcional)
   - **GitHub** (opcional)

### 3. Configurar Firestore Database

1. No menu lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Iniciar no modo de produção**
4. Selecione uma localização (ex: `us-central1`)

### 4. Configurar Storage (Opcional - já que usamos Cloudinary)

1. No menu lateral, clique em **Storage**
2. Clique em **Começar**
3. Escolha **Iniciar no modo de produção**
4. Selecione uma localização (mesma do Firestore)

## 🔑 Obter Credenciais

### 1. Configurações do Projeto

1. Clique no ícone de engrenagem ⚙️ → **Configurações do projeto**
2. Vá para a aba **Geral**
3. Role para baixo até **Seus apps**
4. Clique em **Adicionar app** → **Web app**
5. Registre o app com nome "La Tazza Web"
6. Copie as configurações do SDK

### 2. Atualizar Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua os valores das variáveis do Firebase pelas credenciais obtidas:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## 📁 Arquivos de Configuração

Os seguintes arquivos já estão organizados na pasta `config/firebase/`:

### `config/firebase/firebase.json`

Configuração principal do Firebase CLI com:
- Regras do Firestore
- Índices do Firestore
- Configuração de emuladores
- Configuração de hosting

### `config/firebase/firestore.rules`

Regras de segurança para o Firestore:
- Leitura pública para produtos e cursos
- Controle de escrita apenas para usuários autenticados
- Posts do blog: publicados são públicos, rascunhos apenas para autenticados

### `config/firebase/firestore.indexes.json`

Índices compostos para consultas otimizadas:
- Produtos por categoria e data
- Cursos por nível e data
- Workshops por data
- Posts por status de publicação e categoria

### `config/firebase/client.ts`

Configuração TypeScript organizada do Firebase:
- Inicialização do app
- Configuração do Auth e Firestore
- Validação de variáveis de ambiente
- Exports das instâncias

Regras de segurança para o Firebase Storage (backup para Cloudinary)

## 🚀 Deploy das Regras

### 1. Login no Firebase CLI

   ```bash
   firebase login
   ```

### 2. Conectar ao Projeto

   ```bash
   firebase use --add
   # Selecione o projeto la-tazza
   ```

### 3. Deploy das Regras

   ```bash
   npm run firebase:deploy-rules
   ```

Ou diretamente:

   ```bash
   firebase deploy --only firestore:rules,storage
   ```

## 🧪 Usar Emuladores (Desenvolvimento)

Para desenvolvimento local sem afetar produção:

   ```bash
   npm run firebase:emulators
   ```

Isso iniciará:
- Firestore Emulator na porta 8080
- Auth Emulator na porta 9099
- UI do Emulator em http://localhost:4000

## 📊 Verificar Configuração

### 1. Testar Conexão

Execute o projeto:

   ```bash
   npm run dev
   ```

Acesse `http://localhost:3000/admin` e verifique se:
- ✅ Não há erros de configuração do Firebase
- ✅ Pode fazer login
- ✅ Pode visualizar dados (se houver)

### 2. Verificar Regras

No Firebase Console:
1. **Firestore** → **Regras**: Verifique se as regras estão ativas
2. **Authentication** → **Usuários**: Verifique usuários criados
3. **Storage** → **Regras**: Verifique regras de storage

## 🔒 Segurança

### Regras Implementadas

- **Leitura**: Produtos, cursos e workshops são públicos
- **Escrita**: Apenas usuários autenticados podem modificar dados
- **Blog**: Posts publicados são públicos, rascunhos são privados
- **TODO**: Implementar sistema de roles (admin/editor)

### Melhorias Futuras

- [ ] Sistema de roles baseado em claims customizados
- [ ] Rate limiting para operações de escrita
- [ ] Logs de auditoria
- [ ] Validação de dados no servidor

## 🐛 Troubleshooting

### Erro: "Firebase: Error (auth/invalid-api-key)"

- Verifique se as variáveis de ambiente estão corretas no `.env`
- Confirme se copiou exatamente as credenciais do Firebase Console

### Erro: "Missing or insufficient permissions"

- Verifique se as regras do Firestore foram deployadas
- Confirme se o usuário está autenticado

### Erro: "Function not found"

- Execute `firebase deploy --only functions` se usar Cloud Functions
- Verifique se as funções estão na pasta `functions/`

## 📚 Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Emulators](https://firebase.google.com/docs/emulator-suite)

---

Configurado com ❤️ para La Tazza