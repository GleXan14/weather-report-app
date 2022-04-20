
const WEEK = {
    'es': [
        'Domingo',
        'Lunes',
        'Martes',
        'Miercoles',
        'Jueves',
        'Viernes',
        'Sabado'
    ],
    'en':[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
};
const MONTHS = {
    'es': [
        "Enero","Febrero","Marzo","Abril",
        "Mayo","Junio","Julio","Agosto","Septiembre",
        "Octubre","Noviembre","Diciembre"
    ],
    'en':[
        "January","February","March","April",
        "May","June","July","August","September",
        "October","November","December"
    ]
};

export default class Utility{


    static capitalize(text:string):string{
        const currentText = text;
        const newText = currentText.charAt(0).toUpperCase() + currentText.slice(1);
        return newText;
    }

    static getDay(date: Date, lang: 'es' | 'en' = 'en'){
        
        const dayOfWeek = date.getDay();

        return WEEK[lang][dayOfWeek];
    }

    static getDateFormatted(date: Date, lang: 'es' | 'en' = 'en'){
        const dayOfWeek = date.getDay();
        const month = date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();
        //console.log(lang);

        return `${WEEK[lang][dayOfWeek]}, ${day} ${MONTHS[lang][month]} ${year}`;
    }
}