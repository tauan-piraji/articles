<div align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</div>

<div align="center">

# 🚀 **Articles & Users API — NestJS Backend**

BackEnd responsável pela orquestração de **Usuários e Artigos**  
(Criação, leitura, atualização e exclusão), com:

**🔐 Autenticação JWT | 🛡️ RBAC | 🧰 Validação | 🧩 Arquitetura Modular | 🗄️ PostgreSQL | 🐳 Docker 

---

### **Stack**
<img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-black?logo=jsonwebtokens" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/TypeORM-red?logo=typeorm" />
<img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />

**Versão 0.0.1**
</div>

---

## 📚 **Sobre o Projeto**

A **Articles & Users API** é um backend desenvolvido em **NestJS** para demonstrar organização, boas práticas,
arquitetura limpa e segurança aplicada.

Este serviço foi projetado para:

- Gerenciar usuários (Admin, Author)
- Criar, listar, atualizar e excluir artigos
- Aplicar regras de autorização **RBAC**
- Garantir segurança via JWT
- Registrar logs estruturados
- Padronizar comunicação via DTOs e validação

---

## ✅ **Funcionalidades**

### 👤 **Usuários**
✔️ Cadastro de usuários  
✔️ Login e autenticação via JWT  
✔️ Perfis de acesso: **ADMIN** e **AUTHOR**  
✔️ ADMIN pode gerenciar qualquer usuário  
✔️ AUTHOR possui acesso limitado  

### 📝 **Artigos**
✔️ Criação de artigos vinculados ao usuário autenticado  
✔️ Atualização e exclusão  
— ADMIN pode excluir qualquer artigo  
— AUTHOR só pode excluir seus próprios artigos  
✔️ Listagem geral e por ID  
✔️ Tags opcionais  

---

## 🗂️ **Estrutura do Projeto**

src/
├── modules/                           # Módulos de domínio da aplicação       
│   ├── articles/                      # Módulo de Artigos       
│   │   ├── controller/                # Controllers HTTP       
│   │   ├── service/                   # Regras de negócio         
│   │   ├── dto/                       # Data Transfer Objects       
│   │   ├── entity/                    # Entidades / modelos de persistência   
│   │   └── enums/                     # Enums específicos do módulo       
│   │       
│   ├── users/                         # Módulo de Usuários       
│   │   ├── controller/       
│   │   ├── service/          
│   │   ├── dto/       
│   │   └── entity/       
│   │   
│   └── auth/                          # Autenticação e autorização (JWT + RBAC)   
│       ├── guards/                    # JwtAuthGuard, RolesGuard              
│       ├── decorators/                # @Roles(), @CurrentUser()       
│       ├── strategy/                  # JwtStrategy       
│       └── dto/                       # DTOs de login e retorno       
│       
├── common/                            # Recursos reutilizáveis e genéricos             
│   ├── interceptors/                  # Interceptadores de request/response       
│   ├── filters/                       # Exception Filters globais       
│   └── value-objects/                 # Value Objects para domínio rico         
│       
├── config/                            # Configurações       
│       
├── repository/                        # Repositories para comunicação com o banco    
│              
└── main.ts                            # Bootstrap da aplicação NestJS       
         


---

## 🧼 **Padrões e Convenções**

- Todas mensagens de erro retornadas em **português**
- Arquitetura modular do NestJS seguindo responsabilidade única
- Validação com **class-validator**
- Autenticação JWT + autorização baseada em Roles (RBAC)
- Logs estruturados via Winston
- Uso de DTOs para entrada e saída de dados
- Consistência entre entities, DTOs e services
- Estrutura padronizada para novos módulos

---

## 🐳 **Executando com Docker**

### 🔨 Build

```bash
docker-compose -f .\docker\docker-compose.yml up --build
