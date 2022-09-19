import React from 'react';

export default class FormErrors extends React.Component {
    render() {
        if (this.props.formErrors !== null) {
            return (
                <div
                    id='form-error-alert'
                    className='alert alert-danger'
                    role='alert'>
                    {this.props.formErrors.map((formError, index) => {
                        return <p key={index}>{formError.error}</p>;
                    })}
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}
