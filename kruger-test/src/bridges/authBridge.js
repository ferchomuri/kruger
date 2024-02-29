import PropTypes from "prop-types";

export function PrivateRoute({ children }) {
  const isAuthenticated = checkUserAuthentication();
  return isAuthenticated ? children : window.location.replace("/login");
}

export function checkUserAuthentication() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
