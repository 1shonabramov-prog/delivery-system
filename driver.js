// =========================================================
// DELIVERY SYSTEM
// DRIVER APP
// =========================================================


// =========================================================
// STORAGE KEYS
// =========================================================

const CURRENT_USER_STORAGE_KEY =
    "delivery_system_current_user";

const SHIPMENTS_STORAGE_KEY =
    "delivery_system_shipments";

const DRIVER_ROUTE_STORAGE_KEY =
    "delivery_system_driver_route";


// =========================================================
// CURRENT USER
// =========================================================

function getCurrentUser() {

    const savedUser =
        sessionStorage.getItem(
            CURRENT_USER_STORAGE_KEY
        );


    if (!savedUser) {

        return null;

    }


    try {

        return JSON.parse(
            savedUser
        );

    }

    catch (error) {

        console.error(
            "Failed loading current user",
            error
        );

        return null;

    }

}


// =========================================================
// SHIPMENTS
// =========================================================

function getShipments() {

    const savedShipments =
        localStorage.getItem(
            SHIPMENTS_STORAGE_KEY
        );


    if (!savedShipments) {

        return [];

    }


    try {

        return JSON.parse(
            savedShipments
        );

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

        SHIPMENTS_STORAGE_KEY,

        JSON.stringify(
            shipments
        )

    );

}


// =========================================================
// DOM
// =========================================================

const driverName =
    document.getElementById(
        "driverName"
    );


const driverWorkDate =
    document.getElementById(
        "driverWorkDate"
    );


const totalDeliveriesCount =
    document.getElementById(
        "totalDeliveriesCount"
    );


const deliveredCount =
    document.getElementById(
        "deliveredCount"
    );


const remainingCount =
    document.getElementById(
        "remainingCount"
    );


const failedCount =
    document.getElementById(
        "failedCount"
    );


const deliveriesHeaderCount =
    document.getElementById(
        "deliveriesHeaderCount"
    );


