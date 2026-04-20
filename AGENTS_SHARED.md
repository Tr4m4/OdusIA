# SHARED AGENT PROTOCOLS

This file contains universal protocols and templates shared by all software engineering agents in this ecosystem. Project-specific agents MUST reference these rules.

## 🛡️ CORE PRINCIPLES
- **ENGINEERING EXCELLENCE**: Promote **Idempotency, Observability**, and clean data pipelines. All state changes must be traceable.
- **EXECUTION HIERARCHY**: Follow this strict logical priority: **Safety > Diagnosis > Planning > Execution**.

---

## 🛡️ CONFLICT RESOLUTION PROTOCOL
If a user request contains conflicting constraints or violates security/stability principles, you MUST:

1. **Identify**: Explicitly state the conflict or the risk.
2. **Explain**: Clear explanation of the technical trade-offs. (e.g., "Disabling logs will compromise the **audit trail**, making it impossible to prove compliance or debug systemic data loss.").
3. **Suggest**: Propose a technically superior, alternative approach ("Gold Standard").
4. **Require Confirmation**: STOP and wait for explicit approval before proceeding.

---

## 🚀 TASK EXECUTION PROTOCOL
Every task MUST follow these mandatory steps:

### 1. Mandatory Jira Integration
For EVERY code modification or feature, the agent MUST create a Jira issue before starting work.
- **Workflow**: Create Jira Issue -> **Transition to 'IN PROGRESS'** -> Update `task.md` -> Execute Code.

### 2. Context Safety Check
- Call `jira_search_issues` in the relevant project to find related work.
- Call `view_file` or `grep_search` to ensure no duplicated work or broken patterns.

### 3. ✅ VALIDATION & TESTING PROTOCOL (MANDATORY)
Any proposed change (Bugfix, Feature, Refactor) must address testing before deployment:
- **Test Case Generation**: Define at least two cases:
    - **Positive Test Case**: Confirms intended functionality works.
    - **Negative Test Case**: Confirms change does NOT break existing logic (Regression Prevention).
- **Unit/Integration Check**: Articulate which module's tests will be updated.
- **Pre-Commit Checklist**: 
    - [ ] Unit tests updated.
    - [ ] Integration tests successful in staging.
    - [ ] Side effects on deployment reviewed.

---

## 💥 INCIDENT RESPONSE PROTOCOL (PRIORITY 1)
If the pipeline fails and the root cause analysis (RCA) cannot pinpoint a simple fix, or if the failure is system-wide (e.g., API outage, credential expiry), you MUST:

1. **Containment**: Stop all scheduled automation attempts immediately.
2. **Impact Assessment**: Determine the scope of the failure.
3. **Rollback Priority**: If a change was recently deployed, identify the commit and recommend a **rollback** to the last known stable version. Never deploy a fix without a verified rollback path.
4. **Escalation**: If resolution requires manual intervention, draft a formal **Incident Report** detailing Symptom, RCA, Mitigation, and required Human Action.
5. **Logging**: Document the entire sequence, even for temporary fixes.

---

## 🎫 JIRA TASK TEMPLATE
Use the following format. Task types are **immutable**:
- **Bug**: Failure in existing verified logic.
- **Refactor**: Improvements in maintainability/performance without changing behavior.
- **Feature**: New business requirements.

---
### 🎫 JIRA TASK: [SHORT TITLE]
**Type:** [Feature / Refactor / Bug / Task]
**Priority:** [High/Medium/Low]

**Description:**
[Detailed explanation of the technical requirement]

**Technical Requirements:**
- [Requirements...]

**Acceptance Criteria:**
- [ ] AC 1
- [ ] AC 2

**Technical Notes & Security:**
(Mention secrets management, API quotas, and security protocols).
---

## 🧠 REASONING & CLARITY PROTOCOL
- **THINK STEP-BY-STEP**: Logical breakdown before any action.
- **DOUBT = QUESTION**: STOP and ask the user if a requirement is ambiguous.
- **TRACEABILITY**: All major changes must be reflected in `implementation_plan`, `task.md`, and `walkthrough`.

---

## 🛠️ CORE MCP TOOLS
- **Jira**: Issue and transition management.
- **Confluence/Search**: Business logic and documentation retrieval.
- **General Tools**: `grep_search`, `multi_replace_file_content`, `view_file`.

**Authentication**: Use project-specific methods (`nlm login`, `.env`).
