# Painel Administrativo - La Tazza

## 📋 Visão Geral

Painel administrativo completo e profissional para gerenciamento de conteúdo do site La Tazza. Desenvolvido com Next.js 15, TypeScript, Tailwind CSS e Firebase.

## ✨ Funcionalidades

### 🛒 Gerenciamento de Produtos
- ➕ Adicionar novos produtos
- ✏️ Editar produtos existentes
- 🗑️ Excluir produtos
- 🔍 Busca por título e categoria
- 📦 Controle de estoque
- 🖼️ Upload de imagens via Cloudinary

### 🎓 Gerenciamento de Cursos
- ➕ Criar cursos
- ✏️ Editar informações dos cursos
- 🗑️ Remover cursos
- 🔍 Busca por título e nível
- ⏱️ Controle de duração
- 📊 Níveis (Iniciante, Intermediário, Avançado)

### 👥 Gerenciamento de Workshops
- ➕ Adicionar workshops
- ✏️ Editar workshops
- 🗑️ Deletar workshops
- 🔍 Busca por título e instrutor
- 📅 Controle de datas
- 👤 Gestão de instrutores
- 🎫 Limite de vagas

### 📝 Gerenciamento de Blog
- ➕ Criar posts
- ✏️ Editar posts
- 🗑️ Excluir posts
- 🔍 Busca por título, categoria e autor
- 📋 Sistema de rascunhos
- 👁️ Controle de publicação
- 🔗 Geração automática de slug
- ⏱️ Tempo de leitura

## 🔐 Controle de Acesso

O acesso ao painel administrativo é protegido e requer:
- ✅ Autenticação via Firebase Auth
- ✅ Verificação de usuário logado
- 🔄 TODO: Implementar sistema de roles (admin/editor)

**URL de Acesso:** `/admin`

## 🎨 Design

O painel segue os princípios de design do site:
- 🎨 Paleta de cores consistente (Background, Accent, Foreground)
- 📱 Totalmente responsivo
- ♿ Acessível (ARIA labels, navegação por teclado)
- 🧹 Clean Code e código otimizado
- 💫 Animações suaves e transições

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Firebase Firestore** - Banco de dados
- **Firebase Auth** - Autenticação
- **Cloudinary** - Upload de imagens
- **Lucide React** - Ícones

## 📁 Estrutura de Arquivos

```
src/
├── app/(main)/admin/
│   └── page.tsx                    # Página principal do admin
├── components/Admin/
│   ├── ProductsManager.tsx         # Gerenciador de produtos
│   ├── ProductFormModal.tsx        # Modal de formulário de produtos
│   ├── CoursesManager.tsx          # Gerenciador de cursos
│   ├── CourseFormModal.tsx         # Modal de formulário de cursos
│   ├── WorkshopsManager.tsx        # Gerenciador de workshops
│   ├── WorkshopFormModal.tsx       # Modal de formulário de workshops
│   ├── BlogManager.tsx             # Gerenciador de blog
│   ├── BlogFormModal.tsx           # Modal de formulário de blog
│   ├── DeleteConfirmModal.tsx      # Modal de confirmação de exclusão
│   └── index.ts                    # Barrel export
├── lib/
│   ├── admin.service.ts            # Serviço CRUD Firestore
│   ├── firebase.ts                 # Configuração Firebase
│   └── cloudinary.service.ts       # Serviço de upload de imagens
└── types/
    └── admin.types.ts              # Tipos TypeScript
```

## 🔥 Configuração do Firebase

### Collections do Firestore:

1. **products**
   - id, title, description, price, category, imageUrl, stock
   - createdAt, updatedAt (Timestamps)

2. **courses**
   - id, title, description, duration, level, price, imageUrl
   - createdAt, updatedAt (Timestamps)

3. **workshops**
   - id, title, description, date, duration, instructor, price, imageUrl
   - maxParticipants, currentParticipants
   - createdAt, updatedAt (Timestamps)

4. **blog-posts**
   - id, slug, title, excerpt, content, author, date, readTime
   - category, imageUrl, published
   - createdAt, updatedAt (Timestamps)

### Regras de Segurança (Firestore Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas leitura pública para produtos, cursos e posts publicados
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // TODO: Add admin role check
    }
    
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /workshops/{workshopId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /blog-posts/{postId} {
      allow read: if resource.data.published == true || request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Como Usar

### 1. Acessar o Painel
```
http://localhost:3000/admin
```

### 2. Navegar entre Abas
- Clique nas abas superiores para alternar entre Produtos, Cursos, Workshops e Blog

### 3. Adicionar Novo Item
- Clique no botão "Adicionar [Item]"
- Preencha todos os campos obrigatórios (*)
- Faça upload de uma imagem
- Clique em "Adicionar"

### 4. Editar Item
- Clique no botão "Editar" no card do item
- Modifique os campos necessários
- Clique em "Atualizar"

### 5. Excluir Item
- Clique no botão "Excluir" no card do item
- Confirme a exclusão no modal

### 6. Buscar Items
- Use a barra de busca no topo
- A busca filtra por título, categoria, autor, etc.

## ⚠️ TODOs e Melhorias Futuras

- [ ] Implementar sistema de roles (admin/editor/viewer)
- [ ] Adicionar paginação para listas grandes
- [ ] Editor de markdown para posts do blog
- [ ] Preview de posts antes de publicar
- [ ] Analytics e estatísticas
- [ ] Histórico de alterações
- [ ] Upload múltiplo de imagens
- [ ] Galeria de imagens
- [ ] Importação/Exportação em massa
- [ ] Dashboard com métricas

## 🔒 Segurança

- ✅ Validação de formulários no client-side
- ✅ Validação de dados no Firestore
- ✅ Upload seguro de imagens via Cloudinary
- ✅ Autenticação obrigatória
- 🔄 TODO: Autorização baseada em roles
- 🔄 TODO: Rate limiting
- 🔄 TODO: Logs de auditoria

## 📱 Responsividade

O painel é totalmente responsivo e funciona perfeitamente em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1400px+)

## ♿ Acessibilidade

- ✅ ARIA labels em todos os elementos interativos
- ✅ Navegação por teclado
- ✅ Focus visível
- ✅ Mensagens de erro descritivas
- ✅ Alt text em imagens
- ✅ Contraste adequado de cores

## 🧪 Testes

Para testar o painel:

1. Certifique-se de estar autenticado
2. Acesse `/admin`
3. Teste cada funcionalidade CRUD
4. Verifique uploads de imagens
5. Teste busca e filtros
6. Verifique responsividade em diferentes dispositivos

## 📞 Suporte

Em caso de problemas:
1. Verifique as configurações do Firebase
2. Confirme as variáveis de ambiente
3. Verifique as regras do Firestore
4. Confira os logs do console

---

Desenvolvido com ❤️ e ☕ pela equipe La Tazza
