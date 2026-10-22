// =========================================================
// DELIVERY SYSTEM
// ACTIVITY MAP PREPARATION - SUPABASE
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

const mapSupabase =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// GLOBAL STATE
// =========================================================

let mapAuthUser =
    null;

let mapCurrentProfile =
    null;

let mapProfiles =
    [];

let mapShipments =
    [];


// =========================================================
// DOM
// =========================================================

const mapUserAvatar =
    document.getElementById(
        "mapUserAvatar"
    );


const mapUserName =
    document.getElementById(
        "mapUserName"
    );


const mapUserRole =
    document.getElementById(
        "mapUserRole"
    );


const mapTotalShipments =
    document.getElementById(
        "mapTotalShipments"
    );


const mapAssignedShipments =
    document.getElementById(
        "mapAssignedShipments"
    );


const mapOnRouteShipments =
    document.getElementById(
        "mapOnRouteShipments"
    );


const mapMissingLocationCount =
    document.getElementById(
        "mapMissingLocationCount"
    );


const mapSearchInput =
    document.getElementById(
        "mapSearchInput"
    );


const mapStatusFilter =
    document.getElementById(
        "mapStatusFilter"
    );


const mapShipmentsTableBody =
    document.getElementById(
        "mapShipmentsTableBody"
    );


// =========================================================
// REDIRECT
// =========================================================

function mapRedirectToLogin() {

    sessionStorage.removeItem(
        "delivery_system_current_user"
    );


    window.location.href =
        "login.html";
}


// =========================================================
// LOAD SESSION
// =========================================================

async function loadMapSession() {

    const {
        data,
        error
    } =
        await mapSupabase
            .auth
            .getSession();


    if (
        error
    ) {

        console.error(
            "Failed loading map session:",
            error
        );


        mapRedirectToLogin();

        return false;
    }


    if (
        !data.session ||
        !data.session.user
    ) {

        mapRedirectToLogin();

        return false;
    }


    mapAuthUser =
        data.session.user;


    return true;
}


// =========================================================
// LOAD CURRENT PROFILE
// =========================================================

async function loadMapCurrentProfile() {

    if (
        !mapAuthUser
    ) {

        return false;
    }


    const {
        data,
        error
    } =
        await mapSupabase
            .from(
                "profiles"
            )
            .select(
                `
                id,
                username,
                full_name,
                role,
                status
                `
            )
            .eq(
                "id",
                mapAuthUser.id
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


    mapCurrentProfile =
        data;


    if (
        !mapCurrentProfile ||
        mapCurrentProfile.status !==
            "פעיל"
    ) {

        await mapSupabase
            .auth
            .signOut();


        mapRedirectToLogin();

        return false;
    }


    if (
        mapCurrentProfile.role !==
            "ADMIN"

        &&

        mapCurrentProfile.role !==
            "WAREHOUSE"
    ) {

        if (
            mapCurrentProfile.role ===
            "DRIVER"
        ) {

            window.location.href =
                "driver.html";
        }

        else {

            mapRedirectToLogin();
        }


        return false;
    }


    return true;
}


// =========================================================
// CURRENT USER
// =========================================================

function renderMapCurrentUser() {

    if (
        !mapCurrentProfile
    ) {

        return;
    }


    const fullName =
        mapCurrentProfile.full_name ||
        mapCurrentProfile.username ||
        "משתמש";


    if (
        mapUserName
    ) {

        mapUserName.textContent =
            fullName;
    }


    if (
        mapUserAvatar
    ) {

        mapUserAvatar.textContent =
            fullName
                .trim()
                .charAt(
                    0
                )
            ||
            "מ";
    }


    if (
        mapUserRole
    ) {

        mapUserRole.textContent =
            mapCurrentProfile.role ===
                "ADMIN"

                ? "Administrator"

                : "Warehouse";
    }

}


// =========================================================
// LOAD PROFILES
// =========================================================

async function loadMapProfiles() {

    const {
        data,
        error
    } =
        await mapSupabase
            .from(
                "profiles"
            )
            .select(
                `
                id,
                username,
                full_name,
                role,
                status
                `
            )
            .eq(
                "role",
                "DRIVER"
            );


    if (
        error
    ) {

        console.error(
            "Failed loading map profiles:",
            error
        );


        mapProfiles =
            [];


        return false;
    }


    mapProfiles =
        data ||
        [];


    return true;
}


// =========================================================
// LOAD SHIPMENTS
// =========================================================

async function loadMapShipments() {

    const {
        data,
        error
    } =
        await mapSupabase
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
                driver_id,
                driver_name,
                status,
                created_at
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
            "Failed loading map shipments:",
            error
        );


        mapShipments =
            [];


        showMapTableError(
            "לא ניתן לטעון את המשלוחים."
        );


        return false;
    }


    mapShipments =
        data ||
        [];


    return true;
}


// =========================================================
// ADDRESS
// =========================================================

