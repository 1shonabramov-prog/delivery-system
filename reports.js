// =========================================================
// DELIVERY SYSTEM
// REPORTS - SUPABASE
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

const reportsSupabase =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// GLOBAL STATE
// =========================================================

let reportsAuthUser =
    null;

let reportsCurrentProfile =
    null;

let reportsProfiles =
    [];

let reportsShipments =
    [];

let reportsFilteredShipments =
    [];


// =========================================================
// DOM
// =========================================================

const reportsUserAvatar =
    document.getElementById(
        "reportsUserAvatar"
    );


const reportsUserName =
    document.getElementById(
        "reportsUserName"
    );


const reportsUserRole =
    document.getElementById(
        "reportsUserRole"
    );


const reportsFromDate =
    document.getElementById(
        "reportsFromDate"
    );


const reportsToDate =
    document.getElementById(
        "reportsToDate"
    );


const reportsApplyFilterButton =
    document.getElementById(
        "reportsApplyFilterButton"
    );


const reportsResetFilterButton =
    document.getElementById(
        "reportsResetFilterButton"
    );


const reportsTotalShipments =
    document.getElementById(
        "reportsTotalShipments"
    );


const reportsDeliveredShipments =
    document.getElementById(
        "reportsDeliveredShipments"
    );


const reportsFailedShipments =
    document.getElementById(
        "reportsFailedShipments"
    );


const reportsTotalIncome =
    document.getElementById(
        "reportsTotalIncome"
    );


const reportsDriversTableBody =
    document.getElementById(
        "reportsDriversTableBody"
    );


const reportsCitiesTableBody =
    document.getElementById(
        "reportsCitiesTableBody"
    );


// =========================================================
// REDIRECT
// =========================================================

function reportsRedirectToLogin() {

    sessionStorage.removeItem(
        "delivery_system_current_user"
    );


    window.location.href =
        "login.html";
}


// =========================================================
// LOAD SESSION
// =========================================================

async function loadReportsSession() {

    const {
        data,
        error
    } =
        await reportsSupabase
            .auth
            .getSession();


    if (
        error
    ) {

        console.error(
            "Failed loading reports session:",
            error
        );


        reportsRedirectToLogin();

        return false;
    }


    if (
        !data.session ||
        !data.session.user
    ) {

        reportsRedirectToLogin();

        return false;
    }


    reportsAuthUser =
        data.session.user;


    return true;
}


// =========================================================
// LOAD CURRENT PROFILE
// =========================================================

async function loadReportsCurrentProfile() {

    if (
        !reportsAuthUser
    ) {

        return false;
    }


    const {
        data,
        error
    } =
        await reportsSupabase
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
                reportsAuthUser.id
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


    reportsCurrentProfile =
        data;


    if (
        !reportsCurrentProfile ||
        reportsCurrentProfile.status !==
            "פעיל"
    ) {

        await reportsSupabase
            .auth
            .signOut();


        reportsRedirectToLogin();

        return false;
    }


    if (
        reportsCurrentProfile.role !==
            "ADMIN"

        &&

        reportsCurrentProfile.role !==
            "WAREHOUSE"
    ) {

        if (
            reportsCurrentProfile.role ===
            "DRIVER"
        ) {

            window.location.href =
                "driver.html";
        }

        else {

            reportsRedirectToLogin();
        }


        return false;
    }


    return true;
}


// =========================================================
// CURRENT USER
// =========================================================

function renderReportsCurrentUser() {

    if (
        !reportsCurrentProfile
    ) {

        return;
    }


    const fullName =
        reportsCurrentProfile.full_name ||
        reportsCurrentProfile.username ||
        "משתמש";


    if (
        reportsUserName
    ) {

        reportsUserName.textContent =
            fullName;
    }


    if (
        reportsUserAvatar
    ) {

        reportsUserAvatar.textContent =
            fullName
                .trim()
                .charAt(
                    0
                )
            ||
            "מ";
    }


    if (
        reportsUserRole
    ) {

        reportsUserRole.textContent =
            reportsCurrentProfile.role ===
                "ADMIN"

                ? "Administrator"

                : "Warehouse";
    }

}


