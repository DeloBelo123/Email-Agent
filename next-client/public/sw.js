import { ServiceWorker } from "../myLibUI/Backend/serviceWorker/worker"

const sw = new ServiceWorker()
sw.handlePush({
    openIcon:"", //muss noch ein foto hier rein legen,
    closingIcon:"" //muss noch ein foto hier rein legen
})
sw.onNotificationClick("/src/app/readMails")