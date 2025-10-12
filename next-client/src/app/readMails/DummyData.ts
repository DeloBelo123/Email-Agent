import { MailCategories,Email } from "./Types";
export function makeDummyMails(category:MailCategories){
        const dummyMails: Email[] = [
        {
            unique_mail_id: "mail_001",
            inhaber_id: "user_123",
            mail_header: "Max Mustermann <max.mustermann@example.com>",
            mail_body: "Sehr geehrte Damen und Herren,\n\nich wende mich an Sie, da ich auf der Suche nach einer geeigneten Immobilie für meine Familie bin. Wir sind eine vierköpfige Familie mit zwei Kindern im Alter von 8 und 12 Jahren und suchen nach einem Haus oder einer größeren Wohnung in guter Lage.\n\nUnsere Anforderungen sind:\n- Mindestens 4 Zimmer\n- Gute Anbindung an öffentliche Verkehrsmittel\n- Ruhige Wohngegend\n- Preisbereich: 400.000 - 600.000 Euro\n\nWir haben bereits einige Objekte online gesehen und sind besonders an den Häusern in der Gartenstraße und der Parkallee interessiert. Können Sie uns weitere Informationen zu diesen Objekten zusenden?\n\nAußerdem wäre es schön, wenn wir einen Termin für eine Besichtigung vereinbaren könnten. Wir sind flexibel und können auch am Wochenende kommen.\n\nVielen Dank für Ihre Zeit und Mühe. Ich freue mich auf Ihre Rückmeldung.\n\nMit freundlichen Grüßen\nMax Mustermann\n\nTel: 0171-1234567\nE-Mail: max.mustermann@example.com",
            mail_summary: "Interesse an Immobilienangeboten - Anfrage nach verfügbaren Objekten",
            mail_category: category,
            created_at: new Date().toISOString()
        },
        {
            unique_mail_id: "mail_002", 
            inhaber_id: "user_123",
            mail_header: "Sarah Schmidt <sarah.schmidt@company.de>",
            mail_body: "Sehr geehrte Damen und Herren,\n\nbezüglich unseres letzten Gesprächs über die Büroimmobilie in der Hauptstraße 15 möchte ich mich nochmals bei Ihnen melden.\n\nUnser Unternehmen Schmidt & Partner GmbH plant eine Expansion und benötigt zusätzliche Büroflächen für unser wachsendes Team. Die Immobilie in der Hauptstraße 15 scheint unseren Anforderungen sehr gut zu entsprechen.\n\nWir sind insbesondere interessiert an:\n- Der Gesamtfläche von 450 qm\n- Der modernen Ausstattung\n- Der guten Verkehrsanbindung\n- Den Parkmöglichkeiten\n\nKönnen wir einen Termin für eine ausführliche Besichtigung vereinbaren? Unser Geschäftsführer Herr Weber und ich würden gerne die Räumlichkeiten persönlich in Augenschein nehmen.\n\nZusätzlich hätte ich noch einige Fragen:\n- Wie hoch sind die Nebenkosten?\n- Gibt es bereits andere Interessenten?\n- Wann wäre der frühestmögliche Einzugstermin?\n- Sind Renovierungsarbeiten geplant?\n\nWir würden uns freuen, wenn wir zeitnah einen Termin finden könnten. Bitte teilen Sie mir Ihre verfügbaren Zeiten mit.\n\nVielen Dank für Ihre Unterstützung.\n\nMit freundlichen Grüßen\nSarah Schmidt\n\nProjektmanagerin\nSchmidt & Partner GmbH\nTel: 089-12345678\nE-Mail: sarah.schmidt@company.de",
            mail_summary: "Terminanfrage für Büroimmobilie Besichtigung - Hauptstraße 15",
            mail_category: category,
            created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
            unique_mail_id: "mail_003",
            inhaber_id: "user_123", 
            mail_header: "Finanzamt München <finanzamt@muenchen.de>",
            mail_body: "Betreff: Steuerbescheid 2023 - Immobiliensteuer\n\nSehr geehrte Damen und Herren,\n\nanbei übersenden wir Ihnen Ihren Steuerbescheid für das Jahr 2023 bezüglich Ihrer Immobilien in München.\n\nNach Prüfung Ihrer Angaben haben wir folgende Änderungen vorgenommen:\n\n1. Grundsteuer für Ihre Wohnung in der Musterstraße 15:\n   - Vorher: 1.200 Euro\n   - Neu: 1.450 Euro\n   - Grund: Anpassung des Einheitswerts\n\n2. Einkommensteuer aus Vermietung:\n   - Mieteinnahmen: 24.000 Euro\n   - Werbungskosten: 3.600 Euro\n   - Zu versteuernder Betrag: 20.400 Euro\n\nBitte prüfen Sie die Angaben sorgfältig und melden Sie sich bei Rückfragen oder Einwendungen innerhalb von 30 Tagen.\n\nFalls Sie Fragen haben, können Sie sich gerne an unsere Hotline unter 089-12345678 wenden oder eine E-Mail an immo@finanzamt-muenchen.de senden.\n\nMit freundlichen Grüßen\n\nFinanzamt München\nAbteilung Immobiliensteuer\n\nHinweis: Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.",
            mail_summary: "Steuerbescheid 2023 - Prüfung der Angaben erforderlich",
            mail_category: category,
            created_at: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        },
        {
            unique_mail_id: "mail_004",
            inhaber_id: "user_123",
            mail_header: "Marketing Team <marketing@realestate-partner.com>",
            mail_body: "Liebe Immobilienexperten,\n\nwir möchten Ihnen eine spannende Kooperationsmöglichkeit vorstellen, die für beide Seiten sehr vorteilhaft sein könnte.\n\nUnser Unternehmen, die RealEstate Partner GmbH, ist ein führender Anbieter von digitalen Marketinglösungen für die Immobilienbranche. Wir haben bereits über 500 Immobilienmakler und -verwalter als Kunden und helfen ihnen dabei, ihre Online-Präsenz zu verbessern und mehr Kunden zu gewinnen.\n\nUnsere Kooperationsidee:\n\n1. Gemeinsame Marketingkampagne:\n   - Wir erstellen professionelle Videos Ihrer Immobilien\n   - Sie erhalten 20% Rabatt auf alle unsere Dienstleistungen\n   - Wir bewerben Ihre Objekte auf unseren Social Media Kanälen\n\n2. Empfehlungsprogramm:\n   - Für jeden Kunden, den Sie uns empfehlen, erhalten Sie 500 Euro\n   - Für jeden Kunden, den wir Ihnen empfehlen, erhalten wir 500 Euro\n\n3. Schulungsprogramm:\n   - Kostenlose Workshops zu digitalem Marketing\n   - Einmalige Beratung zu Ihrer Online-Strategie\n\nWir sind überzeugt, dass diese Kooperation für beide Seiten sehr gewinnbringend sein wird. Bei Interesse freuen wir uns auf ein persönliches Gespräch.\n\nBitte teilen Sie uns mit, wann Sie Zeit für ein kurzes Telefonat oder einen Termin hätten.\n\nHerzliche Grüße\nDas Marketing Team\n\nRealEstate Partner GmbH\nTel: 089-98765432\nE-Mail: marketing@realestate-partner.com\nWeb: www.realestate-partner.com",
            mail_summary: "Kooperationsanfrage für gemeinsame Marketingkampagne",
            mail_category: category,
            created_at: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
        },
        {
            unique_mail_id: "mail_005",
            inhaber_id: "user_123",
            mail_header: "Eigentümer Müller <mueller@email.com>",
            mail_body: "Sehr geehrte Damen und Herren,\n\nich wende mich an Sie, da ich überlege, meine Wohnung in der Musterstraße 42 zu verkaufen.\n\nDie Wohnung hat folgende Daten:\n- 3 Zimmer, 85 qm\n- 2. Obergeschoss\n- Baujahr 1985\n- Balkon nach Süden\n- Kellerabteil\n- Tiefgaragenstellplatz\n\nIch bin Eigentümer seit 2010 und habe die Wohnung in den letzten Jahren komplett renoviert. Es wurden neue Fenster eingebaut, die Küche wurde modernisiert und das Bad wurde komplett erneuert.\n\nDie Wohnung ist derzeit vermietet an eine Familie mit zwei Kindern. Die Miete beträgt 1.200 Euro kalt. Die Mieter sind sehr zuverlässig und zahlen immer pünktlich.\n\nIch würde gerne wissen:\n1. Wie hoch schätzen Sie den aktuellen Marktwert der Wohnung?\n2. Wie lange dauert es normalerweise, eine solche Wohnung zu verkaufen?\n3. Welche Kosten kommen auf mich zu?\n4. Können Sie mir bei der Vorbereitung der Verkaufsunterlagen helfen?\n\nIch bin flexibel bei der Terminvereinbarung und kann auch am Wochenende empfangen. Bitte rufen Sie mich an oder schreiben Sie mir eine E-Mail.\n\nVielen Dank für Ihre Zeit.\n\nMit freundlichen Grüßen\nThomas Müller\n\nTel: 0172-9876543\nE-Mail: mueller@email.com\n\nP.S.: Ich habe auch Fotos der Wohnung, die ich Ihnen gerne zeigen würde.",
            mail_summary: "Verkaufsinteresse - Anfrage nach Marktwert-Einschätzung Wohnung Musterstraße 42",
            mail_category: category,
            created_at: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
        },
        {
            unique_mail_id: "mail_006",
            inhaber_id: "user_123",
            mail_header: "Spam Bot <noreply@fake-offer.com>",
            mail_body: "🎉 GEWINNEN SIE JETZT! 🎉\n\nLiebe/r Immobilienmakler/in,\n\nSie haben sich für unseren exklusiven Newsletter angemeldet und haben jetzt die Chance, 1.000.000 Euro zu gewinnen!\n\nKlicken Sie einfach auf den Link unten und füllen Sie das kurze Formular aus:\n\n[Verdächtige Links entfernt]\n\nAber warten Sie! Das ist noch nicht alles!\n\nWenn Sie innerhalb der nächsten 24 Stunden antworten, erhalten Sie:\n- 50% Rabatt auf alle unsere Dienstleistungen\n- Kostenlose Beratung im Wert von 500 Euro\n- Exklusive Einladung zu unserem VIP-Event\n\nHaben Sie schon von unseren revolutionären Immobilien-Strategien gehört?\n- Verdienen Sie 10.000 Euro pro Monat passiv\n- Werden Sie in 30 Tagen zum Immobilien-Millionär\n- Lernen Sie die geheimen Tricks der Top-Makler\n\n[Weitere verdächtige Links entfernt]\n\nDiese E-Mail ist eindeutig Spam und sollte nicht beachtet werden. Alle Links wurden aus Sicherheitsgründen entfernt.\n\nHinweis: Falls Sie diese E-Mail nicht angefordert haben, können Sie sich hier abmelden: [Link entfernt]",
            mail_summary: "Spam-E-Mail - Gewinnversprechen und verdächtige Links",
            mail_category: category,
            created_at: new Date(Date.now() - 18000000).toISOString() // 5 hours ago
        }
    ]
    return dummyMails
}