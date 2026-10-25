// =========================================================
// DELIVERY SYSTEM
// WAREHOUSE + SHIPMENTS - SUPABASE
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

let supabaseClient =
    null;


if (
    typeof supabase !== "undefined" &&
    typeof SUPABASE_URL !== "undefined" &&
    typeof SUPABASE_PUBLISHABLE_KEY !== "undefined"
) {

    supabaseClient =
        supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

}


// =========================================================
// GLOBAL STATE
// =========================================================

let currentAuthUser =
    null;

let currentProfile =
    null;

let systemProfiles =
    [];

let shipmentsCache =
    [];

let duplicateScans =
    0;


// =========================================================
// PAGE DETECTION
// =========================================================

const isWarehousePage =
    Boolean(
        document.getElementById(
            "barcodeInput"
        )
    );


const isShipmentsPage =
    Boolean(
        document.getElementById(
            "shipmentsTableBody"
        )
    );


// =========================================================
// MOCK BARCODE DATABASE
// =========================================================

const mockShipmentsDatabase = {

    "72900100001": {

        shipmentNumber:
            "100401",

        customer:
            "משה לוי",

        phone:
            "050-1112233",

        city:
            "ראשון לציון",

        street:
            "רוטשילד",

        houseNumber:
            "44",

        entrance:
            "",

        floor:
            "",

        apartment:
            "",

        addressType:
            "בית פרטי",

        notes:
            ""

    },


    "72900100002": {

        shipmentNumber:
            "100402",

        customer:
            "דנה כהן",

        phone:
            "052-3334455",

        city:
            "חולון",

        street:
            "סוקולוב",

        houseNumber:
            "18",

        entrance:
            "ב",

        floor:
            "3",

        apartment:
            "12",

        addressType:
            "בניין",

        notes:
            "להתקשר לפני הגעה"

    },


    "72900100003": {

        shipmentNumber:
            "100403",

        customer:
            "יוסי ישראלי",

        phone:
            "054-5556677",

        city:
            "פתח תקווה",

        street:
            "חיים עוזר",

        houseNumber:
            "12",

        entrance:
            "א",

        floor:
            "2",

        apartment:
            "6",

        addressType:
            "בניין",

        notes:
            ""

    },


    "72900100004": {

        shipmentNumber:
            "100404",

        customer:
            "נועה אברהם",

        phone:
            "053-7778899",

        city:
            "תל אביב",

        street:
            "דיזנגוף",

        houseNumber:
            "91",

        entrance:
            "",

        floor:
            "4",

        apartment:
            "15",

        addressType:
            "בניין",

        notes:
            "קוד כניסה 2580#"

    },


    "72900100005": {

        shipmentNumber:
            "100405",

        customer:
            "אורן לוי",

        phone:
            "050-9988776",

        city:
            "רמת גן",

        street:
            "ביאליק",

        houseNumber:
            "31",

        entrance:
            "",

        floor:
            "",

        apartment:
            "",

        addressType:
            "עסק",

        notes:
            "קבלה בקומת כניסה"

    }

};


// =========================================================
// AUTH
// =========================================================

async function loadAuthenticatedUser() {

    if (
        !supabaseClient
    ) {

        console.error(
            "Supabase client is not available."
        );

        return false;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        error
    ) {

        console.error(
            "Failed loading session:",
            error
        );

        return false;

    }


    if (
        !data.session ||
        !data.session.user
    ) {

        window.location.href =
            "login.html";

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


    currentProfile =
        data;


    if (
        currentProfile.status !==
        "פעיל"
    ) {

        await supabaseClient.auth
            .signOut();


        window.location.href =
            "login.html";


        return false;

    }


    return true;

}


// =========================================================
// MANAGEMENT AUTHORIZATION
// =========================================================

function authorizeManagementPage() {

    if (
        !currentProfile
    ) {

        return false;

    }


    const allowed =
        currentProfile.role ===
            "ADMIN"

        ||

        currentProfile.role ===
            "WAREHOUSE";


    if (
        !allowed
    ) {

        if (
            currentProfile.role ===
            "DRIVER"
        ) {

            window.location.href =
                "driver.html";

        }

        else {

            window.location.href =
                "login.html";

        }


        return false;

    }


    return true;

}


// =========================================================
// LOAD SYSTEM PROFILES
// =========================================================

async function loadSystemProfiles() {

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
            .order(
                "full_name",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "Failed loading profiles:",
            error
        );

        systemProfiles =
            [];

        return;

    }


    systemProfiles =
        data ||
        [];

}


