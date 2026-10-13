// =========================================================
// DELIVERY SYSTEM
// Main JavaScript
// =========================================================



// =========================================================
// STORAGE
// =========================================================

const STORAGE_KEY = "delivery_system_shipments";



// =========================================================
// MOCK BARCODE DATABASE
//
// בעתיד זה יוחלף ב-API אמיתי.
// =========================================================

const mockShipmentsDatabase = {

    "72900100001": {

        shipmentNumber: "100401",

        customer: "משה לוי",

        phone: "050-1112233",

        city: "ראשון לציון",

        street: "רוטשילד",

        houseNumber: "44",

        entrance: "",

        floor: "",

        apartment: "",

        addressType: "בית פרטי",

        notes: ""

    },


    "72900100002": {

        shipmentNumber: "100402",

        customer: "דנה כהן",

        phone: "052-3334455",

        city: "חולון",

        street: "סוקולוב",

        houseNumber: "18",

        entrance: "ב",

        floor: "3",

        apartment: "12",

        addressType: "בניין",

        notes: "להתקשר לפני הגעה"

    },


    "72900100003": {

        shipmentNumber: "100403",

        customer: "יוסי ישראלי",

        phone: "054-5556677",

        city: "פתח תקווה",

        street: "חיים עוזר",

        houseNumber: "12",

        entrance: "א",

        floor: "2",

        apartment: "6",

        addressType: "בניין",

        notes: ""

    },


    "72900100004": {

        shipmentNumber: "100404",

        customer: "נועה אברהם",

        phone: "053-7778899",

        city: "תל אביב",

        street: "דיזנגוף",

        houseNumber: "91",

        entrance: "",

        floor: "4",

        apartment: "15",

        addressType: "בניין",

        notes: "קוד כניסה 2580#"

    },


    "72900100005": {

        shipmentNumber: "100405",

        customer: "אורן לוי",

        phone: "050-9988776",

        city: "רמת גן",

        street: "ביאליק",

        houseNumber: "31",

        entrance: "",

        floor: "",

        apartment: "",

        addressType: "עסק",

        notes: "קבלה בקומת כניסה"

    }

};



// =========================================================
// LOCAL STORAGE FUNCTIONS
// =========================================================

function getShipments() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(saved);

    }
    catch (error) {

        console.error(
            "Failed loading shipments",
            error
        );

        return [];

    }

}



function saveShipments(shipments) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(shipments)

    );

}



// =========================================================
// CREATE UNIQUE ID
// =========================================================

function createShipmentId() {

    return (
        "shipment_" +
        Date.now() +
        "_" +
        Math.floor(
            Math.random() * 100000
        )
    );

}



// =========================================================
// ADDRESS HELPERS
// =========================================================

function getMainAddress(shipment) {

    return (
        `${shipment.street || ""} ${shipment.houseNumber || ""}`
    ).trim();

}



function getBuildingDetails(shipment) {

    const parts = [];


    if (
        shipment.addressType
    ) {

        parts.push(
            shipment.addressType
        );

    }


    if (
        shipment.entrance
    ) {

        parts.push(
            `כניסה ${shipment.entrance}`
        );

    }


    if (
        shipment.floor
    ) {

        parts.push(
            `קומה ${shipment.floor}`
        );

    }


    if (
        shipment.apartment
    ) {

        parts.push(
            `דירה ${shipment.apartment}`
        );

    }


    return (
        parts.join(" • ") || "-"
    );

}



// =========================================================
// STATUS CLASS
// =========================================================

function getStatusClass(status) {

    switch (status) {

        case "נמסר":
            return "completed";

        case "בדרך":
            return "active";

        case "לא נמסר":
            return "failed";

        default:
            return "waiting";

    }

}



// =========================================================
// =========================================================
// WAREHOUSE PAGE
// =========================================================
// =========================================================



const barcodeInput =
    document.getElementById(
        "barcodeInput"
    );


const scanButton =
    document.getElementById(
        "scanButton"
    );


const scanResult =
    document.getElementById(
        "scanResult"
    );


