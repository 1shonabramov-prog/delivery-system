// =============================================
// Delivery System
// Main JavaScript
// =============================================


// =============================================
// MOCK DATABASE
//
// בשלב הזה אין עדיין Database אמיתי.
// הנתונים האלו רק מדמים מערכת שמחזירה
// פרטי משלוח לפי ברקוד.
// =============================================

const mockShipmentsDatabase = {

    "72900100001": {
        shipmentNumber: "100401",
        customer: "משה לוי",
        phone: "050-1112233",
        city: "ראשון לציון",
        address: "רוטשילד 44"
    },

    "72900100002": {
        shipmentNumber: "100402",
        customer: "דנה כהן",
        phone: "052-3334455",
        city: "חולון",
        address: "סוקולוב 18"
    },

    "72900100003": {
        shipmentNumber: "100403",
        customer: "יוסי ישראלי",
        phone: "054-5556677",
        city: "פתח תקווה",
        address: "חיים עוזר 12"
    },

    "72900100004": {
        shipmentNumber: "100404",
        customer: "נועה אברהם",
        phone: "053-7778899",
        city: "תל אביב",
        address: "דיזנגוף 91"
    },

    "72900100005": {
        shipmentNumber: "100405",
        customer: "אורן לוי",
        phone: "050-9988776",
        city: "רמת גן",
        address: "ביאליק 31"
    }

};


// =============================================
// SCANNED BARCODES
// =============================================

const scannedBarcodes = new Set();


// =============================================
// ELEMENTS
// =============================================

const barcodeInput =
    document.getElementById("barcodeInput");

const scanButton =
    document.getElementById("scanButton");

const scanResult =
    document.getElementById("scanResult");

const recentShipmentsTable =
    document.getElementById("recentShipmentsTable");

const receivedTodayCount =
    document.getElementById("receivedTodayCount");

const duplicateCount =
    document.getElementById("duplicateCount");

const scannerStatus =
    document.getElementById("scannerStatus");


// =============================================
// COUNTERS
// =============================================

let receivedToday = 326;

let duplicateScans = 0;


// =============================================
// BARCODE INPUT
// =============================================

if (barcodeInput) {

    barcodeInput.focus();


    barcodeInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                processBarcode();

            }

        }
    );


    // מחזיר את הפוקוס לשדה הסריקה
    // כדי שעובד המחסן לא יצטרך ללחוץ עליו שוב.

    document.addEventListener(
        "click",
        function (event) {

            const clickedInsideModal =
                event.target.closest(".modal-box");

            if (!clickedInsideModal) {

                setTimeout(
                    function () {

                        barcodeInput.focus();

                    },
                    100
                );

            }

        }
    );

}


// =============================================
// SCAN BUTTON
// =============================================

if (scanButton) {

    scanButton.addEventListener(
        "click",
        processBarcode
    );

}


// =============================================
// PROCESS BARCODE
// =============================================

function processBarcode() {

    if (!barcodeInput) {
        return;
    }


    const barcode =
        barcodeInput.value.trim();


    if (barcode === "") {

        showScanError(
            "יש לסרוק או להזין ברקוד."
        );

        barcodeInput.focus();

        return;

    }


    setScannerWorking();


    // בדיקת כפילות

    if (scannedBarcodes.has(barcode)) {

        duplicateScans++;

        if (duplicateCount) {
            duplicateCount.textContent =
                duplicateScans;
        }


        showDuplicateBarcode(barcode);

        resetScanner();

        return;

    }


    const shipment =
        mockShipmentsDatabase[barcode];


    // ברקוד שקיים במערכת הדמה

    if (shipment) {

        scannedBarcodes.add(barcode);

        receivedToday++;

        if (receivedTodayCount) {
            receivedTodayCount.textContent =
                receivedToday;
        }


        addShipmentToTable(
            barcode,
            shipment
        );


        showScanSuccess(
            barcode,
            shipment
        );


        resetScanner();

        return;

    }


    // ברקוד שלא קיים כרגע במערכת הדמה

    showUnknownBarcode(barcode);

    resetScanner();

}


// =============================================
// SUCCESS MESSAGE
// =============================================

