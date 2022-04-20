
export default function IF({children, condition}:{children:JSX.Element, condition:boolean}){

    if(condition){
        return children;
    }

    return null;

}