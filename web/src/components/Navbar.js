import { Link } from "react-router-dom";

const categories = [
    {
        name: "Dogs",
        subcategories: [
            { title: "Feed", items: ["Dry", "Wet", "Super premium class"] },
            { title: "Treats", items: ["Chews", "Snacks", "Biscuits"] },
            { title: "Care and hygiene", items: ["Shampoos", "Claw clippers", "Puhoderki", "Combs", "Mittens"] },
            { title: "Toilets and trays", items: ["Toilets", "Trays", "Diapers", "Bags and napkins"] },
            { title: "Clothes and shoes", items: ["Cloth", "Shoes", "Accessories"] },
            { title: "Ammunition", items: ["Collars", "Leashes", "Muzzles", "Harnesses", "Roulettes", "Addresses", "Chains and carabiners"] },
            { title: "Automatic feeders", items: ["Automatic feeders", "Automatic drinking bowls", "Container"] },
            { title: "Beds", items: ["Beds", "Aviaries and cages", "Bags and carriers", "Toys"] },
        ],
    },
    {
        name: "Cats",
        subcategories: [
            { title: "Feed", items: ["Dry", "Wet", "Super premium class"] },
            { title: "Toys", items: ["Balls", "Mice", "Feathers"] },
            { title: "Care and hygiene", items: ["Shampoos", "Nail Clippers"] },
            { title: "Toilets and trays", items: ["Toilets", "Trays", "Diapers", "Bags and napkins"] },
            { title: "Clothes and shoes", items: ["Cloth", "Shoes", "Accessories"] },
            { title: "Ammunition", items: ["Collars", "Leashes", "Muzzles", "Harnesses", "Roulettes", "Addresses", "Chains and carabiners"] },
            { title: "Automatic feeders", items: ["Automatic feeders", "Automatic drinking bowls", "Container"] },
            { title: "Beds", items: ["Beds", "Aviaries and cages", "Bags and carriers", "Toys"] },
        ],
    },
    {
        name: "Rodents",
        subcategories: [
            { title: "Feed", items: ["Dry", "Wet", "Super premium class"] },
            { title: "Treats", items: ["Chews", "Snacks", "Biscuits"] },
            { title: "Care and hygiene", items: ["Shampoos", "Claw clippers"] },
            { title: "Toilets and trays", items: ["Toilets", "Trays", "Diapers", "Bags and napkins"] },
            { title: "Clothes and shoes", items: ["Cloth", "Shoes", "Accessories"] },
            { title: "Ammunition", items: ["Collars", "Leashes", "Muzzles", "Harnesses", "Roulettes", "Addresses", "Chains and carabiners"] },
            { title: "Automatic feeders", items: ["Automatic feeders", "Automatic drinking bowls", "Container"] },
            { title: "Beds", items: ["Beds", "Aviaries and cages", "Bags and carriers", "Toys"] },
        ],
    },
    {
        name: "Birds",
        subcategories: [
            { title: "Feed", items: ["Dry", "Wet", "Super premium class"] },
            { title: "Treats", items: ["Chews", "Snacks", "Biscuits"] },
            { title: "Care and hygiene", items: ["Shampoos", "Claw clippers"] },
            { title: "Toilets and trays", items: ["Toilets", "Trays", "Diapers", "Bags and napkins"] },
            { title: "Clothes and shoes", items: ["Cloth", "Shoes", "Accessories"] },
            { title: "Ammunition", items: ["Collars", "Leashes", "Muzzles", "Harnesses", "Roulettes", "Addresses", "Chains and carabiners"] },
            { title: "Automatic feeders", items: ["Automatic feeders", "Automatic drinking bowls", "Container"] },
            { title: "Beds", items: ["Beds", "Aviaries and cages", "Bags and carriers", "Toys"] },
        ],
    },
    {
        name: "Reptilians",
        subcategories: [
            { title: "Feed", items: ["Dry", "Wet", "Super premium class"] },
            { title: "Treats", items: ["Chews", "Snacks", "Biscuits"] },
            { title: "Care and hygiene", items: ["Shampoos", "Claw clippers"] },
            { title: "Toilets and trays", items: ["Toilets", "Trays", "Diapers", "Bags and napkins"] },
            { title: "Clothes and shoes", items: ["Cloth", "Shoes", "Accessories"] },
            { title: "Ammunition", items: ["Collars", "Leashes", "Muzzles", "Harnesses", "Roulettes", "Addresses", "Chains and carabiners"] },
            { title: "Automatic feeders", items: ["Automatic feeders", "Automatic drinking bowls", "Container"] },
            { title: "Beds", items: ["Beds", "Aviaries and cages", "Bags and carriers", "Toys"] },
        ],
    },
    {
        name: "Vet. Pharmacy",
        subcategories: [
            { title: "Feed", items: ["Dry", "Wet", "Super premium class"] },
            { title: "Treats", items: ["Chews", "Snacks", "Biscuits"] },
            { title: "Care and hygiene", items: ["Shampoos", "Claw clippers"] },
            { title: "Toilets and trays", items: ["Toilets", "Trays", "Diapers", "Bags and napkins"] },
            { title: "Clothes and shoes", items: ["Cloth", "Shoes", "Accessories"] },
            { title: "Ammunition", items: ["Collars", "Leashes", "Muzzles", "Harnesses", "Roulettes", "Addresses", "Chains and carabiners"] },
            { title: "Automatic feeders", items: ["Automatic feeders", "Automatic drinking bowls", "Container"] },
            { title: "Beds", items: ["Beds", "Aviaries and cages", "Bags and carriers", "Toys"] },
        ],
    },
];

const Navbar = () => {
    return (
        <>
            <header style={{ background: "#483D8B", color: "white", padding: "20px", textAlign: "center" }}>
                <h1>My Pet Shop</h1>
            </header>

            <nav style={{ marginTop: "20px" }}>
                <ul>
                    {categories.map((category) => (
                        <li key={category.name}>
                            <div className="dropdown">
                                <button className="dropbtn">{category.name}</button>
                                <div className="dropdown-content">
                                    <table className="category-table">
                                        <thead>
                                        <tr>
                                            {category.subcategories.map((subcategory) => (
                                                <th key={subcategory.title}>{subcategory.title}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            {category.subcategories.map((subcategory) => (
                                                <td key={subcategory.title}>
                                                    {subcategory.items.map((item) => (
                                                        <div key={item} className="subcategory-item">
                                                            <Link to={`/products/${category.name.toLowerCase()}/${subcategory.title.toLowerCase()}/${item.toLowerCase()}`}>
                                                                {item}
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </td>
                                            ))}
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};

export default Navbar;
