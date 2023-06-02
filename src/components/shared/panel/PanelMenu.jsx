import React, { Component } from "react";
import { connect } from "react-redux";

import { Menu } from "antd";
import { menuPrimary } from "../../../public/static/data/menu";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

class PanelMenu extends Component {
  rootSubmenuKeys = ["sub1", "sub2", "sub4"];

  state = {
    openKeys: [],
  };

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(
      (key) => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  render() {
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        className="menu--mobile-2"
      >
        {menuPrimary.menu_1.map((item) => {
          if (item.subMenu) {
            return (
              <SubMenu
                key={item.text}
                title={<Link to={item.url}>{item.text}</Link>}
              >
                {item.subMenu.map((subItem) => (
                  <Menu.Item key={subItem.text}>
                    <Link to={subItem.url}>{subItem.text}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else if (item.megaContent) {
            return (
              <SubMenu
                key={item.text}
                title={<Link to={item.url}>{item.text}</Link>}
              >
                {item.megaContent.map((megaItem) => (
                  <SubMenu
                    key={megaItem.heading}
                    title={<span>{megaItem.heading}</span>}
                  >
                    {megaItem.megaItems.map((megaSubItem) => (
                      <Menu.Item key={megaSubItem.text}>
                        <Link to={item.url}>{megaSubItem.text}</Link>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item key={item.text}>
                {item.type === "dynamic" ? (
                  <Link
                    href={`${item.url}/[pid]`}
                    as={`${item.url}/${item.endPoint}`}
                  >
                    l{item.text}
                  </Link>
                ) : (
                  <Link to={item.url} as={item.alias}>
                    {item.text}
                  </Link>
                )}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return state.setting;
};

export default connect(mapStateToProps)(PanelMenu);
