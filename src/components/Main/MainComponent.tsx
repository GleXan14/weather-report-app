
import axios from 'axios';
import { useEffect, useState } from 'react';
import './styles.scss';
import {currentApiHost, apiKey} from '../../environments/api';
import Weather from '../../models/weather';
import { Col, Container, Row } from 'react-bootstrap';
import IF from '../IF/IfComponent';
import Loader from '../Loader/LoaderComponent';
import { IconButton, Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import DailyForecast from '../DailyForecast/DailyForecastComponent';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloudIcon from '@mui/icons-material/Cloud';
import LanguageIcon from '@mui/icons-material/Language';
import Tooltip from '@mui/material/Tooltip';
import Utility from '../../utils/Utility';
import {Strings} from '../../i18n';


export default function Main(){

    const [weather, setWeather] = useState<Weather>();
    const [location, setLocation] = useState<{lat:string, lon:string}>();
    const [clickLang, setClickLang] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const langSaved = localStorage.getItem('lang');
    const [lang, setLang] = useState<'es' | 'en'>(langSaved ? langSaved as any : 'en');
    const [position, setPosition] = useState<any>();
    const todayDate = new Date();
    const [isInitiated, setIsInitiated] = useState<boolean>(false);
    const [hasGeolocation, setHasGeolocation] = useState<boolean>(true);

    useEffect(() => {
        if(!langSaved){
            localStorage.setItem('lang', lang);
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getOwnWeather);
        }else{
            setHasGeolocation(false);
        } 
    }, []);

    useEffect(() => {
        
        localStorage.setItem('lang', lang);
        if(isInitiated){
            getOwnWeather(position);
            
        }else{
            setIsInitiated(true);
        }

    }, [lang]);


    const getOwnWeather = async (dataPos:any) => {
        
        try {
            //console.log(dataPos);
            const {latitude, longitude} = dataPos.coords;
            setLocation({lat: latitude, lon: longitude});
            setPosition({coords:{
                latitude,
                longitude
            }});
            const url = currentApiHost;
            const params = {
                lat: latitude,
                lon: longitude,
                lang,
                units: 'metric',
                appid: apiKey
            };
            const result = await axios.get(url, {params});
            const weather = createWeatherObject(result.data);
            setWeather(weather);
            
        } catch (error) {
            console.log(error);
        }
        //console.log('OUT', weather);

    }

    const createWeatherObject = (data:any):Weather => {
        const newWeather = new Weather();
        const weatherData = {
            city: data.name,
            country: data.sys.country,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            temperature: data.main.temp,
            maxTemp: data.main.temp_max,
            minTemp: data.main.temp_min,
            windSpeed: data.wind.speed,
            cloudiness: data.clouds.all,
            icon: data.weather[0].icon
        }
        
        newWeather.deserialize(weatherData);

        return newWeather;
    }

    const getTodayDateFormatted = ():string => {
        return Utility.getDateFormatted(todayDate, lang);
    }

    const handleClickLangMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setClickLang(
            clickLang === null
            ? {
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
                }
            : 
            null
        );
    };

    const handleLangClose = () => {
        setClickLang(null);
    };

    const handleChangeLang = (
        event: React.MouseEvent<HTMLElement>,
        lang: 'es' | 'en') => {
        
        
        switch(lang){
            case 'es':
                console.log('SPANISH');
                break;
            
            case 'en':
                console.log('ENGLISH');
                break;
        }

        setWeather(undefined);
        setLang(lang);
        handleLangClose();
    };

    return (
        <Container fluid 
        className="d-flex justify-content-center align-items-center flex-column" 
        >

            <IF condition={!!(weather && weather !== undefined && weather.temperature &&
                location && location !== undefined)}>
                <div style={{"width": '100%'}}
                className="pt-3 px-4 d-flex justify-content-between align-items-end flex-row">
                    
                    <div
                    className="d-flex justify-content-center align-items-end flex-row">
                        <LocationOnIcon fontSize="large" />
                        <p className='my-0 mx-2'>{weather?.getLocationFormatted()}</p>
                    </div>
                    <Tooltip title={Strings[lang].LANG}>
                        <IconButton className='custom-icon-color' 
                        aria-label="change lang" component="span"
                        size="large"
                        onClick={handleClickLangMenu}>
                            <LanguageIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        open={clickLang !== null}
                        onClose={handleLangClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                        clickLang !== null
                            ? { top: clickLang.mouseY, left: clickLang.mouseX }
                            : undefined
                        }
                    >
                        <MenuItem>
                            <ToggleButtonGroup
                            color="primary"
                            value={lang}
                            exclusive
                            onChange={handleChangeLang}
                            >
                                <ToggleButton value="es">Español</ToggleButton>
                                <ToggleButton value="en">English</ToggleButton>
                                
                            </ToggleButtonGroup>
                        </MenuItem>
                    </Menu>
                </div>
            </IF>

            <IF condition={!!(weather && weather !== undefined && weather.temperature)}>
                <Row style={{"width": '100%'}}>
                    <Col xs={{order: "last"}} md={{span: 3, order: "first"}} 
                    className="mt-3 d-flex justify-content-center align-items-center flex-column">
                        
                        <div className="my-2 d-flex justify-content-center align-items-center flex-row">
                            <ThermostatIcon sx={{ fontSize: 70 }}/>
                            <h2 className='mx-2'
                            style={{'fontSize': '60px'}}>{weather?.temperature}°</h2>
                        </div>
                        
                        <h5>{weather?.getTemperatureLimitFormatted()}</h5>
                    </Col>

                    <Col md={6} 
                    className="d-flex justify-content-center align-items-center flex-column">
                        <img src={weather?.getIconUrl('large') ? weather?.getIconUrl('large') : ''} alt="icon" 
                        style={{'width': '250px', 'height': '250px'}}/>

                        <div className='custom-date-container'>
                            <h3 className='my-0'>{getTodayDateFormatted()}</h3>
                        </div>
                    </Col>

                    <Col xs={{order: "first"}} md={{span: 3, order: "last"}} 
                    className="mt-3 d-flex justify-content-center align-items-center flex-column">
                        
                        <h2>{weather?.getDescription()}</h2>

                        
                        <div className="my-2 d-flex justify-content-center align-items-center flex-row">
                            <OpacityIcon fontSize="large" />
                            <div className="mx-2 d-flex justify-content-center align-items-start flex-column">
                                <p className='my-0'>{Strings[lang].WEATHER.HUMIDITY}</p>
                                <h5 className='my-0'>{weather?.getHumidityFormatted()}</h5>
                            </div>
                        </div>
                        <div className="my-2 d-flex justify-content-center align-items-start flex-row">
                            <AirIcon fontSize="large" />
                            <div className="mx-2 d-flex justify-content-center align-items-center flex-column">
                                <p className='my-0'>{Strings[lang].WEATHER.WIND_SPEED}</p>
                                <h5 className='my-0'>{weather?.getWindSpeedFormatted()}</h5>
                            </div>
                        </div>
                        <div className="my-2 d-flex justify-content-center align-items-start flex-row">
                            <CloudIcon fontSize="large" />
                            <div className="mx-2 d-flex justify-content-center align-items-center flex-column">
                                <p className='my-0'>{Strings[lang].WEATHER.CLOUDINESS}</p>
                                <h5 className='my-0'>{weather?.getCloudinessFormatted()}</h5>
                            </div>
                        </div>
                        
                    </Col>
                </Row>
            </IF>

            <IF condition={!!(weather && weather !== undefined && weather.temperature &&
                location && location !== undefined)}>
                <DailyForecast location={location!} lang={lang} />
            </IF>

            <IF condition={(!weather || weather === undefined) && !hasGeolocation}>
                <Container fluid 
                className="d-flex justify-content-center align-items-center flex-column"
                style={{"height": '100vh'}}>
                    <h1>{Strings[lang].GEOLOCATION.TITLE}</h1>
                    <p>{Strings[lang].GEOLOCATION.SUBTITLE}</p>
                </Container>
            </IF>

            <IF condition={(!weather || weather === undefined) && hasGeolocation}>
                <Loader lang={lang}></Loader>
            </IF>
        </Container>
    );
}