// =========================================================
// DRIVERS
// =========================================================

function getSystemDrivers() {

    return systemProfiles
        .filter(

            profile =>
                profile.role ===
                "DRIVER"

        );

}


function getActiveDrivers() {

    return getSystemDrivers()
        .filter(

            profile =>
                profile.status ===
                "פעיל"

        );

}


function findSystemDriverById(
    driverId
) {

    return getSystemDrivers()
        .find(

            driver =>
                String(
                    driver.id
                )
                ===
                String(
                    driverId
                )

        ) || null;

}


// =========================================================
// LOAD SHIPMENTS
// =========================================================

async function loadShipments() {

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

        shipmentsCache =
            [];

        return false;

    }


    shipmentsCache =
        data ||
        [];


    return true;

}


// =========================================================
// ADDRESS HELPERS
// =========================================================

function getMainAddress(
    shipment
) {

    return (

        `${shipment.street || ""} ${shipment.house_number || ""}`

    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


function getBuildingDetails(
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
        parts.join(
            " • "
        )
        ||
        "-"
    );

}


// =========================================================
// STATUS CLASS
// =========================================================

function getStatusClass(
    status
) {

    switch (
        status
    ) {

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
// TODAY HELPER
// =========================================================

function shipmentCreatedToday(
    shipment
) {

    if (
        !shipment.created_at
    ) {

        return false;

    }


    const shipmentDate =
        new Date(
            shipment.created_at
        );


    const today =
        new Date();


    return (

        shipmentDate.getFullYear() ===
            today.getFullYear()

        &&

        shipmentDate.getMonth() ===
            today.getMonth()

        &&

        shipmentDate.getDate() ===
            today.getDate()

    );

}


// =========================================================
// =========================================================
// WAREHOUSE
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


const warehouseUnassignedCount =
    document.getElementById(
        "warehouseUnassignedCount"
    );


const warehouseAssignedCount =
    document.getElementById(
        "warehouseAssignedCount"
    );


const duplicateCount =
    document.getElementById(
        "duplicateCount"
    );


const scannerStatus =
    document.getElementById(
        "scannerStatus"
    );


// =========================================================
// WAREHOUSE COUNTERS
// =========================================================

function updateWarehouseCounters() {

    const receivedToday =
        shipmentsCache.filter(
            shipmentCreatedToday
        ).length;


    const unassigned =
        shipmentsCache.filter(

            shipment =>
                !shipment.driver_id

        ).length;


    const assigned =
        shipmentsCache.filter(

            shipment =>
                Boolean(
                    shipment.driver_id
                )

        ).length;


    if (
        receivedTodayCount
    ) {

        receivedTodayCount.textContent =
            receivedToday;

    }


    if (
        warehouseUnassignedCount
    ) {

        warehouseUnassignedCount.textContent =
            unassigned;

    }


    if (
        warehouseAssignedCount
    ) {

        warehouseAssignedCount.textContent =
            assigned;

    }


    if (
        duplicateCount
    ) {

        duplicateCount.textContent =
            duplicateScans;

    }

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

        250

    );

}


// =========================================================
// SCAN MESSAGES
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
                משלוח #${shipment.shipment_number || ""}
                •
                ${shipment.customer || ""}
                •
                ${getMainAddress(shipment)},
                ${shipment.city || ""}
            </p>

            <small>
                ברקוד:
                ${shipment.barcode || ""}
            </small>

        </div>

    `;

}


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

        </div>

    `;

}


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
            shipment.created_at
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
            #${shipment.shipment_number || ""}
        </td>

        <td>
            ${shipment.barcode || ""}
        </td>

        <td>
            ${shipment.customer || ""}
        </td>

        <td>
            ${shipment.phone || ""}
        </td>

        <td>
            ${shipment.city || ""}
        </td>

        <td>
            ${getMainAddress(
                shipment
            )}
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

    `;


    recentShipmentsTable.prepend(
        row
    );

}


// =========================================================
// RENDER RECENT SHIPMENTS
// =========================================================

function renderWarehouseRecentShipments() {

    if (
        !recentShipmentsTable
    ) {

        return;

    }


    recentShipmentsTable.innerHTML =
        "";


    if (
        shipmentsCache.length ===
        0
    ) {

        recentShipmentsTable.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#64748b;
                    "
                >
                    עדיין אין משלוחים במערכת
                </td>

            </tr>

        `;


        return;

    }


    shipmentsCache
        .slice()
        .reverse()
        .slice(
            0,
            20
        )
        .forEach(
            addWarehouseShipmentToTable
        );

}


