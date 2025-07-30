import { useNavigate, useParams } from "react-router-dom";

const withNavigation = (Component) => {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} navigate={navigate} params={params} />;
  };
};

export default withNavigation;