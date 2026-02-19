# Planejamento Detalhado - Sistema de Gestão de Horas Extras e Benefícios (Hora Extra)

Baseado na documentação `documentacao-app-hora-extra.pdf`.

## 📋 Visão Geral da Stack
*   **Frontend:** React (Vite + TypeScript)
*   **Backend:** Node.js (NestJS ou Express - Clean Architecture)
*   **Banco de Dados:** PostgreSQL
*   **Autenticação:** JWT + RBAC (Role-Based Access Control)

---

## 📅 Fase 1: Configuração e Infraestrutura
*Objetivo: Ter os ambientes de Frontend, Backend e Banco de Dados rodando e conectados.*

1.  **Repositório e Ambiente:**
    *   Iniciar repositório Git.
    *   Configurar Docker Compose para subir o PostgreSQL localmente.
2.  **Backend Init:**
    *   Inicializar projeto (NestJS recomendado).
    *   Configurar ORM (TypeORM/Prisma) para conexão com Postgres.
    *   Configurar variáveis de ambiente (`.env`).
3.  **Frontend Init:**
    *   Inicializar projeto React com Vite e TypeScript.
    *   Configurar biblioteca de rotas (`react-router-dom`).
    *   Configurar biblioteca de estilização.

## 🧱 Fase 2: Modelagem de Dados e Autenticação
*Objetivo: Estruturar o banco de dados conforme o PDF e garantir segurança.*

1.  **Migrations (Banco de Dados):**
    *   `users`: id, email, password_hash, role (EMPLOYEE, MANAGER, RESTAURANT, ADMIN).
    *   `employees`: dados funcionais, valor_hora.
    *   `overtime`: registros de horas extras, data, status.
    *   `balance`: saldo atual consolidado.
    *   `balance_movements`: histórico financeiro (crédito/débito).
    *   `rule_versions`: versionamento de regras de negócio.
2.  **Módulo de Autenticação (Auth):**
    *   Implementar Login (Rota `/auth/login`).
    *   Gerar JWT com Payload (sub, email, role).
    *   Criar Guards/Middlewares para proteção de rotas.

## ⚙️ Fase 3: Core Business - Lógica de Horas e Saldo
*Objetivo: Implementar o coração do sistema: registrar horas e convertê-las em dinheiro.*

1.  **Módulo de Funcionários:**
    *   CRUD de Funcionários.
    *   Vínculo User <-> Employee.
2.  **Módulo de Horas Extras (Overtime):**
    *   Registro de hora extra (Data, Qtd Horas).
    *   Validação de unicidade diária.
3.  **Engine de Regras (Processamento Diário):**
    *   **Regra:** Até 2h = 50% valor hora; Acima de 2h = 100% valor hora.
    *   Service de processamento: Lê `overtime` pendente -> Calcula -> Gera `balance_movements` -> Atualiza `balance`.

## 🖥️ Fase 4: Frontend - Módulos Essenciais (MVP)
*Objetivo: Permitir que o funcionário consulte e o restaurante venda.*

1.  **Tela de Login:**
    *   Formulário e redirecionamento por `role`.
2.  **Portal do Funcionário:**
    *   **Dashboard:** Saldo Atual, Extrato simples.
    *   **Minhas Horas:** Lista de horas e status.
3.  **Portal do Restaurante (PDV):**
    *   **Consulta:** Busca por matrícula/nome.
    *   **Débito:** Input valor + Confirmar.
    *   Integração com backend.

## 📊 Fase 5: Gestão e Administração
*Objetivo: Ferramentas para gestores e RH.*

1.  **Portal do Gestor:**
    *   Dashboard de setor.
    *   Relatórios de horas extras e alertas (>2h frequentes).
2.  **Painel Admin:**
    *   Cadastro de funcionários.
    *   Configuração de Regras (parâmetros 50%/100%).
    *   Trigger Manual de Processamento.

## 🚀 Fase 6: Refinamento e Testes
*Objetivo: Garantir qualidade final.*

1.  **Testes de Integração:**
    *   Fluxo completo: Registro -> Processamento -> Saldo -> Consumo.
2.  **UI/UX:**
    *   Feedback de erros, loadings.
3.  **Documentação:**
    *   Instruções de rodar (Docker/NPM).