// =========================================================
// PROCESS BARCODE
// =========================================================

async function processBarcode() {

    if (
        !barcodeInput
    ) {

        return;

    }


    const barcode =
        barcodeInput.value
            .trim();


    if (
        !barcode
    ) {

        showScanError(
            "יש לסרוק או להזין ברקוד."
        );

        return;

    }


    setScannerWorking();


    const alreadyExists =
        shipmentsCache.some(

            shipment =>
                shipment.barcode ===
                barcode

        );


    if (
        alreadyExists
    ) {

        duplicateScans++;


        updateWarehouseCounters();


        showDuplicateBarcode(
            barcode
        );


        resetScanner();


        return;

    }


    const source =
        mockShipmentsDatabase[
            barcode
        ];


    if (
        !source
    ) {

        showUnknownBarcode(
            barcode
        );


        resetScanner();


        return;

    }


    const newShipment = {

        shipment_number:
            source.shipmentNumber,

        barcode:
            barcode,

        customer:
            source.customer,

        phone:
            source.phone,

        city:
            source.city,

        street:
            source.street,

        house_number:
            source.houseNumber,

        entrance:
            source.entrance ||
            null,

        floor:
            source.floor ||
            null,

        apartment:
            source.apartment ||
            null,

        address_type:
            source.addressType ||
            "אחר",

        notes:
            source.notes ||
            null,

        driver_id:
            null,

        driver_name:
            null,

        status:
            "ממתין לשיוך",

        created_by:
            currentProfile.id

    };


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
        error
    ) {

        console.error(
            "Barcode insert failed:",
            error
        );


        showScanError(
            "לא ניתן לשמור את המשלוח."
        );


        resetScanner();


        return;

    }


    shipmentsCache.push(
        data
    );


    updateWarehouseCounters();


    renderWarehouseRecentShipments();


    showScanSuccess(
        data
    );


    resetScanner();

}


// =========================================================
// BARCODE EVENTS
// =========================================================

if (
    barcodeInput
) {

    barcodeInput.addEventListener(

        "keydown",

        function (
            event
        ) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                processBarcode();

            }

        }

    );

}


if (
    scanButton
) {

    scanButton.addEventListener(

        "click",

        processBarcode

    );

}


// =========================================================
// MANUAL WAREHOUSE MODAL
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


function closeWarehouseManualModal() {

    if (
        manualDeliveryModal
    ) {

        manualDeliveryModal
            .classList
            .add(
                "hidden"
            );

    }

}


