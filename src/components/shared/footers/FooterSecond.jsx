import React from "react";
import { Link } from "react-router-dom";

const FooterSecond = () => (
  <footer className="ps-footer ps-footer--2">
    <div className="container">
      <div className="ps-footer__content">
        <div className="row">
          <div className="col-xl-8">
            <div className="row">
              <div className="col-md-4 col-sm-6">
                <aside className="widget widget_footer">
                  <h4 className="widget-title">Quick links</h4>
                  <ul className="ps-list--link">
                    <li>
                      <Link to="/page/blank">Policy</Link>
                    </li>
                    <li>
                      <Link to="/page/blank">Term & Condition</Link>
                    </li>
                    <li>
                      <Link to="/page/blank">Shipping</Link>
                    </li>
                    <li>
                      <Link to="/page/blank">Return</Link>
                    </li>
                    <li>
                      <Link to="/page/faqs">FAQs</Link>
                    </li>
                  </ul>
                </aside>
              </div>
              <div className="col-md-4 col-sm-6">
                <aside className="widget widget_footer">
                  <h4 className="widget-title">Company</h4>
                  <ul className="ps-list--link">
                    <li>
                      <Link to="/page/about-us">About Us</Link>
                    </li>
                    <li>
                      <Link to="/product/affiliate">Affilate</Link>
                    </li>
                    <li>
                      <Link to="/page/blank">Career</Link>
                    </li>
                    <li>
                      <Link to="/page/contact-us">Contact</Link>
                    </li>
                  </ul>
                </aside>
              </div>
              <div className="col-md-4 col-sm-6">
                <aside className="widget widget_footer">
                  <h4 className="widget-title">Bussiness</h4>
                  <ul className="ps-list--link">
                    <li>
                      <Link to="/blog">Our Press</Link>
                    </li>
                    <li>
                      <Link to="/account/checkout">Checkout</Link>
                    </li>
                    <li>
                      <Link to="/account/login">My account</Link>
                    </li>
                    <li>
                      <Link to="/shop">Shop</Link>
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <aside className="widget widget_newletters">
              <h4 className="widget-title">Newsletter</h4>
              <form className="ps-form--newletter" action="#" method="get">
                <div className="form-group--nest">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Email Address"
                  />
                  <button className="ps-btn">Subscribe</button>
                </div>
                <ul className="ps-list--social">
                  <li>
                    <a className="facebook" href="#!">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a className="twitter" href="#!">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a className="google-plus" href="#!">
                      <i className="fa fa-google-plus"></i>
                    </a>
                  </li>
                  <li>
                    <a className="instagram" href="#!">
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </form>
            </aside>
          </div>
        </div>
      </div>
      <div className="ps-footer__copyright">
        <p>© 2021 biotech. All Rights Reserved</p>
      </div>
    </div>
  </footer>
);

export default FooterSecond;
