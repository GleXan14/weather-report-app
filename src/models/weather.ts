import Utility from "../utils/Utility";

export interface IWeather{
    city:string | null;
    country:string | null;
    description:string | null;
    humidity:number | null;
    temperature:number | null;
    maxTemp:number | null;
    minTemp:number | null;
    windSpeed:number | null;
    cloudiness:number | null;
    icon:string | null;
    error:any;

}

export default class Weather implements IWeather{
    public city:string | null = null;
    public country:string | null = null;
    public description:string | null = null;
    public humidity:number | null = null;
    public temperature:number | null = null;
    public maxTemp:number | null = null;
    public minTemp:number | null = null;
    public windSpeed:number | null = null;
    public cloudiness:number | null = null;
    public icon:string | null = null;
    public error:any = null;

    deserialize(input:any):this{
        Object.assign(this, input);
        return this;
    }

    getLocationFormatted(){
        return `${this.country}, ${this.city}`;
    }

    getTemperatureLimitFormatted(){
        return `Max. ${this.maxTemp}°, Min. ${this.minTemp}°`;
    }

    getHumidityFormatted(){
        return `${this.humidity}%`;
    }

    getWindSpeedFormatted(){
        return `${this.windSpeed} m/s`;
    }

    getCloudinessFormatted(){
        return `${this.cloudiness}%`;
    }

    getDescription(){
        return Utility.capitalize(this.description!);
    }

    hasError(){
        return this.error && this.error !== undefined;
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
}