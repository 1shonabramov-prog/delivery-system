// =========================================================
// DRIVER APP
// =========================================================


// =========================================================
// STORAGE KEYS
// =========================================================

const DRIVER_SHIPMENTS_STORAGE_KEY =
    "delivery_system_shipments";

const DRIVER_USERS_STORAGE_KEY =
    "delivery_system_users";

const CURRENT_USER_STORAGE_KEY =
    "delivery_system_current_user";

const DRIVER_ROUTE_STORAGE_KEY =
    "delivery_system_driver_route_settings";


// =========================================================
// CURRENT USER
// =========================================================

function getCurrentUser() {

    const saved =
        sessionStorage.getItem(
            CURRENT_USER_STORAGE_KEY
        );


    if (
        !saved
    ) {

        return null;

    }


    try {

        return JSON.parse(
            saved
        );

    }

    catch (
        error
    ) {

        console.error(
            "Failed loading current user",
            error
        );

        return null;

    }

}


// =========================================================
// USERS
// =========================================================

function getSystemUsers() {

    const saved =
        localStorage.getItem(
            DRIVER_USERS_STORAGE_KEY
        );


    if (
        !saved
    ) {

        return [];

    }


    try {

        return JSON.parse(
            saved
        );

    }

    catch (
        error
    ) {

        console.error(
            "Failed loading users",
            error
        );

        return [];

    }

}


// =========================================================
// LIVE USER CHECK
// =========================================================

function getLiveCurrentUser() {

    const sessionUser =
        getCurrentUser();


    if (
        !sessionUser
    ) {

        return null;

    }


    const users =
        getSystemUsers();


    const liveUser =
        users.find(

            user =>

                String(
                    user.id ||
                    user.driverId ||
                    ""
                )

                ===

                String(
                    sessionUser.id ||
                    sessionUser.driverId ||
                    ""
                )

                ||

                (
                    user.username &&
                    sessionUser.username &&
                    user.username ===
                    sessionUser.username
                )

        );


    if (
        liveUser
    ) {

        return liveUser;

    }


    return sessionUser;

}


// =========================================================
// AUTHORIZATION
// =========================================================

const currentUser =
    getLiveCurrentUser();


if (
    !currentUser ||
    currentUser.role !==
        "DRIVER" ||
    currentUser.status !==
        "פעיל"
) {

    sessionStorage.removeItem(
        CURRENT_USER_STORAGE_KEY
    );


    window.location.href =
        "login.html";

}


// =========================================================
// CURRENT DRIVER ID
// =========================================================

function getCurrentDriverId() {

    return (

        currentUser.driverId ||
        currentUser.id ||
        ""

    );

}


// =========================================================
// SHIPMENTS STORAGE
// =========================================================

function getDriverAllShipments() {

    const saved =
        localStorage.getItem(
            DRIVER_SHIPMENTS_STORAGE_KEY
        );


    if (
        !saved
    ) {

        return [];

    }


    try {

        return JSON.parse(
            saved
        );

    }

    catch (
        error
    ) {

        console.error(
            "Failed loading shipments",
            error
        );

        return [];

    }

}


function saveDriverAllShipments(
    shipments
) {

    localStorage.setItem(

        DRIVER_SHIPMENTS_STORAGE_KEY,

        JSON.stringify(
            shipments
        )

    );

}


// =========================================================
// CREATE SHIPMENT ID
// =========================================================

function createDriverShipmentId() {

    return (
        "shipment_" +
        Date.now() +
        "_" +
        Math.floor(
            Math.random() *
            100000
        )
    );

}


// =========================================================
// CREATE SHIPMENT NUMBER
// =========================================================

function createDriverShipmentNumber() {

    return (
        "D" +
        Date.now()
            .toString()
            .slice(
                -7
            )
    );

}


// =========================================================
// DRIVER MATCH
// =========================================================

function shipmentBelongsToCurrentDriver(
    shipment
) {

    const currentDriverId =
        String(
            getCurrentDriverId()
        );


    if (
        shipment.driverId
    ) {

        return (

            String(
                shipment.driverId
            )

            ===

            currentDriverId

        );

    }


    if (
        shipment.driverName
    ) {

        return (

            shipment.driverName ===
            currentUser.fullName

        );

    }


    if (
        shipment.driver
    ) {

        return (

            shipment.driver ===
            currentUser.fullName

            ||

            shipment.driver ===
            currentUser.username

        );

    }


    return false;

}


