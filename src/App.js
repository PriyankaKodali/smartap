import React, { Component } from 'react';
import { withRouter } from 'react-router';
// import $ from 'jquery';
import './App.css';


class App extends Component {



  constructor(props) {
    super(props);
    var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
    window.isLoggedIn = isLoggedIn;
  }

  logoutClick(e) {
    e.preventDefault();
    sessionStorage.removeItem("smart_ap_access_token");
    sessionStorage.removeItem("roles");
    window.isLoggedIn = false;
    window.open("/portal/#/login", "_self")
  }

  render() {
    var roles = sessionStorage.getItem("smart_ap_roles");

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="navbar-container">
            <div className="navbar-header">
              <a href="/index.html">
                <img src="images/logo.png" alt="" height="70px" />
                {
                  window.isLoggedIn && roles.indexOf("Employee") === -1 ? //no logo text for admin
                    <div className="text-center logo-text">
                      <span className="logo-text-main">SMART VILLAGE - SMART WARD</span>
                      <br />
                      <span className="logo-text-sub">TOWARDS SMART ANDHRA PRADESH</span>
                    </div>
                    :
                    <div />
                }

              </a>
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="navbar-collapse-1">

              {
                !window.isLoggedIn ?
                  <ul className="nav navbar-nav navbar-right navbar-menu">
                    <li className="dropdown pointer"><a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">About Us</a>
                      <ul className="dropdown-menu">
                        <li><a href="/sapf.html">Smart AP Foundation</a></li>
                        <li><a href="/executive-committee.html">Executive Committee</a></li>
                        <li><a href="/our-team.html">Our Team</a></li>
                      </ul>
                    </li>
                    <li className="dropdown pointer"><a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">What we do</a>
                      <ul className="dropdown-menu">
                        <li><a href="/svsw.html">SVSW Program</a></li>
                        <li><a href="/non-negotiables.html">20 Non-Negotiables</a></li>
                        <li><a href="http://www.un.org/sustainabledevelopment/sustainable-development-goals" target="_blank" rel="noopener noreferrer">SDGs</a></li>
                      </ul>
                    </li>
                    <li className="dropdown pointer"><a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Success Stories</a>
                      <ul className="dropdown-menu">
                        <li><a href="/case-studies.html">Case studies</a></li>
                        <li><a href="/best-practices.html">Best Practice Sites</a></li>
                      </ul>
                    </li>
                    <li className="dropdown pointer"><a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Partners</a>
                      <ul className="dropdown-menu">
                        <li><a href="/our-partners.html">Our Partners</a></li>
                        <li><a href="/recognitions.html">Recognitions</a></li>
                        <li><a href="/become-a-partner.html">Become a Partner</a></li>
                        <li><a href="/contribute-to-a-project.html">Contribute to a Project</a></li>
                        <li><a href="/faqs.html">FAQ's</a></li>
                      </ul>
                    </li>
                    <li className="dropdown pointer"><a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Media</a>
                      <ul className="dropdown-menu">
                        <li><a href="/gallery.html">Gallery</a></li>
                        <li><a href="/videos.html">Videos</a></li>
                        <li><a href="/news.html">News</a></li>
                      </ul>
                    </li>
                    <li className="dropdown pointer"><a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Resources</a>
                      <ul className="dropdown-menu">
                        <li><a href="/gos.html">Government Orders</a></li>
                        <li><a href="/news-letters.html">News Letters</a></li>
                        <li><a href="/manuals.html">Manuals</a></li>
                        <li><a href="/annual-reports.html">Annual Reports</a></li>
                      </ul>
                    </li>
                    <li className="dropdown pointer"><a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Contact Us</a>
                      <ul className="dropdown-menu">
                        <li><a href="/work-with-us.html">Work with us</a></li>
                        <li><a href="/contact-us.html">Contact Us</a></li>
                      </ul>
                    </li>
                  </ul> : <div />
              }
              
              {
                window.isLoggedIn && roles.indexOf("Employee") !== -1 ?
                  <div>
                    {
                      roles.indexOf("Admin") !== -1 ?
                        <ul className="nav navbar-nav navbar-right navbar-menu" >
                          <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/admin-dashboard")}>Dashboard</a></li>
                          <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/adoption-applications")}>Applications</a></li>
                          <li className="dropdown pointer">
                            <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Partners<span className="caret"></span></a>
                            <ul className="dropdown-menu">
                              <li><a onClick={() => this.props.history.push("/admin/partners")}>Approved Partnerships</a></li>
                              <li><a onClick={() => this.props.history.push("/admin/registered-users")}>Registered Users</a></li>
                            </ul>
                          </li>
                          <li className="dropdown pointer">
                            <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Projects<span className="caret"></span></a>
                            <ul className="dropdown-menu">
                              <li><a onClick={() => this.props.history.push("/admin/master-projects")}>Master Projects</a></li>
                              <li><a onClick={() => this.props.history.push("/admin/project-proposals")}>Project Proposals</a></li>
                            </ul>
                          </li>
                          <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/official-contacts")}>Official Contacts</a></li>
                          <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/employees")}>Employees</a></li>
                          <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/donations")}>Donations</a></li>
                          <li className="dropdown pointer">
                            <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">CMS<span className="caret"></span></a>
                            <ul className="dropdown-menu">
                              <li><a onClick={() => this.props.history.push("/admin/case-studies")}>Case Studies</a></li>
                              <li><a onClick={() => this.props.history.push("/admin/home-page-images")}>Home Page Images</a></li>
                              <li><a onClick={() => this.props.history.push("/admin/home-page-notifications")}>Home Page Notifications</a></li>
                              <li><a onClick={() => this.props.history.push("/admin/sapf-activities")}>SAPF Activities</a></li>
                              <li><a onClick={() => this.props.history.push("/admin/news-items")}>News Items</a></li>
                            </ul>
                          </li>
                          <li className="dropdown pointer">
                            <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">{"Hi " + sessionStorage.getItem("smart_ap_displayName")}<span className="caret"></span></a>
                            <ul className="dropdown-menu">
                              <li><a onClick={() => this.props.history.push("/change-password")}>Change Password</a></li>
                              <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                            </ul>
                          </li>
                        </ul>
                        :
                        roles.indexOf("WowTracker") !== -1 ?
                          < ul className="nav navbar-nav navbar-right navbar-menu" >
                            <li className="dropdown pointer">
                              <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">{"Hi " + sessionStorage.getItem("smart_ap_displayName")}<span className="caret"></span></a>
                              <ul className="dropdown-menu">
                                <li><a onClick={() => this.props.history.push("/change-password")}>Change Password</a></li>
                                <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                              </ul>
                            </li>
                          </ul>
                          :
                          <div />
                    }
                  </div>
                  :
                  <div />
              }

              {
                window.isLoggedIn && roles.indexOf("CPO") !== -1 ?
                  < ul className="nav navbar-nav navbar-right" >
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/cpo-dashboard")}>Dashboard</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/adoption-applications")}>Applications</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/activities")}>Activities</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/partners")}>Partners</a></li>
                    <li className="dropdown pointer">
                      <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">{"Hi " + sessionStorage.getItem("smart_ap_displayName")}<span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a onClick={() => this.props.history.push("/change-password")}>Change Password</a></li>
                        <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                      </ul>
                    </li> </ul> : <div />
              }

              {
                window.isLoggedIn && roles.indexOf("MPDO") !== -1 ?
                  < ul className="nav navbar-nav navbar-right" >
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/mpdo-dashboard")}>Dashboard</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/adoption-applications")}>Applications</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/activities")}>Activities</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/partners")}>Partners</a></li>
                    <li className="dropdown pointer">
                      <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">{"Hi " + sessionStorage.getItem("smart_ap_displayName")}<span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a onClick={() => this.props.history.push("/change-password")}>Change Password</a></li>
                        <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                      </ul>
                    </li>   </ul> : <div />
              }

              {
                window.isLoggedIn && roles.indexOf("MO") !== -1 ?
                  < ul className="nav navbar-nav navbar-right" >
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/mo-dashboard")}>Dashboard</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/adoption-applications")}>Applications</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/activities")}>Activities</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/admin/partners")}>Partners</a></li>
                    <li className="dropdown pointer">
                      <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">{"Hi " + sessionStorage.getItem("smart_ap_displayName")}<span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a onClick={() => this.props.history.push("/change-password")}>Change Password</a></li>
                        <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                      </ul>
                    </li>   </ul> : <div />
              }

              {
                window.isLoggedIn && roles.indexOf("Partner") !== -1 ?
                  < ul className="nav navbar-nav navbar-right" >
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/partner-dashboard")}>Dashboard</a></li>
                    <li className="dropdown pointer">
                      <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">Partnership<span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a onClick={() => this.props.history.push("/adopt")}>Become a partner</a></li>
                        <li><a onClick={() => this.props.history.push("/my-adoptions")}>My Partnerships</a></li>
                        <li><a onClick={() => this.props.history.push("/my-proposals")}>My Proposals</a></li>
                        <li><a onClick={() => this.props.history.push("/my-donations")}>My Contributions</a></li>
                      </ul>
                    </li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/project-proposal")}>Propose a Project</a></li>
                    <li><a className="pointer navbar-menu-item" onClick={() => this.props.history.push("/Donate")}>Contribute</a></li>
                    <li className="dropdown pointer">
                      <a className="navbar-menu-item dropdown-toggle" data-toggle="dropdown">{"Hi " + sessionStorage.getItem("smart_ap_displayName")}<span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a onClick={() => this.props.history.push("/my-donations")}>My Contibutions</a></li>
                        <li><a onClick={() => this.props.history.push("/partner-profile")}>Edit Profile</a></li>
                        <li><a onClick={() => this.props.history.push("/change-password")}>Change Password</a></li>
                        <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                      </ul>
                    </li>   </ul> : <div />
              }
            </div>
          </div>
        </nav>
        {this.props.children}
      </div >

    );
  }
}

export default withRouter(App);

