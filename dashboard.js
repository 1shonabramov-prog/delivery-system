// =========================================================
// DELIVERY SYSTEM
// DASHBOARD - SUPABASE
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

const dashboardSupabase =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// GLOBAL STATE
// =========================================================

let currentAuthUser =
    null;

let currentProfile =
    null;

let dashboardShipments =
    [];

let dashboardProfiles =
    [];


// =========================================================
// DOM ELEMENTS
// =========================================================

const sidebarUserAvatar =
    document.getElementById(
        "sidebarUserAvatar"
    );


const sidebarUserName =
    document.getElementById(
        "sidebarUserName"
    );


const sidebarUserRole =
    document.getElementById(
        "sidebarUserRole"
    );


const dashboardTotalShipments =
    document.getElementById(
        "dashboardTotalShipments"
    );


const dashboardDeliveredShipments =
    document.getElementById(
        "dashboardDeliveredShipments"
    );


const dashboardDeliveredPercent =
    document.getElementById(
        "dashboardDeliveredPercent"
    );


const dashboardOnRouteShipments =
    document.getElementById(
        "dashboardOnRouteShipments"
    );


const dashboardUnassignedShipments =
    document.getElementById(
        "dashboardUnassignedShipments"
    );


const dashboardDriversTable =
    document.getElementById(
        "dashboardDriversTable"
    );


const dashboardCitiesList =
    document.getElementById(
        "dashboardCitiesList"
    );


const dashboardSearch =
    document.getElementById(
        "dashboardSearch"
    );


// =========================================================
// REDIRECT TO LOGIN
// =========================================================

function redirectToLogin() {

    sessionStorage.removeItem(
        "delivery_system_current_user"
    );


    window.location.href =
        "login.html";

}


// =========================================================
// LOAD AUTH SESSION
// =========================================================

async function loadDashboardSession() {

    const {
        data,
        error
    } =
        await dashboardSupabase
            .auth
            .getSession();


    if (
        error
    ) {

        console.error(
            "Failed loading session:",
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

async function loadDashboardProfile() {

    if (
        !currentAuthUser
    ) {

        return false;

    }


    const {
        data,
        error
    } =
        await dashboardSupabase
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
            "Failed loading current profile:",
            error
        );


        return false;

    }


    currentProfile =
        data;


    if (
        !currentProfile ||
        currentProfile.status !==
            "פעיל"
    ) {

        await dashboardSupabase
            .auth
            .signOut();


        redirectToLogin();

        return false;

    }


    // רק מנהל או מחסן יכולים להיכנס ל-Dashboard

    if (
        currentProfile.role !==
            "ADMIN"

        &&

        currentProfile.role !==
            "WAREHOUSE"
    ) {

        if (
            currentProfile.role ===
            "DRIVER"
        ) {

            window.location.href =
                "driver.html";

        }

        else {

            redirectToLogin();

        }


        return false;

    }


    return true;

}


// =========================================================
// CURRENT USER DISPLAY
// =========================================================

function renderCurrentUser() {

    if (
        !currentProfile
    ) {

        return;

    }


    const fullName =
        currentProfile.full_name ||
        currentProfile.username ||
        "משתמש";


    if (
        sidebarUserName
    ) {

        sidebarUserName.textContent =
            fullName;

    }


    if (
        sidebarUserAvatar
    ) {

        sidebarUserAvatar.textContent =
            fullName
                .trim()
                .charAt(
                    0
                )
            ||
            "מ";

    }


    if (
        sidebarUserRole
    ) {

        switch (
            currentProfile.role
        ) {

            case "ADMIN":

                sidebarUserRole.textContent =
                    "Administrator";

                break;


            case "WAREHOUSE":

                sidebarUserRole.textContent =
                    "Warehouse";

                break;


            default:

                sidebarUserRole.textContent =
                    currentProfile.role;

        }

    }

}


// =========================================================
// LOAD ALL SHIPMENTS
// =========================================================

async function loadDashboardShipments() {

    const {
        data,
        error
    } =
        await dashboardSupabase
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
                        false
                }
            );


    if (
        error
    ) {

        console.error(
            "Failed loading dashboard shipments:",
            error
        );


        dashboardShipments =
            [];


        return false;

    }


    dashboardShipments =
        data ||
        [];


    return true;

}


// =========================================================
// LOAD PROFILES
// =========================================================

async function loadDashboardProfiles() {

    const {
        data,
        error
    } =
        await dashboardSupabase
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


        dashboardProfiles =
            [];


        return false;

    }


    dashboardProfiles =
        data ||
        [];


    return true;

}


// =========================================================
// DASHBOARD STATISTICS
// =========================================================

function renderDashboardStatistics() {

    const total =
        dashboardShipments.length;


    const delivered =
        dashboardShipments.filter(

            shipment =>
                shipment.status ===
                "נמסר"

        ).length;


    const onRoute =
        dashboardShipments.filter(

            shipment =>
                shipment.status ===
                "בדרך"

        ).length;


    const unassigned =
        dashboardShipments.filter(

            shipment =>
                !shipment.driver_id

        ).length;


    const deliveredPercent =
        total > 0

            ? Math.round(
                (
                    delivered /
                    total
                )
                *
                100
            )

            : 0;


    if (
        dashboardTotalShipments
    ) {

        dashboardTotalShipments.textContent =
            total;

    }


    if (
        dashboardDeliveredShipments
    ) {

        dashboardDeliveredShipments.textContent =
            delivered;

    }


    if (
        dashboardDeliveredPercent
    ) {

        dashboardDeliveredPercent.textContent =
            `${deliveredPercent}% מהמשלוחים`;

    }


    if (
        dashboardOnRouteShipments
    ) {

        dashboardOnRouteShipments.textContent =
            onRoute;

    }


    if (
        dashboardUnassignedShipments
    ) {

        dashboardUnassignedShipments.textContent =
            unassigned;

    }

}