// =========================================================
// LOAD DRIVER PROFILES
// =========================================================

async function loadReportsProfiles() {

    const {
        data,
        error
    } =
        await reportsSupabase
            .from(
                "profiles"
            )
            .select(
                `
                id,
                username,
                full_name,
                role,
                status,
                driver_rate
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
            "Failed loading report profiles:",
            error
        );


        reportsProfiles =
            [];


        return false;
    }


    reportsProfiles =
        data ||
        [];


    return true;
}


// =========================================================
// LOAD SHIPMENTS
// =========================================================

async function loadReportsShipments() {

    const {
        data,
        error
    } =
        await reportsSupabase
            .from(
                "shipments"
            )
            .select(
                `
                id,
                shipment_number,
                city,
                driver_id,
                driver_name,
                status,
                created_at,
                delivered_at,
                failed_at,
                delivery_rate,
                delivery_amount
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
            "Failed loading report shipments:",
            error
        );


        reportsShipments =
            [];


        return false;
    }


    reportsShipments =
        data ||
        [];


    reportsFilteredShipments =
        [...reportsShipments];


    return true;
}


// =========================================================
// MONEY
// =========================================================

function reportsFormatMoney(
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
// DATE HELPERS
// =========================================================

function getStartOfDate(
    value
) {

    if (
        !value
    ) {

        return null;
    }


    return new Date(
        `${value}T00:00:00`
    );
}


function getEndOfDate(
    value
) {

    if (
        !value
    ) {

        return null;
    }


    return new Date(
        `${value}T23:59:59.999`
    );
}


// =========================================================
// APPLY DATE FILTER
// =========================================================

function applyReportsDateFilter() {

    const fromDate =
        getStartOfDate(
            reportsFromDate.value
        );


    const toDate =
        getEndOfDate(
            reportsToDate.value
        );


    reportsFilteredShipments =
        reportsShipments.filter(

            shipment => {

                if (
                    !shipment.created_at
                ) {

                    return false;
                }


                const createdAt =
                    new Date(
                        shipment.created_at
                    );


                if (
                    fromDate &&
                    createdAt < fromDate
                ) {

                    return false;
                }


                if (
                    toDate &&
                    createdAt > toDate
                ) {

                    return false;
                }


                return true;
            }

        );


    renderReports();
}


// =========================================================
// RESET FILTER
// =========================================================

function resetReportsDateFilter() {

    reportsFromDate.value =
        "";


    reportsToDate.value =
        "";


    reportsFilteredShipments =
        [...reportsShipments];


    renderReports();
}


// =========================================================
// SUMMARY STATS
// =========================================================

function renderReportsSummary() {

    const total =
        reportsFilteredShipments.length;


    const delivered =
        reportsFilteredShipments.filter(

            shipment =>
                shipment.status ===
                "נמסר"

        );


    const failed =
        reportsFilteredShipments.filter(

            shipment =>
                shipment.status ===
                "לא נמסר"

        );


    const income =
        delivered.reduce(

            (
                totalIncome,
                shipment
            ) => {

                return (
                    totalIncome +
                    Number(
                        shipment.delivery_amount ||
                        shipment.delivery_rate ||
                        0
                    )
                );
            },

            0

        );


    reportsTotalShipments.textContent =
        total;


    reportsDeliveredShipments.textContent =
        delivered.length;


    reportsFailedShipments.textContent =
        failed.length;


    reportsTotalIncome.textContent =
        reportsFormatMoney(
            income
        );
}


// =========================================================
// DRIVER SUMMARY
// =========================================================

function buildDriversReport() {

    const map =
        new Map();


    /*
        Important:
        Every driver from profiles is inserted first.
        This means drivers with ZERO shipments will still appear.
    */

    reportsProfiles.forEach(

        driver => {

            map.set(
                String(
                    driver.id
                ),
                {
                    id:
                        driver.id,

                    name:
                        driver.full_name ||
                        driver.username ||
                        "שליח",

                    status:
                        driver.status,

                    rate:
                        Number(
                            driver.driver_rate ||
                            0
                        ),

                    total:
                        0,

                    delivered:
                        0,

                    failed:
                        0,

                    remaining:
                        0,

                    income:
                        0
                }
            );

        }

    );


    /*
        Add shipment activity to the drivers.
    */

    reportsFilteredShipments.forEach(

        shipment => {

            if (
                !shipment.driver_id
            ) {

                return;
            }


            const driverId =
                String(
                    shipment.driver_id
                );


            /*
                In case an old shipment belongs to a driver
                whose profile no longer exists, keep the
                historical driver in the report as well.
            */

            if (
                !map.has(
                    driverId
                )
            ) {

                map.set(
                    driverId,
                    {
                        id:
                            shipment.driver_id,

                        name:
                            shipment.driver_name ||
                            "שליח לא קיים",

                        status:
                            "לא פעיל",

                        rate:
                            Number(
                                shipment.delivery_rate ||
                                0
                            ),

                        total:
                            0,

                        delivered:
                            0,

                        failed:
                            0,

                        remaining:
                            0,

                        income:
                            0
                    }
                );
            }


            const driver =
                map.get(
                    driverId
                );


            driver.total++;


            if (
                shipment.status ===
                "נמסר"
            ) {

                driver.delivered++;


                driver.income +=
                    Number(
                        shipment.delivery_amount ||
                        shipment.delivery_rate ||
                        driver.rate ||
                        0
                    );
            }

            else if (
                shipment.status ===
                "לא נמסר"
            ) {

                driver.failed++;
            }

            else {

                driver.remaining++;
            }

        }

    );


    return Array.from(
        map.values()
    )
        .map(

            driver => {

                const completed =
                    driver.delivered +
                    driver.failed;


                const successPercent =
                    completed > 0

                        ? Math.round(
                            (
                                driver.delivered /
                                completed
                            )
                            *
                            100
                        )

                        : 0;


                return {
                    ...driver,

                    successPercent:
                        successPercent
                };
            }

        )
        .sort(

            (
                a,
                b
            ) => {

                /*
                    Active drivers first,
                    then by delivered count,
                    then alphabetically.
                */

                if (
                    a.status === "פעיל" &&
                    b.status !== "פעיל"
                ) {

                    return -1;
                }


                if (
                    a.status !== "פעיל" &&
                    b.status === "פעיל"
                ) {

                    return 1;
                }


                if (
                    b.delivered !==
                    a.delivered
                ) {

                    return (
                        b.delivered -
                        a.delivered
                    );
                }


                return a.name.localeCompare(
                    b.name,
                    "he"
                );
            }

        );

}


// =========================================================
// SUCCESS BADGE
// =========================================================

function getReportsSuccessBadge(
    value
) {

    let className =
        "waiting";


    if (
        value >= 90
    ) {

        className =
            "completed";
    }

    else if (
        value >= 70
    ) {

        className =
            "active";
    }

    else if (
        value > 0
    ) {

        className =
            "failed";
    }


    return `

        <span class="status ${className}">
            ${value}%
        </span>

    `;
}


// =========================================================
// DRIVER STATUS
// =========================================================

function getReportDriverStatusBadge(
    status
) {

    if (
        status ===
        "פעיל"
    ) {

        return `

            <span
                style="
                    display:inline-block;
                    margin-right:6px;
                    font-size:11px;
                    color:#15803d;
                    font-weight:700;
                "
            >
                פעיל
            </span>

        `;
    }


    return `

        <span
            style="
                display:inline-block;
                margin-right:6px;
                font-size:11px;
                color:#b91c1c;
                font-weight:700;
            "
        >
            לא פעיל
        </span>

    `;
}


// =========================================================
// RENDER DRIVER TABLE
// =========================================================

function renderReportsDriversTable() {

    const driversReport =
        buildDriversReport();


    reportsDriversTableBody.innerHTML =
        "";


    if (
        driversReport.length ===
        0
    ) {

        reportsDriversTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    לא קיימים שליחים במערכת
                </td>

            </tr>

        `;


        return;
    }


    driversReport.forEach(

        driver => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${driver.name}
                    </strong>

                    ${getReportDriverStatusBadge(
                        driver.status
                    )}

                </td>


                <td>
                    ${driver.total}
                </td>


                <td>
                    ${driver.delivered}
                </td>


                <td>
                    ${driver.failed}
                </td>


                <td>
                    ${driver.remaining}
                </td>


                <td>
                    ${getReportsSuccessBadge(
                        driver.successPercent
                    )}
                </td>


                <td>

                    <strong>
                        ${reportsFormatMoney(
                            driver.income
                        )}
                    </strong>

                </td>

            `;


            reportsDriversTableBody.appendChild(
                row
            );

        }

    );
}


