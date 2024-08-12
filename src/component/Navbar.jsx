import { Link } from "react-router-dom";

const Navbar = ({ title, children }) => {
  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-base-300 w-full z-50">
            <div className="flex-none px-2">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">{title}</div>
            {/* <div className="ml-auto px-4">test</div> */}
          </div>

          {children}
          <div className="flex justify-between p-4">
            <Link className="btn btn-primary" to={"/"}>
              DISPLAY HOLDING TIME
            </Link>
            <Link className="btn btn-info" to={"/pdlc"}>
              PDLC
            </Link>
            <button className="btn btn-warning">RMLC</button>
            <button className="btn btn-warning">ORDER MENU KHUSUS</button>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 px-4 py-20">
            <li>
              <Link to={"/configuration"}>MASTER PRODUCTS</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
