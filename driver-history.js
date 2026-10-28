// =========================================================
// DRIVER HISTORY
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

const historySupabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// STATE
// =========================================================

let historyCurrentUser =
    null;

let historyCurrentProfile =
    null;

let historyShipments =
    [];

let currentHistoryFilter =
    "today";


// =========================================================
// DOM
// =========================================================

const backToDriverButton =
    document.getElementById(
        "backToDriverButton"
    );


const historyDriverName =
    document.getElementById(
        "historyDriverName"
    );


const filterTodayButton =
    document.getElementById(
        "filterTodayButton"
    );


const filterYesterdayButton =
    document.getElementById(
        "filterYesterdayButton"
    );


const filterLast7DaysButton =
    document.getElementById(
        "filterLast7DaysButton"
    );


const filterThisMonthButton =
    document.getElementById(
        "filterThisMonthButton"
    );


const historyCustomDate =
    document.getElementById(
        "historyCustomDate"
    );


const filterCustomDateButton =
    document.getElementById(
        "filterCustomDateButton"
    );


const historyFilterLabel =
    document.getElementById(
        "historyFilterLabel"
    );


const historyTotalCount =
    document.getElementById(
        "historyTotalCount"
    );


const historyDeliveredCount =
    document.getElementById(
        "historyDeliveredCount"
    );


const historyFailedCount =
    document.getElementById(
        "historyFailedCount"
    );


const historyIncome =
    document.getElementById(
        "historyIncome"
    );


const historyListSubtitle =
    document.getElementById(
        "historyListSubtitle"
    );


const historyResultCount =
    document.getElementById(
        "historyResultCount"
    );


const historyShipmentsList =
    document.getElementById(
        "historyShipmentsList"
    );


// =========================================================
// HELPERS
// =========================================================

function getLocalDateString(
    date
) {

    const local =
        new Date(
            date.getTime()
            -
            date.getTimezoneOffset() *
            60000
        );


    return local
        .toISOString()
        .split(
            "T"
        )[0];

}


function getShipmentCompletedAt(
    shipment
) {

    if (
        shipment.status ===
        "נמסר"
    ) {

        return shipment.delivered_at;

    }


    if (
        shipment.status ===
        "לא נמסר"
    ) {

        return shipment.failed_at;

    }


    return null;

}


