// =========================================================
// GOOGLE MAPS CONFIG
// =========================================================

// חשוב:
// כאן נכנס ה-Website API Key
// לא ה-Delivery Geocoding Server Key

const GOOGLE_MAPS_API_KEY =
    "AIzaSyDGToSoNAmIF0TKeQU1S0P-GNqI8r6UsqQ";


// =========================================================
// GOOGLE MAPS JAVASCRIPT API - BOOTSTRAP LOADER
// =========================================================

// הטעינה הזאת יוצרת את:
// google.maps.importLibrary()
//
// לאחר מכן driver.js יכול לטעון:
// google.maps.importLibrary("places")

(g => {

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
            b[c] = {}
        );

    const d =
        b.maps ||
        (
            b.maps = {}
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
                            resolve,
                            reject
                        ) => {

                            a =
                                m.createElement(
                                    "script"
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
                                "https://maps.googleapis.com/maps/api/js?"
                                +
                                e.toString();


                            d[q] =
                                resolve;


                            a.onerror =
                                () =>
                                    h =
                                        reject(
                                            Error(
                                                p +
                                                " could not load."
                                            )
                                        );


                            a.nonce =
                                m.querySelector(
                                    "script[nonce]"
                                )
                                    ?.nonce
                                ||
                                "";


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
                libraryName,
                ...args
            ) => {

                r.add(
                    libraryName
                );

                return u()
                    .then(
                        () =>
                            d[l](
                                libraryName,
                                ...args
                            )
                    );

            };

})({
    key:
        GOOGLE_MAPS_API_KEY,

    v:
        "weekly",

    language:
        "he",

    region:
        "IL"
});