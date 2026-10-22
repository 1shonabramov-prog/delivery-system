// =========================================================
// DELIVERY SYSTEM
// DRIVERS MANAGEMENT - SUPABASE
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

const driversSupabase =
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

let driversProfiles =
    [];

let driversShipments =
    [];


// =========================================================
// DOM ELEMENTS
// =========================================================

const driversUserAvatar =
    document.getElementById(
        "driversUserAvatar"
    );


const driversUserName =
    document.getElementById(
        "driversUserName"
    );


const driversUserRole =
    document.getElementById(
        "driversUserRole"
    );


const driversSearchInput =
    document.getElementById(
        "driversSearchInput"
    );


const driversTotalCount =
    document.getElementById(
        "driversTotalCount"
    );


const driversActiveCount =
    document.getElementById(
        "driversActiveCount"
    );


const driversInactiveCount =
    document.getElementById(
        "driversInactiveCount"
    );


const driversAssignedShipmentsCount =
    document.getElementById(
        "driversAssignedShipmentsCount"
    );


const driversTableBody =
    document.getElementById(
        "driversTableBody"
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

async function loadDriversSession() {

    const {
        data,
        error
    } =
        await driversSupabase
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

async function loadDriversCurrentProfile() {

    if (
        !currentAuthUser
    ) {

        return false;

    }


    const {
        data,
        error
    } =
        await driversSupabase
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

        await driversSupabase
            .auth
            .signOut();


        redirectToLogin();

        return false;

    }


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
// RENDER CURRENT USER
// =========================================================

function renderDriversCurrentUser() {

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
        driversUserName
    ) {

        driversUserName.textContent =
            fullName;

    }


    if (
        driversUserAvatar
    ) {

        driversUserAvatar.textContent =
            fullName
                .trim()
                .charAt(
                    0
                )
            ||
            "מ";

    }


    if (
        driversUserRole
    ) {

        driversUserRole.textContent =
            currentProfile.role ===
                "ADMIN"

                ? "Administrator"

                : "Warehouse";

    }

}


// =========================================================
// LOAD DRIVER PROFILES
// =========================================================

async function loadDriversProfiles() {

    const {
        data,
        error
    } =
        await driversSupabase
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
                "role",
                "DRIVER"
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
            "Failed loading driver profiles:",
            error
        );


        driversProfiles =
            [];


        return false;

    }


    driversProfiles =
        data ||
        [];


    return true;

}


// =========================================================
// LOAD SHIPMENTS
// =========================================================

async function loadDriversShipments() {

    const {
        data,
        error
    } =
        await driversSupabase
            .from(
                "shipments"
            )
            .select(
                `
                id,
                driver_id,
                driver_name,
                status,
                delivery_rate,
                delivery_amount,
                delivered_at,
                failed_at,
                created_at
                `
            );


    if (
        error
    ) {

        console.error(
            "Failed loading shipments:",
            error
        );


        driversShipments =
            [];


        return false;

    }


    driversShipments =
        data ||
        [];


    return true;

}


// =========================================================
// DRIVER SHIPMENTS
// =========================================================

