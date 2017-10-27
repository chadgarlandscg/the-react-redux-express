import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'react-router-redux'
import Sample from './Sample'
import {someAction, updateCounterChangeField, updateCounter, getCounter} from "../redux/actions/index";
const mapStateToProps = (state, ownProps) =>  {
    return {
        appState: state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateSampleText: text => dispatch(someAction(text)),
        updateCounterChangeField: value => dispatch(updateCounterChangeField(value)),
        updateCounter: (value, id) => dispatch(updateCounter(value, id)),
        getCounter: (id) => dispatch(getCounter(id))
    }
}
const ConnectedSample = withRouter(connect(mapStateToProps, mapDispatchToProps)(Sample))
export default ConnectedSample