if (
    manualDeliveryButton &&
    manualDeliveryModal
) {

    manualDeliveryButton.addEventListener(

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

    closeManualModal.addEventListener(

        "click",

        closeWarehouseManualModal

    );

}


if (
    cancelManualDelivery
) {

    cancelManualDelivery.addEventListener(

        "click",

        closeWarehouseManualModal

    );

}


// =========================================================
// MANUAL WAREHOUSE INSERT
// =========================================================

if (
    manualDeliveryForm
) {

    manualDeliveryForm.addEventListener(

        "submit",

        async function (
            event
        ) {

            event.preventDefault();


            const barcode =
                document
                    .getElementById(
                        "manualBarcode"
                    )
                    .value
                    .trim();


            const duplicate =
                shipmentsCache.some(

                    shipment =>
                        shipment.barcode ===
                        barcode

                );


            if (
                duplicate
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
                address.split(
                    " "
                );


            const houseNumber =
                addressParts.pop() ||
                "";


            const street =
                addressParts.join(
                    " "
                );


            const newShipment = {

                shipment_number:
                    document
                        .getElementById(
                            "manualShipmentNumber"
                        )
                        .value
                        .trim(),

                barcode:
                    barcode ||
                    null,

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
                        .trim()
                    ||
                    null,

                city:
                    document
                        .getElementById(
                            "manualCity"
                        )
                        .value
                        .trim(),

                street:
                    street,

                house_number:
                    houseNumber,

                entrance:
                    null,

                floor:
                    null,

                apartment:
                    null,

                address_type:
                    "אחר",

                notes:
                    null,

                driver_id:
                    null,

                driver_name:
                    null,

                status:
                    "ממתין לשיוך",

                created_by:
                    currentProfile.id

            };


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
                error
            ) {

                console.error(
                    "Manual shipment insert failed:",
                    error
                );


                alert(
                    "לא ניתן היה לשמור את המשלוח."
                );


                return;

            }


            shipmentsCache.push(
                data
            );


            updateWarehouseCounters();


            renderWarehouseRecentShipments();


            showScanSuccess(
                data
            );


            manualDeliveryForm.reset();


            closeWarehouseManualModal();

        }

    );

}
// =========================================================
// =========================================================
// SHIPMENTS MANAGEMENT
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


const shipmentDriverSelect =
    document.getElementById(
        "shipmentDriver"
    );


// =========================================================
// DRIVER NAME
// =========================================================

function getShipmentDriverDisplayName(
    shipment
) {

    if (
        shipment.driver_name
    ) {

        return shipment.driver_name;

    }


    if (
        shipment.driver_id
    ) {

        const driver =
            findSystemDriverById(
                shipment.driver_id
            );


        if (
            driver
        ) {

            return driver.full_name;

        }

    }


    return "ללא שיוך";

}


// =========================================================
// INACTIVE DRIVER
// =========================================================

function isShipmentDriverInactive(
    shipment
) {

    if (
        !shipment.driver_id
    ) {

        return false;

    }


    const driver =
        findSystemDriverById(
            shipment.driver_id
        );


    if (
        !driver
    ) {

        return false;

    }


    return (
        driver.status !==
        "פעיל"
    );

}


// =========================================================
// DRIVER SELECTORS
// =========================================================

function populateDriverSelectors() {

    const activeDrivers =
        getActiveDrivers();


    if (
        shipmentDriverSelect
    ) {

        const currentValue =
            shipmentDriverSelect.value;


        shipmentDriverSelect.innerHTML = `

            <option value="">
                ללא שיוך
            </option>

        `;


        activeDrivers.forEach(

            driver => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    driver.id;


                option.textContent =
                    driver.full_name ||
                    driver.username ||
                    "שליח";


                shipmentDriverSelect.appendChild(
                    option
                );

            }

        );


        shipmentDriverSelect.value =
            currentValue;

    }


    if (
        driverFilter
    ) {

        const currentValue =
            driverFilter.value;


        driverFilter.innerHTML = `

            <option value="">
                כל השליחים
            </option>

            <option value="UNASSIGNED">
                ללא שיוך
            </option>

        `;


        activeDrivers.forEach(

            driver => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    driver.id;


                option.textContent =
                    driver.full_name ||
                    driver.username ||
                    "שליח";


                driverFilter.appendChild(
                    option
                );

            }

        );


        driverFilter.value =
            currentValue;

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


    const currentValue =
        cityFilter.value;


    const cities =
        [
            ...new Set(

                shipmentsCache
                    .map(
                        shipment =>
                            shipment.city
                    )
                    .filter(
                        Boolean
                    )

            )
        ]
            .sort();


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


    cityFilter.value =
        currentValue;

}


// =========================================================
// SHIPMENT COUNTERS
// =========================================================