// =========================================================
// GET CURRENT DRIVER SHIPMENTS
// =========================================================

function getCurrentDriverShipments() {

    return getDriverAllShipments()
        .filter(
            shipmentBelongsToCurrentDriver
        );

}


// =========================================================
// DOM ELEMENTS
// =========================================================

const driverNameElement =
    document.getElementById(
        "driverName"
    );

const driverDateElement =
    document.getElementById(
        "driverDate"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const totalShipmentsElement =
    document.getElementById(
        "totalShipments"
    );

const deliveredShipmentsElement =
    document.getElementById(
        "deliveredShipments"
    );

const remainingShipmentsElement =
    document.getElementById(
        "remainingShipments"
    );

const failedShipmentsElement =
    document.getElementById(
        "failedShipments"
    );


const addShipmentButton =
    document.getElementById(
        "addShipmentButton"
    );

const addShipmentModal =
    document.getElementById(
        "addShipmentModal"
    );

const closeAddShipmentModal =
    document.getElementById(
        "closeAddShipmentModal"
    );

const cancelAddShipmentButton =
    document.getElementById(
        "cancelAddShipmentButton"
    );

const driverAddShipmentForm =
    document.getElementById(
        "driverAddShipmentForm"
    );


const driverShipmentsList =
    document.getElementById(
        "driverShipmentsList"
    );

const shipmentCountBadge =
    document.getElementById(
        "shipmentCountBadge"
    );


const toggleRoutePlannerButton =
    document.getElementById(
        "toggleRoutePlannerButton"
    );

const routePlannerSection =
    document.getElementById(
        "routePlannerSection"
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

const saveRouteSettingsButton =
    document.getElementById(
        "saveRouteSettingsButton"
    );

const routePlannerMessage =
    document.getElementById(
        "routePlannerMessage"
    );


const deliveryDetailsOverlay =
    document.getElementById(
        "deliveryDetailsOverlay"
    );

const closeDeliveryDetailsButton =
    document.getElementById(
        "closeDeliveryDetails"
    );

const deliveryShipmentNumber =
    document.getElementById(
        "deliveryShipmentNumber"
    );

const deliveryCustomerName =
    document.getElementById(
        "deliveryCustomerName"
    );

const deliveryAddress =
    document.getElementById(
        "deliveryAddress"
    );

const deliveryBuildingDetails =
    document.getElementById(
        "deliveryBuildingDetails"
    );

const deliveryPhone =
    document.getElementById(
        "deliveryPhone"
    );

const deliveryNotes =
    document.getElementById(
        "deliveryNotes"
    );

const callCustomerButton =
    document.getElementById(
        "callCustomerButton"
    );

const openNavigationButton =
    document.getElementById(
        "openNavigationButton"
    );

const navigationOptions =
    document.getElementById(
        "navigationOptions"
    );

const openWazeButton =
    document.getElementById(
        "openWazeButton"
    );

const openGoogleMapsButton =
    document.getElementById(
        "openGoogleMapsButton"
    );

const markDeliveredButton =
    document.getElementById(
        "markDeliveredButton"
    );

const markFailedButton =
    document.getElementById(
        "markFailedButton"
    );

const driverReportsButton =
    document.getElementById(
        "driverReportsButton"
    );


// =========================================================
// CURRENT SELECTED SHIPMENT
// =========================================================

let selectedShipmentId =
    null;


// =========================================================
// HEADER
// =========================================================

function initializeDriverHeader() {

    if (
        driverNameElement
    ) {

        driverNameElement.textContent =
            currentUser.fullName ||
            currentUser.username ||
            "שליח";

    }


    if (
        driverDateElement
    ) {

        driverDateElement.textContent =
            new Date()
                .toLocaleDateString(
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
                );

    }

}


// =========================================================
// LOGOUT
// =========================================================

if (
    logoutButton
) {

    logoutButton
        .addEventListener(

            "click",

            function () {

                sessionStorage.removeItem(
                    CURRENT_USER_STORAGE_KEY
                );


                window.location.href =
                    "login.html";

            }

        );

}


// =========================================================
// ADDRESS HELPERS
// =========================================================

function getDriverShipmentMainAddress(
    shipment
) {

    return (

        `${shipment.street || ""} ${shipment.houseNumber || ""}, ${shipment.city || ""}`

    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


function getDriverBuildingDetails(
    shipment
) {

    const parts =
        [];


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
        parts.join(" • ") ||
        "ללא פרטים נוספים"
    );

}


// =========================================================
// STATUS TEXT
// =========================================================

function getDriverStatusClass(
    status
) {

    switch (
        status
    ) {

        case "נמסר":

            return "status-delivered";


        case "לא נמסר":

            return "status-failed";


        case "בדרך":

            return "status-route";


        case "משויך":

            return "status-assigned";


        default:

            return "status-waiting";

    }

}


// =========================================================
// COUNTERS
// =========================================================

function updateDriverCounters() {

    const shipments =
        getCurrentDriverShipments();


    const total =
        shipments.length;


    const delivered =
        shipments.filter(

            shipment =>
                shipment.status ===
                "נמסר"

        ).length;


    const failed =
        shipments.filter(

            shipment =>
                shipment.status ===
                "לא נמסר"

        ).length;


    const remaining =
        shipments.filter(

            shipment =>

                shipment.status !==
                "נמסר"

                &&

                shipment.status !==
                "לא נמסר"

        ).length;


    if (
        totalShipmentsElement
    ) {

        totalShipmentsElement.textContent =
            total;

    }


    if (
        deliveredShipmentsElement
    ) {

        deliveredShipmentsElement.textContent =
            delivered;

    }


    if (
        failedShipmentsElement
    ) {

        failedShipmentsElement.textContent =
            failed;

    }


    if (
        remainingShipmentsElement
    ) {

        remainingShipmentsElement.textContent =
            remaining;

    }


    if (
        shipmentCountBadge
    ) {

        shipmentCountBadge.textContent =
            total;

    }

}


// =========================================================
// RENDER DRIVER SHIPMENTS
// =========================================================

function renderDriverShipments() {

    if (
        !driverShipmentsList
    ) {

        return;

    }


    const shipments =
        getCurrentDriverShipments();


    driverShipmentsList.innerHTML =
        "";


    if (
        shipments.length ===
        0
    ) {

        driverShipmentsList.innerHTML = `

            <div class="driver-empty-state">

                <strong>
                    עדיין אין משלוחים
                </strong>

                לחץ על "הוסף משלוח"
                והזן את המשלוחים שלך.

            </div>

        `;


        updateDriverCounters();

        return;

    }


    shipments.forEach(

        shipment => {

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "driver-shipment-card";


            card.addEventListener(

                "click",

                function () {

                    openShipmentDetails(
                        shipment.id
                    );

                }

            );


            const customerName =
                shipment.customer ||
                "לקוח";


            const phone =
                shipment.phone ||
                "ללא טלפון";


            const status =
                shipment.status ||
                "משויך";


            card.innerHTML = `

                <div class="shipment-card-top">

                    <div>

                        <h3 class="shipment-card-customer">
                            ${customerName}
                        </h3>

                        <div class="shipment-card-number">
                            #${shipment.shipmentNumber || ""}
                        </div>

                    </div>


                    <span
                        class="
                            shipment-card-status
                            ${getDriverStatusClass(
                                status
                            )}
                        "
                    >
                        ${status}
                    </span>

                </div>


                <div class="shipment-card-address">

                    📍

                    ${getDriverShipmentMainAddress(
                        shipment
                    )}

                </div>


                <div class="shipment-card-phone">

                    📞

                    ${phone}

                </div>


                <div class="shipment-card-footer">

                    <span class="shipment-card-eta">

                        ETA:
                        עדיין לא חושב

                    </span>


                    <span class="shipment-open-text">

                        פרטים >

                    </span>

                </div>

            `;


            driverShipmentsList
                .appendChild(
                    card
                );

        }

    );


    updateDriverCounters();

}


// =========================================================
// ADD SHIPMENT MODAL
// =========================================================

function openAddShipmentModal() {

    if (
        !addShipmentModal
    ) {

        return;

    }


    addShipmentModal
        .classList
        .remove(
            "hidden"
        );


    setTimeout(

        function () {

            const cityInput =
                document.getElementById(
                    "driverShipmentCity"
                );


            if (
                cityInput
            ) {

                cityInput.focus();

            }

        },

        100

    );

}


function closeDriverAddShipmentModal() {

    if (
        !addShipmentModal
    ) {

        return;

    }


    addShipmentModal
        .classList
        .add(
            "hidden"
        );

}


if (
    addShipmentButton
) {

    addShipmentButton
        .addEventListener(

            "click",

            openAddShipmentModal

        );

}


if (
    closeAddShipmentModal
) {

    closeAddShipmentModal
        .addEventListener(

            "click",

            closeDriverAddShipmentModal

        );

}


if (
    cancelAddShipmentButton
) {

    cancelAddShipmentButton
        .addEventListener(

            "click",

            closeDriverAddShipmentModal

        );

}


// =========================================================
// ADD SHIPMENT
// =========================================================

if (
    driverAddShipmentForm
) {

    driverAddShipmentForm
        .addEventListener(

            "submit",

            function (
                event
            ) {

                event.preventDefault();


                const customer =
                    document
                        .getElementById(
                            "driverShipmentCustomer"
                        )
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById(
                            "driverShipmentPhone"
                        )
                        .value
                        .trim();


                const city =
                    document
                        .getElementById(
                            "driverShipmentCity"
                        )
                        .value
                        .trim();


                const street =
                    document
                        .getElementById(
                            "driverShipmentStreet"
                        )
                        .value
                        .trim();


                const houseNumber =
                    document
                        .getElementById(
                            "driverShipmentHouseNumber"
                        )
                        .value
                        .trim();


                const entrance =
                    document
                        .getElementById(
                            "driverShipmentEntrance"
                        )
                        .value
                        .trim();


                const floor =
                    document
                        .getElementById(
                            "driverShipmentFloor"
                        )
                        .value
                        .trim();


                const apartment =
                    document
                        .getElementById(
                            "driverShipmentApartment"
                        )
                        .value
                        .trim();


                const notes =
                    document
                        .getElementById(
                            "driverShipmentNotes"
                        )
                        .value
                        .trim();


                if (
                    !city ||
                    !street ||
                    !houseNumber
                ) {

                    alert(
                        "יש להזין עיר, רחוב ומספר בית."
                    );

                    return;

                }


                const shipments =
                    getDriverAllShipments();


                const shipment = {

                    id:
                        createDriverShipmentId(),

                    barcode:
                        "",

                    shipmentNumber:
                        createDriverShipmentNumber(),

                    customer:
                        customer ||
                        "לקוח",

                    phone:
                        phone,

                    city:
                        city,

                    street:
                        street,

                    houseNumber:
                        houseNumber,

                    entrance:
                        entrance,

                    floor:
                        floor,

                    apartment:
                        apartment,

                    addressType:
                        "אחר",

                    notes:
                        notes,

                    driverId:
                        getCurrentDriverId(),

                    driverName:
                        currentUser.fullName ||
                        currentUser.username ||
                        "",

                    driver:
                        currentUser.fullName ||
                        currentUser.username ||
                        "",

                    status:
                        "משויך",

                    createdAt:
                        new Date()
                            .toISOString(),

                    deliveredAt:
                        null,

                    failedAt:
                        null,

                    failedReason:
                        "",

                    assignmentHistory: [
                        {

                            fromDriverId:
                                "",

                            fromDriverName:
                                "",

                            toDriverId:
                                getCurrentDriverId(),

                            toDriverName:
                                currentUser.fullName ||
                                currentUser.username ||
                                "",

                            changedAt:
                                new Date()
                                    .toISOString(),

                            source:
                                "driver_manual"

                        }
                    ]

                };


                shipments.push(
                    shipment
                );


                saveDriverAllShipments(
                    shipments
                );


                driverAddShipmentForm.reset();


                closeDriverAddShipmentModal();


                renderDriverShipments();

            }

        );

}


// =========================================================
// OPEN SHIPMENT DETAILS
// =========================================================

function openShipmentDetails(
    shipmentId
) {

    const shipment =
        getCurrentDriverShipments()
            .find(

                item =>
                    item.id ===
                    shipmentId

            );


    if (
        !shipment
    ) {

        return;

    }


    selectedShipmentId =
        shipment.id;


    if (
        deliveryShipmentNumber
    ) {

        deliveryShipmentNumber.textContent =
            `משלוח #${shipment.shipmentNumber || ""}`;

    }


    if (
        deliveryCustomerName
    ) {

        deliveryCustomerName.textContent =
            shipment.customer ||
            "לקוח";

    }


    if (
        deliveryAddress
    ) {

        deliveryAddress.textContent =
            getDriverShipmentMainAddress(
                shipment
            );

    }


    if (
        deliveryBuildingDetails
    ) {

        deliveryBuildingDetails.textContent =
            getDriverBuildingDetails(
                shipment
            );

    }


    if (
        deliveryNotes
    ) {

        deliveryNotes.textContent =
            shipment.notes ||
            "ללא הערות";

    }


    const phone =
        shipment.phone ||
        "";


    if (
        deliveryPhone
    ) {

        deliveryPhone.textContent =
            phone ||
            "לא הוזן טלפון";


        deliveryPhone.href =
            phone

                ? `tel:${phone}`

                : "#";

    }


    if (
        callCustomerButton
    ) {

        callCustomerButton.href =
            phone

                ? `tel:${phone}`

                : "#";


        callCustomerButton.style.opacity =
            phone
                ? "1"
                : "0.45";

    }


    if (
        navigationOptions
    ) {

        navigationOptions
            .classList
            .add(
                "hidden"
            );

    }


    if (
        deliveryDetailsOverlay
    ) {

        deliveryDetailsOverlay
            .classList
            .remove(
                "hidden"
            );

    }

}


// =========================================================
// CLOSE DETAILS
// =========================================================

function closeShipmentDetails() {

    selectedShipmentId =
        null;


    if (
        deliveryDetailsOverlay
    ) {

        deliveryDetailsOverlay
            .classList
            .add(
                "hidden"
            );

    }


    if (
        navigationOptions
    ) {

        navigationOptions
            .classList
            .add(
                "hidden"
            );

    }

}


if (
    closeDeliveryDetailsButton
) {

    closeDeliveryDetailsButton
        .addEventListener(

            "click",

            closeShipmentDetails

        );

}


// =========================================================
// NAVIGATION OPTIONS
// =========================================================

if (
    openNavigationButton
) {

    openNavigationButton
        .addEventListener(

            "click",

            function () {

                if (
                    navigationOptions
                ) {

                    navigationOptions
                        .classList
                        .toggle(
                            "hidden"
                        );

                }

            }

        );

}


// =========================================================
// GET SELECTED SHIPMENT
// =========================================================

function getSelectedShipment() {

    if (
        !selectedShipmentId
    ) {

        return null;

    }


    return getCurrentDriverShipments()
        .find(

            shipment =>
                shipment.id ===
                selectedShipmentId

        );

}


// =========================================================
// WAZE
// =========================================================

if (
    openWazeButton
) {

    openWazeButton
        .addEventListener(

            "click",

            function () {

                const shipment =
                    getSelectedShipment();


                if (
                    !shipment
                ) {

                    return;

                }


                const address =
                    getDriverShipmentMainAddress(
                        shipment
                    );


                const url =
                    "https://waze.com/ul?q=" +
                    encodeURIComponent(
                        address
                    ) +
                    "&navigate=yes";


                window.open(
                    url,
                    "_blank"
                );

            }

        );

}


// =========================================================
// GOOGLE MAPS
// =========================================================

if (
    openGoogleMapsButton
) {

    openGoogleMapsButton
        .addEventListener(

            "click",

            function () {

                const shipment =
                    getSelectedShipment();


                if (
                    !shipment
                ) {

                    return;

                }


                const address =
                    getDriverShipmentMainAddress(
                        shipment
                    );


                const url =
                    "https://www.google.com/maps/dir/?api=1&destination=" +
                    encodeURIComponent(
                        address
                    );


                window.open(
                    url,
                    "_blank"
                );

            }

        );

}


// =========================================================
// MARK DELIVERED
// =========================================================

if (
    markDeliveredButton
) {

    markDeliveredButton
        .addEventListener(

            "click",

            function () {

                if (
                    !selectedShipmentId
                ) {

                    return;

                }


                const shipments =
                    getDriverAllShipments();


                const index =
                    shipments.findIndex(

                        shipment =>
                            shipment.id ===
                            selectedShipmentId

                    );


                if (
                    index ===
                    -1
                ) {

                    return;

                }


                const rate =
                    Number(
                        currentUser.driverRate ||
                        currentUser.rate ||
                        0
                    );


                shipments[
                    index
                ].status =
                    "נמסר";


                shipments[
                    index
                ].deliveredAt =
                    new Date()
                        .toISOString();


                shipments[
                    index
                ].failedAt =
                    null;


                shipments[
                    index
                ].failedReason =
                    "";


                shipments[
                    index
                ].deliveryRate =
                    rate;


                shipments[
                    index
                ].deliveryAmount =
                    rate;


                shipments[
                    index
                ].deliveredBy =
                    getCurrentDriverId();


                saveDriverAllShipments(
                    shipments
                );


                closeShipmentDetails();


                renderDriverShipments();

            }

        );

}


// =========================================================
// MARK FAILED
// =========================================================

if (
    markFailedButton
) {

    markFailedButton
        .addEventListener(

            "click",

            function () {

                if (
                    !selectedShipmentId
                ) {

                    return;

                }


                const reason =
                    prompt(
                        "למה המשלוח לא נמסר?"
                    );


                if (
                    reason ===
                    null
                ) {

                    return;

                }


                const shipments =
                    getDriverAllShipments();


                const index =
                    shipments.findIndex(

                        shipment =>
                            shipment.id ===
                            selectedShipmentId

                    );


                if (
                    index ===
                    -1
                ) {

                    return;

                }


                shipments[
                    index
                ].status =
                    "לא נמסר";


                shipments[
                    index
                ].failedAt =
                    new Date()
                        .toISOString();


                shipments[
                    index
                ].failedReason =
                    reason.trim();


                shipments[
                    index
                ].deliveryAmount =
                    0;


                shipments[
                    index
                ].deliveredAt =
                    null;


                saveDriverAllShipments(
                    shipments
                );


                closeShipmentDetails();


                renderDriverShipments();

            }

        );

}


// =========================================================
// ROUTE PLANNER TOGGLE
// =========================================================

if (
    toggleRoutePlannerButton
) {

    toggleRoutePlannerButton
        .addEventListener(

            "click",

            function () {

                if (
                    routePlannerSection
                ) {

                    routePlannerSection
                        .classList
                        .toggle(
                            "hidden"
                        );

                }

            }

        );

}


// =========================================================
// LOAD ROUTE SETTINGS
// =========================================================

function loadRouteSettings() {

    const saved =
        localStorage.getItem(
            DRIVER_ROUTE_STORAGE_KEY
        );


    if (
        !saved
    ) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        if (
            routeDate
        ) {

            routeDate.value =
                today;

        }


        return;

    }


    try {

        const settings =
            JSON.parse(
                saved
            );


        if (
            routeDate
        ) {

            routeDate.value =
                settings.date ||
                "";

        }


        if (
            routeStartTime
        ) {

            routeStartTime.value =
                settings.startTime ||
                "";

        }


        if (
            routeStartAddress
        ) {

            routeStartAddress.value =
                settings.startAddress ||
                "";

        }


        if (
            routeEndAddress
        ) {

            routeEndAddress.value =
                settings.endAddress ||
                "";

        }

    }

    catch (
        error
    ) {

        console.error(
            "Failed loading route settings",
            error
        );

    }

}


// =========================================================
// SAVE ROUTE SETTINGS
// =========================================================

if (
    saveRouteSettingsButton
) {

    saveRouteSettingsButton
        .addEventListener(

            "click",

            function () {

                const settings = {

                    date:
                        routeDate
                            ? routeDate.value
                            : "",

                    startTime:
                        routeStartTime
                            ? routeStartTime.value
                            : "",

                    startAddress:
                        routeStartAddress
                            ? routeStartAddress.value.trim()
                            : "",

                    endAddress:
                        routeEndAddress
                            ? routeEndAddress.value.trim()
                            : ""

                };


                localStorage.setItem(

                    DRIVER_ROUTE_STORAGE_KEY,

                    JSON.stringify(
                        settings
                    )

                );


                if (
                    routePlannerMessage
                ) {

                    routePlannerMessage.textContent =
                        "הגדרות המסלול נשמרו. בשלב הבא נחבר אופטימיזציה של Google Maps.";

                }

            }

        );

}


// =========================================================
// REPORTS
// =========================================================

if (
    driverReportsButton
) {

    driverReportsButton
        .addEventListener(

            "click",

            function () {

                alert(
                    "מסך הדוחות וההכנסות יתווסף בשלב הבא."
                );

            }

        );

}


// =========================================================
// INITIALIZE
// =========================================================

initializeDriverHeader();

loadRouteSettings();

renderDriverShipments();