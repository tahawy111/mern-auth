import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <div className="navbar">
      <span className="logo">
        <Link className="link" to="/">
          Tahawy App
        </Link>
      </span>
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img
              src="https://tahawy111.github.io/My_Porfolio_Websie-1/files/images/icon.png"
              alt=""
              className="avatar"
            />
          </li>
          <li className="listItem">Amer Tahawy</li>
          <li className="listItem">Logout</li>
        </ul>
      ) : (
        <Link to={"/login"} className="link">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
