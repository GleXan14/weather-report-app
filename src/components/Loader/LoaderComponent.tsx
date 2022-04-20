import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {Strings} from '../../i18n';

type Props = {
    lang: 'es' | 'en'
}

export default function Loader(props:Props){

    
    const [lang, setLang] = useState<'es' | 'en'>('en');
    
    useEffect(() => {
        setLang(props.lang)
    }, [props.lang]);

    return (

        <Container fluid 
        className="d-flex justify-content-center align-items-center flex-column"
        style={{"height": '100vh'}}>
            <h1>{Strings[lang].LOADING.TITLE}</h1>
            <p>{Strings[lang].LOADING.SUBTITLE}</p>
        </Container>
    )
}