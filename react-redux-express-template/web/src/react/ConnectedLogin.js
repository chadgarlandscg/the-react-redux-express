import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Login from './Login'
import { login } from "../redux/actions/index";
const mapStateToProps = (state, ownProps) =>  {
    return {
        appState: state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        login: token => dispatch(login(token))
    }
}
const ConnectedLogin = withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
export default ConnectedLogin