import * as React from 'react'
import { Route, Switch } from 'react-router'
import { appState } from '../redux/store/templates/appState'
const Sample = (props) => {
    return (
        <div>
            <Switch>
                <Route
                    exact={true}
                    path="/sample"
                    render={() => {
                        return (
                            <div>
                                <h1>{props.appState.sample}</h1>
                                <button
                                    onClick={() => props.updateSampleText(
                                        props.appState.sample.includes('test') ? appState.sample : appState.sample+' test '
                                    )}
                                >Test</button>
                                <input
                                    type='number'
                                    value={props.appState.counterChangeField}
                                    onChange={element => {
                                        props.updateCounterChangeField(element.target.value)
                                    }}
                                />
                                <label>Current counter value: {props.appState.counter.value}</label>
                                <button
                                    onClick={() => props.updateCounter(props.appState.counterChangeField, props.appState.counter.id)}
                                >Save</button>
                            </div>
                        )
                    }}
                />
            </Switch>
        </div>
    )
}
export default Sample