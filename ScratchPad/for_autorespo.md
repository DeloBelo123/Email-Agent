<AUTORESPO>
- damit du überhaupt checking machen kannst ob der user die mail gesehen hat, mach ein useEffect mit leerem dependencys der einfach
ein signal ein dein backend schickt das der user grade on ist. (render passiert nur wenn einer on ist), oder so dir eine lib um on/off
des users zu checken

- damit die LLM automatisch eine Mail generiert und schickt, kannst du ja ein system bauen wo er das halt nur bei wichtigen mails, wie die
von leads tut weil die ja schnell kalt werden, dann kannst du sowas wie if email[category] == "leads", danach soll er nach time.sleeps(nach users willen) eine respo generieren zu dieser mail und eine http-post anfrage an mein writeMails machen, ezzy!

# future ich:
 - bruder mach so: bei wichtigen mails soll deine readMail eine Email generieren die er dann eine custom router.post schickt welcher die send function mit
 .delay() hat! mach aber vorher das mit github weil deine gesammte application kann sowas von dicke brechen

 - wie du testen kannst das das klappt: mach so das im ganzen 'offline - modus' dinge gelogged werden und packe das in eine file, so kannst du sehen was im off
 modus passiert. Lern vorher github und mach den off-modus in einer branch bro.

 # GANZ WICHTIG: FÜGE BEI REDIS DEN CONFIG EIN, DAS DATEN PERSISSTEN ÜBER SERVER NEUSTART BLEIBEN!!!
 # GANZ WICHTIG: BAUE REFRESH-TOKEN LOGIK REIN
 # GANZ WICHTIG: ÜBERARBEITE DIE AUTO-RESPONSE LOGIK, SO DAS BEI SCHON BEANTWORTETEN EMAILS KEINE GESENDET WIRD, UND    WENN DER USER ON IST KEINE GESENDEN WIRD
