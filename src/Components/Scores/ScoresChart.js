import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    Cell,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const barColors = ['#34ed4180', '#ff000080', '#1e21c980'];
export default class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: [
                {
                    name: 'Correct',
                    total: this.props.chartData.correctCounter,
                },
                {
                    name: 'Incorrect',
                    total: this.props.chartData.incorrectCounter,
                },
                {
                    name: 'Total',
                    total: this.props.chartData.totalCounter,
                },
            ],
        };
    }

    render() {
        return (
            <ResponsiveContainer
                width='95%'
                height={450}>
                <BarChart
                    data={this.state.chartData.slice()}
                    margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <XAxis
                        dataKey='name'
                        stroke='#000000'
                    />
                    <YAxis stroke='#000000' />
                    <Tooltip
                        wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
                        formatter={function (total) {
                            return `${total}`;
                        }}
                    />
                    <Bar
                        dataKey='total'
                        stroke='#000000'
                        strokeWidth={1}>
                        {this.state.chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={barColors[index]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
