# ☕ La Tazza - Café & Cultura

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4-orange)](https://firebase.google.com/)

Website institucional da **La Tazza**, uma cafeteria que combina a paixão pelo café de qualidade com experiências culturais únicas. Oferecemos cursos de barista, workshops de preparação de café, produtos especiais e um blog sobre a cultura cafeeira.

## ✨ Funcionalidades

### 🛒 Loja Online
- Catálogo completo de produtos
- Sistema de filtros e busca
- Carrinho de compras inteligente
- Checkout seguro

### 🎓 Educação e Workshops
- Cursos de barista profissional
- Workshops temáticos
- Sistema de matrículas online
- Certificados digitais

### 📝 Blog Cultural
- Artigos sobre café e cultura
- Receitas especiais
- Dicas de preparo
- Histórias da cafeteria

### 👤 Área do Cliente
- Cadastro e login
- Histórico de pedidos
- Lista de desejos
- Programa de fidelidade

### 🔐 Painel Administrativo
- Gerenciamento completo de produtos
- Administração de cursos e workshops
- Sistema de blog integrado
- Upload de imagens otimizado

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Cloudinary
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Google (para Firebase)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/MatheusGaviota/la-tazza.git
cd la-tazza
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 4. Configure o Firebase
Siga o guia completo em [`docs/firebase/CONFIGURACAO_FIREBASE.md`](docs/firebase/CONFIGURACAO_FIREBASE.md)

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o resultado.

## 📚 Documentação

Toda a documentação está organizada na pasta [`docs/`](docs/):

- **[📖 Documentação Completa](docs/README.md)** - Índice de todas as documentações
- **[🔐 Configuração do Firebase](docs/firebase/CONFIGURACAO_FIREBASE.md)** - Setup completo do Firebase
- **[👨‍💼 Painel Administrativo](docs/admin/PANEL_ADMINISTRATIVO.md)** - Guia do sistema admin
- **[🤝 Guia de Contribuição](docs/setup/GUIA_CONTRIBUICAO.md)** - Como contribuir
- **[📝 CHANGELOG](CHANGELOG.md)** - Histórico de mudanças

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint
npm run format       # Formata código com Prettier
npm run format:check # Verifica formatação

# Firebase
npm run firebase:deploy-rules    # Deploy das regras do Firestore
npm run firebase:emulators       # Inicia emuladores locais
```

## 🎨 Estrutura do Projeto

```
la-tazza/
├── 📁 config/           # Configurações organizadas
│   └── firebase/        # Configurações do Firebase
├── 📁 docs/            # Documentação completa
├── 📁 public/          # Assets estáticos
├── 📁 src/
│   ├── 📁 app/         # Next.js App Router
│   ├── 📁 components/  # Componentes React
│   ├── 📁 contexts/    # Context API
│   ├── 📁 hooks/       # Custom hooks
│   ├── 📁 lib/         # Utilitários e configurações
│   └── 📁 types/       # Definições TypeScript
├── 📄 .env.example     # Exemplo de variáveis de ambiente
├── 📄 package.json     # Dependências e scripts
└── 📄 README.md        # Este arquivo
```

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel:

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch main

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Website**: [la-tazza.com](https://la-tazza.com) (em breve)
- **Email**: contato@la-tazza.com
- **Issues**: [GitHub Issues](https://github.com/MatheusGaviota/la-tazza/issues)

---

Feito com ❤️ e muito ☕ pela equipe La Tazza
