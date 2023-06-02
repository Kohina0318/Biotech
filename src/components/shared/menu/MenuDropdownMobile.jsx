import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

const { SubMenu } = Menu;

class MenuDropdownMobile extends Component {
  render() {
    const { menuData } = this.props;
    return (
      <SubMenu
        key="sub1"
        title={
          menuData.type === "dynamic" ? (
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
          )
        }
      >
        {menuData.subMenu ? (
          <ul className={menuData.subClass}>
            {menuData.subMenu.map((subMenuItem, index) => (
              <MenuDropdownMobile menuData={subMenuItem} key={index} />
            ))}
          </ul>
        ) : (
          ""
        )}
      </SubMenu>
      /*

            <li className={menuData.subMenu ? 'menu-item-has-children dropdown' : ''}>

                {menuData.type === 'dynamic' ? (
                    <Link to={`${menuData.url}/[pid]`} as={`${menuData.url}/${menuData.endPoint}`}>
                        {menuData.text}</a>
                    </Link>
                ) : (
                    <Link to={menuData.url} as={menuData.alias}>
                        {menuData.text}</a>
                    </Link>
                )}
                {menuData.subMenu ? (
                    <ul className={menuData.subClass}>
                        {menuData.subMenu.map((subMenuItem, index) => (
                            <MenuDropdownMobile menuData={subMenuItem} key={index}/>
                        ))}z
                    </ul>
                ) : (
                    ''
                )}
            </li>
            * */
    );
  }
}

export default MenuDropdownMobile;