const recentShipmentsTable =
    document.getElementById(
        "recentShipmentsTable"
    );


const receivedTodayCount =
    document.getElementById(
        "receivedTodayCount"
    );


const duplicateCount =
    document.getElementById(
        "duplicateCount"
    );


const scannerStatus =
    document.getElementById(
        "scannerStatus"
    );



let duplicateScans = 0;



// =========================================================
// UPDATE WAREHOUSE COUNTERS
// =========================================================

function updateWarehouseCounters() {

    if (!receivedTodayCount) {

        return;

    }


    const shipments =
        getShipments();


    receivedTodayCount.textContent =
        shipments.length;

}



// =========================================================
// BARCODE EVENTS
// =========================================================

if (barcodeInput) {

    updateWarehouseCounters();


    barcodeInput.focus();


    barcodeInput.addEventListener(

        "keydown",

        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                processBarcode();

            }

        }

    );

}



if (scanButton) {

    scanButton.addEventListener(

        "click",

        processBarcode

    );

}



// =========================================================
// PROCESS BARCODE
// =========================================================

function processBarcode() {

    if (!barcodeInput) {

        return;

    }


    const barcode =
        barcodeInput
            .value
            .trim();


    if (
        barcode === ""
    ) {

        showScanError(
            "יש לסרוק או להזין ברקוד."
        );

        barcodeInput.focus();

        return;

    }


    setScannerWorking();


    const shipments =
        getShipments();


    const alreadyExists =
        shipments.some(

            shipment =>
                shipment.barcode === barcode

        );


    if (
        alreadyExists
    ) {

        duplicateScans++;


        if (
            duplicateCount
        ) {

            duplicateCount.textContent =
                duplicateScans;

        }


        showDuplicateBarcode(
            barcode
        );


        resetScanner();

        return;

    }


    const shipmentData =
        mockShipmentsDatabase[
            barcode
        ];


    if (
        !shipmentData
    ) {

        showUnknownBarcode(
            barcode
        );


        resetScanner();

        return;

    }


    const shipment = {

        id:
            createShipmentId(),

        barcode:
            barcode,

        shipmentNumber:
            shipmentData.shipmentNumber,

        customer:
            shipmentData.customer,

        phone:
            shipmentData.phone,

        city:
            shipmentData.city,

        street:
            shipmentData.street,

        houseNumber:
            shipmentData.houseNumber,

        entrance:
            shipmentData.entrance,

        floor:
            shipmentData.floor,

        apartment:
            shipmentData.apartment,

        addressType:
            shipmentData.addressType,

        notes:
            shipmentData.notes,

        driver:
            "",

        status:
            "ממתין לשיוך",

        createdAt:
            new Date()
                .toISOString(),

        deliveredAt:
            null

    };


    shipments.push(
        shipment
    );


    saveShipments(
        shipments
    );


    updateWarehouseCounters();


    addWarehouseShipmentToTable(
        shipment
    );


    showScanSuccess(
        shipment
    );


    resetScanner();

}



// =========================================================
// SCAN SUCCESS
// =========================================================

function showScanSuccess(
    shipment
) {

    if (
        !scanResult
    ) {

        return;

    }


    scanResult.className =
        "scan-result scan-success";


    scanResult.innerHTML = `

        <div class="scan-result-icon">
            ✓
        </div>

        <div>

            <h3>
                המשלוח נקלט בהצלחה
            </h3>

            <p>
                משלוח #${shipment.shipmentNumber}
                •
                ${shipment.customer}
                •
                ${getMainAddress(shipment)},
                ${shipment.city}
            </p>

            <small>
                ברקוד:
                ${shipment.barcode}
            </small>

        </div>

    `;

}



// =========================================================
// DUPLICATE
// =========================================================

function showDuplicateBarcode(
    barcode
) {

    if (
        !scanResult
    ) {

        return;

    }


    scanResult.className =
        "scan-result scan-warning";


    scanResult.innerHTML = `

        <div class="scan-result-icon">
            ⚠️
        </div>

        <div>

            <h3>
                המשלוח כבר קיים במערכת
            </h3>

            <p>
                הברקוד ${barcode}
                כבר נקלט.
            </p>

            <small>
                המערכת מנעה יצירת משלוח כפול.
            </small>

        </div>

    `;

}