const deliveriesList =
    document.getElementById(
        "deliveriesList"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const openRoutePlannerButton =
    document.getElementById(
        "openRoutePlannerButton"
    );


const closeRoutePlannerButton =
    document.getElementById(
        "closeRoutePlannerButton"
    );


const routePlanner =
    document.getElementById(
        "routePlanner"
    );


const routeDate =
    document.getElementById(
        "routeDate"
    );


const routeStartTime =
    document.getElementById(
        "routeStartTime"
    );


const routeStartAddress =
    document.getElementById(
        "routeStartAddress"
    );


const routeEndAddress =
    document.getElementById(
        "routeEndAddress"
    );


const buildRouteButton =
    document.getElementById(
        "buildRouteButton"
    );


// =========================================================
// DELIVERY SHEET
// =========================================================

const deliverySheetOverlay =
    document.getElementById(
        "deliverySheetOverlay"
    );


const closeDeliverySheetButton =
    document.getElementById(
        "closeDeliverySheetButton"
    );


const sheetCustomerName =
    document.getElementById(
        "sheetCustomerName"
    );


const sheetPhone =
    document.getElementById(
        "sheetPhone"
    );


const sheetPhoneLink =
    document.getElementById(
        "sheetPhoneLink"
    );


const sheetAddress =
    document.getElementById(
        "sheetAddress"
    );


const sheetBuildingDetails =
    document.getElementById(
        "sheetBuildingDetails"
    );


const sheetNotes =
    document.getElementById(
        "sheetNotes"
    );


const sheetEta =
    document.getElementById(
        "sheetEta"
    );


const sheetNavigationButton =
    document.getElementById(
        "sheetNavigationButton"
    );


const markDeliveredButton =
    document.getElementById(
        "markDeliveredButton"
    );


const markFailedButton =
    document.getElementById(
        "markFailedButton"
    );


// =========================================================
// NAVIGATION
// =========================================================

const navigationOverlay =
    document.getElementById(
        "navigationOverlay"
    );


const navigationAddressText =
    document.getElementById(
        "navigationAddressText"
    );


const openWazeButton =
    document.getElementById(
        "openWazeButton"
    );


const openGoogleMapsButton =
    document.getElementById(
        "openGoogleMapsButton"
    );


const closeNavigationButton =
    document.getElementById(
        "closeNavigationButton"
    );


// =========================================================
// STATE
// =========================================================

let currentUser =
    null;


let selectedShipmentId =
    null;


let navigationAddress =
    "";


// =========================================================
// HELPERS
// =========================================================

function firstValue(...values) {

    return values.find(

        value =>

            value !== undefined &&
            value !== null &&
            value !== ""

    ) || "";

}


function getShipmentId(shipment) {

    return firstValue(

        shipment.id,
        shipment.shipmentId,
        shipment.shipmentNumber,
        shipment.number,
        shipment.barcode

    );

}


function getCustomerName(shipment) {

    return firstValue(

        shipment.customerName,
        shipment.customer,
        shipment.name,
        shipment.recipientName

    ) || "לקוח";

}


function getCustomerPhone(shipment) {

    return firstValue(

        shipment.phone,
        shipment.customerPhone,
        shipment.recipientPhone

    );

}


function getShipmentCity(shipment) {

    return firstValue(

        shipment.city,
        shipment.customerCity

    );

}


function getShipmentStreet(shipment) {

    return firstValue(

        shipment.street,
        shipment.streetName

    );

}


function getShipmentHouseNumber(shipment) {

    return firstValue(

        shipment.houseNumber,
        shipment.house_number,
        shipment.number

    );

}


function getShipmentAddress(shipment) {

    if (
        shipment.address &&
        typeof shipment.address ===
            "string"
    ) {

        return shipment.address;

    }


    const street =
        getShipmentStreet(
            shipment
        );


    const houseNumber =
        getShipmentHouseNumber(
            shipment
        );


    const city =
        getShipmentCity(
            shipment
        );


    const streetAddress =

        [
            street,
            houseNumber
        ]
            .filter(Boolean)
            .join(" ");


    return [

        streetAddress,
        city

    ]
        .filter(Boolean)
        .join(", ");

}


function getBuildingDetails(shipment) {

    const details =
        [];


    const addressType =
        firstValue(

            shipment.addressType,
            shipment.address_type

        );


    const entrance =
        firstValue(

            shipment.entrance

        );


    const floor =
        firstValue(

            shipment.floor

        );


    const apartment =
        firstValue(

            shipment.apartment

        );


    if (addressType) {

        details.push(
            addressType
        );

    }


    if (entrance) {

        details.push(
            "כניסה " +
            entrance
        );

    }


    if (floor) {

        details.push(
            "קומה " +
            floor
        );

    }


    if (apartment) {

        details.push(
            "דירה " +
            apartment
        );

    }


    return details.join(
        " • "
    );

}


function getShipmentNotes(shipment) {

    return firstValue(

        shipment.deliveryNotes,
        shipment.notes,
        shipment.note,
        shipment.driverNotes

    ) || "אין הערות";

}


function getShipmentStatus(shipment) {

    return firstValue(

        shipment.status

    ) || "ממתין לשיוך";

}


// =========================================================
// DRIVER MATCH
// =========================================================

function shipmentBelongsToCurrentDriver(
    shipment
) {

    if (!currentUser) {

        return false;

    }


    // Driver ID is the preferred method.

    if (
        currentUser.driverId &&
        shipment.driverId &&
        shipment.driverId ===
            currentUser.driverId
    ) {

        return true;

    }


    const shipmentDriver =
        String(

            firstValue(

                shipment.driver,
                shipment.driverName,
                shipment.assignedDriver

            )

        )
            .trim()
            .toLowerCase();


    if (!shipmentDriver) {

        return false;

    }


    const possibleNames =
        [

            currentUser.fullName,
            currentUser.username

        ]
            .filter(Boolean)
            .map(

                value =>
                    String(value)
                        .trim()
                        .toLowerCase()

            );


    return possibleNames.includes(
        shipmentDriver
    );

}


// =========================================================
// GET CURRENT DRIVER SHIPMENTS
// =========================================================

function getDriverShipments() {

    return getShipments()
        .filter(
            shipmentBelongsToCurrentDriver
        );

}


// =========================================================
// DATE
// =========================================================

function formatToday() {

    return new Intl.DateTimeFormat(

        "he-IL",

        {
            weekday:
                "long",

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"
        }

    )
        .format(
            new Date()
        );

}


function getLocalDateInputValue() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    const day =
        String(
            date.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


function getCurrentTimeInputValue() {

    const date =
        new Date();


    const hours =
        String(
            date.getHours()
        )
            .padStart(
                2,
                "0"
            );


    const minutes =
        String(
            date.getMinutes()
        )
            .padStart(
                2,
                "0"
            );


    return (
        hours +
        ":" +
        minutes
    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// =========================================================
// SUMMARY
// =========================================================

function updateSummary() {

    const shipments =
        getDriverShipments();


    const total =
        shipments.length;


    const delivered =
        shipments.filter(

            shipment =>
                getShipmentStatus(
                    shipment
                ) ===
                "נמסר"

        ).length;


    const failed =
        shipments.filter(

            shipment =>
                getShipmentStatus(
                    shipment
                ) ===
                "לא נמסר"

        ).length;


    const remaining =
        shipments.filter(

            shipment => {

                const status =
                    getShipmentStatus(
                        shipment
                    );


                return (

                    status !==
                        "נמסר"

                    &&

                    status !==
                        "לא נמסר"

                );

            }

        ).length;


    totalDeliveriesCount.textContent =
        total;


    deliveredCount.textContent =
        delivered;


    failedCount.textContent =
        failed;


    remainingCount.textContent =
        remaining;


    deliveriesHeaderCount.textContent =
        remaining;

}


// =========================================================
// RENDER DELIVERIES
// =========================================================

function renderDeliveries() {

    const shipments =
        getDriverShipments();


    if (
        shipments.length === 0
    ) {

        deliveriesList.innerHTML = `

            <div class="empty-deliveries">

                <div class="empty-deliveries-icon">
                    📦
                </div>

                <h3>
                    אין משלוחים להצגה
                </h3>

                <p>
                    משלוחים ששויכו אליך יופיעו כאן.
                </p>

            </div>

        `;


        updateSummary();

        return;

    }


    const activeShipments =
        shipments.filter(

            shipment => {

                const status =
                    getShipmentStatus(
                        shipment
                    );


                return (

                    status !==
                        "נמסר"

                    &&

                    status !==
                        "לא נמסר"

                );

            }

        );


    const completedShipments =
        shipments.filter(

            shipment => {

                const status =
                    getShipmentStatus(
                        shipment
                    );


                return (

                    status ===
                        "נמסר"

                    ||

                    status ===
                        "לא נמסר"

                );

            }

        );


    const orderedShipments =
        [

            ...activeShipments,
            ...completedShipments

        ];


    deliveriesList.innerHTML =
        "";


    orderedShipments.forEach(

        (
            shipment,
            index
        ) => {


            const id =
                getShipmentId(
                    shipment
                );


            const customer =
                getCustomerName(
                    shipment
                );


            const address =
                getShipmentAddress(
                    shipment
                );


            const buildingDetails =
                getBuildingDetails(
                    shipment
                );


            const status =
                getShipmentStatus(
                    shipment
                );


            const isDelivered =
                status ===
                "נמסר";


            const isFailed =
                status ===
                "לא נמסר";


            let statusText =
                "ממתין";


            if (isDelivered) {

                statusText =
                    "נמסר ✅";

            }


            else if (isFailed) {

                statusText =
                    "לא נמסר ❌";

            }


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "delivery-card";


            card.innerHTML = `

                <div class="delivery-card-top">

                    <div class="delivery-number">

                        ${index + 1}

                    </div>


                    <div class="delivery-card-info">

                        <div class="delivery-customer">

                            ${escapeHtml(
                                customer
                            )}

                        </div>


                        <div class="delivery-address">

                            ${escapeHtml(
                                address ||
                                "לא הוגדרה כתובת"
                            )}

                        </div>


                        ${
                            buildingDetails

                                ?

                                `
                                <span class="delivery-building">

                                    ${escapeHtml(
                                        buildingDetails
                                    )}

                                </span>
                                `

                                :

                                ""
                        }


                        <div class="delivery-eta">

                            ${
                                isDelivered ||
                                isFailed

                                    ?

                                    statusText

                                    :

                                    "🕒 ETA טרם חושב"
                            }

                        </div>

                    </div>

                </div>


                <div class="delivery-card-actions">


                    <button
                        type="button"
                        class="delivery-details-button"
                        data-action="details"
                        data-id="${escapeHtml(
                            id
                        )}"
                    >

                        פרטים

                    </button>


                    <button
                        type="button"
                        class="delivery-navigation-button"
                        data-action="navigation"
                        data-id="${escapeHtml(
                            id
                        )}"
                    >

                        🧭 ניווט

                    </button>


                    <button
                        type="button"
                        class="delivery-delivered-button"
                        data-action="delivered"
                        data-id="${escapeHtml(
                            id
                        )}"
                        ${
                            isDelivered ||
                            isFailed

                                ?

                                "disabled"

                                :

                                ""
                        }
                    >

                        ${
                            isDelivered

                                ?

                                "✅ נמסר"

                                :

                                isFailed

                                    ?

                                    "❌ לא נמסר"

                                    :

                                    "✅ נמסר"
                        }

                    </button>


                </div>

            `;


            deliveriesList
                .appendChild(
                    card
                );

        }

    );


    updateSummary();

}


// =========================================================
// FIND SHIPMENT
// =========================================================

function findShipmentById(
    shipmentId
) {

    const shipments =
        getDriverShipments();


    return shipments.find(

        shipment =>

            String(
                getShipmentId(
                    shipment
                )
            )

            ===

            String(
                shipmentId
            )

    );

}


// =========================================================
// OPEN DELIVERY DETAILS
// =========================================================

function openDeliveryDetails(
    shipmentId
) {

    const shipment =
        findShipmentById(
            shipmentId
        );


    if (!shipment) {

        return;

    }


    selectedShipmentId =
        shipmentId;


    const customer =
        getCustomerName(
            shipment
        );


    const phone =
        getCustomerPhone(
            shipment
        );


    const address =
        getShipmentAddress(
            shipment
        );


    const buildingDetails =
        getBuildingDetails(
            shipment
        );


    const notes =
        getShipmentNotes(
            shipment
        );


    sheetCustomerName.textContent =
        customer;


    sheetPhone.textContent =
        phone ||
        "לא הוגדר מספר";


    if (phone) {

        const cleanPhone =
            String(phone)
                .replace(
                    /[^\d+]/g,
                    ""
                );


        sheetPhoneLink.href =
            "tel:" +
            cleanPhone;

    }

    else {

        sheetPhoneLink.href =
            "#";

    }


    sheetAddress.textContent =
        address ||
        "לא הוגדרה כתובת";


    sheetBuildingDetails.textContent =
        buildingDetails;


    sheetNotes.textContent =
        notes;


    sheetEta.textContent =
        "טרם חושב מסלול";


    deliverySheetOverlay
        .classList
        .remove(
            "hidden"
        );

}


// =========================================================
// CLOSE DELIVERY DETAILS
// =========================================================

function closeDeliveryDetails() {

    deliverySheetOverlay
        .classList
        .add(
            "hidden"
        );


    selectedShipmentId =
        null;

}


// =========================================================
// NAVIGATION
// =========================================================

function openNavigation(
    shipmentId
) {

    const shipment =
        findShipmentById(
            shipmentId
        );


    if (!shipment) {

        return;

    }


    const address =
        getShipmentAddress(
            shipment
        );


    if (!address) {

        alert(
            "למשלוח הזה אין כתובת לניווט."
        );

        return;

    }


    navigationAddress =
        address;


    navigationAddressText.textContent =
        address;


    navigationOverlay
        .classList
        .remove(
            "hidden"
        );

}


function closeNavigation() {

    navigationOverlay
        .classList
        .add(
            "hidden"
        );


    navigationAddress =
        "";

}


// =========================================================
// WAZE
// =========================================================

function navigateWithWaze() {

    if (!navigationAddress) {

        return;

    }


    const address =
        encodeURIComponent(
            navigationAddress
        );


    const wazeUrl =
        "https://www.waze.com/ul?q=" +
        address +
        "&navigate=yes";


    window.location.href =
        wazeUrl;

}


// =========================================================
// GOOGLE MAPS
// =========================================================

function navigateWithGoogleMaps() {

    if (!navigationAddress) {

        return;

    }


    const address =
        encodeURIComponent(
            navigationAddress
        );


    const mapsUrl =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        address;


    window.location.href =
        mapsUrl;

}


// =========================================================
// UPDATE SHIPMENT STATUS
// =========================================================

function updateShipmentStatus(
    shipmentId,
    newStatus,
    failedReason = ""
) {

    const shipments =
        getShipments();


    const index =
        shipments.findIndex(

            shipment =>

                String(
                    getShipmentId(
                        shipment
                    )
                )

                ===

                String(
                    shipmentId
                )

        );


    if (
        index === -1
    ) {

        alert(
            "המשלוח לא נמצא."
        );

        return;

    }


    shipments[
        index
    ].status =
        newStatus;


    if (
        newStatus ===
        "נמסר"
    ) {

        const deliveryRate =
            Number(
                currentUser
                    .deliveryRate ||
                0
            );


        shipments[
            index
        ].deliveredAt =
            new Date()
                .toISOString();


        shipments[
            index
        ].deliveryRate =
            deliveryRate;


        shipments[
            index
        ].deliveryAmount =
            deliveryRate;


        shipments[
            index
        ].deliveredBy =
            currentUser.id;


        shipments[
            index
        ].failedReason =
            "";

    }


    if (
        newStatus ===
        "לא נמסר"
    ) {

        shipments[
            index
        ].failedAt =
            new Date()
                .toISOString();


        shipments[
            index
        ].failedReason =
            failedReason;


        shipments[
            index
        ].deliveryAmount =
            0;

    }


    saveShipments(
        shipments
    );


    closeDeliveryDetails();


    renderDeliveries();

}


// =========================================================
// MARK DELIVERED
// =========================================================

function markShipmentDelivered(
    shipmentId
) {

    const confirmed =
        confirm(
            "לסמן את המשלוח כנמסר?"
        );


    if (!confirmed) {

        return;

    }


    updateShipmentStatus(

        shipmentId,

        "נמסר"

    );

}


// =========================================================
// MARK FAILED
// =========================================================

function markShipmentFailed(
    shipmentId
) {

    const reason =
        prompt(

            "למה המשלוח לא נמסר?\n\nלדוגמה: הלקוח לא ענה, כתובת שגויה, אין גישה לבניין"

        );


    if (
        reason === null
    ) {

        return;

    }


    updateShipmentStatus(

        shipmentId,

        "לא נמסר",

        reason.trim()

    );

}


// =========================================================
// DELIVERY LIST EVENTS
// =========================================================

deliveriesList.addEventListener(

    "click",

    function (event) {


        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {

            return;

        }


        const action =
            button.dataset.action;


        const shipmentId =
            button.dataset.id;


        if (
            action ===
            "details"
        ) {

            openDeliveryDetails(
                shipmentId
            );

        }


        if (
            action ===
            "navigation"
        ) {

            openNavigation(
                shipmentId
            );

        }


        if (
            action ===
            "delivered"
        ) {

            markShipmentDelivered(
                shipmentId
            );

        }

    }

);


// =========================================================
// SHEET EVENTS
// =========================================================

closeDeliverySheetButton
    .addEventListener(

        "click",

        closeDeliveryDetails

    );


deliverySheetOverlay
    .addEventListener(

        "click",

        function (event) {

            if (
                event.target ===
                deliverySheetOverlay
            ) {

                closeDeliveryDetails();

            }

        }

    );


sheetNavigationButton
    .addEventListener(

        "click",

        function () {

            if (
                selectedShipmentId
            ) {

                closeDeliveryDetails();


                openNavigation(
                    selectedShipmentId
                );

            }

        }

    );


markDeliveredButton
    .addEventListener(

        "click",

        function () {

            if (
                selectedShipmentId
            ) {

                markShipmentDelivered(
                    selectedShipmentId
                );

            }

        }

    );


markFailedButton
    .addEventListener(

        "click",

        function () {

            if (
                selectedShipmentId
            ) {

                markShipmentFailed(
                    selectedShipmentId
                );

            }

        }

    );


// =========================================================
// NAVIGATION EVENTS
// =========================================================

openWazeButton
    .addEventListener(

        "click",

        navigateWithWaze

    );


openGoogleMapsButton
    .addEventListener(

        "click",

        navigateWithGoogleMaps

    );


closeNavigationButton
    .addEventListener(

        "click",

        closeNavigation

    );


navigationOverlay
    .addEventListener(

        "click",

        function (event) {

            if (
                event.target ===
                navigationOverlay
            ) {

                closeNavigation();

            }

        }

    );


// =========================================================
// ROUTE PLANNER OPEN / CLOSE
// =========================================================

openRoutePlannerButton
    .addEventListener(

        "click",

        function () {

            routePlanner
                .classList
                .remove(
                    "hidden"
                );


            openRoutePlannerButton
                .classList
                .add(
                    "hidden"
                );

        }

    );


closeRoutePlannerButton
    .addEventListener(

        "click",

        function () {

            routePlanner
                .classList
                .add(
                    "hidden"
                );


            openRoutePlannerButton
                .classList
                .remove(
                    "hidden"
                );

        }

    );


// =========================================================
// SAVE ROUTE SETTINGS
// =========================================================

buildRouteButton
    .addEventListener(

        "click",

        function () {


            const date =
                routeDate.value;


            const startTime =
                routeStartTime.value;


            const startAddress =
                routeStartAddress
                    .value
                    .trim();


            const endAddress =
                routeEndAddress
                    .value
                    .trim();


            if (!date) {

                alert(
                    "יש לבחור תאריך."
                );

                return;

            }


            if (!startTime) {

                alert(
                    "יש לבחור שעת התחלה."
                );

                return;

            }


            if (!startAddress) {

                alert(
                    "יש להזין כתובת התחלה."
                );

                return;

            }


            const routeSettings = {

                driverId:
                    currentUser.driverId,

                userId:
                    currentUser.id,

                date:
                    date,

                startTime:
                    startTime,

                startAddress:
                    startAddress,

                endAddress:
                    endAddress,

                createdAt:
                    new Date()
                        .toISOString()

            };


            localStorage.setItem(

                DRIVER_ROUTE_STORAGE_KEY,

                JSON.stringify(
                    routeSettings
                )

            );


            alert(

                "פרטי יום העבודה נשמרו.\n\nבשלב הבא נחבר את Google Maps כדי לחשב את סדר התחנות וזמני ההגעה."

            );

        }

    );


// =========================================================
// LOAD SAVED ROUTE SETTINGS
// =========================================================

function loadSavedRouteSettings() {

    const saved =
        localStorage.getItem(
            DRIVER_ROUTE_STORAGE_KEY
        );


    if (!saved) {

        return;

    }


    try {

        const route =
            JSON.parse(
                saved
            );


        if (
            route.userId !==
            currentUser.id
        ) {

            return;

        }


        routeDate.value =
            route.date ||
            getLocalDateInputValue();


        routeStartTime.value =
            route.startTime ||
            getCurrentTimeInputValue();


        routeStartAddress.value =
            route.startAddress ||
            "";


        routeEndAddress.value =
            route.endAddress ||
            "";

    }

    catch (error) {

        console.error(
            "Failed loading route settings",
            error
        );

    }

}


// =========================================================
// LOGOUT
// =========================================================

logoutButton.addEventListener(

    "click",

    function () {


        const confirmed =
            confirm(
                "לצאת מהמערכת?"
            );


        if (!confirmed) {

            return;

        }


        sessionStorage.removeItem(
            CURRENT_USER_STORAGE_KEY
        );


        window.location.href =
            "login.html";

    }

);


// =========================================================
// REPORTS
// =========================================================

const reportsButton =
    document.querySelector(
        ".reports-button"
    );


if (reportsButton) {

    reportsButton.addEventListener(

        "click",

        function (event) {

            event.preventDefault();


            alert(
                "מסך הדוחות וההכנסות ייבנה בשלב הבא."
            );

        }

    );

}


// =========================================================
// AUTHORIZATION
// =========================================================

function authorizeDriver() {

    currentUser =
        getCurrentUser();


    if (!currentUser) {

        window.location.href =
            "login.html";

        return false;

    }


    if (
        currentUser.status !==
        "פעיל"
    ) {

        sessionStorage.removeItem(
            CURRENT_USER_STORAGE_KEY
        );


        window.location.href =
            "login.html";

        return false;

    }


    if (
        currentUser.role !==
        "DRIVER"
    ) {

        if (
            currentUser.role ===
            "ADMIN"
        ) {

            window.location.href =
                "index.html";

            return false;

        }


        if (
            currentUser.role ===
            "WAREHOUSE"
        ) {

            window.location.href =
                "warehouse.html";

            return false;

        }


        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


// =========================================================
// INITIALIZE DRIVER APP
// =========================================================

function initializeDriverApp() {

    const authorized =
        authorizeDriver();


    if (!authorized) {

        return;

    }


    // Driver name

    driverName.textContent =
        currentUser.fullName ||
        currentUser.username ||
        "שליח";


    // Work date

    driverWorkDate.textContent =
        formatToday();


    // Route default values

    routeDate.value =
        getLocalDateInputValue();


    routeStartTime.value =
        getCurrentTimeInputValue();


    // Load previously saved route settings

    loadSavedRouteSettings();


    // Shipments

    renderDeliveries();

}


// =========================================================
// START
// =========================================================

initializeDriverApp();