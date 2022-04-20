import Utility from "../utils/Utility";


export interface IDailyWeather{
    icon: string | null;
    maxTemp:number | null;
    minTemp:number | null;
    date: Date | null;
}

export default class DailyWeather implements IDailyWeather{
    public icon: string | null = null;
    public maxTemp: number | null = null;
    public minTemp: number | null = null;
    public date: Date | null = null;

    deserialize(input:any):this{
        Object.assign(this, input);
        return this;
    }

    getMaxTemp(){
        return `${this.maxTemp}°`;
    }

    getMinTemp(){
        return `${this.minTemp}°`;
    }

    getIconUrl(size?:'small' | 'medium' | 'large'){
        if(!this.icon || this.icon === undefined){
            return '';
        }

        switch(size){
            case 'medium':
                return `http://openweathermap.org/img/wn/${this.icon}@2x.png`;
            
            case 'large':
                return `http://openweathermap.org/img/wn/${this.icon}@4x.png`;

            case 'small':
            case undefined:
            default:
                return `http://openweathermap.org/img/wn/${this.icon}.png`;

        }
        
    }

    getDay(lang: 'es' | 'en' = 'en'){
        //console.log(this.date?.toDateString())
        return Utility.getDay(this.date!, lang);
    }
}