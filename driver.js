// =========================================================
// DRIVER APP - SUPABASE
// =========================================================


// =========================================================
// CREATE SUPABASE CLIENT
// =========================================================

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// STORAGE
// =========================================================

const CURRENT_USER_STORAGE_KEY =
    "delivery_system_current_user";

const DRIVER_ROUTE_STORAGE_KEY =
    "delivery_system_driver_route_settings";


// =========================================================
// GLOBAL STATE
// =========================================================

let currentAuthUser =
    null;

let currentProfile =
    null;

let driverShipments =
    [];

let selectedShipmentId =
    null;


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

const shipmentListSubtitle =
    document.getElementById(
        "shipmentListSubtitle"
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

const deliveryEta =
    document.getElementById(
        "deliveryEta"
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
// AUTH
// =========================================================

async function loadAuthenticatedUser() {

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .getSession();


    if (
        error
    ) {

        console.error(
            "Failed loading Supabase session:",
            error
        );

        redirectToLogin();

        return false;

    }


    if (
        !data.session ||
        !data.session.user
    ) {

        redirectToLogin();

        return false;

    }


    currentAuthUser =
        data.session.user;


    return true;

}


// =========================================================
// LOAD CURRENT PROFILE
// =========================================================

async function loadCurrentProfile() {

    if (
        !currentAuthUser
    ) {

        return false;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "profiles"
            )
            .select(
                `
                id,
                username,
                full_name,
                phone,
                role,
                status,
                driver_rate,
                notes
                `
            )
            .eq(
                "id",
                currentAuthUser.id
            )
            .single();


    if (
        error
    ) {

        console.error(
            "Failed loading profile:",
            error
        );

        return false;

    }


    if (
        !data ||
        data.role !==
            "DRIVER" ||
        data.status !==
            "פעיל"
    ) {

        await supabaseClient.auth
            .signOut();


        redirectToLogin();

        return false;

    }


    currentProfile =
        data;


    saveCurrentUserSession();


    return true;

}


// =========================================================
// SAVE APP SESSION
// =========================================================

function saveCurrentUserSession() {

    if (
        !currentProfile ||
        !currentAuthUser
    ) {

        return;

    }


    const currentUser = {

        id:
            currentProfile.id,

        driverId:
            currentProfile.id,

        username:
            currentProfile.username ||
            "",

        fullName:
            currentProfile.full_name ||
            "",

        phone:
            currentProfile.phone ||
            "",

        role:
            currentProfile.role,

        status:
            currentProfile.status,

        driverRate:
            Number(
                currentProfile.driver_rate ||
                0
            ),

        notes:
            currentProfile.notes ||
            "",

        email:
            currentAuthUser.email ||
            ""

    };


    sessionStorage.setItem(

        CURRENT_USER_STORAGE_KEY,

        JSON.stringify(
            currentUser
        )

    );

}


// =========================================================
// LOGIN REDIRECT
// =========================================================

function redirectToLogin() {

    sessionStorage.removeItem(
        CURRENT_USER_STORAGE_KEY
    );


    window.location.href =
        "login.html";

}


// =========================================================
// HEADER
// =========================================================

function initializeDriverHeader() {

    if (
        driverNameElement
    ) {

        driverNameElement.textContent =
            currentProfile.full_name ||
            currentProfile.username ||
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

    logoutButton.addEventListener(

        "click",

        async function () {

            await supabaseClient.auth
                .signOut();


            sessionStorage.removeItem(
                CURRENT_USER_STORAGE_KEY
            );


            window.location.href =
                "login.html";

        }

    );

}


// =========================================================
// ADDRESS
// =========================================================

function getShipmentMainAddress(
    shipment
) {

    const mainAddress =

        `${shipment.street || ""} ${shipment.house_number || ""}`

            .replace(
                /\s+/g,
                " "
            )

            .trim();


    if (
        shipment.city
    ) {

        return (
            `${mainAddress}, ${shipment.city}`
        );

    }


    return mainAddress;

}


// =========================================================
// BUILDING DETAILS
// =========================================================

function getShipmentBuildingDetails(
    shipment
) {

    const parts =
        [];


    if (
        shipment.address_type &&
        shipment.address_type !==
            "אחר"
    ) {

        parts.push(
            shipment.address_type
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
        parts.join(" • ") ||
        "ללא פרטים נוספים"
    );

}


// =========================================================
// STATUS CLASS
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
// LOAD SHIPMENTS FROM SUPABASE
// =========================================================

async function loadDriverShipments() {

    if (
        !currentProfile
    ) {

        return;

    }


    if (
        shipmentListSubtitle
    ) {

        shipmentListSubtitle.textContent =
            "טוען משלוחים...";

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "shipments"
            )
            .select(
                `
                id,
                shipment_number,
                barcode,
                customer,
                phone,
                city,
                street,
                house_number,
                entrance,
                floor,
                apartment,
                address_type,
                notes,
                driver_id,
                driver_name,
                status,
                created_at,
                delivered_at,
                failed_at,
                failed_reason,
                delivery_rate,
                delivery_amount,
                created_by
                `
            )
            .eq(
                "driver_id",
                currentProfile.id
            )
            .order(
                "created_at",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "Failed loading shipments:",
            error
        );


        if (
            shipmentListSubtitle
        ) {

            shipmentListSubtitle.textContent =
                "שגיאה בטעינת המשלוחים";

        }


        return;

    }


    driverShipments =
        data ||
        [];


    if (
        shipmentListSubtitle
    ) {

        shipmentListSubtitle.textContent =
            "כל המשלוחים המשויכים אליך";

    }


    renderDriverShipments();

}


// =========================================================
// COUNTERS
// =========================================================

function updateDriverCounters() {

    const total =
        driverShipments.length;


    const delivered =
        driverShipments.filter(

            shipment =>
                shipment.status ===
                "נמסר"

        ).length;


    const failed =
        driverShipments.filter(

            shipment =>
                shipment.status ===
                "לא נמסר"

        ).length;


    const remaining =
        driverShipments.filter(

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
        remainingShipmentsElement
    ) {

        remainingShipmentsElement.textContent =
            remaining;

    }


    if (
        failedShipmentsElement
    ) {

        failedShipmentsElement.textContent =
            failed;

    }


    if (
        shipmentCountBadge
    ) {

        shipmentCountBadge.textContent =
            total;

    }

}


// =========================================================
// RENDER SHIPMENTS
// =========================================================

function renderDriverShipments() {

    if (
        !driverShipmentsList
    ) {

        return;

    }


    driverShipmentsList.innerHTML =
        "";


    if (
        driverShipments.length ===
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


    driverShipments.forEach(

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
                            #${shipment.shipment_number || ""}
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

                    ${getShipmentMainAddress(
                        shipment
                    )}

                </div>


                <div class="shipment-card-phone">

                    📞 ${phone}

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


    addShipmentModal.classList
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


    addShipmentModal.classList
        .add(
            "hidden"
        );

}


if (
    addShipmentButton
) {

    addShipmentButton.addEventListener(

        "click",

        openAddShipmentModal

    );

}


if (
    closeAddShipmentModal
) {

    closeAddShipmentModal.addEventListener(

        "click",

        closeDriverAddShipmentModal

    );

}


if (
    cancelAddShipmentButton
) {

    cancelAddShipmentButton.addEventListener(

        "click",

        closeDriverAddShipmentModal

    );

}


// =========================================================
// CREATE SHIPMENT NUMBER
// =========================================================

function createShipmentNumber() {

    return (
        "D" +
        Date.now()
            .toString()
            .slice(
                -8
            )
    );

}


// =========================================================
// ADD SHIPMENT TO SUPABASE
// =========================================================

if (
    driverAddShipmentForm
) {

    driverAddShipmentForm.addEventListener(

        "submit",

        async function (
            event
        ) {

            event.preventDefault();


            if (
                !currentProfile
            ) {

                return;

            }


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


            const newShipment = {

                shipment_number:
                    createShipmentNumber(),

                barcode:
                    null,

                customer:
                    customer ||
                    "לקוח",

                phone:
                    phone ||
                    null,

                city:
                    city,

                street:
                    street,

                house_number:
                    houseNumber,

                entrance:
                    entrance ||
                    null,

                floor:
                    floor ||
                    null,

                apartment:
                    apartment ||
                    null,

                address_type:
                    "אחר",

                notes:
                    notes ||
                    null,

                driver_id:
                    currentProfile.id,

                driver_name:
                    currentProfile.full_name ||
                    currentProfile.username ||
                    "",

                status:
                    "משויך",

                delivery_rate:
                    Number(
                        currentProfile.driver_rate ||
                        0
                    ),

                delivery_amount:
                    null,

                created_by:
                    currentProfile.id

            };


            const submitButton =
                driverAddShipmentForm
                    .querySelector(
                        'button[type="submit"]'
                    );


            if (
                submitButton
            ) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "שומר...";

            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "shipments"
                    )
                    .insert(
                        newShipment
                    )
                    .select()
                    .single();


            if (
                submitButton
            ) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "הוסף משלוח";

            }


            if (
                error
            ) {

                console.error(
                    "Failed creating shipment:",
                    error
                );


                alert(
                    "לא ניתן היה לשמור את המשלוח."
                );

                return;

            }


            driverAddShipmentForm.reset();


            closeDriverAddShipmentModal();


            driverShipments.push(
                data
            );


            renderDriverShipments();

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


    return driverShipments.find(

        shipment =>
            shipment.id ===
            selectedShipmentId

    ) || null;

}


// =========================================================
// OPEN SHIPMENT DETAILS
// =========================================================

function openShipmentDetails(
    shipmentId
) {

    const shipment =
        driverShipments.find(

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
            `משלוח #${shipment.shipment_number || ""}`;

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
            getShipmentMainAddress(
                shipment
            );

    }


    if (
        deliveryBuildingDetails
    ) {

        deliveryBuildingDetails.textContent =
            getShipmentBuildingDetails(
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


    if (
        deliveryEta
    ) {

        deliveryEta.textContent =
            "עדיין לא חושב";

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

        navigationOptions.classList
            .add(
                "hidden"
            );

    }


    if (
        deliveryDetailsOverlay
    ) {

        deliveryDetailsOverlay.classList
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

        deliveryDetailsOverlay.classList
            .add(
                "hidden"
            );

    }


    if (
        navigationOptions
    ) {

        navigationOptions.classList
            .add(
                "hidden"
            );

    }

}


if (
    closeDeliveryDetailsButton
) {

    closeDeliveryDetailsButton.addEventListener(

        "click",

        closeShipmentDetails

    );

}


// =========================================================
// NAVIGATION
// =========================================================

if (
    openNavigationButton
) {

    openNavigationButton.addEventListener(

        "click",

        function () {

            if (
                navigationOptions
            ) {

                navigationOptions.classList
                    .toggle(
                        "hidden"
                    );

            }

        }

    );

}


// =========================================================
// WAZE
// =========================================================

if (
    openWazeButton
) {

    openWazeButton.addEventListener(

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
                getShipmentMainAddress(
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

    openGoogleMapsButton.addEventListener(

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
                getShipmentMainAddress(
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

    markDeliveredButton.addEventListener(

        "click",

        async function () {

            const shipment =
                getSelectedShipment();


            if (
                !shipment
            ) {

                return;

            }


            const rate =
                Number(
                    currentProfile.driver_rate ||
                    shipment.delivery_rate ||
                    0
                );


            const deliveredAt =
                new Date()
                    .toISOString();


            const {
                error
            } =
                await supabaseClient
                    .from(
                        "shipments"
                    )
                    .update(
                        {
                            status:
                                "נמסר",

                            delivered_at:
                                deliveredAt,

                            failed_at:
                                null,

                            failed_reason:
                                null,

                            delivery_rate:
                                rate,

                            delivery_amount:
                                rate
                        }
                    )
                    .eq(
                        "id",
                        shipment.id
                    );


            if (
                error
            ) {

                console.error(
                    "Failed marking shipment delivered:",
                    error
                );


                alert(
                    "לא ניתן היה לעדכן את המשלוח."
                );

                return;

            }


            shipment.status =
                "נמסר";

            shipment.delivered_at =
                deliveredAt;

            shipment.failed_at =
                null;

            shipment.failed_reason =
                null;

            shipment.delivery_rate =
                rate;

            shipment.delivery_amount =
                rate;


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

    markFailedButton.addEventListener(

        "click",

        async function () {

            const shipment =
                getSelectedShipment();


            if (
                !shipment
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


            const failedAt =
                new Date()
                    .toISOString();


            const {
                error
            } =
                await supabaseClient
                    .from(
                        "shipments"
                    )
                    .update(
                        {
                            status:
                                "לא נמסר",

                            failed_at:
                                failedAt,

                            failed_reason:
                                reason.trim(),

                            delivered_at:
                                null,

                            delivery_amount:
                                0
                        }
                    )
                    .eq(
                        "id",
                        shipment.id
                    );


            if (
                error
            ) {

                console.error(
                    "Failed marking shipment failed:",
                    error
                );


                alert(
                    "לא ניתן היה לעדכן את המשלוח."
                );

                return;

            }


            shipment.status =
                "לא נמסר";

            shipment.failed_at =
                failedAt;

            shipment.failed_reason =
                reason.trim();

            shipment.delivered_at =
                null;

            shipment.delivery_amount =
                0;


            closeShipmentDetails();


            renderDriverShipments();

        }

    );

}


// =========================================================
// ROUTE PLANNER
// =========================================================

if (
    toggleRoutePlannerButton
) {

    toggleRoutePlannerButton.addEventListener(

        "click",

        function () {

            if (
                routePlannerSection
            ) {

                routePlannerSection.classList
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

    const storageKey =
        currentProfile

            ? `${DRIVER_ROUTE_STORAGE_KEY}_${currentProfile.id}`

            : DRIVER_ROUTE_STORAGE_KEY;


    const saved =
        localStorage.getItem(
            storageKey
        );


    if (
        !saved
    ) {

        if (
            routeDate
        ) {

            const now =
                new Date();


            const localDate =
                new Date(
                    now.getTime() -
                    now.getTimezoneOffset() *
                    60000
                )
                    .toISOString()
                    .split(
                        "T"
                    )[0];


            routeDate.value =
                localDate;

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
            "Failed loading route settings:",
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

    saveRouteSettingsButton.addEventListener(

        "click",

        function () {

            if (
                !currentProfile
            ) {

                return;

            }


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


            const storageKey =
                `${DRIVER_ROUTE_STORAGE_KEY}_${currentProfile.id}`;


            localStorage.setItem(

                storageKey,

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

    driverReportsButton.addEventListener(

        "click",

        function () {

            alert(
                "מסך הדוחות וההכנסות יחובר ל-Supabase בשלב הבא."
            );

        }

    );

}


// =========================================================
// INITIALIZE DRIVER APP
// =========================================================

async function initializeDriverApp() {

    const authenticated =
        await loadAuthenticatedUser();


    if (
        !authenticated
    ) {

        return;

    }


    const profileLoaded =
        await loadCurrentProfile();


    if (
        !profileLoaded
    ) {

        return;

    }


    initializeDriverHeader();


    loadRouteSettings();


    await loadDriverShipments();

}


// =========================================================
// START
// =========================================================

initializeDriverApp();