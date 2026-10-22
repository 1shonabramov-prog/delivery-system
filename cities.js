// =========================================================
// DELIVERY SYSTEM
// CITIES / AREAS - SUPABASE
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

const citiesSupabase =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// GLOBAL STATE
// =========================================================

let citiesAuthUser =
    null;

let citiesCurrentProfile =
    null;

let citiesShipments =
    [];

let citiesSummary =
    [];


// =========================================================
// DOM
// =========================================================

const citiesUserAvatar =
    document.getElementById(
        "citiesUserAvatar"
    );


const citiesUserName =
    document.getElementById(
        "citiesUserName"
    );


const citiesUserRole =
    document.getElementById(
        "citiesUserRole"
    );


const citiesSearchInput =
    document.getElementById(
        "citiesSearchInput"
    );


const citiesTotalCount =
    document.getElementById(
        "citiesTotalCount"
    );


const citiesShipmentsCount =
    document.getElementById(
        "citiesShipmentsCount"
    );


const citiesUnassignedCount =
    document.getElementById(
        "citiesUnassignedCount"
    );


const citiesDeliveredCount =
    document.getElementById(
        "citiesDeliveredCount"
    );


const citiesTableBody =
    document.getElementById(
        "citiesTableBody"
    );


// =========================================================
// REDIRECT
// =========================================================

function citiesRedirectToLogin() {

    sessionStorage.removeItem(
        "delivery_system_current_user"
    );


    window.location.href =
        "login.html";
}


// =========================================================
// LOAD SESSION
// =========================================================

async function loadCitiesSession() {

    const {
        data,
        error
    } =
        await citiesSupabase
            .auth
            .getSession();


    if (
        error
    ) {

        console.error(
            "Failed loading session:",
            error
        );


        citiesRedirectToLogin();

        return false;
    }


    if (
        !data.session ||
        !data.session.user
    ) {

        citiesRedirectToLogin();

        return false;
    }


    citiesAuthUser =
        data.session.user;


    return true;
}


// =========================================================
// LOAD CURRENT PROFILE
// =========================================================

async function loadCitiesCurrentProfile() {

    if (
        !citiesAuthUser
    ) {

        return false;
    }


    const {
        data,
        error
    } =
        await citiesSupabase
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
                citiesAuthUser.id
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


    citiesCurrentProfile =
        data;


    if (
        !citiesCurrentProfile ||
        citiesCurrentProfile.status !==
        "פעיל"
    ) {

        await citiesSupabase
            .auth
            .signOut();


        citiesRedirectToLogin();

        return false;
    }


    if (
        citiesCurrentProfile.role !==
            "ADMIN"

        &&

        citiesCurrentProfile.role !==
            "WAREHOUSE"
    ) {

        if (
            citiesCurrentProfile.role ===
            "DRIVER"
        ) {

            window.location.href =
                "driver.html";
        }

        else {

            citiesRedirectToLogin();
        }


        return false;
    }


    return true;
}


// =========================================================
// RENDER CURRENT USER
// =========================================================

function renderCitiesCurrentUser() {

    if (
        !citiesCurrentProfile
    ) {

        return;
    }


    const fullName =
        citiesCurrentProfile.full_name ||
        citiesCurrentProfile.username ||
        "משתמש";


    if (
        citiesUserName
    ) {

        citiesUserName.textContent =
            fullName;
    }


    if (
        citiesUserAvatar
    ) {

        citiesUserAvatar.textContent =
            fullName
                .trim()
                .charAt(
                    0
                )
            ||
            "מ";
    }


    if (
        citiesUserRole
    ) {

        citiesUserRole.textContent =
            citiesCurrentProfile.role ===
                "ADMIN"

                ? "Administrator"

                : "Warehouse";
    }

}


// =========================================================
// LOAD SHIPMENTS
// =========================================================

