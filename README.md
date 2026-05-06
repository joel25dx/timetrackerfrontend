# Time Tracker Frontend

En webbapplikation för att mäta tid på olika aktiviteter, datan lagras genom mongoDB.

---

## Funktioner

*   **Hantera aktiviteter**: Skapa, ändra och ta bort kategorier (t.ex. "Jobb", "Träning").
*   **Timer**: En klocka som mäter tid i realtid.
*   **Säkerhet**: Tack vare `localStorage` försvinner inte din tid eller din valda aktivitet om du råkar ladda om sidan.
*   **Sparade sessioner**: När timern stoppas räknas start- och sluttid ut automatiskt och skickas direkt till databasen.

---

## Tekniker

*   **React & TypeScript**: För logik samt struktur.
*   **Vite**: För utveckling och byggprocess.
*   **CSS**: För design.

---

## Kom igång

Följ dessa steg för att köra projektet lokalt:

### 1. Installera
bash
npm install

### 2. Starta utvecklingsservern
Bash
npm run dev

### API:
Appen är kopplad till följande backend-tjänst:
URL: https://timetracker-e87sw.ondigitalocean.app