// =========================================================
// UNKNOWN BARCODE
// =========================================================

function showUnknownBarcode(
    barcode
) {

    if (
        !scanResult
    ) {

        return;

    }


    scanResult.className =
        "scan-result scan-error";


    scanResult.innerHTML = `

        <div class="scan-result-icon">
            ✕
        </div>

        <div>

            <h3>
                הברקוד לא נמצא
            </h3>

            <p>
                לא נמצאו פרטי משלוח עבור
                ${barcode}.
            </p>

            <small>
                בעתיד תתבצע כאן פנייה ל-API של מערכת המשלוחים.
            </small>

        </div>

    `;

}



// =========================================================
// GENERIC ERROR
// =========================================================

function showScanError(
    message
) {

    if (
        !scanResult
    ) {

        return;

    }


    scanResult.className =
        "scan-result scan-error";


    scanResult.innerHTML = `

        <div class="scan-result-icon">
            ✕
        </div>

        <div>

            <h3>
                לא ניתן לבצע קליטה
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}



// =========================================================
// WAREHOUSE TABLE
// =========================================================

function addWarehouseShipmentToTable(
    shipment
) {

    if (
        !recentShipmentsTable
    ) {

        return;

    }


    const row =
        document.createElement(
            "tr"
        );


    const time =
        new Date(
            shipment.createdAt
        )
            .toLocaleTimeString(
                "he-IL",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit"
                }
            );


    row.innerHTML = `

        <td>
            ${time}
        </td>

        <td>
            #${shipment.shipmentNumber}
        </td>

        <td>
            ${shipment.barcode}
        </td>

        <td>
            ${shipment.customer}
        </td>

        <td>
            ${shipment.phone}
        </td>

        <td>
            ${shipment.city}
        </td>

        <td>
            ${getMainAddress(shipment)}
        </td>

        <td>

            <span class="status waiting">
                ${shipment.status}
            </span>

        </td>

    `;


    recentShipmentsTable.prepend(
        row
    );

}



// =========================================================
// SCANNER STATUS
// =========================================================

function setScannerWorking() {

    if (
        !scannerStatus
    ) {

        return;

    }


    scannerStatus.innerHTML = `

        <span class="status-dot working"></span>

        מבצע קליטה...

    `;

}



function setScannerReady() {

    if (
        !scannerStatus
    ) {

        return;

    }


    scannerStatus.innerHTML = `

        <span class="status-dot"></span>

        מוכן לסריקה

    `;

}



// =========================================================
// RESET SCANNER
// =========================================================

function resetScanner() {

    if (
        !barcodeInput
    ) {

        return;

    }


    barcodeInput.value =
        "";


    setTimeout(

        function () {

            setScannerReady();

            barcodeInput.focus();

        },

        300

    );

}



// =========================================================
// WAREHOUSE MANUAL MODAL
// =========================================================

const manualDeliveryButton =
    document.getElementById(
        "manualDeliveryButton"
    );


const manualDeliveryModal =
    document.getElementById(
        "manualDeliveryModal"
    );


const closeManualModal =
    document.getElementById(
        "closeManualModal"
    );


const cancelManualDelivery =
    document.getElementById(
        "cancelManualDelivery"
    );


const manualDeliveryForm =
    document.getElementById(
        "manualDeliveryForm"
    );



if (
    manualDeliveryButton &&
    manualDeliveryModal
) {

    manualDeliveryButton
        .addEventListener(

            "click",

            function () {

                manualDeliveryModal
                    .classList
                    .remove(
                        "hidden"
                    );

            }

        );

}



if (
    closeManualModal
) {

    closeManualModal
        .addEventListener(

            "click",

            closeWarehouseManualModal

        );

}



if (
    cancelManualDelivery
) {

    cancelManualDelivery
        .addEventListener(

            "click",

            closeWarehouseManualModal

        );

}



function closeWarehouseManualModal() {

    if (
        !manualDeliveryModal
    ) {

        return;

    }


    manualDeliveryModal
        .classList
        .add(
            "hidden"
        );

}



// =========================================================
// MANUAL WAREHOUSE SUBMIT
// =========================================================

if (
    manualDeliveryForm
) {

    manualDeliveryForm
        .addEventListener(

            "submit",

            function (event) {

                event.preventDefault();


                const barcode =
                    document
                        .getElementById(
                            "manualBarcode"
                        )
                        .value
                        .trim();


                const shipments =
                    getShipments();


                const exists =
                    shipments.some(

                        shipment =>
                            shipment.barcode ===
                            barcode

                    );


                if (
                    exists
                ) {

                    showDuplicateBarcode(
                        barcode
                    );

                    closeWarehouseManualModal();

                    return;

                }


                const address =
                    document
                        .getElementById(
                            "manualAddress"
                        )
                        .value
                        .trim();


                const addressParts =
                    address.split(" ");


                const houseNumber =
                    addressParts.pop() || "";


                const street =
                    addressParts.join(" ");


                const shipment = {

                    id:
                        createShipmentId(),

                    barcode:
                        barcode,

                    shipmentNumber:
                        document
                            .getElementById(
                                "manualShipmentNumber"
                            )
                            .value
                            .trim(),

                    customer:
                        document
                            .getElementById(
                                "manualCustomer"
                            )
                            .value
                            .trim(),

                    phone:
                        document
                            .getElementById(
                                "manualPhone"
                            )
                            .value
                            .trim(),

                    city:
                        document
                            .getElementById(
                                "manualCity"
                            )
                            .value
                            .trim(),

                    street:
                        street,

                    houseNumber:
                        houseNumber,

                    entrance:
                        "",

                    floor:
                        "",

                    apartment:
                        "",

                    addressType:
                        "אחר",

                    notes:
                        "",

                    driver:
                        "",

                    status:
                        "ממתין לשיוך",

                    createdAt:
                        new Date()
                            .toISOString(),

                    deliveredAt:
                        null

                };


                shipments.push(
                    shipment
                );


                saveShipments(
                    shipments
                );


                updateWarehouseCounters();


                addWarehouseShipmentToTable(
                    shipment
                );


                showScanSuccess(
                    shipment
                );


                manualDeliveryForm.reset();


                closeWarehouseManualModal();

            }

        );

}



// =========================================================
// =========================================================
// SHIPMENTS PAGE
// =========================================================
// =========================================================



const shipmentsTableBody =
    document.getElementById(
        "shipmentsTableBody"
    );


const shipmentSearchInput =
    document.getElementById(
        "shipmentSearchInput"
    );


const cityFilter =
    document.getElementById(
        "cityFilter"
    );


const driverFilter =
    document.getElementById(
        "driverFilter"
    );


const statusFilter =
    document.getElementById(
        "statusFilter"
    );



// =========================================================
// SHIPMENT COUNTERS
// =========================================================

function updateShipmentCounters() {

    const shipments =
        getShipments();


    const total =
        shipments.length;


    const unassigned =
        shipments.filter(

            shipment =>
                !shipment.driver

        ).length;


    const assigned =
        shipments.filter(

            shipment =>
                shipment.driver

        ).length;


    const delivered =
        shipments.filter(

            shipment =>
                shipment.status ===
                "נמסר"

        ).length;


    const totalElement =
        document.getElementById(
            "shipmentsTotalCount"
        );


    const unassignedElement =
        document.getElementById(
            "shipmentsUnassignedCount"
        );


    const assignedElement =
        document.getElementById(
            "shipmentsAssignedCount"
        );


    const deliveredElement =
        document.getElementById(
            "shipmentsDeliveredCount"
        );


    if (
        totalElement
    ) {

        totalElement.textContent =
            total;

    }


    if (
        unassignedElement
    ) {

        unassignedElement.textContent =
            unassigned;

    }


    if (
        assignedElement
    ) {

        assignedElement.textContent =
            assigned;

    }


    if (
        deliveredElement
    ) {

        deliveredElement.textContent =
            delivered;

    }

}



// =========================================================
// CITY FILTER
// =========================================================

function populateCityFilter() {

    if (
        !cityFilter
    ) {

        return;

    }


    const shipments =
        getShipments();


    const cities =
        [
            ...new Set(

                shipments
                    .map(
                        shipment =>
                            shipment.city
                    )
                    .filter(
                        Boolean
                    )

            )
        ];


    cities.sort();


    cityFilter.innerHTML = `

        <option value="">
            כל הערים
        </option>

    `;


    cities.forEach(

        city => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                city;


            option.textContent =
                city;


            cityFilter.appendChild(
                option
            );

        }

    );

}



// =========================================================
// RENDER SHIPMENTS
// =========================================================

function renderShipments() {

    if (
        !shipmentsTableBody
    ) {

        return;

    }


    const shipments =
        getShipments();


    const searchValue =
        shipmentSearchInput
            ? shipmentSearchInput
                .value
                .trim()
                .toLowerCase()
            : "";


    const selectedCity =
        cityFilter
            ? cityFilter.value
            : "";


    const selectedDriver =
        driverFilter
            ? driverFilter.value
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "";


    const filtered =
        shipments.filter(

            shipment => {


                const searchableText = [

                    shipment.shipmentNumber,

                    shipment.barcode,

                    shipment.customer,

                    shipment.phone,

                    shipment.city,

                    shipment.street,

                    shipment.houseNumber,

                    shipment.driver,

                    shipment.status

                ]
                    .join(" ")
                    .toLowerCase();


                if (
                    searchValue &&
                    !searchableText
                        .includes(
                            searchValue
                        )
                ) {

                    return false;

                }


                if (
                    selectedCity &&
                    shipment.city !==
                        selectedCity
                ) {

                    return false;

                }


                if (
                    selectedDriver
                ) {

                    if (
                        selectedDriver ===
                        "ללא שיוך"
                    ) {

                        if (
                            shipment.driver
                        ) {

                            return false;

                        }

                    }

                    else if (
                        shipment.driver !==
                        selectedDriver
                    ) {

                        return false;

                    }

                }


                if (
                    selectedStatus &&
                    shipment.status !==
                        selectedStatus
                ) {

                    return false;

                }


                return true;

            }

        );


    shipmentsTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        shipmentsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#64748b;
                    "
                >
                    לא נמצאו משלוחים
                </td>

            </tr>

        `;

        return;

    }


    filtered
        .slice()
        .reverse()
        .forEach(

            shipment => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const driverText =
                    shipment.driver ||
                    "ללא שיוך";


                row.innerHTML = `

                    <td>
                        #${shipment.shipmentNumber}
                    </td>


                    <td>
                        ${shipment.barcode}
                    </td>


                    <td>
                        <strong>
                            ${shipment.customer}
                        </strong>
                    </td>


                    <td>
                        ${shipment.phone}
                    </td>


                    <td>
                        ${shipment.city}
                    </td>


                    <td>
                        ${getMainAddress(shipment)}
                    </td>


                    <td>
                        ${getBuildingDetails(shipment)}
                    </td>


                    <td>
                        ${driverText}
                    </td>


                    <td>

                        <span
                            class="
                                status
                                ${getStatusClass(
                                    shipment.status
                                )}
                            "
                        >

                            ${shipment.status}

                        </span>

                    </td>


                    <td>

                        <button
                            class="table-btn"
                            onclick="
                                editShipment(
                                    '${shipment.id}'
                                )
                            "
                        >
                            עריכה
                        </button>

                    </td>

                `;


                shipmentsTableBody
                    .appendChild(
                        row
                    );

            }

        );

}



