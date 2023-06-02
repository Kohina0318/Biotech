import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import MegaMenu from "./MegaMenu";
import MenuDropdown from "./MenuDropdown";
import { languageLable } from "utilities/helpers";

const Menu = ({ data, className, app }) => {
  const { selectedLanguageData } = app;

  return (
    <ul className={className}>
      {data &&
        data.map((item) => {
          if (item.subMenu) {
            return <MenuDropdown  menuData={item} key={item.text} />;
          } else if (item.megaContent) {
            return <MegaMenu menuData={item} key={item.text} />;
          } else {
            return (
              <li key={item.text}>
                {item.type === "dynamic" ? (
                  <Link
                    href={`${item.url}/[pid]`}
                    as={`${item.url}/${item.endPoint}`}
                  >
                    {languageLable(selectedLanguageData, item.text)}
                  </Link>
                ) : (
                  <React.Fragment>
                    {item.isRedirect ? (
                      <React.Fragment>
                        <Link
                          to={`#`}
                          as={item.alias}
                          onClick={() => rediectToOtherSite(item.url)}
                        >
                          {languageLable(selectedLanguageData, item.text)}
                        </Link>
                      </React.Fragment>
                    ) : (
                      <Link to={item.url} as={item.alias}>
                        {languageLable(selectedLanguageData, item.text)}
                      </Link>
                    )}
                  </React.Fragment>
                )}
              </li>
            );
          }
        })}
    </ul>
  );
};

const rediectToOtherSite = (url) => {
  window.open(url, "_blank");
};

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(Menu);
