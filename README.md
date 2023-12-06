Game Theory App mit Next.js, Axios und Mantine
==============================================

Die Game Theory App ist eine moderne Webanwendung, die mit den bewährten Technologien Next.js, Axios und Mantine entwickelt wurde. Diese README gibt einen Überblick über die Struktur, Funktionalitäten und die Verwendung der genannten Technologien.

Inhaltsverzeichnis
------------------

-   [Game Theory App mit Next.js, Axios und Mantine](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#game-theory-app-mit-nextjs-axios-und-mantine)
  -   [Inhaltsverzeichnis](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#inhaltsverzeichnis)
  -   [Public Goods Game](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#public-goods-game)
    -   [Beschreibung](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#beschreibung)
    -   [Verzeichnisstruktur](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#verzeichnisstruktur)
    -   [Firebase-Konfiguration](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#firebase-konfiguration)
    -   [Hilfsfunktionen](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#hilfsfunktionen)
    -   [Hooks](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#hooks)
    -   [Logger](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#logger)
    -   [Themen](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#themen)
  -   [Quick Start Guide](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#quick-start-guide)
  -   [Detaillierte Erklärung](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#detaillierte-erkl%C3%A4rung)
    -   [Verwendete Technologien](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#verwendete-technologien)
      -   [Next.js](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#nextjs)
      -   [Axios](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#axios)
      -   [Mantine](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#mantine)
    -   [Projektstruktur](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#projektstruktur)
    -   [Firebase Integration](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#firebase-integration)
    -   [Benachrichtigungen](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#benachrichtigungen)
    -   [Datenvisualisierung](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#datenvisualisierung)
  -   [Serverseitige Bereitstellung](https://chat.openai.com/c/f94f1538-af0c-4405-a092-076d688785b3#serverseitige-bereitstellung)

Public Goods Game
-----------------

### Beschreibung

Die Game Theory App wurde mit Next.js, Axios und Mantine entwickelt, um eine effiziente und benutzerfreundliche Webanwendung zu erstellen. Die Anwendung ermöglicht es Benutzern, Spiele basierend auf Spieltheorieprinzipien zu erstellen, zu verwalten und zu spielen. Spieler können Aktionen ausführen, Karten spielen und den Fortschritt ihrer Spiele verfolgen.

### Verzeichnisstruktur

Die Anwendung ist in verschiedene Verzeichnisse strukturiert:

-   components: Enthält React-Komponenten für verschiedene Ansichten und Aktionen der App.
-   utils: Hier finden sich Hilfsfunktionen, benutzerdefinierte Hooks, Firebase-Konfiguration und der Logger.
-   public: Bilder und Ressourcen, die von der Anwendung genutzt werden.

### Firebase-Konfiguration

Die Firebase-Konfiguration befindet sich in der Datei `firebaseApp.ts`. Diese Datei initialisiert Firebase mit den benötigten API-Schlüsseln und Einstellungen, und die Firebase-Instanz wird in der gesamten Anwendung verwendet.

### Hilfsfunktionen

Die Datei `helpers.ts` enthält eine Hilfsfunktion zur Validierung von Zahlen, die einem bestimmten Enumerationswert entsprechen. Diese Funktion wird für die Verarbeitung von Spieleraktionen im Spiel verwendet.

### Hooks

Die Datei `hooks.ts` enthält benutzerdefinierte Hooks, darunter `useInterval` für die Ausführung von Funktionen in Intervallen und `useModal` für die Verwaltung von Modalzuständen.

### Logger

Der Logger in der Datei `logger.ts` wird für die Protokollierung von Informationen, Debugging-Details, Fehlern und Warnungen verwendet. In der Produktionsumgebung werden nur Fehler und Warnungen protokolliert.

### Themen

Das Designthema der Anwendung wird in der Datei `theme.ts` festgelegt. Es enthält Farbdefinitionen und benutzerdefinierte Stile für bestimmte Komponenten wie Buttons und Titel.

Quick Start Guide
-----------------

-   Starten Sie den Entwicklungsserver: `npm run dev`
-   Öffnen Sie <http://localhost:3000/overview> und erstellen Sie ein neues Spiel. Kopieren Sie die entsprechende *gameID* in die Zwischenablage.
-   Öffnen Sie [http://localhost:3000](http://localhost:3000/) in Ihrem Browser (leitet weiter zu <http://localhost:3000/login/student>) und treten Sie einem Spiel bei, indem Sie die *gameID* verwenden.
-   Der neu beigetretene Spieler ist nun auf der Übersichtsseite zu sehen.

Alternativ können Sie das Projekt lokal erstellen und auf Ihrem Computer ausführen:

bashCopy code

`npm run build
npm start`

Detaillierte Erklärung
----------------------

Diese Sektion bietet detaillierte Informationen zum Projekt, seiner Struktur und technischen Details.

### Verwendete Technologien

#### Next.js

[Next.js](https://nextjs.org/) ist das zugrunde liegende Framework dieses Projekts. Es erleichtert die Entwicklung von React-Anwendungen und bietet erweiterte Funktionen wie Server-Side Rendering (SSR) und statische Seiten-Generierung (SSG). Die Verzeichnisstruktur wird automatisch generiert, und dynamische Routen können einfach erstellt werden.

#### Axios

[Axios](https://axios-http.com/) wird in der Anwendung verwendet, um Daten von einem Server abzurufen. Ein Beispiel aus der `overviewTable.tsx`-Datei zeigt die Verwendung von Axios für den Zugriff auf API-Endpunkte:

javascriptCopy code

`// Verwendung von Axios in overviewTable.tsx
import axios from 'axios';

const fetchGames = async () => {
try {
const response = await axios.get('/api/games');
const games = response.data;
// Verarbeite die Spiele...
} catch (error) {
console.error('Fehler beim Abrufen der Spiele:', error);
}
};`

Axios ermöglicht eine effiziente asynchrone Kommunikation mit dem Server.

#### Mantine

[Mantine](https://mantine.dev/) ist eine React-Komponentenbibliothek, die für viele UI-Elemente in der Anwendung verwendet wird. Hier ein Beispiel aus der `GameMasterMenuBar.tsx`-Datei:

javascriptCopy code

`// Verwendung von Mantine in GameMasterMenuBar.tsx
import { Container, Flex, Title, Menu, ActionIcon } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';

function GameMasterMenuBar() {
return (
<Container>
<Flex>
<Title>Game Theory</Title>
<Menu>
<Menu.Target>
<ActionIcon>
<IconUser />
</ActionIcon>
</Menu.Target>
{/* Weitere Mantine-Komponenten für das Dropdown-Menü */}
</Menu>
</Flex>
</Container>
);
}`

Mantine erleichtert die Erstellung moderner UI-Elemente.

### Projektstruktur

Die Anwendung ist in verschiedene Verzeichnisse strukturiert, darunter `components`, `utils` und `public`. Diese Verzeichnisse enthalten React-Komponenten, Hilfsfunktionen, Ressourcen und mehr.

### Firebase Integration

Die Anwendung integriert Firebase für die Backend-Infrastruktur. Die Konfiguration ist in `firebaseApp.ts` zu finden.

### Benachrichtigungen

Die `notifications`-Komponente in `loginNotifications.tsx` und `notifications.tsx` zeigt Erfolgs- und Fehlermeldungen.

### Datenvisualisierung

Die `Plot`-Komponente in `plot.tsx` verwendet Recharts für die Darstellung von Spielstatistiken.

Serverseitige Bereitstellung
----------------------------

Wenn Sie mit den Änderungen zufrieden sind, können Sie einen Produktionsbuild erstellen und den lokalen Produktionsserver starten. Verwenden Sie `npm run build` für den Build und `npm start` für den lokalen Produktionsserver. Wenn Sie mit dem Ergebnis zufrieden sind, können die Änderungen auf den Server hochgeladen werden. SSH-Zugriff auf den Server ist erforderlich. Folgen Sie diesen Schritten:

1.  Verbinden Sie sich über SSH mit dem Server: `ssh atlasserver`.
2.  Navigieren Sie zum Verzeichnis, in dem das Git-Repository geklont wurde: `cd /etc/gametheory/pulic-goods-game`.
3.  Aktualisieren Sie lokale Dateien mit den neuesten Änderungen: `git fetch` und `git pull`.
4.  Überprüfen Sie, ob das Repository auf dem neuesten Stand ist: `git status`.
5.  Öffnen Sie das Unterverzeichnis `./docker`: `cd docker/`.
6.  Erstellen Sie das Docker-Image mit den neuesten Änderungen: `docker compose build`.
7.  Starten Sie den Docker-Container neu: `docker compose up -d`.

Die Anwendung ist jetzt unter [gametheory.atlasproject.de](https://gametheory.atlasproject.de/) verfügbar.

Weitere Details zur [Next.js-Bereitstellung](https://nextjs.org/docs/deployment).