function showScanSuccess(
    barcode,
    shipment
) {

    if (!scanResult) {
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
                משלוח #${shipment.shipmentNumber}
                •
                ${shipment.customer}
                •
                ${shipment.address},
                ${shipment.city}
            </p>

            <small>
                ברקוד:
                ${barcode}
            </small>

        </div>

    `;

}


// =============================================
// DUPLICATE BARCODE
// =============================================

function showDuplicateBarcode(barcode) {

    if (!scanResult) {
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
                המשלוח כבר נקלט
            </h3>

            <p>
                הברקוד ${barcode}
                כבר נסרק במהלך העבודה הנוכחית.
            </p>

            <small>
                המערכת מנעה יצירת משלוח כפול.
            </small>

        </div>

    `;

}


// =============================================
// UNKNOWN BARCODE
// =============================================

function showUnknownBarcode(barcode) {

    if (!scanResult) {
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
                לא נמצאו פרטי משלוח עבור:
                ${barcode}
            </p>

            <small>
                בעתיד המערכת תבצע כאן
                פנייה ל-API של מערכת המשלוחים.
            </small>

        </div>

    `;

}


// =============================================
// GENERIC ERROR
// =============================================

function showScanError(message) {

    if (!scanResult) {
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


// =============================================
// ADD SHIPMENT TO TABLE
// =============================================

function addShipmentToTable(
    barcode,
    shipment
) {

    if (!recentShipmentsTable) {
        return;
    }


    const row =
        document.createElement("tr");


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "he-IL",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    row.innerHTML = `

        <td>
            ${time}
        </td>

        <td>
            #${shipment.shipmentNumber}
        </td>

        <td>
            ${barcode}
        </td>

        <td>
            ${shipment.customer}
        </td>

        <td>
            ${shipment.phone}
        </td>

        <td>
            ${shipment.city}
        </td>

        <td>
            ${shipment.address}
        </td>

        <td>

            <span class="status waiting">
                ממתין לשיוך
            </span>

        </td>

    `;


    recentShipmentsTable.prepend(row);

}


// =============================================
// SCANNER STATUS
// =============================================

function setScannerWorking() {

    if (!scannerStatus) {
        return;
    }


    scannerStatus.innerHTML = `

        <span class="status-dot working"></span>

        מבצע קליטה...

    `;

}


function setScannerReady() {

    if (!scannerStatus) {
        return;
    }


    scannerStatus.innerHTML = `

        <span class="status-dot"></span>

        מוכן לסריקה

    `;

}


// =============================================
// RESET SCANNER
// =============================================

function resetScanner() {

    if (!barcodeInput) {
        return;
    }


    barcodeInput.value = "";


    setTimeout(
        function () {

            setScannerReady();

            barcodeInput.focus();

        },
        300
    );

}


// =============================================
// MANUAL DELIVERY MODAL
// =============================================

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


// פתיחת חלון

if (
    manualDeliveryButton &&
    manualDeliveryModal
) {

    manualDeliveryButton.addEventListener(
        "click",
        function () {

            manualDeliveryModal.classList.remove(
                "hidden"
            );

        }
    );

}


// סגירת חלון

if (closeManualModal) {

    closeManualModal.addEventListener(
        "click",
        closeManualDeliveryModal
    );

}


if (cancelManualDelivery) {

    cancelManualDelivery.addEventListener(
        "click",
        closeManualDeliveryModal
    );

}


function closeManualDeliveryModal() {

    if (!manualDeliveryModal) {
        return;
    }


    manualDeliveryModal.classList.add(
        "hidden"
    );


    if (barcodeInput) {

        setTimeout(
            function () {
                barcodeInput.focus();
            },
            100
        );

    }

}


// =============================================
// MANUAL DELIVERY SUBMIT
// =============================================

if (manualDeliveryForm) {

    manualDeliveryForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const barcode =
                document
                    .getElementById(
                        "manualBarcode"
                    )
                    .value
                    .trim();


            const shipmentNumber =
                document
                    .getElementById(
                        "manualShipmentNumber"
                    )
                    .value
                    .trim();


            const customer =
                document
                    .getElementById(
                        "manualCustomer"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "manualPhone"
                    )
                    .value
                    .trim();


            const city =
                document
                    .getElementById(
                        "manualCity"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "manualAddress"
                    )
                    .value
                    .trim();


            if (scannedBarcodes.has(barcode)) {

                showDuplicateBarcode(
                    barcode
                );

                closeManualDeliveryModal();

                return;

            }


            const shipment = {

                shipmentNumber:
                    shipmentNumber,

                customer:
                    customer,

                phone:
                    phone,

                city:
                    city,

                address:
                    address

            };


            scannedBarcodes.add(
                barcode
            );


            receivedToday++;


            if (receivedTodayCount) {

                receivedTodayCount.textContent =
                    receivedToday;

            }


            addShipmentToTable(
                barcode,
                shipment
            );


            showScanSuccess(
                barcode,
                shipment
            );


            manualDeliveryForm.reset();


            closeManualDeliveryModal();

        }
    );

}