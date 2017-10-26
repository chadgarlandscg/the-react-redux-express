import * as React from 'react'
import { Route, Switch } from 'react-router'
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
                            </div>
                        )
                    }}
                />
            </Switch>
        </div>
    )
}
export default Sample