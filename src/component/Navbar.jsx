/**
 * Navbar component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the navbar.
 * @param {ReactNode} props.children - The children elements of the navbar.
 * @returns {JSX.Element} The rendered Navbar component.
 */
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title, children }) => {
  const drawerCheckboxRef = useRef(null);
  const { user, logout } = useAuth();
  console.log(user);

  const closeDrawer = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

  return (
    <>
      <div className="drawer">
        <input
          id="my-drawer-3"
          type="checkbox"
          className="drawer-toggle"
          ref={drawerCheckboxRef}
        />
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
            <div className="ml-auto px-4 space-x-2">
              <p className="text-lg">
                Hi, <span className="font-bold">{user.name}</span>!
              </p>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar placeholder"
                >
                  <div className="bg-neutral text-neutral-content w-8 rounded-full">
                    {user && user.name ? (
                      <span>
                        {user.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    ) : (
                      <span>b</span>
                    )}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <p>{`Hi, ${user.name}!`}</p>
                  </li>
                  <li onClick={logout}>
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {children}
          <div className="flex justify-between p-4">
            <Link className="btn btn-primary" to={"/"} onClick={closeDrawer}>
              DISPLAY HOLDING TIME
            </Link>
            <Link className="btn btn-info" to={"/pdlc"} onClick={closeDrawer}>
              PDLC
            </Link>
            <Link className="btn btn-accent" to={"/rmlc"} onClick={closeDrawer}>
              RMLC
            </Link>
            <Link
              className="btn btn-secondary"
              to={"/order-menu-khusus"}
              onClick={closeDrawer}
            >
              ORDER MENU KHUSUS
            </Link>
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
              <Link to={"/calculate-pdlc"} onClick={closeDrawer}>
                CALCULATE PDLC
              </Link>
            </li>
            <li>
              <Link to={"/calculate-rmlc"} onClick={closeDrawer}>
                CALCULATE RMLC
              </Link>
            </li>
            <li>
              <Link to={"/items-configuration"} onClick={closeDrawer}>
                ITEM CONFIGURATION
              </Link>
            </li>
            <li>
              <Link to={"/products-configuration"} onClick={closeDrawer}>
                PRODUCT CONFIGURATION
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
