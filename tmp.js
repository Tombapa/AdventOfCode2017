// JavaScript source code

var library = "siili_appointment.js";
var modifiedOn = "2017-04-12 12:20";

var currentActivityId = null;


function onLoad() {
    stamp(onLoad.name);
    currentActivityId = Xrm.Page.data.entity.getId();
    stamp(onLoad.name, ("'currentActivityId' eq '" + currentActivityId + "'"));
    //debug("onLoad()");
}


function onSave() {
    stamp(onSave.name);
    //debug("onSave()");

    if ((currentActivityId == null) || (currentActivityId == "")) {
        stamp(onSave.name, "About to force and re-open.", currentActivityId);
        waitAndForceReopen(currentActivityId);
    } else {
        stamp(onSave.name, "Saved an appointment with existing activityId.", currentActivityId);
    }
    
}


/**
 * @description If activityId is null, set timeout and form notification while asynchronously open the newly created appointment.
 * @param {String} activityId Appointment GUID to from onLoad, expexted to be null when a new appointment has been created.
 */
function waitAndForceReopen(activityId) {
    var timeout = 3000;
    stamp(waitAndForceReopen.name, ("About to wait for " + timeout + " milliseconds."), activityId);
    // set form notification
    setTimeout(
        function () {
            Xrm.Page.ui.setFormNotification(
                "Please wait - enabling notes. This should only " + (timeout / 1000) + " seconds.",
                "INFO",
                "wait"
            );
        },
        500);
    // open newly-created appointment with default form
    setTimeout(
        function () {
            stamp(waitAndForceReopen.name, ("Waited for " + timeout + " milliseconds."), activityId);
            retrieveLatestAppointment();
            Xrm.Page.ui.clearFormNotification("wait");
        },
        timeout);
}


/**
 * @description Asynchronous. Retrieves the latest current-user-created appointment. Uses openExistingApointment(appointmentId) to open it with default form.
 */
function retrieveLatestAppointment() {
    //stamp(retrieveLatestAppointment.name);
    var userIdStr = Xrm.Page.context.getUserId().replace(/[{}]/g, "").toUpperCase();
    stamp(retrieveLatestAppointment.name, ("'userIdStr' eq '" + userIdStr + "'"));

    var req = new XMLHttpRequest();
    var clientURL = Xrm.Page.context.getClientUrl();
    var query = "/api/data/v8.1/appointments"
        + "?$select=activityid,subject,createdon,ownerid"
        + "&$top=1"
        + "&$orderby=createdon desc"
        + "&$filter=_ownerid_value eq " + userIdStr;
    req.open("GET", encodeURI(clientURL + query), true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    //req.setRequestHeader("OData-MaxVersion", "4.0");
    //req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            req.onreadystatechange = null;
            if (this.status == 200) {
                var data = JSON.parse(this.response);
                if (data && data.value) {
                    //debug("retrieveLatestAppointment()", data.value[0]);
                    //console.dir(data);
                    var latestActivityId = data.value[0].activityid.replace(/[{}]/g, "").toUpperCase();
                    stamp(retrieveLatestAppointment.name, ("'latestActivityId' eq '" + latestActivityId + "'"));
                    openExistingAppointment(latestActivityId);
                }
            }
            else {
                var error = JSON.parse(this.response).error;
                alert("Error retrieving latest appointment: " + error.message);
            }
        }
    };
    req.send(null);
}    


/**
 * @description Open the specified appointment record using the default form.
 * @param {String} appointmentId Appointment to be opened with openEntityForm().
 */
function openExistingAppointment(appointmentId) {
    stamp(openExistingAppointment.name, null, appointmentId);
    var parameters = {};
    parameters["navbar"] = "entity";
    //console.dir(parameters);
    Xrm.Utility.openEntityForm("appointment", appointmentId, parameters);
}


/**
 * @description For debugging purposes only - disabled on form properties.
 */
function subjectOnChange(context) {
    stamp(subjectOnChange.name);
    console.dir(context);
    retrieveLatestAppointment();
}


/**
 * @description Logs the name of the calling function with optional parameters and either optional message or library's modifiedOn timestamp.'
 * @param {String} caller The name of calling the function.
 * @param {String} message Optional message to override the modifiedOn timestamp.
 * @param {String} parameters Optional, the parameters passed to the caller.
 */
function stamp(caller, message, parameters) {
    var entry = library + "." + caller;
    // Either "()" or "(parameters)"
    if ((typeof parameters !== undefined) && (parameters != null)) {
        entry = entry + "('" + parameters + "')";
    } else {
        entry = entry + "()";
    }
    // Either timestamp or message
    if ((typeof message !== undefined) && (message != null)) {
        entry = entry + ": " + message;
    } else {
        entry = entry + ", modified on " + modifiedOn + ".";
    }
    // Finally
    console.log(entry);
}


/**
 * @description For logging purposes. Uses console.log.
 * @param {String} caller The name of calling function.
 * @param {Object} data An object to provde errorCode, message, subject and activityid.
 */
function debug(caller, data) {
    console.log(
        library + "." + caller
        + "\n Id: " + Xrm.Page.data.entity.getId()
        + "\n Primary attribute value: " + Xrm.Page.data.entity.getPrimaryAttributeValue()
        + "\n Form type: " + Xrm.Page.ui.getFormType()
        + ((data === undefined) ? "" : ("\n errorCode: " + data.errorCode + "\n message: " + data.message + "\n retrievedActivitySubject: " + data.subject + "\n retrievedActivityId: " + data.activityid))
    );
}