function getMapShipmentAddress(
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


// =========================================================
// FULL ADDRESS
// =========================================================

function getMapFullAddress(
    shipment
) {

    const address =
        getMapShipmentAddress(
            shipment
        );


    const city =
        String(
            shipment.city ||
            ""
        )
            .trim();


    return [
        address,
        city,
        "ישראל"
    ]
        .filter(
            Boolean
        )
        .join(
            ", "
        );
}


// =========================================================
// DRIVER NAME
// =========================================================

function getMapDriverName(
    shipment
) {

    if (
        shipment.driver_name
    ) {

        return shipment.driver_name;
    }


    if (
        !shipment.driver_id
    ) {

        return "ללא שיוך";
    }


    const driver =
        mapProfiles.find(

            profile =>
                String(
                    profile.id
                )
                ===
                String(
                    shipment.driver_id
                )

        );


    if (
        !driver
    ) {

        return "שליח לא נמצא";
    }


    return (
        driver.full_name ||
        driver.username ||
        "שליח"
    );
}


// =========================================================
// COUNTERS
// =========================================================

function renderMapCounters() {

    const total =
        mapShipments.length;


    const assigned =
        mapShipments.filter(

            shipment =>
                Boolean(
                    shipment.driver_id
                )

        ).length;


    const onRoute =
        mapShipments.filter(

            shipment =>
                shipment.status ===
                "בדרך"

        ).length;


    /*
        For now every shipment is considered missing coordinates
        because latitude / longitude do not exist yet in the table.
        After the next DB change this counter will become real.
    */

    const missingLocation =
        mapShipments.length;


    if (
        mapTotalShipments
    ) {

        mapTotalShipments.textContent =
            total;
    }


    if (
        mapAssignedShipments
    ) {

        mapAssignedShipments.textContent =
            assigned;
    }


    if (
        mapOnRouteShipments
    ) {

        mapOnRouteShipments.textContent =
            onRoute;
    }


    if (
        mapMissingLocationCount
    ) {

        mapMissingLocationCount.textContent =
            missingLocation;
    }

}


// =========================================================
// STATUS CLASS
// =========================================================

function getMapStatusClass(
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
// LOCATION BADGE
// =========================================================

function getMapLocationBadge() {

    return `

        <span class="status waiting">
            ממתין למיקום
        </span>

    `;
}


// =========================================================
// FILTER
// =========================================================

function getFilteredMapShipments() {

    const search =
        mapSearchInput

            ? mapSearchInput.value
                .trim()
                .toLowerCase()

            : "";


    const selectedStatus =
        mapStatusFilter

            ? mapStatusFilter.value

            : "";


    return mapShipments.filter(

        shipment => {

            if (
                selectedStatus &&
                shipment.status !==
                    selectedStatus
            ) {

                return false;
            }


            if (
                search
            ) {

                const searchText =
                    [

                        shipment.shipment_number,

                        shipment.customer,

                        shipment.city,

                        shipment.street,

                        shipment.house_number,

                        getMapDriverName(
                            shipment
                        ),

                        shipment.status

                    ]
                        .filter(
                            Boolean
                        )
                        .join(
                            " "
                        )
                        .toLowerCase();


                if (
                    !searchText.includes(
                        search
                    )
                ) {

                    return false;
                }

            }


            return true;
        }

    );
}


// =========================================================
// TABLE
// =========================================================

function renderMapShipmentsTable() {

    if (
        !mapShipmentsTableBody
    ) {

        return;
    }


    const shipments =
        getFilteredMapShipments();


    mapShipmentsTableBody.innerHTML =
        "";


    if (
        shipments.length ===
        0
    ) {

        mapShipmentsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    לא נמצאו משלוחים
                </td>

            </tr>

        `;


        return;
    }


    shipments.forEach(

        shipment => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    #${shipment.shipment_number || ""}
                </td>


                <td>
                    ${shipment.customer || "-"}
                </td>


                <td>
                    ${shipment.city || "-"}
                </td>


                <td>

                    <div>
                        ${getMapShipmentAddress(
                            shipment
                        ) || "-"}
                    </div>

                    <div
                        style="
                            margin-top:4px;
                            font-size:11px;
                            color:#64748b;
                        "
                    >
                        ${getMapFullAddress(
                            shipment
                        )}
                    </div>

                </td>


                <td>
                    ${getMapDriverName(
                        shipment
                    )}
                </td>


                <td>

                    <span
                        class="
                            status
                            ${getMapStatusClass(
                                shipment.status
                            )}
                        "
                    >
                        ${shipment.status}
                    </span>

                </td>


                <td>
                    ${getMapLocationBadge()}
                </td>

            `;


            mapShipmentsTableBody.appendChild(
                row
            );

        }

    );
}


// =========================================================
// ERROR
// =========================================================

function showMapTableError(
    message
) {

    if (
        !mapShipmentsTableBody
    ) {

        return;
    }


    mapShipmentsTableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
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
// FILTER EVENTS
// =========================================================

if (
    mapSearchInput
) {

    mapSearchInput.addEventListener(

        "input",

        renderMapShipmentsTable

    );
}


if (
    mapStatusFilter
) {

    mapStatusFilter.addEventListener(

        "change",

        renderMapShipmentsTable

    );
}


// =========================================================
// INITIALIZE
// =========================================================

async function initializeMapPage() {

    const authenticated =
        await loadMapSession();


    if (
        !authenticated
    ) {

        return;
    }


    const profileLoaded =
        await loadMapCurrentProfile();


    if (
        !profileLoaded
    ) {

        return;
    }


    renderMapCurrentUser();


    await Promise.all(
        [
            loadMapProfiles(),
            loadMapShipments()
        ]
    );


    renderMapCounters();


    renderMapShipmentsTable();
}


// =========================================================
// START
// =========================================================

initializeMapPage();