function updateShipmentCounters() {

    const total =
        shipmentsCache.length;


    const unassigned =
        shipmentsCache.filter(

            shipment =>
                !shipment.driver_id

        ).length;


    const assigned =
        shipmentsCache.filter(

            shipment =>
                Boolean(
                    shipment.driver_id
                )

        ).length;


    const delivered =
        shipmentsCache.filter(

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
// DRIVER FILTER
// =========================================================

function shipmentMatchesDriverFilter(
    shipment,
    selectedDriver
) {

    if (
        !selectedDriver
    ) {

        return true;

    }


    if (
        selectedDriver ===
        "UNASSIGNED"
    ) {

        return (
            !shipment.driver_id
        );

    }


    return (

        String(
            shipment.driver_id ||
            ""
        )

        ===

        String(
            selectedDriver
        )

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


    const search =
        shipmentSearchInput
            ? shipmentSearchInput.value
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
        shipmentsCache.filter(

            shipment => {

                const driverName =
                    getShipmentDriverDisplayName(
                        shipment
                    );


                const searchText =
                    [

                        shipment.shipment_number,

                        shipment.barcode,

                        shipment.customer,

                        shipment.phone,

                        shipment.city,

                        shipment.street,

                        shipment.house_number,

                        driverName,

                        shipment.status

                    ]
                        .filter(
                            value =>
                                value !==
                                null &&
                                value !==
                                undefined
                        )
                        .join(
                            " "
                        )
                        .toLowerCase();


                if (
                    search &&
                    !searchText.includes(
                        search
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
                    !shipmentMatchesDriverFilter(
                        shipment,
                        selectedDriver
                    )
                ) {

                    return false;

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
        filtered.length ===
        0
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
                    getShipmentDriverDisplayName(
                        shipment
                    );


                const driverInactive =
                    isShipmentDriverInactive(
                        shipment
                    );


                row.innerHTML = `

                    <td>
                        #${shipment.shipment_number || ""}
                    </td>

                    <td>
                        ${shipment.barcode || ""}
                    </td>

                    <td>
                        <strong>
                            ${shipment.customer || ""}
                        </strong>
                    </td>

                    <td>
                        ${shipment.phone || ""}
                    </td>

                    <td>
                        ${shipment.city || ""}
                    </td>

                    <td>
                        ${getMainAddress(
                            shipment
                        )}
                    </td>

                    <td>
                        ${getBuildingDetails(
                            shipment
                        )}
                    </td>

                    <td>

                        <div>
                            ${driverText}
                        </div>

                        ${
                            driverInactive

                                ? `
                                    <div
                                        style="
                                            display:inline-block;
                                            margin-top:5px;
                                            padding:3px 7px;
                                            border-radius:7px;
                                            background:#fff7ed;
                                            color:#c2410c;
                                            font-size:11px;
                                            font-weight:700;
                                        "
                                    >
                                        ⚠️ לא פעיל
                                    </div>
                                `

                                : ""
                        }

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


                shipmentsTableBody.appendChild(
                    row
                );

            }

        );

}
// =========================================================
// FILTER EVENTS
// =========================================================

if (
    shipmentSearchInput
) {

    shipmentSearchInput.addEventListener(

        "input",

        renderShipments

    );

}


if (
    cityFilter
) {

    cityFilter.addEventListener(

        "change",

        renderShipments

    );

}


if (
    driverFilter
) {

    driverFilter.addEventListener(

        "change",

        renderShipments

    );

}


if (
    statusFilter
) {

    statusFilter.addEventListener(

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


    populateDriverSelectors();


    const editingId =
        document.getElementById(
            "editingShipmentId"
        );


    if (
        editingId
    ) {

        editingId.value =
            "";

    }


    const title =
        document.getElementById(
            "shipmentModalTitle"
        );


    if (
        title
    ) {

        title.textContent =
            "משלוח חדש";

    }


    shipmentModal.classList
        .remove(
            "hidden"
        );

}


// =========================================================
// CLOSE SHIPMENT MODAL
// =========================================================

function closeShipmentManagementModal() {

    if (
        shipmentModal
    ) {

        shipmentModal.classList
            .add(
                "hidden"
            );

    }

}


if (
    newShipmentButton
) {

    newShipmentButton.addEventListener(

        "click",

        openNewShipmentModal

    );

}


if (
    closeShipmentModal
) {

    closeShipmentModal.addEventListener(

        "click",

        closeShipmentManagementModal

    );

}


if (
    cancelShipmentButton
) {

    cancelShipmentButton.addEventListener(

        "click",

        closeShipmentManagementModal

    );

}


// =========================================================
// EDIT SHIPMENT
// =========================================================

function editShipment(
    shipmentId
) {

    const shipment =
        shipmentsCache.find(

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


    populateDriverSelectors();


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
        shipment.barcode ||
        "";


    document
        .getElementById(
            "shipmentNumber"
        )
        .value =
        shipment.shipment_number ||
        "";


    document
        .getElementById(
            "shipmentCustomer"
        )
        .value =
        shipment.customer ||
        "";


    document
        .getElementById(
            "shipmentPhone"
        )
        .value =
        shipment.phone ||
        "";


    document
        .getElementById(
            "shipmentAddressType"
        )
        .value =
        shipment.address_type ||
        "אחר";


    document
        .getElementById(
            "shipmentCity"
        )
        .value =
        shipment.city ||
        "";


    document
        .getElementById(
            "shipmentStreet"
        )
        .value =
        shipment.street ||
        "";


    document
        .getElementById(
            "shipmentHouseNumber"
        )
        .value =
        shipment.house_number ||
        "";


    document
        .getElementById(
            "shipmentEntrance"
        )
        .value =
        shipment.entrance ||
        "";


    document
        .getElementById(
            "shipmentFloor"
        )
        .value =
        shipment.floor ||
        "";


    document
        .getElementById(
            "shipmentApartment"
        )
        .value =
        shipment.apartment ||
        "";


    if (
        shipmentDriverSelect
    ) {

        shipmentDriverSelect.value =
            shipment.driver_id ||
            "";

    }


    document
        .getElementById(
            "shipmentStatus"
        )
        .value =
        shipment.status ||
        "ממתין לשיוך";


    document
        .getElementById(
            "shipmentNotes"
        )
        .value =
        shipment.notes ||
        "";


    const title =
        document.getElementById(
            "shipmentModalTitle"
        );


    if (
        title
    ) {

        title.textContent =
            "עריכת משלוח";

    }


    shipmentModal.classList
        .remove(
            "hidden"
        );

}


// =========================================================
// GEOCODE SHIPMENT AFTER ADDRESS CHANGE
// =========================================================

async function geocodeShipmentLocation(
    shipmentId
) {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "geocode-shipment",
                    {
                        body: {
                            shipment_id:
                                shipmentId
                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                "Shipment geocoding failed:",
                error
            );


            return {
                success:
                    false,
                error:
                    error
            };

        }


        if (
            !data ||
            data.success !==
            true
        ) {

            console.error(
                "Unexpected geocoding response:",
                data
            );


            return {
                success:
                    false,
                error:
                    data
            };

        }


        console.log(
            "Shipment geocoded successfully:",
            data
        );


        return {
            success:
                true,
            data:
                data
        };

    }

    catch (
        error
    ) {

        console.error(
            "Shipment geocoding exception:",
            error
        );


        return {
            success:
                false,
            error:
                error
        };

    }

}


// =========================================================
// SAVE SHIPMENT
// =========================================================

if (
    shipmentForm
) {

    shipmentForm.addEventListener(

        "submit",

        async function (
            event
        ) {

            event.preventDefault();


            const editingId =
                document
                    .getElementById(
                        "editingShipmentId"
                    )
                    .value;


            const selectedDriverId =
                shipmentDriverSelect
                    ? shipmentDriverSelect.value
                    : "";


            let selectedDriverName =
                null;


            if (
                selectedDriverId
            ) {

                const selectedDriver =
                    findSystemDriverById(
                        selectedDriverId
                    );


                if (
                    selectedDriver
                ) {

                    selectedDriverName =
                        selectedDriver.full_name ||
                        selectedDriver.username ||
                        null;

                }

            }


            let status =
                document
                    .getElementById(
                        "shipmentStatus"
                    )
                    .value;


            if (
                selectedDriverId &&
                status ===
                "ממתין לשיוך"
            ) {

                status =
                    "משויך";

            }


            if (
                !selectedDriverId &&
                status ===
                "משויך"
            ) {

                status =
                    "ממתין לשיוך";

            }


            const shipmentData = {

                shipment_number:
                    document
                        .getElementById(
                            "shipmentNumber"
                        )
                        .value
                        .trim(),

                barcode:
                    document
                        .getElementById(
                            "shipmentBarcode"
                        )
                        .value
                        .trim()
                    ||
                    null,

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
                        .trim()
                    ||
                    null,

                address_type:
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

                house_number:
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
                        .trim()
                    ||
                    null,

                floor:
                    document
                        .getElementById(
                            "shipmentFloor"
                        )
                        .value
                        .trim()
                    ||
                    null,

                apartment:
                    document
                        .getElementById(
                            "shipmentApartment"
                        )
                        .value
                        .trim()
                    ||
                    null,

                driver_id:
                    selectedDriverId ||
                    null,

                driver_name:
                    selectedDriverName,

                status:
                    status,

                notes:
                    document
                        .getElementById(
                            "shipmentNotes"
                        )
                        .value
                        .trim()
                    ||
                    null

            };


            if (
                editingId
            ) {

                const existingShipment =
                    shipmentsCache.find(

                        shipment =>
                            shipment.id ===
                            editingId

                    );


                const addressChanged =
                    Boolean(
                        existingShipment
                    )

                    &&

                    (
                        String(
                            existingShipment.city ||
                            ""
                        )
                            .trim()

                        !==

                        String(
                            shipmentData.city ||
                            ""
                        )
                            .trim()

                        ||

                        String(
                            existingShipment.street ||
                            ""
                        )
                            .trim()

                        !==

                        String(
                            shipmentData.street ||
                            ""
                        )
                            .trim()

                        ||

                        String(
                            existingShipment.house_number ||
                            ""
                        )
                            .trim()

                        !==

                        String(
                            shipmentData.house_number ||
                            ""
                        )
                            .trim()
                    );


                if (
                    status ===
                    "נמסר"
                ) {

                    shipmentData.delivered_at =
                        existingShipment &&
                        existingShipment.delivered_at

                            ? existingShipment.delivered_at

                            : new Date()
                                .toISOString();

                }

                else {

                    shipmentData.delivered_at =
                        null;

                }


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from(
                            "shipments"
                        )
                        .update(
                            shipmentData
                        )
                        .eq(
                            "id",
                            editingId
                        )
                        .select()
                        .single();


                if (
                    error
                ) {

                    console.error(
                        "Shipment update failed:",
                        error
                    );


                    alert(
                        "לא ניתן היה לעדכן את המשלוח."
                    );


                    return;

                }


                const index =
                    shipmentsCache.findIndex(

                        shipment =>
                            shipment.id ===
                            editingId

                    );


                if (
                    index !==
                    -1
                ) {

                    shipmentsCache[
                        index
                    ] =
                        data;

                }


                // =================================================
                // ADDRESS CHANGED -> GEOCODE NEW LOCATION
                // =================================================

                if (
                    addressChanged
                ) {

                    const geocodeResult =
                        await geocodeShipmentLocation(
                            editingId
                        );


                    if (
                        geocodeResult.success
                    ) {

                        console.log(
                            "Shipment location updated successfully."
                        );

                    }

                    else {

                        alert(
                            "המשלוח נשמר, אבל לא הצלחנו לאתר את הכתובת החדשה במפה.\nאפשר לנסות שוב דרך מפת הפעילות."
                        );

                    }

                }

            }

            else {

                const duplicateBarcode =
                    shipmentData.barcode

                    &&
                    shipmentsCache.some(

                        shipment =>
                            shipment.barcode ===
                            shipmentData.barcode

                    );


                if (
                    duplicateBarcode
                ) {

                    alert(
                        "ברקוד זה כבר קיים במערכת."
                    );


                    return;

                }


                shipmentData.created_by =
                    currentProfile.id;


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from(
                            "shipments"
                        )
                        .insert(
                            shipmentData
                        )
                        .select()
                        .single();


                if (
                    error
                ) {

                    console.error(
                        "Shipment insert failed:",
                        error
                    );


                    alert(
                        "לא ניתן היה ליצור את המשלוח."
                    );


                    return;

                }


                shipmentsCache.push(
                    data
                );

            }


            closeShipmentManagementModal();


            populateCityFilter();


            populateDriverSelectors();


            updateShipmentCounters();


            renderShipments();

        }

    );

}// =========================================================
// INITIALIZE WAREHOUSE
// =========================================================

async function initializeWarehousePage() {

    if (
        !isWarehousePage
    ) {

        return;

    }


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


    if (
        !authorizeManagementPage()
    ) {

        return;

    }


    await loadShipments();


    updateWarehouseCounters();


    renderWarehouseRecentShipments();


    setScannerReady();


    if (
        barcodeInput
    ) {

        barcodeInput.focus();

    }

}


// =========================================================
// INITIALIZE SHIPMENTS
// =========================================================

async function initializeShipmentsPage() {

    if (
        !isShipmentsPage
    ) {

        return;

    }


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


    if (
        !authorizeManagementPage()
    ) {

        return;

    }


    await Promise.all(
        [
            loadSystemProfiles(),
            loadShipments()
        ]
    );


    populateDriverSelectors();


    populateCityFilter();


    updateShipmentCounters();


    renderShipments();

}


// =========================================================
// START
// =========================================================

if (
    isWarehousePage
) {

    initializeWarehousePage();

}


if (
    isShipmentsPage
) {

    initializeShipmentsPage();

}