// =========================================================
// CITY SUMMARY
// =========================================================

function buildCitiesReport() {

    const map =
        new Map();


    reportsFilteredShipments.forEach(

        shipment => {

            const city =
                String(
                    shipment.city ||
                    ""
                )
                    .trim();


            if (
                !city
            ) {

                return;
            }


            if (
                !map.has(
                    city
                )
            ) {

                map.set(
                    city,
                    {
                        city:
                            city,

                        total:
                            0,

                        delivered:
                            0,

                        failed:
                            0
                    }
                );
            }


            const cityData =
                map.get(
                    city
                );


            cityData.total++;


            if (
                shipment.status ===
                "נמסר"
            ) {

                cityData.delivered++;
            }


            if (
                shipment.status ===
                "לא נמסר"
            ) {

                cityData.failed++;
            }

        }

    );


    return Array.from(
        map.values()
    )
        .map(

            city => {

                const completed =
                    city.delivered +
                    city.failed;


                const successPercent =
                    completed > 0

                        ? Math.round(
                            (
                                city.delivered /
                                completed
                            )
                            *
                            100
                        )

                        : 0;


                return {
                    ...city,

                    successPercent:
                        successPercent
                };
            }

        )
        .sort(

            (
                a,
                b
            ) =>
                b.total -
                a.total

        );

}