function formatHistoryDateTime(
    value
) {

    if (
        !value
    ) {

        return "-";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleString(
        "he-IL",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}


function getShipmentAddress(
    shipment
) {

    return `${shipment.street || ""} ${shipment.house_number || ""}, ${shipment.city || ""}`
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


// =========================================================
// AUTH
// =========================================================

async function loadHistorySession() {

    const {
        data,
        error
    } =
        await historySupabaseClient
            .auth
            .getSession();


    if (
        error
        ||
        !data.session
        ||
        !data.session.user
    ) {

        window.location.href =
            "login.html";


        return false;

    }


    historyCurrentUser =
        data.session.user;


    return true;

}


// =========================================================
// PROFILE
// =========================================================

async function loadHistoryProfile() {

    const {
        data,
        error
    } =
        await historySupabaseClient
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
                "id",
                historyCurrentUser.id
            )
            .single();


    if (
        error
        ||
        !data
    ) {

        console.error(
            "History profile error:",
            error
        );


        window.location.href =
            "login.html";


        return false;

    }


    if (
        data.role !==
            "DRIVER"

        ||

        data.status !==
            "פעיל"
    ) {

        window.location.href =
            "login.html";


        return false;

    }


    historyCurrentProfile =
        data;


    if (
        historyDriverName
    ) {

        historyDriverName.textContent =
            data.full_name
            ||
            data.username
            ||
            "שליח";

    }


    return true;

}


// =========================================================
// LOAD COMPLETED SHIPMENTS
// =========================================================

async function loadHistoryShipments() {

    if (
        !historyCurrentProfile
    ) {

        return;

    }


    if (
        historyListSubtitle
    ) {

        historyListSubtitle.textContent =
            "טוען משלוחים...";

    }


    const {
        data,
        error
    } =
        await historySupabaseClient
            .from(
                "shipments"
            )
            .select(
                `
                id,
                shipment_number,
                customer,
                phone,
                city,
                street,
                house_number,
                entrance,
                floor,
                apartment,
                building_code,
                address_notes,
                delivery_instructions,
                notes,
                status,
                delivered_at,
                failed_at,
                failed_reason,
                delivery_rate,
                delivery_amount,
                source_type,
                source_name,
                planned_delivery_date,
                route_started_at,
                created_at
                `
            )
            .eq(
                "driver_id",
                historyCurrentProfile.id
            )
            .in(
                "status",
                [
                    "נמסר",
                    "לא נמסר"
                ]
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
            "History shipments error:",
            error
        );


        if (
            historyListSubtitle
        ) {

            historyListSubtitle.textContent =
                "שגיאה בטעינת ההיסטוריה";

        }


        return;

    }


    historyShipments =
        data
        ||
        [];


    applyCurrentHistoryFilter();

}


// =========================================================
// FILTER HELPERS
// =========================================================

function getStartOfToday() {

    const date =
        new Date();


    date.setHours(
        0,
        0,
        0,
        0
    );


    return date;

}


function getEndOfToday() {

    const date =
        new Date();


    date.setHours(
        23,
        59,
        59,
        999
    );


    return date;

}


function isBetweenDates(
    value,
    start,
    end
) {

    if (
        !value
    ) {

        return false;

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return false;

    }


    return (
        date >= start
        &&
        date <= end
    );

}


// =========================================================
// APPLY FILTER
// =========================================================

function applyCurrentHistoryFilter() {

    let filtered =
        [];

    let label =
        "";


    const now =
        new Date();


    if (
        currentHistoryFilter ===
        "today"
    ) {

        filtered =
            historyShipments.filter(
                shipment =>
                    isBetweenDates(
                        getShipmentCompletedAt(
                            shipment
                        ),
                        getStartOfToday(),
                        getEndOfToday()
                    )
            );


        label =
            "היום";

    }


    else if (
        currentHistoryFilter ===
        "yesterday"
    ) {

        const start =
            new Date();


        start.setDate(
            start.getDate() -
            1
        );

        start.setHours(
            0,
            0,
            0,
            0
        );


        const end =
            new Date(
                start
            );


        end.setHours(
            23,
            59,
            59,
            999
        );


        filtered =
            historyShipments.filter(
                shipment =>
                    isBetweenDates(
                        getShipmentCompletedAt(
                            shipment
                        ),
                        start,
                        end
                    )
            );


        label =
            "אתמול";

    }


    else if (
        currentHistoryFilter ===
        "last7"
    ) {

        const start =
            new Date();


        start.setDate(
            start.getDate() -
            6
        );

        start.setHours(
            0,
            0,
            0,
            0
        );


        filtered =
            historyShipments.filter(
                shipment =>
                    isBetweenDates(
                        getShipmentCompletedAt(
                            shipment
                        ),
                        start,
                        getEndOfToday()
                    )
            );


        label =
            "7 ימים אחרונים";

    }


    else if (
        currentHistoryFilter ===
        "month"
    ) {

        const start =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );


        const end =
            new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );


        filtered =
            historyShipments.filter(
                shipment =>
                    isBetweenDates(
                        getShipmentCompletedAt(
                            shipment
                        ),
                        start,
                        end
                    )
            );


        label =
            "החודש";

    }


    else if (
        currentHistoryFilter ===
        "custom"
    ) {

        const selectedDate =
            historyCustomDate
                ? historyCustomDate.value
                : "";


        if (
            !selectedDate
        ) {

            alert(
                "בחר תאריך."
            );


            return;

        }


        const start =
            new Date(
                `${selectedDate}T00:00:00`
            );


        const end =
            new Date(
                `${selectedDate}T23:59:59`
            );


        filtered =
            historyShipments.filter(
                shipment =>
                    isBetweenDates(
                        getShipmentCompletedAt(
                            shipment
                        ),
                        start,
                        end
                    )
            );


        label =
            new Date(
                `${selectedDate}T12:00:00`
            )
                .toLocaleDateString(
                    "he-IL"
                );

    }


    renderHistory(
        filtered,
        label
    );

}


// =========================================================
// RENDER SUMMARY
// =========================================================

function renderHistorySummary(
    shipments
) {

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


    const income =
        delivered.reduce(
            (
                total,
                shipment
            ) => {

                const amount =
                    Number(
                        shipment.delivery_amount
                        ??
                        shipment.delivery_rate
                        ??
                        0
                    );


                return total + amount;

            },
            0
        );


    if (
        historyTotalCount
    ) {

        historyTotalCount.textContent =
            shipments.length;

    }


    if (
        historyDeliveredCount
    ) {

        historyDeliveredCount.textContent =
            delivered.length;

    }


    if (
        historyFailedCount
    ) {

        historyFailedCount.textContent =
            failed.length;

    }


    if (
        historyIncome
    ) {

        historyIncome.textContent =
            `₪${income.toFixed(2)}`;

    }

}


// =========================================================
// RENDER HISTORY LIST
// =========================================================

