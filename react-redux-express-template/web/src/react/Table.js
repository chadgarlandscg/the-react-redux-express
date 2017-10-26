import React, {Component} from 'react';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: "Press-me"
        };
    }
    changeButtonText(){
        this.setState({test: this.state.test==='Press-me' ? 'Touch-me' : 'Press-me'});
    }
    render() {
        const renderTableRows = (n) => {
            let rows = [];
            for (let i=0;i<n;i++){
                rows.push(
                    <tr key={i}>
                        <td>{i}</td>
                        <td>{n}</td>
                        <td>test</td>
                    </tr>
                );
            }
            return rows;
        }
        return (
            <div className="TableDiv">
                <table className="Table">
                    <thead className='TableHead'>
                        <tr>
                            <th>
                                Name
                            </th>
                            <th>
                                Val
                            </th>
                            <th>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*renderTableRows(50)*/}
                        <tr>
                            <td>
                                Test
                            </td>
                            <td>
                                001
                            </td>
                            <td>
                                <input type='button' value={this.state.test} onClick={() => this.changeButtonText()}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;
