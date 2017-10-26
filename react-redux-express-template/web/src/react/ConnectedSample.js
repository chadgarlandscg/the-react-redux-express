import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'react-router-redux'
import Sample from './Sample'
const mapStateToProps = (state, ownProps) =>  {
    return {
        appState: state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}
const ConnectedSample = withRouter(connect(mapStateToProps, mapDispatchToProps)(Sample))
export default ConnectedSample