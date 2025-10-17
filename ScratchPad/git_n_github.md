# Git-commands

- Gits Lifecycle:
[working directory -> staging -> commit]
working-directory:
 - das hier ist dein normales Arbeits verzeichnis. wenn du hier änderungen machst, sagt git "hey, hier ist was passiert!", aber mehr auch nicht
 - ganz wichtig: jeglicher commit wird in allen datein die einf status working directory haben nicht in den commit gebracht!
stagging:
 - vom einfachen directory kommt deine datei nur durch git add <X> in die staging-phase
 - eine file in der stagging phase wird beim nächsten commit geschnapp-schusst
commit:
 - permanenter schnapp-schuss des codes wohin man hin springen kann
 - alles was in der stagging phase war kann man jetzt mit einer eindeutingen ID und nachricht rück-verfolgen und hinwechseln

- git init 
-> erstellt den .git ordner für deinen Ordner damit der git-workflow wo alles von git ist

- git add <fileName> / .
-> fügt die file in gits track list, erst ab da gelten die restlichen commands auf den (mit '.' packst du alles in die track-list)
-> WICHTIG: nach git add <X> befindet sich deine file in der "staging" phase, wo er beim nächsten commit, auch geschnapp-schusst wird.
   du musst nach jeder änderung der file wieder git add <fileName> / . machen um die änderung jetzt auch zu stagen, den die änderungen sind jetzt nur in directory

- git rm --cached <fileName> / .
-> enfernt die files aus der track list

- git status
-> sagt dir alle relevanten dinge über dein projekt was mit git zu tun hat (alle getrackten files, changes, usw...)

- git commit -a -m "<message>"
-> macht ein schnapp-schuss vom jetztigen code worauf du immer zurück kannst
-> mit -m gibst du noch eine nachricht zum Schnapp-schuss
-> mit -a skippst du den stagging part und kannst vom directory direkt commiten

- git log
-> nennt dir die history alles commits mit datum und message dazu

- git restore --staged <fileName> / .
-> holt die bestimmten datein von der stagging phase wieder einfach in dein directory

- git restore "<X>"
-> holt eine gelöschte Datei zurück in dein directory

- git reset <code>
-> wenn du verkackt hast bringt er dich zurück zum zustand des commites mit dem gegebenen code den du von git log --oneline bekommst (in gelb)
-> VORSICHT: in den neuen commits kommt man dann nur schwer, nutze hier also lieber branches!!!

* brachnes

- git branch
-> zeigt dir alle deine branches mit * vor dem in dem du grade bist

- git branch <branchName>
-> erstellt eine neue branch, bleibst aber immernoch in deiner alten (meist main)

- git switch -c <branchName>
-> du wechselst jetzt zu dieser branch
-> -c macht das du vor her nicht 'git branch <branchName>' machen musst und dann wechselst sondern das du direkt erstellst und dahin wechselst

- git switch main
-> wechselt direkt zurück in die main-branch

- git merge -m "<message>" <branchName>
-> von der branch aus in der du bist (meist main) fügst du jetzt die änderungen aus <branchName> rein

- git branch -d <branchName>
-> so lösche ich eine branch (meist nach dem ich die commits vom branch in main hinzugefügt habe)

* bei Merging conflicts:
bei Conflicts befindest du dich in (main|MERGING), das ist eine spezielle phase wo git dir in den Datein die merging-conflict haben
dir beide versionen dieser branches zeigt und die so illustriert werden:
<<<<<<< HEAD (main)
Version 1
=======
Version 2
>>>>>>> branch

dann kannst du die dinge so ändern wie du willst, dann 'git commit -a' oder vorher 'git add .' und dann commit machen und schon läuft auf der main-branch alles glatt

* remote befehle / github

- git remote <X>
-> mit remote ist klar: ab jetzt geht es um github!

- git remote add <alias-name> (meist origin) <url>
-> wenn du eine github repo erstellst dann kannt du dieser url einen namen geben und per diesen namen in der cloud dinge ändern 

- git push -u <alias-name> (meist origin) <branchName> (meist main)
-> postet die gennante branch auf der url des alias-names
-> -u machst du nur beim ersten push, das ist so das sich git merkt das immer wenn du 'git push' sagst, das du halt <alias-name> <branchName> meinst.

- git push --all
-> postet auch all deine branches auf github

- git pull <alias-name> <branchName>
-> git guckt, welche änderungen in der cloud repo sind und updated diese in deine main-branch
-> WICHTIG: kann zu conflicts führen!

(
    - git fetch -> git merge
    -> holt alle bearbeitungen die du in der cloud gemacht hast und merged die local in dein projekt
    -> ist genau das gleiche wie git pull
)

- git clone <url> <new-name>
-> kopiert von der cloude die gesammte code base und erstellt einen neuen ordner mit dem namen <new-name> im Ordner wo du grade bist

