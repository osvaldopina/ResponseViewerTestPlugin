const React = require('react');

module.exports.responseViewers = [{
  contentType: /json/,
  name: 'ResponseViewerTestPlugin',
  previewMode: 'preview',
  previewModeChild: 'ResponseViewerTestPlugin',
  component: class extends React.Component {

    constructor (props) {
        super(props);
		this.handleOnlineEditChange = this.handleOnlineEditChange.bind(this);
        this.handleChangeUrl = this.handleChangeUrl.bind(this);
		this.handleChangeMethod = this.handleChangeMethod.bind(this);
		this.handleChangeBodyText = this.handleChangeBodyText.bind(this);
		this.handleChangeBodyMimeType = this.handleChangeBodyMimeType.bind(this);
		this.handleChangeNewRequestName = this.handleChangeNewRequestName.bind(this);
		this.handleSend = this.handleSend.bind(this);
		this.handleSendOnNewRequest = this.handleSendOnNewRequest.bind(this);
		this.calculateContentTypeHeader = this.calculateContentTypeHeader.bind(this);
		this.getMimeType = this.getMimeType.bind(this);
		this.getBodyText = this.getBodyText.bind(this);
		this.createInsomniaRequestFromState = this.createInsomniaRequestFromState.bind(this);
		this.handlePluginUIChange = this.handlePluginUIChange.bind(this);
		this.updateInsomniaFromState = this.updateInsomniaFromState.bind(this);
		this.createStateFromInsomniaRequest = this.createStateFromInsomniaRequest.bind(this);
		
		if (this.props) {
			this.state = { 
				syncEdit : true,
				url : props.currentRequest.url,
				method : props.currentRequest.method,
				newRequestName : "",
				body :  {
					mimeType : props.currentRequest.body.mimeType,
					text: props.currentRequest.body.text
				}
		  }
		};
		
	}
	
	updateInsomniaFromState(state, useName) {
		const request = this.createInsomniaRequestFromState(state, useName);
		this.props.handleUpdateRequest((Object.assign(request, { headers : this.calculateContentTypeHeader(request) })));
	}
	
	createInsomniaRequestFromState(state, useName) {
		const request = {};
		if (useName && ! Object.is(state.newRequestName, undefined)) {
			Object.assign(request, { name : state.newRequestName });
		}
		if (! Object.is(state.url, undefined)) {
			Object.assign(request, { url : state.url });
		}
		if (! Object.is(state.method, undefined)) {
			Object.assign(request, { method : state.method });
		}
		if (! Object.is(state.body, undefined)) {
			const bodyPatch = {};
			if (! Object.is(state.body.mimeType, undefined)) {
				Object.assign(bodyPatch, { mimeType : state.body.mimeType });
			}
			if (! Object.is(state.body.text, undefined)) {
				Object.assign(bodyPatch, { text : state.body.text });
			}
			Object.assign(request,{ body :  bodyPatch });
		}
		return request;
	}
	
	calculateContentTypeHeader(request) {
		const headers = [];
		this.props.currentRequest.headers.forEach((currentRequestHeader) => {
			if (currentRequestHeader.name !== 'Content-Type') {
				headers.push(currentRequestHeader);
			}
		});
		
		if (! Object.is(request.body, undefined) && ! Object.is(request.body.mimeType, undefined)) {
			headers.push({
				name : 'Content-Type',
				value : request.body.mimeType
			});
		}
		return headers;
	}
	
	createStateFromInsomniaRequest(request) {
		const futureState = {};
		if (! Object.is(request.url, undefined)) {
			Object.assign(futureState, { url : request.url });
		}
		if (! Object.is(request.method, undefined)) {
			Object.assign(futureState, { method : request.method });
		}
		if (! Object.is(request.body, undefined)) {
			const bodyPatch = {};
			if (! Object.is(request.body.mimeType, undefined)) {
				Object.assign(bodyPatch, { mimeType : request.body.mimeType });
			}
			if (! Object.is(request.body.text, undefined)) {
				Object.assign(bodyPatch, { text : request.body.text });
			}
			Object.assign(futureState,{ body : bodyPatch });
		}
		return futureState;
	}
	
	componentWillReceiveProps(props) {
		if (this.state.syncEdit) {
			var requestPatch = this.createStateFromInsomniaRequest(props.currentRequest);
			this.setState(requestPatch);
		}
	}
	
	handlePluginUIChange(changePatch) {
		const futureState = Object.assign({}, this.state, changePatch);
		this.setState(changePatch);
		if (futureState.syncEdit) {
		  this.updateInsomniaFromState(futureState);
		}
	}
	
	handleOnlineEditChange(event) {
		this.handlePluginUIChange({
			syncEdit : ! this.state.syncEdit
		});
	}
	
    handleChangeUrl(event) {
		this.handlePluginUIChange({
		   url: event.target.value
		});
    }
	
	handleChangeMethod(event) {
		this.handlePluginUIChange({
		   method: event.target.value
		});
    }
	
	handleChangeBodyText(event) {
		this.handlePluginUIChange({
			body : {
			   mimeType : this.state.body.mimeType,
			   text :  event.target.value === "" ? undefined : event.target.value
			}
		});
    }

	handleChangeBodyMimeType(event) {
		this.handlePluginUIChange({
			body : {
			   mimeType : event.target.value === "" ? undefined : event.target.value,
			   text: this.state.body.text
			}
		});
    }
	
	async handleSend(event) {
		if (!this.state.syncEdit) {
			const request = this.createInsomniaRequestFromState(this.state)
			await this.props.handleUpdateRequest(request);
		}
		await this.props.handleSendRequest();
    }
	
	handleChangeNewRequestName(event) {
		this.setState({
			newRequestName : event.target.value
		});
	}
	
	handleSendOnNewRequest(event) {
		this.props.handleSendOnNewRequest(this.createInsomniaRequestFromState(this.state, this.state.newRequestName));

	}

	getMimeType() {
		return 	Object.is(this.state.body, undefined) ? 
					"" : 
					Object.is(this.state.body.mimeType, undefined) ?
						"" :
						this.state.body.mimeType;
	}
	
	getBodyText() {
		return 	Object.is(this.state.body, undefined) ? 
					"" : 
					Object.is(this.state.body.text, undefined) ?
						"" :
						this.state.body.text;
	}	
		
    render() {
        return (
            React.createElement("div",{className:"form-row pad-top-sm"},
                React.createElement("div",{className:"form-control form-control--outlined"},
	                React.createElement("button",{onClick:this.handleOnlineEditChange},this.state.syncEdit? "Disable Sync Edit" : "Enable Sync Edit"),
					React.createElement("br",null),
					React.createElement("label",null,"URL",
		                React.createElement("input",
			                {value:this.state.url, onChange:this.handleChangeUrl}
			            )
		            ),
					React.createElement("label",null,"Method",
						React.createElement("select",{value:this.state.method, onChange:this.handleChangeMethod},
							React.createElement("option",{value:"GET"},"GET"),
							React.createElement("option",{value:"POST"},"POST"),
							React.createElement("option",{value:"PUT"},"PUT"),
							React.createElement("option",{value:"PATCH"},"PATCH"),
							React.createElement("option",{value:"DELETE"},"DELETE"),
							React.createElement("option",{value:"OPTIONS"},"OPTIONS"),
							React.createElement("option",{value:"HEAD"},"HEAD")
						)
					),
					React.createElement("label",null,"Body MimeType",
						React.createElement("select",{ value : this.getMimeType(), onChange:this.handleChangeBodyMimeType},
							React.createElement("option",{value:""},"-- select a mime type"),
							React.createElement("option",{value:"application/xml"},"application/xml"),
							React.createElement("option",{value:"application/json"},"application/json")
						)
					),
					React.createElement("label",null,"Body",
						React.createElement("textarea",{rows: 20, value:this.getBodyText(), onChange:this.handleChangeBodyText})
					),
					React.createElement("br", null),
					React.createElement("button",{onClick:this.handleSend},"Send"),
					React.createElement("br", null),
					React.createElement("br", null),
				    React.createElement("label",null,"New Request Name",
		                React.createElement("input",{value:this.state.newRequestName, onChange: this.handleChangeNewRequestName})
		            ),					
					React.createElement("br", null),
					React.createElement("button",{onClick:this.handleSendOnNewRequest},"Send on new Request")
				)
            )
        )
    }
  }
}];
