import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import './styles.scss';
import Weather from "../../models/weather";
import {dailyApiHost, apiKey} from '../../environments/api';
import axios from "axios";
import DailyWeather, { IDailyWeather } from "../../models/daily";
import IF from "../IF/IfComponent";
import Loader from "../Loader/LoaderComponent";

type Props = {
    location: {lat:string, lon:string},
    lang: 'es' | 'en'
}

export default function DailyForecast(props:Props){

    const [weathers, setWeathers] = useState<DailyWeather[]>([]);
    const [lang, setLang] = useState<'es' | 'en'>('en');
    const location = props.location;
    

    useEffect(() => {
        if (location) {
            getDailyWeathers();
        } 
    }, []);

    useEffect(() => {
        setLang(props.lang)
    }, [props.lang]);

    const getDailyWeathers = async () => {
        const {lat, lon} = location;
        
        const url = dailyApiHost;
        const params = {
            lat,
            lon,
            exclude: 'hourly,current,minutely,alerts',
            units: 'metric',
            appid: apiKey
        };
        
        const result = await axios.get(url, {params});
        const weathers = createWeatherArray(result.data.daily.slice(1,7));
        setWeathers(weathers);

        //console.log('OUT', result.data);
    }

    const createWeatherArray = (data:any[]) => {
        const newWeathers: DailyWeather[] = [];
        data.forEach(item => {
            const newWeather = new DailyWeather();
            const weatherData = {
                maxTemp: item.temp.max,
                minTemp: item.temp.min,
                icon: item.weather[0].icon,
                date: new Date(item.dt*1000)
            };
            //console.log(item.dt);
            newWeather.deserialize(weatherData);

            newWeathers.push(newWeather);
        });

        return newWeathers;
    }

    return (
        <Container fluid
        className="py-4 px-2 custom-daily-container d-flex justify-content-center align-items-center" 
        >
            <IF condition={!!(weathers && weathers !== undefined && weathers.length > 0)}>
                <Row style={{"width": '90vw'}}>
                    {weathers.map((item, i) => 
                        <Col xs={6} md={2} key={i}
                        className="mt-2 d-flex justify-content-center align-items-center flex-column">
                            <div
                            className="daily-day col-12 d-flex justify-content-center align-items-center flex-column">
                                <h5>{item.getDay(lang)}</h5>
                                <img src={item.getIconUrl('large') ? item.getIconUrl('medium') : ''} alt="icon" 
                                style={{'width': '80px', 'height': '80px'}}/>
                                <h6>{item.getMaxTemp()}</h6>
                                <h6>{item.getMinTemp()}</h6>
                            </div>
                        </Col>
                    )}
                </Row>
            </IF>

            <IF condition={(!weathers || weathers === undefined || weathers.length === 0)}>
                <Loader lang={lang}></Loader>
            </IF>
        </Container>
    )
}