// =========================================================
// RENDER CITY TABLE
// =========================================================

function renderReportsCitiesTable() {

    const citiesReport =
        buildCitiesReport();


    reportsCitiesTableBody.innerHTML =
        "";


    if (
        citiesReport.length ===
        0
    ) {

        reportsCitiesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    אין נתוני ערים בטווח שנבחר
                </td>

            </tr>

        `;


        return;
    }


    citiesReport.forEach(

        city => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${city.city}
                    </strong>

                </td>


                <td>
                    ${city.total}
                </td>


                <td>
                    ${city.delivered}
                </td>


                <td>
                    ${city.failed}
                </td>


                <td>
                    ${getReportsSuccessBadge(
                        city.successPercent
                    )}
                </td>

            `;


            reportsCitiesTableBody.appendChild(
                row
            );

        }

    );
}


// =========================================================
// RENDER ALL
// =========================================================

function renderReports() {

    renderReportsSummary();

    renderReportsDriversTable();

    renderReportsCitiesTable();
}


// =========================================================
// FILTER EVENTS
// =========================================================

reportsApplyFilterButton.addEventListener(

    "click",

    applyReportsDateFilter

);


reportsResetFilterButton.addEventListener(

    "click",

    resetReportsDateFilter

);


// =========================================================
// INITIALIZE
// =========================================================

async function initializeReportsPage() {

    const authenticated =
        await loadReportsSession();


    if (
        !authenticated
    ) {

        return;
    }


    const profileLoaded =
        await loadReportsCurrentProfile();


    if (
        !profileLoaded
    ) {

        return;
    }


    renderReportsCurrentUser();


    await Promise.all(
        [
            loadReportsProfiles(),
            loadReportsShipments()
        ]
    );


    renderReports();
}


// =========================================================
// START
// =========================================================

initializeReportsPage();