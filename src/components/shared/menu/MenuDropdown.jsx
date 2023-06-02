import React, { Component } from "react";
import { Link } from "react-router-dom";

class MenuDropdown extends Component {
  render() {
    const { menuData } = this.props;
    return (
      <li className={menuData.subMenu ? "menu-item-has-children dropdown" : ""}>
        {/* <Link to={menuData.url} as={menuData.url}>
                    {menuData.text}</a>
                </Link>*/}
        {menuData.type === "dynamic" ? (
          <Link
            href={`${menuData.url}/[pid]`}
            as={`${menuData.url}/${menuData.endPoint}`}
          >
            {menuData.text}
          </Link>
        ) : (
          <Link to={menuData.url} as={menuData.alias}>
            {menuData.text}
          </Link>
        )}
        {menuData.subMenu ? (
          <ul className={menuData.subClass}>
            {menuData.subMenu.map((subMenuItem, index) => (
              <MenuDropdown menuData={subMenuItem} key={index} />
            ))}
          </ul>
        ) : (
          ""
        )}
      </li>
    );
  }
}

export default MenuDropdown;
