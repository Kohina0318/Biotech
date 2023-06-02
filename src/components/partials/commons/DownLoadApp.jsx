import React from "react";
import { Link } from "react-router-dom";

const DownloadApp = () => (
  <section className="ps-download-app">
    <div className="ps-container">
      <div className="ps-block--download-app">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 ">
              <div className="ps-block__thumbnail">
                <img src="/static/img/logo_light.png" alt={process.env.REACT_APP_NAME} />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 ">
              <div className="ps-block__content">
                <h3>Download Biotech App Now!</h3>
                <p>
                  Shopping fastly and easily more with our app. Get a link to
                  download the app on your phone
                </p>
                <form
                  className="ps-form--download-app"
                  action="do_action"
                  method="post"
                >
                  <div className="form-group--nest">
                    <input
                      className="form-control"
                      type="Email"
                      placeholder="Email Address"
                    />
                    <button className="ps-btn">Subscribe</button>
                  </div>
                </form>
                <p className="download-link">
                  <Link to="/">
                    <img src="/static/img/google-play.png" alt={process.env.REACT_APP_NAME} />
                  </Link>
                  <Link to="/">
                    <img src="/static/img/app-store.png" alt={process.env.REACT_APP_NAME} />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default DownloadApp;
