import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home page</Link>
                </li>
                <li>
                    <div className="dropdown">
                        <button className="dropbtn">Categories</button>
                        <div className="dropdown-content">
                            <Link to="/products/dog">Dogs</Link>
                            <Link to="/products/cat">Cats</Link>
                            <Link to="/products/birds">Birds</Link>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
