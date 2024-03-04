import React from "react";
import Button from "../button/Button";
import "./navbar.css";

/**
 * barre de navigation
 * @param props les enfants de la barre
 * @return {Element}
 * @constructor
 */
export function Navbar(props){
    return (
        <React.Fragment>
            <input type="checkbox" id={"navbar-toggler"}/>
            <label htmlFor="navbar-toggler" className={"nav-toggler justify-center page-toggler"}>
                <span></span>
                <span></span>
                <span></span>
            </label>

            <div id={"navbar"} className={"text-upper upper-bg flex-row justify-end align-center"}>
                <label htmlFor="navbar-toggler" className={"nav-toggler justify-center"}>
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
                {props.children}
            </div>
        </React.Fragment>
    );
}

/**
 * barre de navigation de l'application
 * @constructor
 */
export function ApplicationNavbar() {
    return <Navbar>
    <MenuItem
            title={"Voir la liste des produits"}
            text={"Liste des produits"}
            href={"#"}
        />

        <Button
            text={"Voir mes paniers"}
        />
    </Navbar>
}

/**
 * item de la barre de navigation
 * @param props
 * @return {Element}
 * @constructor
 */
export function MenuItem(props){
    return (
        <a
            className={"menu-item"}
            title={props.title}
            href={props.link ?? null}
            target={props.isBlank ? "_blank" : null}
        >{props.text}</a>
    );
}