function getShipmentsForDriver(
    driverId
) {

    return driversShipments
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
// DRIVER METRICS
// =========================================================

function getDriverMetrics(
    driver
) {

    const shipments =
        getShipmentsForDriver(
            driver.id
        );


    const delivered =
        shipments.filter(

            shipment =>
                shipment.status ===
                    "נמסר"

        );


    const failed =
        shipments.filter(

            shipment =>
                shipment.status ===
                    "לא נמסר"

        );


    const remaining =
        shipments.filter(

            shipment =>

                shipment.status !==
                    "נמסר"

                &&

                shipment.status !==
                    "לא נמסר"

        );


    const income =
        delivered.reduce(

            (
                total,
                shipment
            ) => {

                return (
                    total +
                    Number(
                        shipment.delivery_amount ||
                        shipment.delivery_rate ||
                        0
                    )
                );

            },

            0

        );


    return {

        total:
            shipments.length,

        delivered:
            delivered.length,

        remaining:
            remaining.length,

        failed:
            failed.length,

        income:
            income

    };

}


// =========================================================
// RENDER STATS
// =========================================================

function renderDriversStats() {

    const total =
        driversProfiles.length;


    const active =
        driversProfiles.filter(

            driver =>
                driver.status ===
                    "פעיל"

        ).length;


    const inactive =
        driversProfiles.filter(

            driver =>
                driver.status !==
                    "פעיל"

        ).length;


    const assignedShipments =
        driversShipments.filter(

            shipment =>
                Boolean(
                    shipment.driver_id
                )

        ).length;


    if (
        driversTotalCount
    ) {

        driversTotalCount.textContent =
            total;

    }


    if (
        driversActiveCount
    ) {

        driversActiveCount.textContent =
            active;

    }


    if (
        driversInactiveCount
    ) {

        driversInactiveCount.textContent =
            inactive;

    }


    if (
        driversAssignedShipmentsCount
    ) {

        driversAssignedShipmentsCount.textContent =
            assignedShipments;

    }

}


// =========================================================
// STATUS BADGE
// =========================================================

function getDriverStatusBadge(
    driver
) {

    if (
        driver.status ===
        "פעיל"
    ) {

        return `

            <span class="status completed">
                פעיל
            </span>

        `;

    }


    return `

        <span class="status failed">
            לא פעיל
        </span>

    `;

}


// =========================================================
// FORMAT MONEY
// =========================================================

function formatMoney(
    value
) {

    return (
        "₪" +
        Number(
            value ||
            0
        )
            .toLocaleString(
                "he-IL",
                {
                    minimumFractionDigits:
                        0,

                    maximumFractionDigits:
                        2
                }
            )
    );

}


// =========================================================
// RENDER DRIVERS TABLE
// =========================================================

function renderDriversTable() {

    if (
        !driversTableBody
    ) {

        return;

    }


    const searchValue =
        driversSearchInput

            ? driversSearchInput.value
                .trim()
                .toLowerCase()

            : "";


    const filteredDrivers =
        driversProfiles.filter(

            driver => {

                if (
                    !searchValue
                ) {

                    return true;

                }


                const searchText =
                    [

                        driver.full_name,

                        driver.username,

                        driver.phone,

                        driver.status

                    ]
                        .filter(
                            Boolean
                        )
                        .join(
                            " "
                        )
                        .toLowerCase();


                return searchText.includes(
                    searchValue
                );

            }

        );


    driversTableBody.innerHTML =
        "";


    if (
        filteredDrivers.length ===
        0
    ) {

        driversTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    לא נמצאו שליחים
                </td>

            </tr>

        `;


        return;

    }


    filteredDrivers.forEach(

        driver => {

            const metrics =
                getDriverMetrics(
                    driver
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div>

                        <strong>
                            ${
                                driver.full_name ||
                                driver.username ||
                                "שליח"
                            }
                        </strong>

                        ${
                            driver.phone

                                ? `
                                    <div
                                        style="
                                            margin-top:4px;
                                            font-size:12px;
                                            color:#64748b;
                                        "
                                    >
                                        ${driver.phone}
                                    </div>
                                `

                                : ""
                        }

                    </div>

                </td>


                <td>
                    ${getDriverStatusBadge(
                        driver
                    )}
                </td>


                <td>
                    ${formatMoney(
                        driver.driver_rate
                    )}
                </td>


                <td>
                    ${metrics.total}
                </td>


                <td>
                    ${metrics.delivered}
                </td>


                <td>
                    ${metrics.remaining}
                </td>


                <td>
                    ${metrics.failed}
                </td>


                <td>

                    <strong>
                        ${formatMoney(
                            metrics.income
                        )}
                    </strong>

                </td>

            `;


            driversTableBody.appendChild(
                row
            );

        }

    );

}


// =========================================================
// SEARCH
// =========================================================

if (
    driversSearchInput
) {

    driversSearchInput.addEventListener(

        "input",

        renderDriversTable

    );

}


// =========================================================
// INITIALIZE
// =========================================================

async function initializeDriversPage() {

    const authenticated =
        await loadDriversSession();


    if (
        !authenticated
    ) {

        return;

    }


    const profileLoaded =
        await loadDriversCurrentProfile();


    if (
        !profileLoaded
    ) {

        return;

    }


    renderDriversCurrentUser();


    await Promise.all(
        [
            loadDriversProfiles(),
            loadDriversShipments()
        ]
    );


    renderDriversStats();


    renderDriversTable();

}


// =========================================================
// START
// =========================================================

initializeDriversPage();