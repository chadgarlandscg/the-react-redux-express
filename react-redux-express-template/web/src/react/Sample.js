import * as React from 'react'
import { Route, Switch } from 'react-router'
import { appState } from '../redux/store/templates/appState'
export default class Sample extends React.Component {
    componentDidMount(){
        this.props.getCounter(this.props.appState.counter.id)
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route
                        exact={true}
                        path="/sample"
                        render={() => {
                            return (
                                <div>
                                    <h1>{this.props.appState.sample}</h1>
                                    <button
                                        onClick={() => this.props.updateSampleText(
                                            this.props.appState.sample.includes('test') ? appState.sample : appState.sample + ' test '
                                        )}
                                    >Test
                                    </button>
                                    <input
                                        type='number'
                                        value={this.props.appState.counterChangeField}
                                        onChange={element => {
                                            this.props.updateCounterChangeField(element.target.value)
                                        }}
                                    />
                                    <label>Current counter value: {this.props.appState.counter.value}</label>
                                    <button
                                        onClick={() => this.props.updateCounter(this.props.appState.counterChangeField, this.props.appState.counter.id)}
                                    >Save
                                    </button>
                                </div>
                            )
                        }}
                    />
                </Switch>
            </div>
        )
    }
}

