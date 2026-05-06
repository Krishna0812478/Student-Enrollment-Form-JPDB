var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";
var connToken = "90935249|-31949236546660019|90958475";

$("#rollNo").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollNo = $("#rollNo").val();
    var jsonStr = { "Roll-No": rollNo };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    
    $("#fullName").val(data["Full-Name,"]); 
    $("#stuClass").val(data.Class);
    $("#birthDate").val(data["Birth-Date"]);
    $("#address").val(data.Address);
    $("#enrollDate").val(data["Enrollment-Date"]);
}

function setFieldsEnabled(status) {
    $("#fullName").prop("disabled", !status);
    $("#stuClass").prop("disabled", !status);
    $("#birthDate").prop("disabled", !status);
    $("#address").prop("disabled", !status);
    $("#enrollDate").prop("disabled", !status);
}

function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#stuClass").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollDate").val("");
    
    $("#rollNo").prop("disabled", false);
    setFieldsEnabled(false);
    
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollNo").focus();
}

function validateData() {
    var rollNo = $("#rollNo").val();
    var fullName = $("#fullName").val();
    var stuClass = $("#stuClass").val();
    var birthDate = $("#birthDate").val();
    var address = $("#address").val();
    var enrollDate = $("#enrollDate").val();

    if (rollNo === "") { alert("Roll No missing"); $("#rollNo").focus(); return ""; }
    if (fullName === "") { alert("Full Name missing"); $("#fullName").focus(); return ""; }
    if (stuClass === "") { alert("Class missing"); $("#stuClass").focus(); return ""; }
    if (birthDate === "") { alert("Birth Date missing"); $("#birthDate").focus(); return ""; }
    if (address === "") { alert("Address missing"); $("#address").focus(); return ""; }
    if (enrollDate === "") { alert("Enrollment Date missing"); $("#enrollDate").focus(); return ""; }

    return JSON.stringify({
        "Roll-No": rollNo,
        "Full-Name,": fullName, 
        "Class": stuClass,
        "Birth-Date": birthDate,
        "Address": address,
        "Enrollment-Date": enrollDate
    });
}

function getStudent() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, rollNoJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        setFieldsEnabled(true);
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);
        setFieldsEnabled(true);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;
    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    alert("Data Saved!");
    resetForm();
}

function updateData() {
    var jsonChg = validateData();
    if (jsonChg === "") return;
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, dbName, relName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    alert("Data Updated!");
    resetForm();
}