// =========================================================
// SHIPMENT FILTER EVENTS
// =========================================================

if (
    shipmentSearchInput
) {

    shipmentSearchInput
        .addEventListener(

            "input",

            renderShipments

        );

}



if (
    cityFilter
) {

    cityFilter
        .addEventListener(

            "change",

            renderShipments

        );

}



if (
    driverFilter
) {

    driverFilter
        .addEventListener(

            "change",

            renderShipments

        );

}



if (
    statusFilter
) {

    statusFilter
        .addEventListener(

            "change",

            renderShipments

        );

}



// =========================================================
// SHIPMENT MODAL
// =========================================================

const shipmentModal =
    document.getElementById(
        "shipmentModal"
    );


const newShipmentButton =
    document.getElementById(
        "newShipmentButton"
    );


const closeShipmentModal =
    document.getElementById(
        "closeShipmentModal"
    );


const cancelShipmentButton =
    document.getElementById(
        "cancelShipmentButton"
    );


const shipmentForm =
    document.getElementById(
        "shipmentForm"
    );



if (
    newShipmentButton
) {

    newShipmentButton
        .addEventListener(

            "click",

            function () {

                openNewShipmentModal();

            }

        );

}



if (
    closeShipmentModal
) {

    closeShipmentModal
        .addEventListener(

            "click",

            closeShipmentManagementModal

        );

}



