// =========================================================
// DELIVERY SYSTEM
// ACTIVITY MAP - GOOGLE MAPS + SUPABASE
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

let googleMap =
    null;

let googleInfoWindow =
    null;

let googleMarkers =
    [];

let googleMapsReady =
    false;

let AdvancedMarkerElementClass =
    null;


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

const mapLocationFilter =
    document.getElementById(
        "mapLocationFilter"
    );

const mapShipmentsTableBody =
    document.getElementById(
        "mapShipmentsTableBody"
    );

const activityMap =
    document.getElementById(
        "activityMap"
    );

const mapStatusText =
    document.getElementById(
        "mapStatusText"
    );

const mapVisibleMarkersCount =
    document.getElementById(
        "mapVisibleMarkersCount"
    );

const mapGeocodeMissingButton =
    document.getElementById(
        "mapGeocodeMissingButton"
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

    const fullName =
        mapCurrentProfile.full_name ||
        mapCurrentProfile.username ||
        "משתמש";


    mapUserName.textContent =
        fullName;


    mapUserAvatar.textContent =
        fullName
            .trim()
            .charAt(
                0
            )
        ||
        "מ";


    mapUserRole.textContent =
        mapCurrentProfile.role ===
            "ADMIN"

            ? "Administrator"

            : "Warehouse";
}


// =========================================================
// LOAD DRIVERS
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
                created_at,
                latitude,
                longitude,
                geocoded_at
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
// GOOGLE MAPS BOOTSTRAP
// =========================================================

function installGoogleMapsBootstrap() {

    if (
        window.google &&
        window.google.maps &&
        window.google.maps.importLibrary
    ) {

        return;
    }


    ((g) => {

        let h;
        let a;
        let k;

        const p =
            "The Google Maps JavaScript API";

        const c =
            "google";

        const l =
            "importLibrary";

        const q =
            "__ib__";

        const m =
            document;

        let b =
            window;


        b =
            b[c] ||
            (
                b[c] =
                {}
            );


        const d =
            b.maps ||
            (
                b.maps =
                    {}
            );


        const r =
            new Set();


        const e =
            new URLSearchParams();


        const u =
            () =>
                h ||
                (
                    h =
                        new Promise(

                            async (
                                f,
                                n
                            ) => {

                                await (
                                    a =
                                        m.createElement(
                                            "script"
                                        )
                                );


                                e.set(
                                    "libraries",
                                    [
                                        ...r
                                    ] + ""
                                );


                                for (
                                    k in g
                                ) {

                                    e.set(
                                        k.replace(
                                            /[A-Z]/g,
                                            t =>
                                                "_" +
                                                t[0]
                                                    .toLowerCase()
                                        ),
                                        g[k]
                                    );
                                }


                                e.set(
                                    "callback",
                                    c +
                                    ".maps." +
                                    q
                                );


                                a.src =
                                    `https://maps.${c}apis.com/maps/api/js?` +
                                    e;


                                d[q] =
                                    f;


                                a.onerror =
                                    () =>
                                        h =
                                            n(
                                                Error(
                                                    p +
                                                    " could not load."
                                                )
                                            );


                                m.head.append(
                                    a
                                );

                            }

                        )
                );


        d[l]
            ? console.warn(
                p +
                " only loads once. Ignoring:",
                g
            )
            : d[l] =
                (
                    f,
                    ...n
                ) =>
                    r.add(
                        f
                    )
                    &&
                    u()
                        .then(
                            () =>
                                d[l](
                                    f,
                                    ...n
                                )
                        );

    })(
        {
            key:
                GOOGLE_MAPS_API_KEY,

            v:
                "weekly",

            language:
                "he",

            region:
                "IL"
        }
    );
}


// =========================================================
// LOAD GOOGLE MAPS
// =========================================================

