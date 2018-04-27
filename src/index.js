import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route, Redirect } from 'react-router'
import { HashRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-select/dist/react-select.css';
import 'jquery-ui/themes/base/all.css';


// UnAuthorized
import UnAuthorized from './UnAuthorized/UnAuthorized';


import Adoption from './Adoption/Adoption';
import AdoptionSuccess from './AdoptionSuccess/AdoptionSuccess';
import ChangePassword from './ChangePassword/ChangePassword';
import Donate from './Donate/Donate';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import Login from './Login/Login';
import MyAdoptions from './MyAdoptions/MyAdoptions';
import MyDonations from './MyDonations/MyDonations';
import MyProposals from './MyProposals/MyProposals';
import NewAdoption from './NewAdoption/NewAdoption';
import PanchayatFunds from './PanchayatFunds/PanchayatFunds';
import PartnerDashboard from './PartnerDashboard/PartnerDashboard';
import PartnerGrievance from './PartnerGrievance/PartnerGrievance';
import PartnerGrievances from './PartnerGrievances/PartnerGrievances';
import PartnerProfile from './PartnerProfile/PartnerProfile';
import PoolFunds from './PoolFunds/PoolFunds';
import Project from './Project/Project';
import ProjectFunds from './ProjectFunds/ProjectFunds';
import ProjectProposal from './ProjectProposal/ProjectProposal';
import QuickRegistration from './QuickRegistration/QuickRegistration';
import ResetPassword from './ResetPassword/ResetPassword';
import VerificationSuccess from './VerificationSuccess/VerificationSuccess';
import VerifyPhone from './VerifyPhone/VerifyPhone';


//--------------ADMIN SECTION IMPORTS-----------------------//
import Activities from './Admin/Activities/Activities';
import AdoptionApplications from './Admin/AdoptionApplications/AdoptionApplications';
import AdoptionApplication from './Admin/AdoptionApplication/AdoptionApplication';
import AdminDashboard from './Admin/Dashboards/AdminDashboard/AdminDashboard';
import CaseStudies from './Admin/CaseStudies/CaseStudies';
import CaseStudy from './Admin/CaseStudy/CaseStudy';
import CpoDashboard from './Admin/Dashboards/CpoDashboard/CpoDashboard';
import MoDashboard from './Admin/Dashboards/MoDashboard/MoDashboard';
import MpdoDashboard from './Admin/Dashboards/MpdoDashboard/MpdoDashboard';
import Donations from './Admin/Donations/Donations';
import Donation from './Admin/Donation/Donation';
import Emails from './Admin/Emails/Emails';
import Employee from './Admin/Employee/Employee';
import Employees from './Admin/Employees/Employees';
import SAPFActivity from './Admin/SAPFActivity/SAPFActivity';
import SAPFActivities from './Admin/SAPFActivities/SAPFActivities';
import HomePageImages from './Admin/HomePageImages/HomePageImages';
import HomePageNotifications from './Admin/HomePageNotifications/HomePageNotifications';
import MasterProject from './Admin/MasterProject/MasterProject';
import MasterProjects from './Admin/MasterProjects/MasterProjects';
import NewsItem from './Admin/NewsItem/NewsItem';
import NewsItems from './Admin/NewsItems/NewsItems';
import NewsLetterEmails from './Admin/NewsLetterEmails/NewsLetterEmails';
import OfficialContact from './Admin/OfficialContact/OfficialContact';
import OfficialContacts from './Admin/OfficialContacts/OfficialContacts';
import Partners from './Admin/Partners/Partners';
import { PartnerDetails } from './Admin/PartnerDetails/PartnerDetails';
import { PartnerProfile as PartnerData } from './Admin/PartnerProfile/PartnerProfile';
import { ProjectProposal as ProposalData } from './Admin/ProjectProposal/ProjectProposal';
import ProjectProposals from './Admin/ProjectProposals/ProjectProposals';
import PartnershipReport from './Admin/Reports/PartnershipReport/PartnershipReport';
import RegisteredUsers from './Admin/RegisteredUsers/RegisteredUsers';
import WowTracker from './Admin/WowTracker/WowTracker';
import WowTrackerDailyInfo from './Admin/WowTrackerDailyInfo/WowTrackerDailyInfo';
import WowTrackerDailyUpload from './Admin/WowTrackerDailyUpload/WowTrackerDailyUpload';

window.jQuery = window.$ = require("jquery");
var bootstrap = require("bootstrap");
window.isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;



ReactDOM.render((
  <HashRouter>
    <div>
      <ToastContainer autoClose={3000} position="top-center" />
      <App>
        <Route exact path="/unauthorized" component={UnAuthorized} />

        <Route exact path="/" render={(nextState) => isLoggedIn(nextState, <Login location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/adoption/:id" render={(nextState) => requireAuth(nextState, <Adoption location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/adoption-success" render={(nextState) => requireAuth(nextState, <AdoptionSuccess location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/change-password" render={(nextState) => requireAuth(nextState, <ChangePassword location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/donate/:status?" render={(nextState) => requireAuth(nextState, <Donate location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/login" render={(nextState) => isLoggedIn(nextState, <Login location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/my-adoptions" render={(nextState) => requireAuth(nextState, <MyAdoptions location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/my-donations" render={(nextState) => requireAuth(nextState, <MyDonations location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/my-proposals" render={(nextState) => requireAuth(nextState, <MyProposals location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/adopt" render={(nextState) => requireAuth(nextState, <NewAdoption location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/panchayat-funds/:id?" render={(nextState) => requireAuth(nextState, <PanchayatFunds location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/partner-dashboard" render={(nextState) => requireAuth(nextState, <PartnerDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/partner-grievances" render={(nextState) => requireAuth(nextState, <PartnerGrievances location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/partner-grievance/:id?" render={(nextState) => requireAuth(nextState, <PartnerGrievance location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/partner-profile" render={(nextState) => requireAuth(nextState, <PartnerProfile location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/pool-funds" render={(nextState) => requireAuth(nextState, <PoolFunds location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/project/:id" render={(nextState) => requireAuth(nextState, <Project location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/project-funds/:id?" render={(nextState) => requireAuth(nextState, <ProjectFunds location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/project-proposal" render={(nextState) => requireAuth(nextState, <ProjectProposal location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/quick-registration" component={QuickRegistration} />
        <Route exact path="/reset-password/:userId/:code" component={ResetPassword} />
        <Route exact path="/verification-success" component={VerificationSuccess} />
        <Route exact path="/verify-phone/:userId/:phone" component={VerifyPhone} />


        {/*-----------------ADMIN SECTION ROUTES-----------------------*/}
        <Route exact path="/admin/activities" render={(nextState) => requireOfficial(nextState, <Activities location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/admin-dashboard" render={(nextState) => requireAdmin(nextState, <AdminDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/case-studies" render={(nextState) => requireAdmin(nextState, <CaseStudies location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/case-study/:id?" render={(nextState) => requireAdmin(nextState, <CaseStudy location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/cpo-dashboard" render={(nextState) => requireCPO(nextState, <CpoDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/mo-dashboard" render={(nextState) => requireMO(nextState, <MoDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/mpdo-dashboard" render={(nextState) => requireMPDO(nextState, <MpdoDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/adoption-applications" render={(nextState) => requireAdminOrOfficial(nextState, <AdoptionApplications location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/adoption-application/:id?" render={(nextState) => requireAdminOrOfficial(nextState, <AdoptionApplication location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/donations" render={(nextState) => requireAdmin(nextState, <Donations location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/donation/:id" render={(nextState) => requireAdmin(nextState, <Donation location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/emails" render={(nextState) => requireAdmin(nextState, <Emails location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/employee/:id?" render={(nextState) => requireAdmin(nextState, <Employee location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/employees" render={(nextState) => requireAdmin(nextState, <Employees location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/sapf-activity/:id?" render={(nextState) => requireAdmin(nextState, <SAPFActivity location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/sapf-activities" render={(nextState) => requireAdmin(nextState, <SAPFActivities location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/home-page-images" render={(nextState) => requireAdmin(nextState, <HomePageImages location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/home-page-notifications" render={(nextState) => requireAdmin(nextState, <HomePageNotifications location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/master-project/:id?" render={(nextState) => requireAdmin(nextState, <MasterProject location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/master-projects" render={(nextState) => requireAdmin(nextState, <MasterProjects location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/news-item/:id?" render={(nextState) => requireAdmin(nextState, <NewsItem location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/news-items" render={(nextState) => requireAdmin(nextState, <NewsItems location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/newsletter-emails" render={(nextState) => requireAdmin(nextState, <NewsLetterEmails location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/official-contact/:id?" render={(nextState) => requireAdmin(nextState, <OfficialContact location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/official-contacts" render={(nextState) => requireAdmin(nextState, <OfficialContacts location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/partners" render={(nextState) => requireAdminOrOfficial(nextState, <Partners location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/partner-details/:id" render={(nextState) => requireAdminOrOfficial(nextState, <PartnerDetails location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/partner-profile/:id" render={(nextState) => requireAdmin(nextState, <PartnerData location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/project-proposals" render={(nextState) => requireAdminOrOfficial(nextState, <ProjectProposals location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/project-proposal/:id" render={(nextState) => requireAdminOrOfficial(nextState, <ProposalData location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/partnership-report" render={(nextState) => requireAdminOrOfficial(nextState, <PartnershipReport location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/registered-users" render={(nextState) => requireAdmin(nextState, <RegisteredUsers location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/wow-tracker" render={(nextState) => requireWow(nextState, <WowTracker location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/wow-tracker-info/:id" render={(nextState) => requireWow(nextState, <WowTrackerDailyInfo location={nextState.location} history={nextState.history} match={nextState.match} />)} />
        <Route exact path="/admin/daily-wow-tracker" render={(nextState) => requireWow(nextState, <WowTrackerDailyUpload location={nextState.location} history={nextState.history} match={nextState.match} />)} />
      </App>
    </div>

  </HashRouter >
)
  ,
  document.getElementById('root')
);


function requireAuth(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  else {
    return component;
  }
}

function requireAdmin(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || roles.indexOf("Admin") === -1) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function requireOfficial(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || (roles.indexOf("CPO") === -1 && roles.indexOf("MPDO") === -1 && roles.indexOf("MO") === -1)) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function requireAdminOrOfficial(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || (roles.indexOf("Admin") === -1 && roles.indexOf("CPO") === -1 && roles.indexOf("MPDO") === -1 && roles.indexOf("MO") === -1)) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function requireAdminOrPartner(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || (roles.indexOf("Admin") === -1 && roles.indexOf("Partner") === -1)) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function requireCPO(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || (roles.indexOf("CPO") === -1)) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function requireMPDO(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || (roles.indexOf("MPDO") === -1)) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function requireMO(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || (roles.indexOf("MO") === -1)) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function requireWow(nextState, component) {
  var isLoggedIn = sessionStorage.getItem("smart_ap_access_token") !== null;
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }
  var roles = sessionStorage.getItem("smart_ap_roles");
  if (!roles || (roles.indexOf("WowTracker") === -1 && roles.indexOf("Admin") === -1)) {
    return <Redirect to="/unauthorized" />
  }
  else {
    return component;
  }
}

function isLoggedIn(nextState, component) {
  var accessToken = sessionStorage.getItem("smart_ap_access_token");
  if (accessToken === null) {
    return component;
  }
  var roles = sessionStorage.getItem("smart_ap_roles");

  if (roles.indexOf("CPO") !== -1) {
    return <Redirect to="/admin/cpo-dashboard" />
  }
  if (roles.indexOf("MPDO") !== -1) {
    return <Redirect to="/admin/mpdo-dashboard" />
  }
  if (roles.indexOf("MO") !== -1) {
    return <Redirect to="/admin/mo-dashboard" />
  }
  if (roles.indexOf("Admin") !== -1) {
    return <Redirect to="/admin/admin-dashboard" />
  }
  return <Redirect to="/partner-dashboard" />
}
