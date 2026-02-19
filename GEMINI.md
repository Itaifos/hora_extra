# GEMINI.md - Project Context

## Project Overview
**Name:** Sistema de Gestão de Horas Extras e Benefícios (Hora Extra)
**Purpose:** A system designed to register, process, and convert employee overtime into internal benefit credits, which can be used exclusively at the company's internal restaurant.

## Directory Overview
This directory currently serves as the central repository for project documentation and specifications. It contains the foundational logic and architectural plans for the upcoming development phase.

## Key Files
- `documentacao-app-hora-extra.pdf`: Comprehensive project specification, including business rules, user roles, system flows, UI/UX maps, and technical architecture.
- `GEMINI.md`: This context file, providing a high-level overview for AI-assisted development.

## Business Rules (Core Logic)
- **Overtime Conversion:**
  - Up to 2 hours/day: Converted at 50% of the employee's normal hourly rate.
  - Above 2 hours/day: Converted at 100% of the employee's normal hourly rate.
- **Credits:** Credits are for internal use only and do not expose sensitive salary information.

## Planned Architecture
- **Frontend:** React (Modular structure with Profile-based dashboards).
- **Backend:** Node.js (NestJS or Express) following Clean Architecture principles.
- **Database:** PostgreSQL.
- **Authentication:** JWT with Role-Based Access Control (RBAC).

## User Profiles
1. **Employee:** View overtime history and available balance.
2. **Manager:** Access sector-wide reports, financial impact analysis, and overtime approval.
3. **Restaurant:** Simple point-of-sale interface to debit balances and view consumption history.
4. **Administrator:** Full control over employee registration, conversion rules, and daily processing.

## Usage
Use the documentation in the PDF to guide the implementation of the backend API and frontend interfaces. Focus on the MVP features first: registration, overtime logging, daily rule processing, and balance management.