function renderHistoryList(
    shipments
) {

    if (
        !historyShipmentsList
    ) {

        return;

    }


    historyShipmentsList.innerHTML =
        "";


    if (
        historyResultCount
    ) {

        historyResultCount.textContent =
            shipments.length;

    }


    if (
        historyListSubtitle
    ) {

        historyListSubtitle.textContent =
            shipments.length ===
                0

                ? "לא נמצאו משלוחים בתקופה הזאת"

                : `${shipments.length} משלוחים`;

    }


    if (
        shipments.length ===
        0
    ) {

        historyShipmentsList.innerHTML = `

            <div class="driver-empty-state">

                אין משלוחים להצגה בתקופה שנבחרה.

            </div>

        `;


        return;

    }


    shipments.forEach(

        shipment => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "driver-shipment-card";


            const completedAt =
                getShipmentCompletedAt(
                    shipment
                );


            const statusIcon =
                shipment.status ===
                    "נמסר"

                    ? "✅"

                    : "❌";


            const income =
                shipment.status ===
                    "נמסר"

                    ? Number(
                        shipment.delivery_amount
                        ??
                        shipment.delivery_rate
                        ??
                        0
                    )

                    : 0;


            const sourceLabel =
                shipment.source_type ===
                    "DRIVER_MANUAL"

                    ? "משלוח ידני"

                    : shipment.source_name
                        ||
                        "";


            card.innerHTML = `

                <div class="shipment-card-top">

                    <div>

                        <h3 class="shipment-card-customer">
                            ${shipment.customer || "לקוח"}
                        </h3>

                        ${
                            sourceLabel

                                ? `
                                    <div
                                        style="
                                            margin-top:3px;
                                            font-size:11px;
                                            color:#94a3b8;
                                        "
                                    >
                                        ${sourceLabel}
                                    </div>
                                `

                                : ""
                        }

                    </div>


                    <span
                        class="
                            shipment-card-status
                            ${
                                shipment.status ===
                                    "נמסר"

                                    ? "status-delivered"

                                    : "status-failed"
                            }
                        "
                    >
                        ${statusIcon}
                        ${shipment.status}
                    </span>

                </div>


                <div class="shipment-card-address">

                    📍
                    ${getShipmentAddress(
                        shipment
                    )}

                </div>


                ${
                    shipment.phone

                        ? `
                            <div class="shipment-card-phone">

                                📞
                                ${shipment.phone}

                            </div>
                        `

                        : ""
                }


                <div
                    style="
                        margin-top:8px;
                        font-size:13px;
                        color:#64748b;
                    "
                >

                    🕒
                    ${formatHistoryDateTime(
                        completedAt
                    )}

                </div>


                ${
                    shipment.status ===
                        "לא נמסר"

                    &&
                    shipment.failed_reason

                        ? `
                            <div
                                style="
                                    margin-top:8px;
                                    font-size:13px;
                                "
                            >

                                סיבה:
                                ${shipment.failed_reason}

                            </div>
                        `

                        : ""
                }


                ${
                    shipment.status ===
                        "נמסר"

                        ? `
                            <div
                                style="
                                    margin-top:8px;
                                    font-size:14px;
                                    font-weight:700;
                                "
                            >

                                הכנסה:
                                ₪${income.toFixed(2)}

                            </div>
                        `

                        : ""
                }

            `;


            historyShipmentsList
                .appendChild(
                    card
                );

        }

    );

}


// =========================================================
// RENDER EVERYTHING
// =========================================================

function renderHistory(
    shipments,
    label
) {

    if (
        historyFilterLabel
    ) {

        historyFilterLabel.textContent =
            `מציג: ${label}`;

    }


    renderHistorySummary(
        shipments
    );


    renderHistoryList(
        shipments
    );

}


// =========================================================
// FILTER EVENTS
// =========================================================

if (
    filterTodayButton
) {

    filterTodayButton.addEventListener(

        "click",

        function () {

            currentHistoryFilter =
                "today";


            applyCurrentHistoryFilter();

        }

    );

}


if (
    filterYesterdayButton
) {

    filterYesterdayButton.addEventListener(

        "click",

        function () {

            currentHistoryFilter =
                "yesterday";


            applyCurrentHistoryFilter();

        }

    );

}


if (
    filterLast7DaysButton
) {

    filterLast7DaysButton.addEventListener(

        "click",

        function () {

            currentHistoryFilter =
                "last7";


            applyCurrentHistoryFilter();

        }

    );

}


if (
    filterThisMonthButton
) {

    filterThisMonthButton.addEventListener(

        "click",

        function () {

            currentHistoryFilter =
                "month";


            applyCurrentHistoryFilter();

        }

    );

}


if (
    filterCustomDateButton
) {

    filterCustomDateButton.addEventListener(

        "click",

        function () {

            currentHistoryFilter =
                "custom";


            applyCurrentHistoryFilter();

        }

    );

}


// =========================================================
// BACK
// =========================================================

if (
    backToDriverButton
) {

    backToDriverButton.addEventListener(

        "click",

        function () {

            window.location.href =
                "driver.html";

        }

    );

}


// =========================================================
// INITIALIZE
// =========================================================

async function initializeHistoryPage() {

    const sessionLoaded =
        await loadHistorySession();


    if (
        !sessionLoaded
    ) {

        return;

    }


    const profileLoaded =
        await loadHistoryProfile();


    if (
        !profileLoaded
    ) {

        return;

    }


    if (
        historyCustomDate
    ) {

        historyCustomDate.value =
            getLocalDateString(
                new Date()
            );

    }


    await loadHistoryShipments();

}


// =========================================================
// START
// =========================================================

initializeHistoryPage();