if (
    cancelShipmentButton
) {

    cancelShipmentButton
        .addEventListener(

            "click",

            closeShipmentManagementModal

        );

}



// =========================================================
// OPEN NEW SHIPMENT
// =========================================================

function openNewShipmentModal() {

    if (
        !shipmentModal ||
        !shipmentForm
    ) {

        return;

    }


    shipmentForm.reset();


    document
        .getElementById(
            "editingShipmentId"
        )
        .value =
        "";


    document
        .getElementById(
            "shipmentModalTitle"
        )
        .textContent =
        "משלוח חדש";


    shipmentModal
        .classList
        .remove(
            "hidden"
        );

}



// =========================================================
// CLOSE SHIPMENT MODAL
// =========================================================

function closeShipmentManagementModal() {

    if (
        !shipmentModal
    ) {

        return;

    }


    shipmentModal
        .classList
        .add(
            "hidden"
        );

}



// =========================================================
// EDIT SHIPMENT
// =========================================================

function editShipment(
    shipmentId
) {

    const shipments =
        getShipments();


    const shipment =
        shipments.find(

            item =>
                item.id ===
                shipmentId

        );


    if (
        !shipment ||
        !shipmentModal
    ) {

        return;

    }


    document
        .getElementById(
            "editingShipmentId"
        )
        .value =
        shipment.id;


    document
        .getElementById(
            "shipmentBarcode"
        )
        .value =
        shipment.barcode;


    document
        .getElementById(
            "shipmentNumber"
        )
        .value =
        shipment.shipmentNumber;


    document
        .getElementById(
            "shipmentCustomer"
        )
        .value =
        shipment.customer;


    document
        .getElementById(
            "shipmentPhone"
        )
        .value =
        shipment.phone;


    document
        .getElementById(
            "shipmentAddressType"
        )
        .value =
        shipment.addressType ||
        "אחר";


    document
        .getElementById(
            "shipmentCity"
        )
        .value =
        shipment.city;


    document
        .getElementById(
            "shipmentStreet"
        )
        .value =
        shipment.street;


    document
        .getElementById(
            "shipmentHouseNumber"
        )
        .value =
        shipment.houseNumber;


    document
        .getElementById(
            "shipmentEntrance"
        )
        .value =
        shipment.entrance || "";


    document
        .getElementById(
            "shipmentFloor"
        )
        .value =
        shipment.floor || "";


    document
        .getElementById(
            "shipmentApartment"
        )
        .value =
        shipment.apartment || "";


    document
        .getElementById(
            "shipmentDriver"
        )
        .value =
        shipment.driver || "";


    document
        .getElementById(
            "shipmentStatus"
        )
        .value =
        shipment.status;


    document
        .getElementById(
            "shipmentNotes"
        )
        .value =
        shipment.notes || "";


    document
        .getElementById(
            "shipmentModalTitle"
        )
        .textContent =
        "עריכת משלוח";


    shipmentModal
        .classList
        .remove(
            "hidden"
        );

}