// =========================================================
// DRIVER SHIPMENTS
// =========================================================

function getShipmentsForDriver(
    driverId
) {

    return dashboardShipments
        .filter(

            shipment =>
                String(
                    shipment.driver_id ||
                    ""
                )

                ===

                String(
                    driverId
                )

        );

}


// =========================================================
// DRIVER STATUS
// =========================================================

function getDriverDashboardStatus(
    driver,
    shipments
) {

    if (
        driver.status !==
        "פעיל"
    ) {

        return {
            text:
                "לא פעיל",

            className:
                "waiting"
        };

    }


    if (
        shipments.length ===
        0
    ) {

        return {
            text:
                "ללא משלוחים",

            className:
                "waiting"
        };

    }


    const unfinished =
        shipments.filter(

            shipment =>

                shipment.status !==
                    "נמסר"

                &&

                shipment.status !==
                    "לא נמסר"

        );


    if (
        unfinished.length >
        0
    ) {

        return {
            text:
                "במסלול",

            className:
                "active"
        };

    }


    return {
        text:
            "סיים",

        className:
            "completed"
    };

}


// =========================================================
// RENDER DRIVER TABLE
// =========================================================

function renderDashboardDrivers() {

    if (
        !dashboardDriversTable
    ) {

        return;

    }


    const drivers =
        dashboardProfiles.filter(

            profile =>
                profile.role ===
                "DRIVER"

        );


    dashboardDriversTable.innerHTML =
        "";


    if (
        drivers.length ===
        0
    ) {

        dashboardDriversTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#64748b;
                    "
                >
                    אין שליחים במערכת
                </td>

            </tr>

        `;


        return;

    }


    drivers.forEach(

        driver => {

            const shipments =
                getShipmentsForDriver(
                    driver.id
                );


            const delivered =
                shipments.filter(

                    shipment =>
                        shipment.status ===
                        "נמסר"

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


            const driverStatus =
                getDriverDashboardStatus(
                    driver,
                    shipments
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    ${
                        driver.full_name ||
                        driver.username ||
                        "שליח"
                    }

                    ${
                        driver.status !==
                        "פעיל"

                            ? `
                                <div
                                    style="
                                        margin-top:4px;
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
                    ${shipments.length}
                </td>


                <td>
                    ${delivered}
                </td>


                <td>
                    ${remaining}
                </td>


                <td>

                    <span
                        class="
                            status
                            ${driverStatus.className}
                        "
                    >

                        ${driverStatus.text}

                    </span>

                </td>

            `;


            dashboardDriversTable
                .appendChild(
                    row
                );

        }

    );

}


// =========================================================
// CITY STATISTICS
// =========================================================

function getCityStatistics() {

    const cityMap =
        {};


    dashboardShipments.forEach(

        shipment => {

            const city =
                shipment.city
                    ? shipment.city.trim()
                    : "";


            if (
                !city
            ) {

                return;

            }


            if (
                !cityMap[
                    city
                ]
            ) {

                cityMap[
                    city
                ] =
                    0;

            }


            cityMap[
                city
            ]++;

        }

    );


    return Object.entries(
        cityMap
    )
        .map(

            (
                [
                    city,
                    count
                ]
            ) => {

                return {
                    city:
                        city,

                    count:
                        count
                };

            }

        )
        .sort(

            (
                first,
                second
            ) =>

                second.count -
                first.count

        );

}


// =========================================================
// RENDER CITIES
// =========================================================

function renderDashboardCities() {

    if (
        !dashboardCitiesList
    ) {

        return;

    }


    const cities =
        getCityStatistics();


    dashboardCitiesList.innerHTML =
        "";


    if (
        cities.length ===
        0
    ) {

        dashboardCitiesList.innerHTML = `

            <div class="city-row">

                <span>
                    אין משלוחים להצגה
                </span>

                <strong>
                    0
                </strong>

            </div>

        `;


        return;

    }


    cities
        .slice(
            0,
            5
        )
        .forEach(

            cityData => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "city-row";


                row.innerHTML = `

                    <span>
                        ${cityData.city}
                    </span>

                    <strong>
                        ${cityData.count}
                    </strong>

                `;


                dashboardCitiesList
                    .appendChild(
                        row
                    );

            }

        );

}


// =========================================================
// DASHBOARD SEARCH
// =========================================================

if (
    dashboardSearch
) {

    dashboardSearch.addEventListener(

        "keydown",

        function (
            event
        ) {

            if (
                event.key !==
                "Enter"
            ) {

                return;

            }


            const searchValue =
                dashboardSearch.value
                    .trim();


            if (
                !searchValue
            ) {

                return;

            }


            sessionStorage.setItem(

                "delivery_system_shipment_search",

                searchValue

            );


            window.location.href =
                "shipments.html";

        }

    );

}


// =========================================================
// REFRESH DASHBOARD
// =========================================================

function renderDashboard() {

    renderCurrentUser();

    renderDashboardStatistics();

    renderDashboardDrivers();

    renderDashboardCities();

}


// =========================================================
// INITIALIZE
// =========================================================

async function initializeDashboard() {

    const authenticated =
        await loadDashboardSession();


    if (
        !authenticated
    ) {

        return;

    }


    const profileLoaded =
        await loadDashboardProfile();


    if (
        !profileLoaded
    ) {

        return;

    }


    await Promise.all(
        [
            loadDashboardShipments(),
            loadDashboardProfiles()
        ]
    );


    renderDashboard();

}


// =========================================================
// START
// =========================================================

initializeDashboard();