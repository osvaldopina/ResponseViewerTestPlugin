const React = require('react');

module.exports.responseViewers = [{
  contentType: /json/,
  name: 'ResponseViewerTestPlugin',
  previewMode: 'preview',
  previewModeChild: 'ResponseViewerTestPlugin',
  component: class extends React.Component {

    constructor (props) {
        super(props);
        this.handleChangeUrl = this.handleChangeUrl.bind(this);
		this.handleChangeMethod = this.handleChangeMethod.bind(this);
		this.handleSend = this.handleSend.bind(this);
    }
  
    handleChangeUrl(event) {
        if (this.props.handleUpdateRequest) {
            this.props.handleUpdateRequest({
			   url: event.target.value
			});
        }
    }
    
	handleChangeMethod(event) {
        if (this.props.handleUpdateRequest) {
            this.props.handleUpdateRequest({
			   method: event.target.value
			});
        }
    }

	handleSend(event) {
        if (this.props.handleSendRequest) {
            this.props.handleSendRequest();
        }
    }

    render() {
        return (
            React.createElement("div",{className:"form-row pad-top-sm"},
                React.createElement("div",{className:"form-control form-control--outlined"},
	                React.createElement("label",null,"URL",
		                React.createElement("input",
			                {value:this.props.currentRequest.url,onChange:this.handleChangeUrl}
			            )
		            ),
					React.createElement("label",null,"Method",
						React.createElement("select",{value:this.props.currentRequest.method, onChange:this.handleChangeMethod},
							React.createElement("option",{value:"GET"},"GET"),
							React.createElement("option",{value:"POST"},"POST"),
							React.createElement("option",{value:"PUT"},"PUT"),
							React.createElement("option",{value:"PATCH"},"PATCH"),
							React.createElement("option",{value:"DELETE"},"DELETE"),
							React.createElement("option",{value:"OPTIONS"},"OPTIONS"),
							React.createElement("option",{value:"HEAD"},"HEAD")
						)
					),
					React.createElement("div",{className:"form-control form-control--outlined"},
						React.createElement("br", null),
						React.createElement("button",{onClick:this.handleSend},"Send")
					)									
				)
            )
        )
    }
  }
}];
