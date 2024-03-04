import React from "react";
import Select from "react-select";
import "./product.css";

/**
 * affichage des produits
 */
export default class Product extends React.Component{
    /**
     * lien de récupération des produits
     * @type {string}
     */
    static PRODUCTS_FETCH_LINK = "http://127.0.0.1:8000/produits";
    /**
     * lien de récupération des catégories de produits
     * @type {string}
     */
    static CATEGORIES_FETCH_LINK = "http://127.0.0.1:8000/categories";

    /**
     * lien de récupération des produits d'une catégorie (id de la catégorie à ajouter)
     * @type {string}
     */
    static CATEGORY_PRODUCT_FETCH_LINK = "http://127.0.0.1:8000/produits/categories/";

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            categories: [],
            choosedCategories: []
        };
    }

    componentDidMount() {
        this.getProducts();
        this.getCategories();
    }

    render() {
        const {products,categories, choosedCategories} = this.state;
        const options = categories
            .filter((category) => !choosedCategories.includes(category.id) )
            .map(category => {
                return {
                    "value": category.id,
                    "label": category.categoryName
                };
            });

        return (
            <React.Fragment>
                <div className={"categories"}>
                    <p className={"title text-upper text-underline"}>Liste des catégories</p>

                    <Select
                        onChange={(newChoosedValues) => this.changeCategories(newChoosedValues)}
                        className={"categories-select"}
                        isSearchable
                        isMulti
                        options={options}
                    />
                </div>

                <div className={"products"}>
                    {
                        products.map(product => (
                            <p key={product.id}>{product.name}</p>
                        ))
                    }
                </div>
            </React.Fragment>
        );
    }

    /**
     * @param categoriesId liste des ids des catégories choisies
     * récupère la liste des produits dans l'état produit
     */
    async getProducts(categoriesId = []){
        if(categoriesId.length === 0){
            // récupération de tous les produits
            fetch(Product.PRODUCTS_FETCH_LINK,{method: "POST"})
                .then(response => response.json())
                .then(result => {
                    if(!result.success) throw Error();

                    this.setState({
                        products: result.products,
                        choosedCategories: categoriesId
                    });
                })
                .catch(() => alert("Echec de récupération des produits"));
        }
        else{
            let products = [];

            // récupération des produits des catégories choisies
            for(const categoryId of categoriesId){
                try{
                    const response = await fetch(`${Product.CATEGORY_PRODUCT_FETCH_LINK}${categoryId}`,{method: "POST"});
                    const result = await response.json();

                    if(!result.success) throw Error();

                    products = products.concat(result.products);
                }
                catch(err){
                    alert("Echec de récupération des produits");
                }
            }

            this.setState({
                products: products,
                choosedCategories: categoriesId
            });
        }
    }

    /**
     * @return récupère la liste des catégories
     */
    getCategories(){
        fetch(Product.CATEGORIES_FETCH_LINK,{method: "POST"})
            .then(response => response.json())
            .then(result => {
                if(!result.success) throw Error();

                this.setState({ categories: result.categories });
            })
            .catch(() => alert("Echec de récupération des catégories"));
    }

    /**
     * met à jour les catégories choisies en mettant à jour les produits
     * @param choosedValues valeurs choisies
     */
    changeCategories(choosedValues){
        this.getProducts(choosedValues.map(choosedOption => choosedOption.value));
    }
}