// =========================================================
// SAVE SHIPMENT
// =========================================================

if (
    shipmentForm
) {

    shipmentForm
        .addEventListener(

            "submit",

            function (event) {

                event.preventDefault();


                const shipments =
                    getShipments();


                const editingId =
                    document
                        .getElementById(
                            "editingShipmentId"
                        )
                        .value;


                const driver =
                    document
                        .getElementById(
                            "shipmentDriver"
                        )
                        .value;


                let status =
                    document
                        .getElementById(
                            "shipmentStatus"
                        )
                        .value;


                if (
                    driver &&
                    status ===
                    "ממתין לשיוך"
                ) {

                    status =
                        "משויך";

                }


                if (
                    !driver &&
                    status ===
                    "משויך"
                ) {

                    status =
                        "ממתין לשיוך";

                }


                const formData = {

                    barcode:
                        document
                            .getElementById(
                                "shipmentBarcode"
                            )
                            .value
                            .trim(),

                    shipmentNumber:
                        document
                            .getElementById(
                                "shipmentNumber"
                            )
                            .value
                            .trim(),

                    customer:
                        document
                            .getElementById(
                                "shipmentCustomer"
                            )
                            .value
                            .trim(),

                    phone:
                        document
                            .getElementById(
                                "shipmentPhone"
                            )
                            .value
                            .trim(),

                    addressType:
                        document
                            .getElementById(
                                "shipmentAddressType"
                            )
                            .value,

                    city:
                        document
                            .getElementById(
                                "shipmentCity"
                            )
                            .value
                            .trim(),

                    street:
                        document
                            .getElementById(
                                "shipmentStreet"
                            )
                            .value
                            .trim(),

                    houseNumber:
                        document
                            .getElementById(
                                "shipmentHouseNumber"
                            )
                            .value
                            .trim(),

                    entrance:
                        document
                            .getElementById(
                                "shipmentEntrance"
                            )
                            .value
                            .trim(),

                    floor:
                        document
                            .getElementById(
                                "shipmentFloor"
                            )
                            .value
                            .trim(),

                    apartment:
                        document
                            .getElementById(
                                "shipmentApartment"
                            )
                            .value
                            .trim(),

                    driver:
                        driver,

                    status:
                        status,

                    notes:
                        document
                            .getElementById(
                                "shipmentNotes"
                            )
                            .value
                            .trim()

                };


                if (
                    editingId
                ) {

                    const index =
                        shipments
                            .findIndex(

                                item =>
                                    item.id ===
                                    editingId

                            );


                    if (
                        index !== -1
                    ) {

                        shipments[
                            index
                        ] = {

                            ...shipments[
                                index
                            ],

                            ...formData

                        };


                        if (
                            status ===
                            "נמסר" &&
                            !shipments[
                                index
                            ].deliveredAt
                        ) {

                            shipments[
                                index
                            ].deliveredAt =
                                new Date()
                                    .toISOString();

                        }

                    }

                }


                else {

                    const duplicateBarcode =
                        shipments.some(

                            shipment =>
                                shipment.barcode ===
                                formData.barcode

                        );


                    if (
                        duplicateBarcode
                    ) {

                        alert(
                            "ברקוד זה כבר קיים במערכת."
                        );

                        return;

                    }


                    shipments.push({

                        id:
                            createShipmentId(),

                        ...formData,

                        createdAt:
                            new Date()
                                .toISOString(),

                        deliveredAt:
                            status ===
                            "נמסר"
                                ? new Date()
                                    .toISOString()
                                : null

                    });

                }


                saveShipments(
                    shipments
                );


                closeShipmentManagementModal();


                populateCityFilter();


                updateShipmentCounters();


                renderShipments();

            }

        );

}



// =========================================================
// INITIALIZE SHIPMENTS PAGE
// =========================================================

if (
    shipmentsTableBody
) {

    populateCityFilter();

    updateShipmentCounters();

    renderShipments();

}