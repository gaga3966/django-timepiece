var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months = [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

// Display a message to the user.
var showMessage = function(type, message) {
    var container = $("<div />").addClass("alert alert-" + type)
    var close = $("<a />").addClass("close").attr({
        "data-dismiss": "alert",
        "href": "#"
    }).text("x");
    container.append(close).append(message);
    $("#alerts").empty().append(container);
}
var showError = function(message) { showMessage("error", message); }
var showSuccess = function(message) { showMessage("success", message); }

// Displays an error message to the user.
var handleAjaxFailure = function(xhr, status, error) {
    if (xhr.status === 400 || xhr.status === 403) {
        showError(xhr.responseText);
    } else {  // Probably a 404 or 500 error.
        showError("An internal error has occurred. Please contact an " +
                  "administrator.");
    }
}

// Calls the API to change (verify, reject, or approve) the status of
// entries.
var changeEntries = function(changeUrl, collection, entryIds, successMsg) {
    $.ajax({
        type: "POST",
        url: changeUrl,
        data: JSON.stringify(entryIds),
        dataType: "json"
    }).done(function(data, status, xhr) {
        // API returns the updated data for the changed entries.
        $(data).each(function(i, raw_entry) {
            collection.get(raw_entry.id).set(raw_entry);
        });
        if (successMsg) {
            showSuccess(successMsg);
        }
    }).fail(handleAjaxFailure);
}
var verifyEntries = function(collection, entryIds, success_msg) {
    var changeUrl = verify_url;
    changeEntries(changeUrl, collection, entryIds, success_msg);
}
var rejectEntries = function(collection, entryIds, success_msg) {
    var changeUrl = reject_url;
    changeEntries(changeUrl, collection, entryIds, success_msg);
}
var approveEntries = function(collection, entryIds, success_msg) {
    var changeUrl = approve_url;
    changeEntries(changeUrl, collection, entryIds, success_msg);
}

var display_time = function(d) {
    // TODO: handle timezone.
    hours = "" + (d.getHours() % 12 || 12);
    minutes = d.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : "" + minutes;
    ampm = d.getHours() >= 12 ? "pm" : "am";
    return hours + ":" + minutes + " " + ampm;
}

var get_ids_from_current_month = function(entries) {
    var entryIds = [];
    _.each(entries, function(entry) {
        if (entry.isFromCurrentMonth()) {
            entryIds.push(entry.get('id'));
        }
    });
    return entryIds;
}