async function loadGoogleMaps() {

    try {

        if (
            !GOOGLE_MAPS_API_KEY ||
            GOOGLE_MAPS_API_KEY.includes(
                "PASTE_"
            )
        ) {

            throw new Error(
                "Google Maps API key is missing"
            );
        }


        installGoogleMapsBootstrap();


        const [
            mapsLibrary,
            markerLibrary
        ] =
            await Promise.all(
                [
                    google.maps.importLibrary(
                        "maps"
                    ),

                    google.maps.importLibrary(
                        "marker"
                    )
                ]
            );


        AdvancedMarkerElementClass =
            markerLibrary
                .AdvancedMarkerElement;


        googleInfoWindow =
            new google.maps.InfoWindow();


        googleMap =
            new mapsLibrary.Map(
                activityMap,
                {
                    center: {
                        lat:
                            31.95,

                        lng:
                            34.80
                    },

                    zoom:
                        9,

                    mapId:
                        "DEMO_MAP_ID",

                    streetViewControl:
                        false,

                    mapTypeControl:
                        false,

                    fullscreenControl:
                        true
                }
            );


        googleMapsReady =
            true;


        mapStatusText.textContent =
            "Google Maps מחובר";


        return true;

    }

    catch (
        error
    ) {

        console.error(
            "Google Maps load failed:",
            error
        );


        googleMapsReady =
            false;


        mapStatusText.textContent =
            "לא ניתן לטעון את Google Maps";


        activityMap.innerHTML = `

            <div
                style="
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    text-align:center;
                    padding:30px;
                    color:#b91c1c;
                "
            >

                <div>

                    <div
                        style="
                            font-size:42px;
                            margin-bottom:10px;
                        "
                    >
                        ⚠️
                    </div>

                    <strong>
                        Google Maps לא נטען
                    </strong>

                    <p>
                        בדוק שה-Maps JavaScript API פעיל
                        ושה-Website API Key תקין.
                    </p>

                </div>

            </div>

        `;


        return false;
    }

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

    return [
        getMapShipmentAddress(
            shipment
        ),
        shipment.city,
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
// LOCATION
// =========================================================

function shipmentHasLocation(
    shipment
) {

    const latitude =
        Number(
            shipment.latitude
        );


    const longitude =
        Number(
            shipment.longitude
        );


    return (
        Number.isFinite(
            latitude
        )
        &&
        Number.isFinite(
            longitude
        )
    );
}


// =========================================================
// COUNTERS
// =========================================================

function renderMapCounters() {

    mapTotalShipments.textContent =
        mapShipments.length;


    mapAssignedShipments.textContent =
        mapShipments.filter(
            shipment =>
                Boolean(
                    shipment.driver_id
                )
        ).length;


    mapOnRouteShipments.textContent =
        mapShipments.filter(
            shipment =>
                shipment.status ===
                "בדרך"
        ).length;


    mapMissingLocationCount.textContent =
        mapShipments.filter(
            shipment =>
                !shipmentHasLocation(
                    shipment
                )
        ).length;
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

function getMapLocationBadge(
    shipment
) {

    if (
        shipmentHasLocation(
            shipment
        )
    ) {

        return `

            <span class="status completed">
                יש מיקום
            </span>

        `;
    }


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
            .value
            .trim()
            .toLowerCase();


    const selectedStatus =
        mapStatusFilter
            .value;


    const selectedLocation =
        mapLocationFilter
            .value;


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
                selectedLocation ===
                    "LOCATED"

                &&

                !shipmentHasLocation(
                    shipment
                )
            ) {

                return false;
            }


            if (
                selectedLocation ===
                    "MISSING"

                &&

                shipmentHasLocation(
                    shipment
                )
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

                        shipment.phone,

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
// CLEAR MARKERS
// =========================================================

function clearGoogleMarkers() {

    googleMarkers.forEach(

        marker => {

            marker.map =
                null;
        }

    );


    googleMarkers =
        [];
}


// =========================================================
// MARKER CONTENT
// =========================================================

function createMarkerContent(
    shipment
) {

    const element =
        document.createElement(
            "div"
        );


    element.style.width =
        "34px";

    element.style.height =
        "34px";

    element.style.borderRadius =
        "50%";

    element.style.display =
        "flex";

    element.style.alignItems =
        "center";

    element.style.justifyContent =
        "center";

    element.style.background =
        "#2563eb";

    element.style.color =
        "#ffffff";

    element.style.fontSize =
        "16px";

    element.style.fontWeight =
        "700";

    element.style.border =
        "3px solid #ffffff";

    element.style.boxShadow =
        "0 4px 12px rgba(0,0,0,0.25)";


    if (
        shipment.status ===
        "נמסר"
    ) {

        element.textContent =
            "✓";
    }

    else if (
        shipment.status ===
        "לא נמסר"
    ) {

        element.textContent =
            "✕";
    }

    else {

        element.textContent =
            "📦";
    }


    return element;
}


// =========================================================
// INFO WINDOW
// =========================================================

function getMarkerInfoHtml(
    shipment
) {

    return `

        <div
            dir="rtl"
            style="
                min-width:220px;
                font-family:Arial,sans-serif;
                line-height:1.6;
            "
        >

            <strong
                style="
                    font-size:15px;
                "
            >
                #${shipment.shipment_number || ""}
                -
                ${shipment.customer || "לקוח"}
            </strong>

            <div>
                📍 ${getMapFullAddress(
                    shipment
                )}
            </div>

            <div>
                🚚 ${getMapDriverName(
                    shipment
                )}
            </div>

            <div>
                סטטוס:
                ${shipment.status}
            </div>

            ${
                shipment.phone

                    ? `
                        <div>
                            📞
                            <a
                                href="tel:${shipment.phone}"
                            >
                                ${shipment.phone}
                            </a>
                        </div>
                    `

                    : ""
            }

        </div>

    `;
}


// =========================================================
// RENDER GOOGLE MARKERS
// =========================================================

function renderGoogleMarkers() {

    if (
        !googleMapsReady ||
        !googleMap ||
        !AdvancedMarkerElementClass
    ) {

        return;
    }


    clearGoogleMarkers();


    const shipments =
        getFilteredMapShipments()
            .filter(
                shipmentHasLocation
            );


    if (
        shipments.length ===
        0
    ) {

        mapVisibleMarkersCount.textContent =
            "0 נקודות על המפה";


        return;
    }


    const bounds =
        new google.maps.LatLngBounds();


    shipments.forEach(

        shipment => {

            const position = {

                lat:
                    Number(
                        shipment.latitude
                    ),

                lng:
                    Number(
                        shipment.longitude
                    )

            };


            const marker =
                new AdvancedMarkerElementClass(
                    {
                        map:
                            googleMap,

                        position:
                            position,

                        title:
                            `${shipment.customer || ""} - ${getMapFullAddress(
                                shipment
                            )}`,

                        content:
                            createMarkerContent(
                                shipment
                            )
                    }
                );


            marker.addListener(

                "click",

                () => {

                    googleInfoWindow.setContent(
                        getMarkerInfoHtml(
                            shipment
                        )
                    );


                    googleInfoWindow.open(
                        {
                            map:
                                googleMap,

                            anchor:
                                marker
                        }
                    );

                }

            );


            googleMarkers.push(
                marker
            );


            bounds.extend(
                position
            );

        }

    );


    if (
        shipments.length ===
        1
    ) {

        googleMap.setCenter(
            {
                lat:
                    Number(
                        shipments[0].latitude
                    ),

                lng:
                    Number(
                        shipments[0].longitude
                    )
            }
        );


        googleMap.setZoom(
            15
        );
    }

    else {

        googleMap.fitBounds(
            bounds
        );
    }


    mapVisibleMarkersCount.textContent =
        `${shipments.length} נקודות על המפה`;
}


// =========================================================
// OPEN SHIPMENT ON MAP
// =========================================================

function focusShipmentOnMap(
    shipmentId
) {

    const shipment =
        mapShipments.find(

            item =>
                String(
                    item.id
                )
                ===
                String(
                    shipmentId
                )

        );


    if (
        !shipment ||
        !shipmentHasLocation(
            shipment
        ) ||
        !googleMap
    ) {

        return;
    }


    googleMap.setCenter(
        {
            lat:
                Number(
                    shipment.latitude
                ),

            lng:
                Number(
                    shipment.longitude
                )
        }
    );


    googleMap.setZoom(
        17
    );


    window.scrollTo(
        {
            top:
                0,

            behavior:
                "smooth"
        }
    );
}


window.focusShipmentOnMap =
    focusShipmentOnMap;


// =========================================================
// TABLE
// =========================================================

function renderMapShipmentsTable() {

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
                    colspan="8"
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


        renderGoogleMarkers();


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
                    ${getMapShipmentAddress(
                        shipment
                    ) || "-"}
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
                    ${getMapLocationBadge(
                        shipment
                    )}
                </td>

                <td>

                    ${
                        shipmentHasLocation(
                            shipment
                        )

                            ? `
                                <button
                                    type="button"
                                    class="table-btn"
                                    onclick="
                                        focusShipmentOnMap(
                                            '${shipment.id}'
                                        )
                                    "
                                >
                                    הצג במפה
                                </button>
                            `

                            : `
                                <span
                                    style="
                                        color:#94a3b8;
                                        font-size:12px;
                                    "
                                >
                                    טרם אותר
                                </span>
                            `
                    }

                </td>

            `;


            mapShipmentsTableBody.appendChild(
                row
            );

        }

    );


    renderGoogleMarkers();
}


// =========================================================
// ERROR
// =========================================================

function showMapTableError(
    message
) {

    mapShipmentsTableBody.innerHTML = `

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
// GEOCODE ONE SHIPMENT
// =========================================================

async function geocodeMapShipment(
    shipment
) {

    const {
        data,
        error
    } =
        await mapSupabase
            .functions
            .invoke(
                "geocode-shipment",
                {
                    body: {
                        shipment_id:
                            shipment.id
                    }
                }
            );


    if (
        error
    ) {

        console.error(
            "Geocoding failed:",
            shipment.id,
            error
        );


        return false;
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


        return false;
    }


    shipment.latitude =
        data.latitude;

    shipment.longitude =
        data.longitude;

    shipment.geocoded_at =
        data.geocoded_at;


    return true;
}


// =========================================================
// GEOCODE ALL MISSING
// =========================================================

async function geocodeMissingMapShipments() {

    const missing =
        mapShipments.filter(

            shipment =>
                !shipmentHasLocation(
                    shipment
                )

        );


    if (
        missing.length ===
        0
    ) {

        alert(
            "לכל המשלוחים כבר יש מיקום."
        );

        return;
    }


    mapGeocodeMissingButton.disabled =
        true;


    let successCount =
        0;


    for (
        let index = 0;
        index < missing.length;
        index++
    ) {

        mapGeocodeMissingButton.textContent =
            `מאתר ${index + 1}/${missing.length}...`;


        const success =
            await geocodeMapShipment(
                missing[index]
            );


        if (
            success
        ) {

            successCount++;
        }

    }


    mapGeocodeMissingButton.disabled =
        false;


    mapGeocodeMissingButton.textContent =
        "📍 אתר משלוחים ללא מיקום";


    await loadMapShipments();


    renderMapCounters();

    renderMapShipmentsTable();


    alert(
        `הסתיים תהליך האיתור.\n${successCount} מתוך ${missing.length} משלוחים אותרו בהצלחה.`
    );
}


// =========================================================
// EVENTS
// =========================================================

mapSearchInput.addEventListener(
    "input",
    renderMapShipmentsTable
);


mapStatusFilter.addEventListener(
    "change",
    renderMapShipmentsTable
);


mapLocationFilter.addEventListener(
    "change",
    renderMapShipmentsTable
);


mapGeocodeMissingButton.addEventListener(
    "click",
    geocodeMissingMapShipments
);


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


    const mapLoaded =
        await loadGoogleMaps();


    renderMapShipmentsTable();


    if (
        mapLoaded
    ) {

        renderGoogleMarkers();
    }

}


// =========================================================
// START
// =========================================================

initializeMapPage();