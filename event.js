import dayjs from "dayjs";
import "dayjs/locale/fr.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
// import { mock } from './mock.js';
import axios from 'axios';

dayjs.locale("fr");
dayjs.extend(localizedFormat);
dayjs.extend(weekOfYear);

// get datas from API
export async function getEvent(isDaily) {
    let date;
    let request;
    if (isDaily) {
        let today = dayjs().format('YYYY-MM-DD')
        date = [today, today]
        request = 'https://data.toulouse-metropole.fr/api/v2/catalog/datasets/agenda-des-manifestations-culturelles-so-toulouse/records?where=lieu_nom%3D%22ZENITH%20TOULOUSE%20METROPOLE%22%20AND%20date_debut%3C%3D%22' + date[0] + '%22%20AND%20date_fin%3E%3D%22' + date[1] + '%22&order_by=date_debut%20asc&limit=100&offset=0&refine=&timezone=UTC'
    } else {
        let startWeek = dayjs().startOf("week").add(7, 'day').format('YYYY-MM-DD')
        let endWeek = dayjs().endOf("week").add(7, 'day').format('YYYY-MM-DD')
        date = [startWeek, endWeek]
        request = 'https://data.toulouse-metropole.fr/api/v2/catalog/datasets/agenda-des-manifestations-culturelles-so-toulouse/records?where=lieu_nom%3D%22ZENITH%20TOULOUSE%20METROPOLE%22%20AND%20date_debut%3C%3D%22' + date[1] + '%22%20AND%20date_fin%3E%3D%22' + date[0] + '%22&order_by=date_debut%20asc&limit=100&offset=0&refine=&timezone=UTC'
    }
    let eventList = []

    try {
        let data = await axios.get(request);
        // console.log('data', data)
        if (data.data.total_count !== 0) {
            for (const event of data.data.records) {
                if (event.record.fields.horaires) {
                    eventList.push({
                        artist: event.record.fields.nom_de_la_manifestation,
                        // date: new Date(event.record.fields.date_debut).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
                        time: event.record.fields.horaires
                    })
                } else {
                    eventList.push({
                        artist: event.record.fields.nom_de_la_manifestation,
                        date: new Date(event.record.fields.date_debut).toLocaleDateString('fr-FR', { weekday: 'long'}),
                    })
                }
            }
            return eventList
        } else {
            return null
        }
    } catch (error) {
        console.error(error);
    }
}

// sanitize data
export function format(data, dailyMode) {
    //////////////////////////delete false data//////////////////////////
    let entryToDelete = "CASSE-NOISETTE"
    let index = data.findIndex(e => e.artist === entryToDelete)
    if (index !== -1) {
        data.splice(index, 1);
    }
    //////////////////////////delete false data//////////////////////////

    if(data.length <= 0){
        return ''
    }

    let textDailyMode = dailyMode ? "d'aujourd'hui" : "de la semaine"
    let text = data.length === 1 ? "L'évènement " + textDailyMode + " est : \n" : "Les évènements " + textDailyMode + " sont : \n"
    for (const event of data) {
        let newTime;
        if (event.time && !Number.isInteger(event.time.charAt(0))) {
            newTime = event.time.substring(event.time.indexOf("à"), event.time.length);
        }
        let timeText = ""
        if (event.time) {
            timeText = ' à' + newTime
        }
        if (dailyMode) {
            text = text + '- ' + event.artist + timeText + '\n'
        } else {
            if (event.time) {
                text = text + '- ' + event.artist + ' ' + event.time.toLowerCase() + '\n';
            } else {
                text = text + '- ' + event.artist + ' ' + event.date + '\n';
            }
        }

    }
    return text
}