async function loadCitiesShipments() {

    const {
        data,
        error
    } =
        await citiesSupabase
            .from(
                "shipments"
            )
            .select(
                `
                id,
                city,
                driver_id,
                status,
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


        citiesShipments =
            [];


        showCitiesError(
            "לא ניתן לטעון את נתוני המשלוחים."
        );


        return false;
    }


    citiesShipments =
        data ||
        [];


    return true;
}


// =========================================================
// NORMALIZE CITY
// =========================================================

function normalizeCityName(
    city
) {

    return String(
        city ||
        ""
    )
        .trim()
        .replace(
            /\s+/g,
            " "
        );
}


// =========================================================
// BUILD CITY SUMMARY
// =========================================================

function buildCitiesSummary() {

    const cityMap =
        new Map();


    citiesShipments.forEach(

        shipment => {

            const city =
                normalizeCityName(
                    shipment.city
                );


            if (
                !city
            ) {

                return;
            }


            if (
                !cityMap.has(
                    city
                )
            ) {

                cityMap.set(
                    city,
                    {
                        city:
                            city,

                        total:
                            0,

                        unassigned:
                            0,

                        assigned:
                            0,

                        onRoute:
                            0,

                        delivered:
                            0,

                        failed:
                            0
                    }
                );
            }


            const cityData =
                cityMap.get(
                    city
                );


            cityData.total++;


            if (
                !shipment.driver_id
            ) {

                cityData.unassigned++;
            }


            if (
                shipment.driver_id
            ) {

                cityData.assigned++;
            }


            if (
                shipment.status ===
                "בדרך"
            ) {

                cityData.onRoute++;
            }


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


    citiesSummary =
        Array.from(
            cityMap.values()
        )
            .map(

                cityData => {

                    const completedAttempts =
                        cityData.delivered +
                        cityData.failed;


                    const deliveryPercent =
                        completedAttempts > 0

                            ? Math.round(
                                (
                                    cityData.delivered /
                                    completedAttempts
                                )
                                *
                                100
                            )

                            : 0;


                    return {
                        ...cityData,

                        deliveryPercent:
                            deliveryPercent
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
// COUNTERS
// =========================================================

function renderCitiesCounters() {

    const totalCities =
        citiesSummary.length;


    const totalShipments =
        citiesShipments.length;


    const unassigned =
        citiesShipments.filter(

            shipment =>
                !shipment.driver_id

        ).length;


    const delivered =
        citiesShipments.filter(

            shipment =>
                shipment.status ===
                "נמסר"

        ).length;


    if (
        citiesTotalCount
    ) {

        citiesTotalCount.textContent =
            totalCities;
    }


    if (
        citiesShipmentsCount
    ) {

        citiesShipmentsCount.textContent =
            totalShipments;
    }


    if (
        citiesUnassignedCount
    ) {

        citiesUnassignedCount.textContent =
            unassigned;
    }


    if (
        citiesDeliveredCount
    ) {

        citiesDeliveredCount.textContent =
            delivered;
    }

}


// =========================================================
// DELIVERY PERCENT BADGE
// =========================================================

function getDeliveryPercentBadge(
    percent
) {

    let className =
        "waiting";


    if (
        percent >= 90
    ) {

        className =
            "completed";
    }

    else if (
        percent >= 70
    ) {

        className =
            "active";
    }

    else if (
        percent > 0
    ) {

        className =
            "failed";
    }


    return `

        <span class="status ${className}">
            ${percent}%
        </span>

    `;
}


// =========================================================
// FILTERED SUMMARY
// =========================================================

function getFilteredCitiesSummary() {

    const search =
        citiesSearchInput

            ? citiesSearchInput.value
                .trim()
                .toLowerCase()

            : "";


    if (
        !search
    ) {

        return citiesSummary;
    }


    return citiesSummary.filter(

        cityData =>
            cityData.city
                .toLowerCase()
                .includes(
                    search
                )

    );
}


// =========================================================
// RENDER TABLE
// =========================================================

function renderCitiesTable() {

    if (
        !citiesTableBody
    ) {

        return;
    }


    const filteredCities =
        getFilteredCitiesSummary();


    citiesTableBody.innerHTML =
        "";


    if (
        filteredCities.length ===
        0
    ) {

        citiesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    לא נמצאו ערים
                </td>

            </tr>

        `;


        return;
    }


    filteredCities.forEach(

        cityData => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${cityData.city}
                    </strong>

                </td>


                <td>
                    ${cityData.total}
                </td>


                <td>
                    ${cityData.unassigned}
                </td>


                <td>
                    ${cityData.assigned}
                </td>


                <td>
                    ${cityData.onRoute}
                </td>


                <td>
                    ${cityData.delivered}
                </td>


                <td>
                    ${cityData.failed}
                </td>


                <td>
                    ${getDeliveryPercentBadge(
                        cityData.deliveryPercent
                    )}
                </td>

            `;


            citiesTableBody.appendChild(
                row
            );

        }

    );

}


// =========================================================
// ERROR
// =========================================================

function showCitiesError(
    message
) {

    if (
        !citiesTableBody
    ) {

        return;
    }


    citiesTableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                style="
                    text-align:center;
                    padding:35px;
                    color:#b91c1c;
                "
            >
                ${message}
            </td>

        </tr>

    `;
}


// =========================================================
// SEARCH
// =========================================================

if (
    citiesSearchInput
) {

    citiesSearchInput.addEventListener(

        "input",

        renderCitiesTable

    );
}


// =========================================================
// INITIALIZE
// =========================================================

async function initializeCitiesPage() {

    const authenticated =
        await loadCitiesSession();


    if (
        !authenticated
    ) {

        return;
    }


    const profileLoaded =
        await loadCitiesCurrentProfile();


    if (
        !profileLoaded
    ) {

        return;
    }


    renderCitiesCurrentUser();


    const shipmentsLoaded =
        await loadCitiesShipments();


    if (
        !shipmentsLoaded
    ) {

        return;
    }


    buildCitiesSummary();


    renderCitiesCounters();


    renderCitiesTable();
}


// =========================================================
// START
// =========================================================

initializeCitiesPage();