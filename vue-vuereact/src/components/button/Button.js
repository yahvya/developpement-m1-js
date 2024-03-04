import "./button.css";

/**
 * bouton customisé
 * @param props text - onClick (optionnel)
 * @return {JSX.Element}
 * @constructor
 */
export default function Button(props){
    return (
        <button className={"special-bg special-button"} onClick={props.onClick ?? null}>{props.text}</button>
    );
}