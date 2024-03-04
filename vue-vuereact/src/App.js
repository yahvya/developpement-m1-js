import React from "react";
import Product from "./pages/product/Product";
import {ApplicationNavbar} from "./components/navbar/Navbar";

/**
 * application
 * @constructor
 */
export default function App(){
    return (
        <React.Fragment>
            <ApplicationNavbar/>
            <Product />
        </React.Fragment>
    );
}