import React, { Component } from "react";

import { Link } from "react-router-dom";

class Menu extends Component {
  render() {
    const { menuData } = this.props;
    return (
      <li
        className={
          menuData.megaContent ? "menu-item-has-children has-mega-menu" : ""
        }
      >
        {menuData.type === "dynamic" ? (
          <Link
            href={`${menuData.url}/[pid]`}
            as={`${menuData.url}/${menuData.endPoint}`}
          >
            {menuData.text}
          </Link>
        ) : (
          <Link to={menuData.url} as={menuData.url}>
            {menuData.text}
          </Link>
        )}
        <div className="mega-menu">
          {menuData &&
            menuData.megaContent.map((megaItem) => (
              <div className="mega-menu__column" key={megaItem.heading}>
                <h4>{megaItem.heading}</h4>
                <ul className="mega-menu__list">
                  {megaItem.megaItems.map((megaSubItem) => (
                    <li key={megaSubItem.text}>
                      {megaSubItem.type === "dynamic" ? (
                        <Link
                          href={`${megaSubItem.url}/[pid]`}
                          as={`${megaSubItem.url}/${megaSubItem.endPoint}`}
                        >
                          {megaSubItem.text}
                        </Link>
                      ) : (
                        <Link to={megaSubItem.url} as={megaSubItem.url}>
                          {megaSubItem.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </li>
    );
  }
}

export default Menu;
