// =========================================================
// DRIVER APP - SUPABASE
// =========================================================


// =========================================================
// CREATE SUPABASE CLIENT
// =========================================================

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// STORAGE
// =========================================================

const CURRENT_USER_STORAGE_KEY =
    "delivery_system_current_user";

const DRIVER_ROUTE_STORAGE_KEY =
    "delivery_system_driver_route_settings";


// =========================================================
// GLOBAL STATE
// =========================================================

let currentAuthUser =
    null;

let currentProfile =
    null;

let driverShipments =
    [];

let selectedShipmentId =
    null;

let routeNeedsRecalculation =
    false;


// =========================================================
// DOM ELEMENTS
// =========================================================

const driverNameElement =
    document.getElementById(
        "driverName"
    );

const driverDateElement =
    document.getElementById(
        "driverDate"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const totalShipmentsElement =
    document.getElementById(
        "totalShipments"
    );

const deliveredShipmentsElement =
    document.getElementById(
        "deliveredShipments"
    );

const remainingShipmentsElement =
    document.getElementById(
        "remainingShipments"
    );

const failedShipmentsElement =
    document.getElementById(
        "failedShipments"
    );


const addShipmentButton =
    document.getElementById(
        "addShipmentButton"
    );

const addShipmentModal =
    document.getElementById(
        "addShipmentModal"
    );

const closeAddShipmentModal =
    document.getElementById(
        "closeAddShipmentModal"
    );

const cancelAddShipmentButton =
    document.getElementById(
        "cancelAddShipmentButton"
    );

const driverAddShipmentForm =
    document.getElementById(
        "driverAddShipmentForm"
    );


const driverShipmentModalTitle =
    document.getElementById(
        "driverShipmentModalTitle"
    );

const driverShipmentModalSubtitle =
    document.getElementById(
        "driverShipmentModalSubtitle"
    );

const editingDriverShipmentId =
    document.getElementById(
        "editingDriverShipmentId"
    );

const saveDriverShipmentButton =
    document.getElementById(
        "saveDriverShipmentButton"
    );


// =========================================================
// GOOGLE PLACES DOM
// =========================================================

let driverShipmentAddressSearch =
    document.getElementById(
        "driverShipmentAddressSearch"
    );

const driverShipmentGooglePlaceId =
    document.getElementById(
        "driverShipmentGooglePlaceId"
    );

const driverShipmentFormattedAddress =
    document.getElementById(
        "driverShipmentFormattedAddress"
    );

const driverShipmentLatitude =
    document.getElementById(
        "driverShipmentLatitude"
    );

const driverShipmentLongitude =
    document.getElementById(
        "driverShipmentLongitude"
    );

const driverShipmentAddressSelected =
    document.getElementById(
        "driverShipmentAddressSelected"
    );

let googlePlacesReady =
    false;

let googlePlaceAutocomplete =
    null;


const driverShipmentsList =
    document.getElementById(
        "driverShipmentsList"
    );

const driverShipmentsSection =
    driverShipmentsList
        ? driverShipmentsList.closest(
            ".shipments-section"
        )
        : null;

const shipmentCountBadge =
    document.getElementById(
        "shipmentCountBadge"
    );

const shipmentListSubtitle =
    document.getElementById(
        "shipmentListSubtitle"
    );


// =========================================================
// ROUTE DOM
// =========================================================

const toggleRoutePlannerButton =
    document.getElementById(
        "toggleRoutePlannerButton"
    );

const routePlannerSection =
    document.getElementById(
        "routePlannerSection"
    );

const routeDate =
    document.getElementById(
        "routeDate"
    );

const routeStartTime =
    document.getElementById(
        "routeStartTime"
    );

const routeStartAddress =
    document.getElementById(
        "routeStartAddress"
    );

const routeEndAddress =
    document.getElementById(
        "routeEndAddress"
    );

const saveRouteSettingsButton =
    document.getElementById(
        "saveRouteSettingsButton"
    );

const calculateRouteButton =
    document.getElementById(
        "calculateRouteButton"
    );

const recalculateRouteButton =
    document.getElementById(
        "recalculateRouteButton"
    );

const routePlannerMessage =
    document.getElementById(
        "routePlannerMessage"
    );


const routeSummarySection =
    document.getElementById(
        "routeSummarySection"
    );

const routeSummaryStartTime =
    document.getElementById(
        "routeSummaryStartTime"
    );

const routeSummaryEndTime =
    document.getElementById(
        "routeSummaryEndTime"
    );

const routeSummaryDuration =
    document.getElementById(
        "routeSummaryDuration"
    );

const routeSummaryDistance =
    document.getElementById(
        "routeSummaryDistance"
    );

const routeUpdateWarning =
    document.getElementById(
        "routeUpdateWarning"
    );

const optimizedRouteList =
    document.getElementById(
        "optimizedRouteList"
    );


// =========================================================
// DELIVERY DETAILS DOM
// =========================================================

const deliveryDetailsOverlay =
    document.getElementById(
        "deliveryDetailsOverlay"
    );

const closeDeliveryDetailsButton =
    document.getElementById(
        "closeDeliveryDetails"
    );

const deliveryShipmentNumber =
    document.getElementById(
        "deliveryShipmentNumber"
    );

const deliveryCustomerName =
    document.getElementById(
        "deliveryCustomerName"
    );

const deliveryAddress =
    document.getElementById(
        "deliveryAddress"
    );

const deliveryAddressButton =
    document.getElementById(
        "deliveryAddressButton"
    );

const deliveryBuildingDetails =
    document.getElementById(
        "deliveryBuildingDetails"
    );

const deliveryBuildingCode =
    document.getElementById(
        "deliveryBuildingCode"
    );

const deliveryPhone =
    document.getElementById(
        "deliveryPhone"
    );

const deliveryAddressNotes =
    document.getElementById(
        "deliveryAddressNotes"
    );

const deliveryInstructions =
    document.getElementById(
        "deliveryInstructions"
    );

const deliveryNotes =
    document.getElementById(
        "deliveryNotes"
    );

const deliveryEta =
    document.getElementById(
        "deliveryEta"
    );

const callCustomerButton =
    document.getElementById(
        "callCustomerButton"
    );

const openWazeDirectButton =
    document.getElementById(
        "openWazeDirectButton"
    );

const editDriverShipmentButton =
    document.getElementById(
        "editDriverShipmentButton"
    );

const deliveryRouteUpdateMessage =
    document.getElementById(
        "deliveryRouteUpdateMessage"
    );

const markDeliveredButton =
    document.getElementById(
        "markDeliveredButton"
    );

const markFailedButton =
    document.getElementById(
        "markFailedButton"
    );


const driverReportsButton =
    document.getElementById(
        "driverReportsButton"
    );


// =========================================================
// YB GO V2 - SAFE WORK MODE VISUAL LAYER
// =========================================================

function injectDriverV2Styles() {

    if (
        document.getElementById(
            "ybDriverV2Styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "ybDriverV2Styles";

    style.textContent = `
        :root {
            color-scheme: dark;
            --yb-bg: #050a12;
            --yb-bg-2: #07111f;
            --yb-panel: rgba(13, 25, 43, .84);
            --yb-panel-strong: #0c1728;
            --yb-panel-soft: rgba(20, 38, 63, .68);
            --yb-border: rgba(119, 174, 255, .22);
            --yb-border-strong: rgba(91, 168, 255, .46);
            --yb-text: #f7faff;
            --yb-muted: #8fa4bf;
            --yb-blue: #1387ff;
            --yb-blue-2: #225dff;
            --yb-cyan: #28cfff;
            --yb-success: #25d783;
            --yb-danger: #ff5b69;
            --yb-shadow: 0 20px 55px rgba(0, 0, 0, .36);
        }

        * {
            box-sizing: border-box;
        }

        html,
        body {
            background:
                radial-gradient(circle at 50% -10%, rgba(25, 116, 255, .20), transparent 34%),
                linear-gradient(180deg, #06101d 0%, #050a12 55%, #04070d 100%) !important;
            color: var(--yb-text) !important;
        }

        body {
            min-height: 100vh;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Arial,
                sans-serif !important;
        }

        body::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            background:
                linear-gradient(115deg, transparent 0 52%, rgba(23, 119, 255, .035) 52% 53%, transparent 53%),
                radial-gradient(circle at 85% 22%, rgba(20, 165, 255, .08), transparent 24%);
            z-index: 0;
        }

        .driver-app {
            position: relative;
            z-index: 1;
            width: min(100%, 560px) !important;
            margin-inline: auto !important;
            min-height: 100vh;
            padding: 18px 16px 34px !important;
            background: transparent !important;
            color: var(--yb-text) !important;
        }

        .driver-header {
            position: relative;
            overflow: hidden;
            background:
                linear-gradient(145deg, rgba(15, 34, 59, .92), rgba(8, 18, 32, .82)) !important;
            border: 1px solid var(--yb-border) !important;
            border-radius: 26px !important;
            padding: 20px 18px !important;
            box-shadow: var(--yb-shadow) !important;
            backdrop-filter: blur(18px);
        }

        .driver-header::before {
            content: "YB GO";
            position: absolute;
            left: 18px;
            top: 17px;
            font-size: 19px;
            font-weight: 900;
            letter-spacing: .5px;
            background: linear-gradient(90deg, #fff, #46a6ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .driver-header::after {
            content: "";
            position: absolute;
            width: 190px;
            height: 70px;
            left: -42px;
            bottom: -42px;
            border-radius: 50%;
            background: rgba(22, 117, 255, .18);
            filter: blur(22px);
        }

        .driver-header h1 {
            margin: 2px 0 4px !important;
            color: var(--yb-text) !important;
            font-size: clamp(24px, 6vw, 31px) !important;
            line-height: 1.1 !important;
            letter-spacing: -.5px;
        }

        .header-small,
        .driver-date {
            color: var(--yb-muted) !important;
        }

        .logout-button,
        .modal-close-button {
            border: 1px solid rgba(255,255,255,.12) !important;
            background: rgba(255,255,255,.07) !important;
            color: #e8f1ff !important;
            border-radius: 15px !important;
            min-width: 44px;
            min-height: 44px;
            box-shadow: none !important;
            backdrop-filter: blur(12px);
        }

        .summary-grid {
            gap: 10px !important;
            margin-top: 14px !important;
        }

        .summary-card {
            min-height: 90px !important;
            padding: 15px !important;
            border-radius: 21px !important;
            background:
                linear-gradient(145deg, rgba(20, 37, 61, .88), rgba(10, 20, 35, .92)) !important;
            border: 1px solid var(--yb-border) !important;
            box-shadow: 0 10px 28px rgba(0,0,0,.22) !important;
        }

        .summary-number {
            color: var(--yb-text) !important;
            font-size: 28px !important;
            line-height: 1 !important;
            font-weight: 900 !important;
        }

        .summary-label {
            margin-top: 7px !important;
            color: var(--yb-muted) !important;
            font-size: 12px !important;
        }

        .main-actions {
            gap: 10px !important;
            margin-top: 14px !important;
        }

        .primary-action-button,
        .route-save-button,
        .save-button {
            min-height: 58px !important;
            border: 0 !important;
            border-radius: 18px !important;
            background:
                linear-gradient(
                    135deg,
                    var(--yb-blue),
                    var(--yb-blue-2)
                ) !important;
            color: white !important;
            font-weight: 850 !important;
            box-shadow:
                0 12px 30px rgba(18, 104, 255, .23),
                inset 0 1px 0 rgba(255,255,255,.16) !important;
        }

        .secondary-action-button,
        .reports-button,
        .cancel-button {
            min-height: 54px !important;
            border: 1px solid var(--yb-border) !important;
            border-radius: 18px !important;
            background:
                linear-gradient(145deg, rgba(21, 38, 62, .82), rgba(10, 20, 34, .90)) !important;
            color: var(--yb-text) !important;
            box-shadow: none !important;
            font-weight: 760 !important;
        }

        .route-planner,
        .shipments-section,
        .reports-section {
            margin-top: 16px !important;
            padding: 16px !important;
            border-radius: 24px !important;
            background:
                linear-gradient(145deg, rgba(14, 27, 46, .88), rgba(8, 17, 30, .92)) !important;
            border: 1px solid var(--yb-border) !important;
            box-shadow: 0 12px 34px rgba(0,0,0,.20) !important;
        }

        .section-heading h2 {
            color: var(--yb-text) !important;
            font-size: 22px !important;
            font-weight: 900 !important;
            letter-spacing: -.3px;
        }

        .section-heading p,
        #shipmentListSubtitle {
            color: var(--yb-muted) !important;
        }

        .shipment-count-badge {
            background: linear-gradient(135deg, #178cff, #315cff) !important;
            color: #fff !important;
            border: 0 !important;
            box-shadow: 0 8px 20px rgba(30, 110, 255, .28);
        }

        .driver-shipment-card {
            width: 100%;
            margin-bottom: 10px !important;
            padding: 16px !important;
            text-align: right !important;
            border-radius: 22px !important;
            background:
                linear-gradient(145deg, rgba(22, 39, 64, .94), rgba(9, 19, 33, .96)) !important;
            border: 1px solid var(--yb-border) !important;
            color: var(--yb-text) !important;
            box-shadow:
                0 14px 34px rgba(0,0,0,.22),
                inset 0 1px 0 rgba(255,255,255,.04) !important;
        }

        .shipment-card-customer,
        .shipment-card-address,
        .shipment-card-phone,
        .shipment-card-footer {
            color: var(--yb-text) !important;
        }

        .shipment-card-customer {
            font-size: 18px !important;
            font-weight: 850 !important;
        }

        .shipment-card-address {
            margin-top: 12px !important;
            font-size: 16px !important;
            font-weight: 720 !important;
            color: #d9e9ff !important;
        }

        .shipment-card-phone {
            margin-top: 8px !important;
            color: #9fc8ff !important;
        }

        .shipment-open-text {
            color: #69b6ff !important;
            font-weight: 800 !important;
        }

        .driver-empty-state {
            border-radius: 20px !important;
            background: rgba(255,255,255,.035) !important;
            border: 1px dashed rgba(112, 172, 255, .22) !important;
            color: var(--yb-muted) !important;
        }

        /* ===================== */
        /* ADD / EDIT SHIPMENT   */
        /* ===================== */

        .modal-overlay {
            background: rgba(2, 6, 12, .78) !important;
            backdrop-filter: blur(14px);
        }

        .modal-card {
            width: min(94vw, 540px) !important;
            max-height: 94vh !important;
            overflow-y: auto !important;
            border-radius: 30px !important;
            padding: 18px !important;
            background:
                radial-gradient(circle at 20% 0%, rgba(30, 126, 255, .14), transparent 28%),
                linear-gradient(180deg, #0b1729, #08111f) !important;
            border: 1px solid var(--yb-border-strong) !important;
            box-shadow: 0 28px 80px rgba(0,0,0,.52) !important;
            color: var(--yb-text) !important;
        }

        .modal-header {
            position: sticky;
            top: -18px;
            z-index: 8;
            margin: -18px -18px 16px !important;
            padding: 20px 18px 14px !important;
            background:
                linear-gradient(180deg, rgba(8,17,31,.98), rgba(8,17,31,.93)) !important;
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(109, 171, 255, .12);
        }

        .modal-header h2 {
            color: #fff !important;
            font-size: 25px !important;
            font-weight: 900 !important;
            margin-bottom: 4px !important;
        }

        .modal-header p {
            color: var(--yb-muted) !important;
        }

        #driverAddShipmentForm {
            display: grid;
            gap: 10px;
        }

        #driverAddShipmentForm .form-group {
            margin: 0 !important;
        }

        #driverAddShipmentForm label {
            display: block;
            margin: 0 3px 7px !important;
            color: #b7cae3 !important;
            font-size: 12px !important;
            font-weight: 760 !important;
        }

        #driverAddShipmentForm input,
        #driverAddShipmentForm textarea,
        #routePlannerSection input,
        gmp-place-autocomplete {
            width: 100% !important;
            min-height: 54px !important;
            padding: 14px 15px !important;
            border-radius: 17px !important;
            border: 1px solid rgba(108, 168, 255, .22) !important;
            background: rgba(19, 35, 58, .82) !important;
            color: #f7fbff !important;
            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.035) !important;
            outline: none !important;
            font: inherit !important;
        }

        #driverAddShipmentForm textarea {
            min-height: 74px !important;
            resize: vertical;
        }

        #driverAddShipmentForm input:focus,
        #driverAddShipmentForm textarea:focus,
        #routePlannerSection input:focus {
            border-color: rgba(40, 169, 255, .82) !important;
            box-shadow:
                0 0 0 3px rgba(27, 139, 255, .12),
                0 0 26px rgba(26, 119, 255, .10) !important;
        }

        #driverAddShipmentForm input::placeholder,
        #driverAddShipmentForm textarea::placeholder,
        #routePlannerSection input::placeholder {
            color: #6f829d !important;
        }

        .address-row,
        .address-details-row {
            gap: 10px !important;
        }

        .modal-actions {
            position: sticky;
            bottom: -18px;
            z-index: 8;
            margin: 8px -18px -18px !important;
            padding: 12px 18px 18px !important;
            background:
                linear-gradient(0deg, rgba(8,17,31,.99) 65%, rgba(8,17,31,.78), transparent) !important;
        }

        #driverShipmentAddressSelected {
            border-radius: 15px !important;
            padding: 10px 12px !important;
            color: #8ed2ff !important;
            background: rgba(19, 125, 255, .10) !important;
            border: 1px solid rgba(68, 171, 255, .20) !important;
        }

        /* ===================== */
        /* DELIVERY WORK SHEET   */
        /* ===================== */

        .bottom-sheet-overlay {
            background: rgba(0,0,0,.66) !important;
            backdrop-filter: blur(12px);
        }

        .bottom-sheet {
            position: relative;
            overflow: hidden;
            background:
                radial-gradient(circle at 78% 0%, rgba(23, 126, 255, .13), transparent 25%),
                linear-gradient(180deg, #0a1525, #07101d) !important;
            color: var(--yb-text) !important;
            border: 1px solid var(--yb-border-strong) !important;
            border-bottom: 0 !important;
            border-radius: 30px 30px 0 0 !important;
            box-shadow: 0 -30px 80px rgba(0,0,0,.50) !important;
        }

        .bottom-sheet::before {
            content: "YB GO";
            position: absolute;
            left: 22px;
            top: 18px;
            font-size: 15px;
            font-weight: 900;
            letter-spacing: .4px;
            color: #5eb4ff;
            opacity: .90;
        }

        .bottom-sheet-handle {
            background: rgba(255,255,255,.20) !important;
            width: 46px !important;
            height: 5px !important;
            border-radius: 999px !important;
        }

        .delivery-sheet-header {
            padding-top: 6px;
        }

        .delivery-sheet-header h2 {
            color: #fff !important;
            font-size: 27px !important;
            font-weight: 900 !important;
            letter-spacing: -.4px;
        }

        .delivery-number {
            color: #6daeff !important;
            font-weight: 750 !important;
        }

        .delivery-info-card {
            position: relative;
            overflow: hidden;
            padding: 15px !important;
            border-radius: 24px !important;
            background:
                linear-gradient(145deg, rgba(22, 42, 69, .86), rgba(10, 22, 39, .90)) !important;
            border: 1px solid rgba(92, 167, 255, .28) !important;
            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.035),
                0 15px 36px rgba(0,0,0,.20) !important;
        }

        .delivery-info-card::after {
            content: "";
            position: absolute;
            width: 120px;
            height: 120px;
            left: -50px;
            top: -50px;
            border-radius: 50%;
            background: rgba(25, 123, 255, .12);
            filter: blur(22px);
            pointer-events: none;
        }

        .delivery-info-row {
            padding: 9px 0 !important;
            border-bottom: 1px solid rgba(157, 196, 246, .09) !important;
        }

        .delivery-info-row:last-child {
            border-bottom: 0 !important;
        }

        .info-label {
            color: var(--yb-muted) !important;
            font-size: 11px !important;
        }

        #deliveryAddressButton,
        #deliveryPhone,
        #deliveryEta {
            color: #65b2ff !important;
            font-weight: 850 !important;
        }

        .delivery-actions-grid {
            gap: 10px !important;
            margin-top: 12px !important;
        }

        .delivery-action-button {
            min-height: 58px !important;
            border-radius: 18px !important;
            border: 1px solid var(--yb-border) !important;
            background:
                linear-gradient(145deg, rgba(23, 42, 67, .90), rgba(9, 19, 33, .94)) !important;
            color: #f7fbff !important;
            font-weight: 850 !important;
            box-shadow: none !important;
        }

        #openWazeDirectButton {
            background:
                linear-gradient(
                    135deg,
                    #18a9ff,
                    #235cff
                ) !important;
            border-color: rgba(50, 174, 255, .72) !important;
            box-shadow:
                0 12px 30px rgba(22, 108, 255, .25),
                inset 0 1px 0 rgba(255,255,255,.18) !important;
        }

        #callCustomerButton {
            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.04) !important;
        }

        .delivery-status-actions {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            margin-top: 12px !important;
        }

        .yb-delivery-slider {
            position: relative !important;
            width: 100% !important;
            height: 70px !important;
            padding: 0 !important;
            overflow: hidden !important;
            border: 1px solid rgba(38, 186, 255, .78) !important;
            border-radius: 24px !important;
            background:
                linear-gradient(
                    135deg,
                    rgba(9, 64, 140, .76),
                    rgba(18, 82, 214, .74)
                ) !important;
            color: #fff !important;
            touch-action: pan-y !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            cursor: grab !important;
            box-shadow:
                0 0 0 1px rgba(37, 156, 255, .10),
                0 0 30px rgba(21, 126, 255, .23),
                inset 0 0 24px rgba(42, 168, 255, .10) !important;
        }

        .yb-delivery-slider::after {
            content: "";
            position: absolute;
            left: 18%;
            right: 18%;
            bottom: 6px;
            height: 2px;
            background:
                linear-gradient(
                    90deg,
                    transparent,
                    rgba(62, 202, 255, .85),
                    transparent
                );
            filter: blur(.2px);
        }

        .yb-delivery-slider:active {
            cursor: grabbing !important;
        }

        .yb-slide-label {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-inline: 84px 24px;
            font-size: 18px;
            font-weight: 900;
            letter-spacing: -.1px;
            pointer-events: none;
            text-shadow: 0 2px 18px rgba(0,0,0,.26);
        }

        .yb-slide-label::after {
            content: "›››";
            margin-right: 10px;
            color: #55d2ff;
            letter-spacing: -4px;
            font-size: 26px;
            line-height: 1;
        }

        .yb-slide-thumb {
            position: absolute;
            top: 7px;
            right: 7px;
            width: 56px;
            height: 56px;
            display: grid;
            place-items: center;
            border-radius: 18px;
            background:
                linear-gradient(
                    145deg,
                    #53d5ff,
                    #1788ff
                );
            color: #03234e;
            font-size: 27px;
            font-weight: 950;
            transform: translateX(0);
            transition: transform .18s ease;
            pointer-events: none;
            border: 1px solid rgba(255,255,255,.62);
            box-shadow:
                0 0 24px rgba(42, 190, 255, .60),
                inset 0 1px 0 rgba(255,255,255,.72);
        }

        .yb-delivery-slider.yb-slide-dragging .yb-slide-thumb {
            transition: none;
        }

        .yb-delivery-slider.yb-slide-complete {
            background:
                linear-gradient(135deg, #0b72dd, #255bff) !important;
        }

        .failed-button {
            min-height: 52px !important;
            border-radius: 18px !important;
            background:
                linear-gradient(145deg, rgba(74, 19, 29, .23), rgba(24, 11, 18, .58)) !important;
            color: #ff6876 !important;
            border: 1px solid rgba(255,91,105,.52) !important;
            font-weight: 850 !important;
            box-shadow: none !important;
        }

        #editDriverShipmentButton {
            border-radius: 18px !important;
        }

        .route-message {
            border-radius: 16px !important;
        }

        .yb-driver-toast {
            position: fixed;
            left: 16px;
            right: 16px;
            bottom: 24px;
            z-index: 99999;
            max-width: 520px;
            margin-inline: auto;
            padding: 14px 18px;
            border-radius: 17px;
            background:
                linear-gradient(145deg, #15365c, #0e1f36);
            color: #fff;
            border: 1px solid rgba(85, 176, 255, .26);
            box-shadow: 0 18px 50px rgba(0,0,0,.42);
            font-weight: 850;
            text-align: center;
            opacity: 0;
            transform: translateY(14px);
            transition: .22s ease;
            pointer-events: none;
        }

        .yb-driver-toast.show {
            opacity: 1;
            transform: translateY(0);
        }

        @media (max-width: 640px) {
            .driver-app {
                padding: 10px 10px 28px !important;
            }

            .driver-header {
                border-radius: 22px !important;
                padding: 17px 15px !important;
            }

            .summary-grid {
                gap: 8px !important;
            }

            .summary-card {
                min-height: 82px !important;
                padding: 13px !important;
                border-radius: 18px !important;
            }

            .main-actions {
                gap: 8px !important;
            }

            .route-planner,
            .shipments-section,
            .reports-section {
                margin-top: 12px !important;
                padding: 13px !important;
                border-radius: 21px !important;
            }

            .driver-shipment-card {
                padding: 14px !important;
                border-radius: 19px !important;
            }

            .modal-card {
                width: 100vw !important;
                max-width: none !important;
                max-height: 100dvh !important;
                min-height: 100dvh !important;
                border-radius: 0 !important;
                border-inline: 0 !important;
                border-bottom: 0 !important;
                padding: 15px !important;
            }

            .modal-header {
                top: -15px;
                margin: -15px -15px 14px !important;
                padding: 18px 15px 13px !important;
            }

            #driverAddShipmentForm input,
            #driverAddShipmentForm textarea,
            #routePlannerSection input,
            gmp-place-autocomplete {
                min-height: 52px !important;
                border-radius: 16px !important;
            }

            .modal-actions {
                bottom: -15px;
                margin: 8px -15px -15px !important;
                padding: 12px 15px 15px !important;
            }

            .bottom-sheet {
                max-height: 96dvh !important;
                overflow-y: auto !important;
                padding-bottom: 18px !important;
                border-radius: 28px 28px 0 0 !important;
            }

            .delivery-sheet-header {
                margin-bottom: 8px !important;
            }

            .delivery-info-card {
                padding: 12px !important;
                margin-bottom: 9px !important;
                border-radius: 21px !important;
            }

            .delivery-info-row {
                gap: 6px !important;
                padding-block: 6px !important;
            }

            .delivery-actions-grid {
                margin-top: 8px !important;
                margin-bottom: 8px !important;
            }

            .delivery-status-actions {
                margin-top: 8px !important;
                margin-bottom: 9px !important;
            }

            #editDriverShipmentButton {
                margin-top: 8px !important;
                min-height: 46px !important;
                font-size: 14px !important;
                opacity: .92;
            }

            .yb-delivery-slider {
                height: 64px !important;
                border-radius: 20px !important;
            }

            .yb-slide-thumb {
                width: 50px;
                height: 50px;
                top: 6px;
                right: 6px;
                border-radius: 16px;
            }

            .yb-slide-label {
                font-size: 16px;
                padding-inline: 74px 18px;
            }

            .yb-slide-label::after {
                font-size: 22px;
            }

            .failed-button {
                min-height: 48px !important;
            }
        }
    `;

    document.head.appendChild(
        style
    );

}


injectDriverV2Styles();


function arrangeDriverWorkActions() {

    const actionGrid =
        document.querySelector(
            ".delivery-actions-grid"
        );

    const statusActions =
        document.querySelector(
            ".delivery-status-actions"
        );

    const editButton =
        document.getElementById(
            "editDriverShipmentButton"
        );


    if (
        actionGrid &&
        statusActions
    ) {

        actionGrid.insertAdjacentElement(
            "afterend",
            statusActions
        );

    }


    if (
        statusActions &&
        editButton
    ) {

        statusActions.insertAdjacentElement(
            "afterend",
            editButton
        );

    }

}


arrangeDriverWorkActions();


function enhanceDriverV2Structure() {

    // Number-only keyboard where the task is numeric.
    [
        "driverShipmentHouseNumber",
        "driverShipmentFloor",
        "driverShipmentApartment"
    ].forEach(
        id => {

            const input =
                document.getElementById(
                    id
                );

            if (
                input
            ) {

                input.setAttribute(
                    "inputmode",
                    "numeric"
                );

                input.setAttribute(
                    "pattern",
                    "[0-9]*"
                );

            }

        }
    );


    const buildingCode =
        document.getElementById(
            "driverShipmentBuildingCode"
        );

    if (
        buildingCode
    ) {

        buildingCode.setAttribute(
            "inputmode",
            "numeric"
        );

    }


    const phone =
        document.getElementById(
            "driverShipmentPhone"
        );

    if (
        phone
    ) {

        phone.setAttribute(
            "inputmode",
            "tel"
        );

    }


    // Make add-shipment form start with address search when available.
    const form =
        document.getElementById(
            "driverAddShipmentForm"
        );

    const addressSearch =
        document.getElementById(
            "driverShipmentAddressSearch"
        );


    if (
        form &&
        addressSearch
    ) {

        const wrapper =
            addressSearch.closest(
                ".form-group"
            )
            ||
            addressSearch.parentElement;


        if (
            wrapper &&
            wrapper.parentElement ===
                form
        ) {

            const firstVisibleChild =
                Array.from(
                    form.children
                ).find(
                    child =>
                        child.tagName !==
                            "INPUT"
                        ||
                        child.type !==
                            "hidden"
                );


            if (
                firstVisibleChild &&
                firstVisibleChild !==
                    wrapper
            ) {

                form.insertBefore(
                    wrapper,
                    firstVisibleChild
                );

            }

        }

    }


    // Shorter, more app-like labels.
    const modalTitle =
        document.getElementById(
            "driverShipmentModalTitle"
        );

    const modalSubtitle =
        document.getElementById(
            "driverShipmentModalSubtitle"
        );


    if (
        modalTitle &&
        !getInputValue(
            "editingDriverShipmentId"
        )
    ) {

        modalTitle.textContent =
            "הוספת משלוח";

    }


    if (
        modalSubtitle &&
        !getInputValue(
            "editingDriverShipmentId"
        )
    ) {

        modalSubtitle.textContent =
            "כתובת, טלפון ופרטי מסירה — וזהו";

    }

}


enhanceDriverV2Structure();


let ybDriverToastTimer =
    null;


function showDriverToast(
    message
) {

    let toast =
        document.getElementById(
            "ybDriverToast"
        );


    if (
        !toast
    ) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "ybDriverToast";

        toast.className =
            "yb-driver-toast";

        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList
        .add(
            "show"
        );


    if (
        ybDriverToastTimer
    ) {

        clearTimeout(
            ybDriverToastTimer
        );

    }


    ybDriverToastTimer =
        setTimeout(
            () => {

                toast.classList
                    .remove(
                        "show"
                    );

            },
            2200
        );

}


// =========================================================
// BASIC HELPERS
// =========================================================

function getInputValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.value.trim()
        : "";

}


function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element
    ) {

        element.value =
            value ||
            "";

    }

}


function normalizePhoneForTel(
    phone
) {

    return String(
        phone ||
        ""
    )
        .replace(
            /[^\d+]/g,
            ""
        );

}


// =========================================================
// ADDRESS
// =========================================================

function getShipmentMainAddress(
    shipment
) {

    const mainAddress =
        `${shipment.street || ""} ${shipment.house_number || ""}`
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    if (
        shipment.city
    ) {

        return (
            `${mainAddress}, ${shipment.city}`
        );
    }


    return mainAddress;

}


// =========================================================
// BUILDING DETAILS
// =========================================================

function getShipmentBuildingDetails(
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
        "ללא פרטים נוספים"
    );

}


// =========================================================
// STATUS CLASS
// =========================================================

function getDriverStatusClass(
    status
) {

    switch (
        status
    ) {

        case "נמסר":

            return "status-delivered";


        case "לא נמסר":

            return "status-failed";


        case "בדרך":

            return "status-route";


        case "משויך":

            return "status-assigned";


        default:

            return "status-waiting";

    }

}


// =========================================================
// CREATE INTERNAL SHIPMENT NUMBER
// =========================================================

function createShipmentNumber() {

    return (
        "D" +
        Date.now()
            .toString()
            .slice(
                -8
            )
    );

}


// =========================================================
// SELECTED SHIPMENT
// =========================================================

function getSelectedShipment() {

    if (
        !selectedShipmentId
    ) {

        return null;

    }


    return driverShipments.find(

        shipment =>
            shipment.id ===
            selectedShipmentId

    ) || null;

}


// =========================================================
// AUTH
// =========================================================

async function loadAuthenticatedUser() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        error ||
        !data.session ||
        !data.session.user
    ) {

        if (
            error
        ) {

            console.error(
                "Failed loading Supabase session:",
                error
            );

        }


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


    if (
        !data ||
        data.role !==
        "DRIVER" ||
        data.status !==
        "פעיל"
    ) {

        await supabaseClient
            .auth
            .signOut();


        redirectToLogin();


        return false;

    }


    currentProfile =
        data;


    saveCurrentUserSession();


    return true;

}


// =========================================================
// SAVE APP SESSION
// =========================================================

function saveCurrentUserSession() {

    if (
        !currentProfile ||
        !currentAuthUser
    ) {

        return;

    }


    const currentUser = {

        id:
            currentProfile.id,

        driverId:
            currentProfile.id,

        username:
            currentProfile.username ||
            "",

        fullName:
            currentProfile.full_name ||
            "",

        phone:
            currentProfile.phone ||
            "",

        role:
            currentProfile.role,

        status:
            currentProfile.status,

        driverRate:
            Number(
                currentProfile.driver_rate ||
                0
            ),

        notes:
            currentProfile.notes ||
            "",

        email:
            currentAuthUser.email ||
            ""

    };


    sessionStorage.setItem(

        CURRENT_USER_STORAGE_KEY,

        JSON.stringify(
            currentUser
        )

    );

}


// =========================================================
// LOGIN REDIRECT
// =========================================================

function redirectToLogin() {

    sessionStorage.removeItem(
        CURRENT_USER_STORAGE_KEY
    );


    window.location.href =
        "login.html";

}


// =========================================================
// HEADER
// =========================================================

function initializeDriverHeader() {

    if (
        driverNameElement
    ) {

        driverNameElement.textContent =
            currentProfile.full_name ||
            currentProfile.username ||
            "שליח";

    }


    if (
        driverDateElement
    ) {

        driverDateElement.textContent =
            new Date()
                .toLocaleDateString(
                    "he-IL",
                    {
                        weekday:
                            "long",

                        day:
                            "2-digit",

                        month:
                            "2-digit",

                        year:
                            "numeric"
                    }
                );

    }

}


// =========================================================
// LOGOUT
// =========================================================

if (
    logoutButton
) {

    logoutButton.addEventListener(

        "click",

        async function () {

            await supabaseClient
                .auth
                .signOut();


            sessionStorage.removeItem(
                CURRENT_USER_STORAGE_KEY
            );


            window.location.href =
                "login.html";

        }

    );

}
// =========================================================
// LOAD SHIPMENTS FROM SUPABASE
// =========================================================

async function loadDriverShipments() {

    if (
        !currentProfile
    ) {

        return;

    }


    if (
        shipmentListSubtitle
    ) {

        shipmentListSubtitle.textContent =
            "טוען משלוחים...";

    }


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
                building_code,
                address_notes,
                delivery_instructions,
                notes,
                source_type,
                source_name,
                driver_id,
                driver_name,
                status,
                created_at,
                delivered_at,
                failed_at,
                failed_reason,
                delivery_rate,
                delivery_amount,
                created_by,
                latitude,
                longitude,
                geocoded_at,
                google_place_id,
                formatted_address,
                planned_delivery_date,
                route_started_at
                `
            )
            .eq(
                "driver_id",
                currentProfile.id
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


        if (
            shipmentListSubtitle
        ) {

            shipmentListSubtitle.textContent =
                "שגיאה בטעינת המשלוחים";

        }


        return;

    }


    driverShipments =
        data ||
        [];


    if (
        shipmentListSubtitle
    ) {

        shipmentListSubtitle.textContent =
            "המשלוחים הפעילים שלך";

    }


    renderDriverShipments();

}


// =========================================================
// DATE HELPERS
// =========================================================

function isTodayDate(
    value
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


    const now =
        new Date();


    return (

        date.getFullYear() ===
            now.getFullYear()

        &&

        date.getMonth() ===
            now.getMonth()

        &&

        date.getDate() ===
            now.getDate()

    );

}


// =========================================================
// ACTIVE SHIPMENTS
// =========================================================

function getActiveDriverShipments() {

    return driverShipments.filter(

        shipment =>

            shipment.status !==
                "נמסר"

            &&

            shipment.status !==
                "לא נמסר"

    );

}


// =========================================================
// COMPLETED TODAY
// =========================================================

function getCompletedTodayShipments() {

    return driverShipments.filter(

        shipment => {

            if (
                shipment.status ===
                "נמסר"
            ) {

                return isTodayDate(
                    shipment.delivered_at
                );

            }


            if (
                shipment.status ===
                "לא נמסר"
            ) {

                return isTodayDate(
                    shipment.failed_at
                );

            }


            return false;

        }

    );

}


// =========================================================
// COUNTERS
// =========================================================

function updateDriverCounters() {

    const active =
        getActiveDriverShipments();


    const completedToday =
        getCompletedTodayShipments();


    const deliveredToday =
        completedToday.filter(

            shipment =>
                shipment.status ===
                "נמסר"

        ).length;


    const failedToday =
        completedToday.filter(

            shipment =>
                shipment.status ===
                "לא נמסר"

        ).length;


    const remaining =
        active.length;


    // המספר הראשי מציג כרגע עבודה פעילה בלבד
    if (
        totalShipmentsElement
    ) {

        totalShipmentsElement.textContent =
            active.length;

    }


    if (
        deliveredShipmentsElement
    ) {

        deliveredShipmentsElement.textContent =
            deliveredToday;

    }


    if (
        remainingShipmentsElement
    ) {

        remainingShipmentsElement.textContent =
            remaining;

    }


    if (
        failedShipmentsElement
    ) {

        failedShipmentsElement.textContent =
            failedToday;

    }


    if (
        shipmentCountBadge
    ) {

        shipmentCountBadge.textContent =
            active.length;

    }

}


// =========================================================
// ROUTE WARNING
// =========================================================

function showRouteRecalculationWarning() {

    routeNeedsRecalculation =
        true;


    if (
        routeUpdateWarning
    ) {

        routeUpdateWarning.classList
            .remove(
                "hidden"
            );

    }


    if (
        recalculateRouteButton
    ) {

        recalculateRouteButton.classList
            .remove(
                "hidden"
            );

    }


    if (
        deliveryRouteUpdateMessage
    ) {

        deliveryRouteUpdateMessage.classList
            .remove(
                "hidden"
            );

    }

}


// =========================================================
// CLEAR ROUTE WARNING
// =========================================================

function clearRouteRecalculationWarning() {

    routeNeedsRecalculation =
        false;


    if (
        routeUpdateWarning
    ) {

        routeUpdateWarning.classList
            .add(
                "hidden"
            );

    }


    if (
        recalculateRouteButton
    ) {

        recalculateRouteButton.classList
            .add(
                "hidden"
            );

    }


    if (
        deliveryRouteUpdateMessage
    ) {

        deliveryRouteUpdateMessage.classList
            .add(
                "hidden"
            );

    }

}


// =========================================================
// CREATE SHIPMENT CARD
// =========================================================

function createDriverShipmentCard(
    shipment
) {

    const card =
        document.createElement(
            "button"
        );


    card.type =
        "button";


    card.className =
        "driver-shipment-card";


    card.addEventListener(

        "click",

        function () {

            openShipmentDetails(
                shipment.id
            );

        }

    );


    const customerName =
        shipment.customer ||
        "לקוח";


    const phone =
        shipment.phone ||
        "ללא טלפון";


    const status =
        shipment.status ||
        "משויך";


    const buildingDetails =
        getShipmentBuildingDetails(
            shipment
        );


    const sourceLabel =
        shipment.source_type ===
            "DRIVER_MANUAL"

            ? "משלוח ידני"

            : shipment.source_name
                ? shipment.source_name
                : "";


    card.innerHTML = `

        <div class="shipment-card-top">

            <div>

                <h3 class="shipment-card-customer">
                    ${customerName}
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
                    ${getDriverStatusClass(
                        status
                    )}
                "
            >
                ${status}
            </span>

        </div>


        <div class="shipment-card-address">

            📍

            ${getShipmentMainAddress(
                shipment
            )}

        </div>


        <div class="shipment-card-phone">

            📞 ${phone}

        </div>


        <div
            style="
                margin-top:6px;
                font-size:13px;
                color:#64748b;
            "
        >
            ${buildingDetails}
        </div>


        ${
            shipment.building_code

                ? `
                    <div
                        style="
                            margin-top:6px;
                            font-size:13px;
                            font-weight:700;
                        "
                    >
                        🔐 קוד בניין:
                        ${shipment.building_code}
                    </div>
                `

                : ""
        }


        <div class="shipment-card-footer">

            <span class="shipment-card-eta">

                ${
                    status === "נמסר"

                        ? "✅ נמסר"

                        : status === "לא נמסר"

                            ? "❌ לא נמסר"

                            : "ממתין למסירה"
                }

            </span>


            <span class="shipment-open-text">

                פרטים >

            </span>

        </div>

    `;


    return card;

}


// =========================================================
// DRIVER WORK VIEW
// =========================================================

function setDriverWorkView(
    hasActiveRoute
) {

    // Before a route is created, show the regular shipment list.
    // After a route is created, show only the ordered route stops.
    if (
        driverShipmentsSection
    ) {

        driverShipmentsSection.style.display =
            hasActiveRoute
                ? "none"
                : "";

    }

}


// =========================================================
// RENDER ACTIVE SHIPMENTS ONLY
// =========================================================

function renderDriverShipments() {

    if (
        !driverShipmentsList
    ) {

        return;

    }


    const activeShipments =
        getActiveDriverShipments();


    driverShipmentsList.innerHTML =
        "";


    if (
        activeShipments.length ===
        0
    ) {

        driverShipmentsList.innerHTML = `

            <div class="driver-empty-state">

                <strong>
                    אין כרגע משלוחים פעילים
                </strong>

                <div style="margin-top:6px;">
                    משלוחים שסיימת נמצאים בדוחות והכנסות.
                </div>

            </div>

        `;

    }

    else {

        activeShipments.forEach(

            shipment => {

                driverShipmentsList
                    .appendChild(
                        createDriverShipmentCard(
                            shipment
                        )
                    );

            }

        );

    }


    updateDriverCounters();

}


// =========================================================
// GOOGLE PLACES - BROWSER API KEY
// =========================================================

function getGoogleMapsBrowserApiKey() {

    try {

        if (
            typeof GOOGLE_MAPS_API_KEY !==
                "undefined"
            &&
            GOOGLE_MAPS_API_KEY
        ) {

            return String(
                GOOGLE_MAPS_API_KEY
            ).trim();

        }

    }
    catch (
        error
    ) {
    }


    try {

        if (
            typeof GOOGLE_MAPS_BROWSER_API_KEY !==
                "undefined"
            &&
            GOOGLE_MAPS_BROWSER_API_KEY
        ) {

            return String(
                GOOGLE_MAPS_BROWSER_API_KEY
            ).trim();

        }

    }
    catch (
        error
    ) {
    }


    try {

        if (
            typeof MAPS_API_KEY !==
                "undefined"
            &&
            MAPS_API_KEY
        ) {

            return String(
                MAPS_API_KEY
            ).trim();

        }

    }
    catch (
        error
    ) {
    }


    return (
        window.GOOGLE_MAPS_API_KEY
        ||
        window.GOOGLE_MAPS_BROWSER_API_KEY
        ||
        window.MAPS_API_KEY
        ||
        ""
    );

}


// =========================================================
// GOOGLE MAPS JAVASCRIPT LOADER
// =========================================================

function loadGoogleMapsPlacesLibrary() {

    return new Promise(

        (
            resolve,
            reject
        ) => {

            if (
                window.google
                &&
                google.maps
                &&
                typeof google.maps.importLibrary ===
                    "function"
            ) {

                resolve();

                return;

            }


            const apiKey =
                getGoogleMapsBrowserApiKey();


            if (
                !apiKey
            ) {

                reject(
                    new Error(
                        "Google Maps browser API key was not found in google-maps-config.js"
                    )
                );

                return;

            }


            if (
                document.getElementById(
                    "driverGoogleMapsScript"
                )
            ) {

                let attempts =
                    0;


                const interval =
                    setInterval(
                        function () {

                            attempts++;


                            if (
                                window.google
                                &&
                                google.maps
                                &&
                                typeof google.maps.importLibrary ===
                                    "function"
                            ) {

                                clearInterval(
                                    interval
                                );

                                resolve();

                                return;

                            }


                            if (
                                attempts >=
                                100
                            ) {

                                clearInterval(
                                    interval
                                );

                                reject(
                                    new Error(
                                        "Google Maps JavaScript API did not finish loading."
                                    )
                                );

                            }

                        },
                        100
                    );


                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.id =
                "driverGoogleMapsScript";


            script.src =
                "https://maps.googleapis.com/maps/api/js"
                +
                "?key="
                +
                encodeURIComponent(
                    apiKey
                )
                +
                "&v=weekly"
                +
                "&loading=async"
                +
                "&language=he"
                +
                "&region=IL";


            script.async =
                true;


            script.defer =
                true;


            script.onload =
                function () {

                    resolve();

                };


            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Failed loading Google Maps JavaScript API."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }

    );

}


// =========================================================
// GOOGLE PLACE COMPONENT HELPERS
// =========================================================

function getGoogleAddressComponent(
    addressComponents,
    types
) {

    const component =
        (
            addressComponents
            ||
            []
        ).find(

            item => {

                const componentTypes =
                    item.types
                    ||
                    [];


                return types.some(
                    type =>
                        componentTypes.includes(
                            type
                        )
                );

            }

        );


    if (
        !component
    ) {

        return "";

    }


    return (
        component.longText
        ||
        component.shortText
        ||
        ""
    );

}


function clearGooglePlaceSelection(
    clearSearchText = false
) {

    setInputValue(
        "driverShipmentGooglePlaceId",
        ""
    );

    setInputValue(
        "driverShipmentFormattedAddress",
        ""
    );

    setInputValue(
        "driverShipmentLatitude",
        ""
    );

    setInputValue(
        "driverShipmentLongitude",
        ""
    );


    if (
        clearSearchText
        &&
        driverShipmentAddressSearch
    ) {

        driverShipmentAddressSearch.value =
            "";

    }


    if (
        driverShipmentAddressSelected
    ) {

        driverShipmentAddressSelected.classList
            .add(
                "hidden"
            );

    }

}


function showGooglePlaceSelection(
    formattedAddress
) {

    if (
        !driverShipmentAddressSelected
    ) {

        return;

    }


    driverShipmentAddressSelected.textContent =
        formattedAddress
            ? `✅ נבחרה כתובת: ${formattedAddress}`
            : "✅ כתובת נבחרה מ-Google";


    driverShipmentAddressSelected.classList
        .remove(
            "hidden"
        );

}


// =========================================================
// GOOGLE PLACES AUTOCOMPLETE
// =========================================================

async function initializeGooglePlacesAutocomplete() {

    if (
        googlePlacesReady
    ) {

        return true;

    }


    const originalInput =
        document.getElementById(
            "driverShipmentAddressSearch"
        );


    if (
        !originalInput
    ) {

        return false;

    }


    try {

        await loadGoogleMapsPlacesLibrary();


        const {
            PlaceAutocompleteElement
        } =
            await google.maps.importLibrary(
                "places"
            );


        const autocomplete =
            new PlaceAutocompleteElement({
                includedRegionCodes: [
                    "il"
                ]
            });


        autocomplete.id =
            "driverShipmentAddressSearch";


        autocomplete.placeholder =
            "התחל להקליד רחוב ומספר...";


        autocomplete.style.width =
            "100%";


        autocomplete.style.display =
            "block";


        originalInput.replaceWith(
            autocomplete
        );


        driverShipmentAddressSearch =
            autocomplete;


        googlePlaceAutocomplete =
            autocomplete;


        autocomplete.addEventListener(

            "gmp-select",

            async function (
                event
            ) {

                try {

                    const prediction =
                        event.placePrediction;


                    if (
                        !prediction
                    ) {

                        return;

                    }


                    const place =
                        prediction.toPlace();


                    await place.fetchFields({
                        fields: [
                            "id",
                            "formattedAddress",
                            "location",
                            "addressComponents"
                        ]
                    });


                    const addressComponents =
                        place.addressComponents
                        ||
                        [];


                    const city =
                        getGoogleAddressComponent(
                            addressComponents,
                            [
                                "locality",
                                "postal_town"
                            ]
                        )
                        ||
                        getGoogleAddressComponent(
                            addressComponents,
                            [
                                "administrative_area_level_2"
                            ]
                        );


                    const street =
                        getGoogleAddressComponent(
                            addressComponents,
                            [
                                "route"
                            ]
                        );


                    const houseNumber =
                        getGoogleAddressComponent(
                            addressComponents,
                            [
                                "street_number"
                            ]
                        );


                    const latitude =
                        place.location
                            ? place.location.lat()
                            : null;


                    const longitude =
                        place.location
                            ? place.location.lng()
                            : null;


                    setInputValue(
                        "driverShipmentCity",
                        city
                    );

                    setInputValue(
                        "driverShipmentStreet",
                        street
                    );

                    setInputValue(
                        "driverShipmentHouseNumber",
                        houseNumber
                    );

                    setInputValue(
                        "driverShipmentGooglePlaceId",
                        place.id
                        ||
                        ""
                    );

                    setInputValue(
                        "driverShipmentFormattedAddress",
                        place.formattedAddress
                        ||
                        ""
                    );

                    setInputValue(
                        "driverShipmentLatitude",
                        latitude !== null
                            ? String(
                                latitude
                            )
                            : ""
                    );

                    setInputValue(
                        "driverShipmentLongitude",
                        longitude !== null
                            ? String(
                                longitude
                            )
                            : ""
                    );


                    autocomplete.value =
                        place.formattedAddress
                        ||
                        prediction.text?.text
                        ||
                        "";


                    showGooglePlaceSelection(
                        place.formattedAddress
                        ||
                        ""
                    );

                }

                catch (
                    error
                ) {

                    console.error(
                        "Failed reading selected Google place:",
                        error
                    );


                    alert(
                        "לא הצלחנו לקרוא את הכתובת שנבחרה מ-Google. אפשר לנסות לבחור אותה שוב או להזין את הכתובת ידנית."
                    );

                }

            }

        );


        const manualAddressInputs = [
            "driverShipmentCity",
            "driverShipmentStreet",
            "driverShipmentHouseNumber"
        ];


        manualAddressInputs.forEach(

            inputId => {

                const input =
                    document.getElementById(
                        inputId
                    );


                if (
                    !input
                ) {

                    return;

                }


                input.addEventListener(

                    "input",

                    function () {

                        clearGooglePlaceSelection(
                            false
                        );

                    }

                );

            }

        );


        googlePlacesReady =
            true;


        enhanceDriverV2Structure();


        return true;

    }

    catch (
        error
    ) {

        console.error(
            "Google Places initialization failed:",
            error
        );


        googlePlacesReady =
            false;


        return false;

    }

}



// =========================================================
// RESET SHIPMENT FORM
// =========================================================

function resetDriverShipmentForm() {

    if (
        driverAddShipmentForm
    ) {

        driverAddShipmentForm.reset();

    }


    if (
        editingDriverShipmentId
    ) {

        editingDriverShipmentId.value =
            "";

    }


    clearGooglePlaceSelection(
        true
    );


    if (
        driverShipmentModalTitle
    ) {

        driverShipmentModalTitle.textContent =
            "הוספת משלוח";

    }


    if (
        driverShipmentModalSubtitle
    ) {

        driverShipmentModalSubtitle.textContent =
            "הזן את פרטי הלקוח והכתובת";

    }


    if (
        saveDriverShipmentButton
    ) {

        saveDriverShipmentButton.textContent =
            "שמור משלוח";

    }

}


// =========================================================
// OPEN ADD SHIPMENT MODAL
// =========================================================

function openAddShipmentModal() {

    if (
        !addShipmentModal
    ) {

        return;

    }


    resetDriverShipmentForm();

    enhanceDriverV2Structure();


    addShipmentModal.classList
        .remove(
            "hidden"
        );


    setTimeout(

        function () {

            if (
                driverShipmentAddressSearch
                &&
                typeof driverShipmentAddressSearch.focus ===
                    "function"
            ) {

                driverShipmentAddressSearch.focus();

            }

        },

        100

    );

}


// =========================================================
// OPEN EDIT SHIPMENT MODAL
// =========================================================

function openEditDriverShipmentModal(
    shipment
) {

    if (
        !shipment ||
        !addShipmentModal
    ) {

        return;

    }


    if (
        editingDriverShipmentId
    ) {

        editingDriverShipmentId.value =
            shipment.id;

    }


    setInputValue(
        "driverShipmentCustomer",
        shipment.customer
    );

    setInputValue(
        "driverShipmentPhone",
        shipment.phone
    );

    setInputValue(
        "driverShipmentGooglePlaceId",
        shipment.google_place_id
    );

    setInputValue(
        "driverShipmentFormattedAddress",
        shipment.formatted_address
    );

    setInputValue(
        "driverShipmentLatitude",
        shipment.latitude
    );

    setInputValue(
        "driverShipmentLongitude",
        shipment.longitude
    );


    if (
        driverShipmentAddressSearch
    ) {

        driverShipmentAddressSearch.value =
            shipment.formatted_address
            ||
            getShipmentMainAddress(
                shipment
            );

    }


    if (
        shipment.google_place_id
        &&
        shipment.formatted_address
    ) {

        showGooglePlaceSelection(
            shipment.formatted_address
        );

    }

    else {

        if (
            driverShipmentAddressSelected
        ) {

            driverShipmentAddressSelected.classList
                .add(
                    "hidden"
                );

        }

    }


    setInputValue(
        "driverShipmentCity",
        shipment.city
    );

    setInputValue(
        "driverShipmentStreet",
        shipment.street
    );

    setInputValue(
        "driverShipmentHouseNumber",
        shipment.house_number
    );

    setInputValue(
        "driverShipmentEntrance",
        shipment.entrance
    );

    setInputValue(
        "driverShipmentFloor",
        shipment.floor
    );

    setInputValue(
        "driverShipmentApartment",
        shipment.apartment
    );

    setInputValue(
        "driverShipmentBuildingCode",
        shipment.building_code
    );

    setInputValue(
        "driverShipmentAddressNotes",
        shipment.address_notes
    );

    setInputValue(
        "driverShipmentDeliveryInstructions",
        shipment.delivery_instructions
    );

    setInputValue(
        "driverShipmentNotes",
        shipment.notes
    );


    if (
        driverShipmentModalTitle
    ) {

        driverShipmentModalTitle.textContent =
            "עריכת משלוח";

    }


    if (
        driverShipmentModalSubtitle
    ) {

        driverShipmentModalSubtitle.textContent =
            "עדכן את פרטי הלקוח והמסירה";

    }


    if (
        saveDriverShipmentButton
    ) {

        saveDriverShipmentButton.textContent =
            "שמור שינויים";

    }


    addShipmentModal.classList
        .remove(
            "hidden"
        );

}


// =========================================================
// CLOSE ADD / EDIT MODAL
// =========================================================

function closeDriverAddShipmentModal() {

    if (
        !addShipmentModal
    ) {

        return;

    }


    addShipmentModal.classList
        .add(
            "hidden"
        );

}


// =========================================================
// MODAL EVENTS
// =========================================================

if (
    addShipmentButton
) {

    addShipmentButton.addEventListener(

        "click",

        openAddShipmentModal

    );

}


if (
    closeAddShipmentModal
) {

    closeAddShipmentModal.addEventListener(

        "click",

        closeDriverAddShipmentModal

    );

}


if (
    cancelAddShipmentButton
) {

    cancelAddShipmentButton.addEventListener(

        "click",

        closeDriverAddShipmentModal

    );

}
// =========================================================
// GEOCODE SHIPMENT
// =========================================================

async function geocodeDriverShipment(
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
                "Driver geocoding failed:",
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
                "Unexpected driver geocoding response:",
                data
            );


            return false;

        }


        return true;

    }

    catch (
        error
    ) {

        console.error(
            "Driver geocoding exception:",
            error
        );


        return false;

    }

}
// =========================================================
// SAVE NEW / EDITED SHIPMENT
// =========================================================

if (
    driverAddShipmentForm
) {

    driverAddShipmentForm.addEventListener(

        "submit",

        async function (
            event
        ) {

            event.preventDefault();


            if (
                !currentProfile
            ) {

                return;

            }


            const editingId =
                editingDriverShipmentId
                    ? editingDriverShipmentId.value
                    : "";


            const customer =
                getInputValue(
                    "driverShipmentCustomer"
                );


            const phone =
                getInputValue(
                    "driverShipmentPhone"
                );


            const city =
                getInputValue(
                    "driverShipmentCity"
                );


            const street =
                getInputValue(
                    "driverShipmentStreet"
                );


            const houseNumber =
                getInputValue(
                    "driverShipmentHouseNumber"
                );


            const entrance =
                getInputValue(
                    "driverShipmentEntrance"
                );


            const floor =
                getInputValue(
                    "driverShipmentFloor"
                );


            const apartment =
                getInputValue(
                    "driverShipmentApartment"
                );


            const buildingCode =
                getInputValue(
                    "driverShipmentBuildingCode"
                );


            const addressNotes =
                getInputValue(
                    "driverShipmentAddressNotes"
                );


            const deliveryInstructions =
                getInputValue(
                    "driverShipmentDeliveryInstructions"
                );


            const notes =
                getInputValue(
                    "driverShipmentNotes"
                );


            const googlePlaceId =
                getInputValue(
                    "driverShipmentGooglePlaceId"
                );


            const formattedAddress =
                getInputValue(
                    "driverShipmentFormattedAddress"
                );


            const latitudeValue =
                getInputValue(
                    "driverShipmentLatitude"
                );


            const longitudeValue =
                getInputValue(
                    "driverShipmentLongitude"
                );


            const selectedLatitude =
                latitudeValue !== ""
                    ? Number(
                        latitudeValue
                    )
                    : null;


            const selectedLongitude =
                longitudeValue !== ""
                    ? Number(
                        longitudeValue
                    )
                    : null;


            const hasGoogleCoordinates =
                Number.isFinite(
                    selectedLatitude
                )
                &&
                Number.isFinite(
                    selectedLongitude
                );


            if (
                !city ||
                !street ||
                !houseNumber
            ) {

                alert(
                    "יש להזין עיר, רחוב ומספר בית."
                );


                return;

            }


            const shipmentData = {

                customer:
                    customer ||
                    "לקוח",

                phone:
                    phone ||
                    null,

                city:
                    city,

                street:
                    street,

                house_number:
                    houseNumber,

                entrance:
                    entrance ||
                    null,

                floor:
                    floor ||
                    null,

                apartment:
                    apartment ||
                    null,

                address_type:
                    "אחר",

                building_code:
                    buildingCode ||
                    null,

                address_notes:
                    addressNotes ||
                    null,

                delivery_instructions:
                    deliveryInstructions ||
                    null,

                notes:
                    notes ||
                    null,

                google_place_id:
                    googlePlaceId ||
                    null,

                formatted_address:
                    formattedAddress ||
                    null,

                latitude:
                    hasGoogleCoordinates
                        ? selectedLatitude
                        : null,

                longitude:
                    hasGoogleCoordinates
                        ? selectedLongitude
                        : null,

                geocoded_at:
                    hasGoogleCoordinates
                        ? new Date()
                            .toISOString()
                        : null

            };


            if (
                saveDriverShipmentButton
            ) {

                saveDriverShipmentButton.disabled =
                    true;


                saveDriverShipmentButton.textContent =
                    editingId
                        ? "שומר שינויים..."
                        : "שומר משלוח...";

            }


            // =================================================
            // EDIT EXISTING SHIPMENT
            // =================================================

            if (
                editingId
            ) {

                const existingShipment =
                    driverShipments.find(

                        shipment =>
                            shipment.id ===
                            editingId

                    );


                if (
                    !existingShipment
                ) {

                    if (
                        saveDriverShipmentButton
                    ) {

                        saveDriverShipmentButton.disabled =
                            false;

                        saveDriverShipmentButton.textContent =
                            "שמור שינויים";

                    }


                    alert(
                        "לא נמצא המשלוח לעריכה."
                    );


                    return;

                }


                const addressChanged =

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
                        .trim();


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
                        .eq(
                            "driver_id",
                            currentProfile.id
                        )
                        .select()
                        .single();


                if (
                    error
                ) {

                    console.error(
                        "Failed updating driver shipment:",
                        error
                    );


                    if (
                        saveDriverShipmentButton
                    ) {

                        saveDriverShipmentButton.disabled =
                            false;

                        saveDriverShipmentButton.textContent =
                            "שמור שינויים";

                    }


                    alert(
                        "לא ניתן היה לעדכן את המשלוח."
                    );


                    return;

                }


                const index =
                    driverShipments.findIndex(

                        shipment =>
                            shipment.id ===
                            editingId

                    );


                if (
                    index !==
                    -1
                ) {

                    driverShipments[
                        index
                    ] =
                        data;

                }


                if (
                    addressChanged
                ) {

                    if (
                        hasGoogleCoordinates
                    ) {

                        await loadDriverShipments();

                    }

                    else {

                        const geocoded =
                            await geocodeDriverShipment(
                                editingId
                            );


                        if (
                            geocoded
                        ) {

                            await loadDriverShipments();

                        }

                        else {

                            alert(
                                "הפרטים נשמרו, אבל כרגע לא הצלחנו לאתר את הכתובת החדשה.\nאפשר יהיה לנסות שוב בהמשך."
                            );

                        }

                    }


                    showRouteRecalculationWarning();

                }


                if (
                    saveDriverShipmentButton
                ) {

                    saveDriverShipmentButton.disabled =
                        false;

                    saveDriverShipmentButton.textContent =
                        "שמור משלוח";

                }


                driverAddShipmentForm.reset();


                closeDriverAddShipmentModal();


                renderDriverShipments();


                if (
                    selectedShipmentId ===
                    editingId
                ) {

                    openShipmentDetails(
                        editingId
                    );

                }


                return;

            }


            // =================================================
            // CREATE NEW MANUAL SHIPMENT
            // =================================================

            const newShipment = {

                // מספר פנימי אוטומטי של המערכת
                shipment_number:
                    createShipmentNumber(),

                // משלוח ידני של שליח לא דורש ברקוד
                barcode:
                    null,

                customer:
                    shipmentData.customer,

                phone:
                    shipmentData.phone,

                city:
                    shipmentData.city,

                street:
                    shipmentData.street,

                house_number:
                    shipmentData.house_number,

                entrance:
                    shipmentData.entrance,

                floor:
                    shipmentData.floor,

                apartment:
                    shipmentData.apartment,

                address_type:
                    shipmentData.address_type,

                building_code:
                    shipmentData.building_code,

                address_notes:
                    shipmentData.address_notes,

                delivery_instructions:
                    shipmentData.delivery_instructions,

                notes:
                    shipmentData.notes,

                google_place_id:
                    shipmentData.google_place_id,

                formatted_address:
                    shipmentData.formatted_address,

                latitude:
                    shipmentData.latitude,

                longitude:
                    shipmentData.longitude,

                geocoded_at:
                    shipmentData.geocoded_at,

                // מקור המשלוח
                source_type:
                    "DRIVER_MANUAL",

                source_name:
                    null,

                // המשלוח שייך אוטומטית לשליח שיצר אותו
                driver_id:
                    currentProfile.id,

                driver_name:
                    currentProfile.full_name ||
                    currentProfile.username ||
                    "",

                status:
                    "משויך",

                delivery_rate:
                    Number(
                        currentProfile.driver_rate ||
                        0
                    ),

                delivery_amount:
                    null,

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
                    "Failed creating shipment:",
                    error
                );


                if (
                    saveDriverShipmentButton
                ) {

                    saveDriverShipmentButton.disabled =
                        false;

                    saveDriverShipmentButton.textContent =
                        "שמור משלוח";

                }


                alert(
                    "לא ניתן היה לשמור את המשלוח."
                );


                return;

            }


            driverShipments.push(
                data
            );


            // =================================================
            // GEOCODING BEHIND THE SCENES
            // =================================================

            if (
                hasGoogleCoordinates
            ) {

                await loadDriverShipments();

            }

            else {

                const geocoded =
                    await geocodeDriverShipment(
                        data.id
                    );


                if (
                    geocoded
                ) {

                    await loadDriverShipments();

                }

                else {

                    console.warn(
                        "Shipment saved without geocoding."
                    );

                }

            }


            if (
                saveDriverShipmentButton
            ) {

                saveDriverShipmentButton.disabled =
                    false;

                saveDriverShipmentButton.textContent =
                    "שמור משלוח";

            }


            driverAddShipmentForm.reset();


            closeDriverAddShipmentModal();


            renderDriverShipments();


            showRouteRecalculationWarning();

        }

    );

}


// =========================================================
// OPEN SHIPMENT DETAILS
// =========================================================

function openShipmentDetails(
    shipmentId
) {

    const shipment =
        driverShipments.find(

            item =>
                item.id ===
                shipmentId

        );


    if (
        !shipment
    ) {

        return;

    }


    selectedShipmentId =
        shipment.id;


    if (
        deliveryShipmentNumber
    ) {

        // המספר קיים פנימית, אבל השליח לא נדרש להזין אותו
        deliveryShipmentNumber.textContent =
            shipment.source_type ===
                "DRIVER_MANUAL"

                ? "משלוח ידני"

                : `משלוח #${shipment.shipment_number || ""}`;

    }


    if (
        deliveryCustomerName
    ) {

        deliveryCustomerName.textContent =
            shipment.customer ||
            "לקוח";

    }


    if (
        deliveryAddress
    ) {

        deliveryAddress.textContent =
            getShipmentMainAddress(
                shipment
            );

    }


    if (
        deliveryBuildingDetails
    ) {

        deliveryBuildingDetails.textContent =
            getShipmentBuildingDetails(
                shipment
            );

    }


    if (
        deliveryBuildingCode
    ) {

        deliveryBuildingCode.textContent =
            shipment.building_code ||
            "-";

    }


    if (
        deliveryAddressNotes
    ) {

        deliveryAddressNotes.textContent =
            shipment.address_notes ||
            "-";

    }


    if (
        deliveryInstructions
    ) {

        deliveryInstructions.textContent =
            shipment.delivery_instructions ||
            "-";

    }


    if (
        deliveryNotes
    ) {

        deliveryNotes.textContent =
            shipment.notes ||
            "-";

    }


    if (
        deliveryEta
    ) {

        deliveryEta.textContent =
            "עדיין לא חושב";

    }


    const phone =
        shipment.phone ||
        "";


    const telPhone =
        normalizePhoneForTel(
            phone
        );


    if (
        deliveryPhone
    ) {

        deliveryPhone.textContent =
            phone ||
            "לא הוזן טלפון";


        deliveryPhone.href =
            telPhone
                ? `tel:${telPhone}`
                : "#";

    }


    if (
        callCustomerButton
    ) {

        callCustomerButton.href =
            telPhone
                ? `tel:${telPhone}`
                : "#";


        callCustomerButton.style.opacity =
            telPhone
                ? "1"
                : "0.45";

    }


    if (
        deliveryRouteUpdateMessage
    ) {

        if (
            routeNeedsRecalculation
        ) {

            deliveryRouteUpdateMessage.classList
                .remove(
                    "hidden"
                );

        }

        else {

            deliveryRouteUpdateMessage.classList
                .add(
                    "hidden"
                );

        }

    }


    if (
        deliveryDetailsOverlay
    ) {

        deliveryDetailsOverlay.classList
            .remove(
                "hidden"
            );

    }


    arrangeDriverWorkActions();

    resetDeliverySlider();

}


// =========================================================
// CLOSE DETAILS
// =========================================================

function closeShipmentDetails() {

    selectedShipmentId =
        null;


    if (
        deliveryDetailsOverlay
    ) {

        deliveryDetailsOverlay.classList
            .add(
                "hidden"
            );

    }

}


if (
    closeDeliveryDetailsButton
) {

    closeDeliveryDetailsButton.addEventListener(

        "click",

        closeShipmentDetails

    );

}


// =========================================================
// EDIT SELECTED SHIPMENT
// =========================================================

if (
    editDriverShipmentButton
) {

    editDriverShipmentButton.addEventListener(

        "click",

        function () {

            const shipment =
                getSelectedShipment();


            if (
                !shipment
            ) {

                return;

            }


            closeShipmentDetails();


            openEditDriverShipmentModal(
                shipment
            );

        }

    );

}


// =========================================================
// OPEN WAZE
// =========================================================

function openShipmentInWaze(
    shipment
) {

    if (
        !shipment
    ) {

        return;

    }


    const address =
        getShipmentMainAddress(
            shipment
        );


    if (
        !address
    ) {

        alert(
            "לא קיימת כתובת למשלוח."
        );


        return;

    }


    const latitude =
        Number(
            shipment.latitude
        );

    const longitude =
        Number(
            shipment.longitude
        );


    let url =
        "";


    if (
        Number.isFinite(
            latitude
        ) &&
        Number.isFinite(
            longitude
        ) &&
        latitude !==
            0 &&
        longitude !==
            0
    ) {

        url =
            "https://waze.com/ul?ll=" +
            encodeURIComponent(
                `${latitude},${longitude}`
            ) +
            "&navigate=yes";

    }

    else {

        url =
            "https://waze.com/ul?q=" +
            encodeURIComponent(
                address
            ) +
            "&navigate=yes";

    }


    window.open(
        url,
        "_blank"
    );

}


// =========================================================
// ADDRESS CLICK -> WAZE
// =========================================================

if (
    deliveryAddressButton
) {

    deliveryAddressButton.addEventListener(

        "click",

        function () {

            const shipment =
                getSelectedShipment();


            openShipmentInWaze(
                shipment
            );

        }

    );

}


// =========================================================
// DIRECT WAZE BUTTON
// =========================================================

if (
    openWazeDirectButton
) {

    openWazeDirectButton.addEventListener(

        "click",

        function () {

            const shipment =
                getSelectedShipment();


            openShipmentInWaze(
                shipment
            );

        }

    );

}


// =========================================================
// ACTIVE ROUTE HELPERS
// =========================================================

async function getCurrentDatabaseRoute() {

    if (
        !currentProfile
    ) {

        return null;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "driver_routes"
            )
            .select(
                `
                id,
                driver_id,
                created_at,
                route_date,
                planned_start_at,
                started_at,
                completed_at,
                start_address,
                end_address,
                status,
                total_distance_meters,
                total_duration_seconds,
                estimated_end_at,
                stop_count,
                remaining_stop_count
                `
            )
            .eq(
                "driver_id",
                currentProfile.id
            )
            .in(
                "status",
                [
                    "PLANNED",
                    "ACTIVE"
                ]
            )
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            )
            .limit(
                1
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Failed loading current driver route:",
            error
        );

        return null;

    }


    return data || null;

}


// =========================================================
// COMPLETE ROUTE STOP
// =========================================================

async function completeShipmentInActiveRoute(
    shipmentId,
    completionStatus,
    completedAt
) {

    try {

        const route =
            await getCurrentDatabaseRoute();


        if (
            !route
        ) {

            return true;

        }


        const {
            data: routeStop,
            error: stopLoadError
        } =
            await supabaseClient
                .from(
                    "driver_route_stops"
                )
                .select(
                    `
                    id,
                    route_id,
                    shipment_id,
                    completed_at,
                    completion_status
                    `
                )
                .eq(
                    "route_id",
                    route.id
                )
                .eq(
                    "shipment_id",
                    shipmentId
                )
                .maybeSingle();


        if (
            stopLoadError
        ) {

            console.error(
                "Failed loading route stop:",
                stopLoadError
            );

            return false;

        }


        if (
            !routeStop
        ) {

            return true;

        }


        if (
            !routeStop.completed_at
        ) {

            const {
                error: stopUpdateError
            } =
                await supabaseClient
                    .from(
                        "driver_route_stops"
                    )
                    .update(
                        {
                            completed_at:
                                completedAt,

                            completion_status:
                                completionStatus
                        }
                    )
                    .eq(
                        "id",
                        routeStop.id
                    );


            if (
                stopUpdateError
            ) {

                console.error(
                    "Failed completing route stop:",
                    stopUpdateError
                );

                return false;

            }

        }


        const {
            count,
            error: countError
        } =
            await supabaseClient
                .from(
                    "driver_route_stops"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                )
                .eq(
                    "route_id",
                    route.id
                )
                .is(
                    "completed_at",
                    null
                );


        if (
            countError
        ) {

            console.error(
                "Failed counting remaining route stops:",
                countError
            );

            return false;

        }


        const remaining =
            Number(
                count || 0
            );


        const routeUpdate = {
            remaining_stop_count:
                remaining
        };


        if (
            remaining ===
            0
        ) {

            routeUpdate.status =
                "COMPLETED";

            routeUpdate.completed_at =
                completedAt;

        }


        const {
            error: routeUpdateError
        } =
            await supabaseClient
                .from(
                    "driver_routes"
                )
                .update(
                    routeUpdate
                )
                .eq(
                    "id",
                    route.id
                );


        if (
            routeUpdateError
        ) {

            console.error(
                "Failed updating route remaining count:",
                routeUpdateError
            );

            return false;

        }


        return true;

    }

    catch (
        error
    ) {

        console.error(
            "completeShipmentInActiveRoute failed:",
            error
        );

        return false;

    }

}


// =========================================================
// MARK DELIVERED - SLIDE TO CONFIRM
// =========================================================

let deliverySlideBusy =
    false;

let deliverySlidePointerId =
    null;

let deliverySlideStartX =
    0;

let deliverySlideProgress =
    0;


function prepareDeliverySliderUI() {

    if (
        !markDeliveredButton
    ) {

        return;

    }


    markDeliveredButton.classList
        .add(
            "yb-delivery-slider"
        );


    markDeliveredButton.innerHTML =
        `
            <span class="yb-slide-label">
                החלק לאישור מסירה
            </span>

            <span class="yb-slide-thumb">
                ✓
            </span>
        `;


    markDeliveredButton.setAttribute(
        "aria-label",
        "החלק שמאלה כדי לאשר שהמשלוח נמסר"
    );

}


function resetDeliverySlider() {

    if (
        !markDeliveredButton
    ) {

        return;

    }


    const thumb =
        markDeliveredButton.querySelector(
            ".yb-slide-thumb"
        );


    markDeliveredButton.classList
        .remove(
            "yb-slide-dragging",
            "yb-slide-complete"
        );


    if (
        thumb
    ) {

        thumb.style.transform =
            "translateX(0px)";

    }


    deliverySlidePointerId =
        null;

    deliverySlideStartX =
        0;

    deliverySlideProgress =
        0;

}


async function openNextRouteStopIfAvailable() {

    if (
        !optimizedRouteResult ||
        !Array.isArray(
            optimizedRouteResult.stops
        ) ||
        optimizedRouteResult.stops.length ===
            0
    ) {

        return;

    }


    const nextStop =
        optimizedRouteResult.stops[0];


    if (
        !nextStop ||
        !nextStop.shipment_id
    ) {

        return;

    }


    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                180
            )
    );


    openShipmentDetails(
        nextStop.shipment_id
    );

}


async function markSelectedShipmentDelivered() {

    if (
        deliverySlideBusy
    ) {

        return;

    }


    const shipment =
        getSelectedShipment();


    if (
        !shipment
    ) {

        resetDeliverySlider();

        return;

    }


    deliverySlideBusy =
        true;


    try {

        const rate =
            Number(
                currentProfile.driver_rate ||
                shipment.delivery_rate ||
                0
            );


        const deliveredAt =
            new Date()
                .toISOString();


        const {
            error
        } =
            await supabaseClient
                .from(
                    "shipments"
                )
                .update(
                    {
                        status:
                            "נמסר",

                        delivered_at:
                            deliveredAt,

                        failed_at:
                            null,

                        failed_reason:
                            null,

                        delivery_rate:
                            rate,

                        delivery_amount:
                            rate
                    }
                )
                .eq(
                    "id",
                    shipment.id
                )
                .eq(
                    "driver_id",
                    currentProfile.id
                );


        if (
            error
        ) {

            console.error(
                "Failed marking shipment delivered:",
                error
            );

            alert(
                "לא ניתן היה לעדכן את המשלוח."
            );

            resetDeliverySlider();

            return;

        }


        shipment.status =
            "נמסר";

        shipment.delivered_at =
            deliveredAt;

        shipment.failed_at =
            null;

        shipment.failed_reason =
            null;

        shipment.delivery_rate =
            rate;

        shipment.delivery_amount =
            rate;


        await completeShipmentInActiveRoute(
            shipment.id,
            "DELIVERED",
            deliveredAt
        );


        closeShipmentDetails();


        renderDriverShipments();


        await loadActiveRouteFromDatabase();


        showDriverToast(
            "✓ המשלוח סומן כנמסר"
        );


        await openNextRouteStopIfAvailable();

    }

    finally {

        deliverySlideBusy =
            false;

        resetDeliverySlider();

    }

}


function setupDeliverySlider() {

    if (
        !markDeliveredButton
    ) {

        return;

    }


    prepareDeliverySliderUI();


    markDeliveredButton.addEventListener(
        "click",
        function (
            event
        ) {

            event.preventDefault();

        }
    );


    markDeliveredButton.addEventListener(
        "pointerdown",
        function (
            event
        ) {

            if (
                deliverySlideBusy
            ) {

                return;

            }


            deliverySlidePointerId =
                event.pointerId;

            deliverySlideStartX =
                event.clientX;

            deliverySlideProgress =
                0;


            markDeliveredButton.classList
                .add(
                    "yb-slide-dragging"
                );


            try {

                markDeliveredButton.setPointerCapture(
                    event.pointerId
                );

            }

            catch (
                error
            ) {

                // Not all browsers require pointer capture.

            }

        }
    );


    markDeliveredButton.addEventListener(
        "pointermove",
        function (
            event
        ) {

            if (
                deliverySlidePointerId !==
                    event.pointerId ||
                deliverySlideBusy
            ) {

                return;

            }


            const thumb =
                markDeliveredButton.querySelector(
                    ".yb-slide-thumb"
                );


            if (
                !thumb
            ) {

                return;

            }


            const maxDistance =
                Math.max(
                    1,
                    markDeliveredButton.clientWidth -
                    74
                );


            const movedLeft =
                Math.max(
                    0,
                    deliverySlideStartX -
                    event.clientX
                );


            const distance =
                Math.min(
                    maxDistance,
                    movedLeft
                );


            deliverySlideProgress =
                distance /
                maxDistance;


            thumb.style.transform =
                `translateX(${-distance}px)`;

        }
    );


    const finishSlide =
        async function (
            event
        ) {

            if (
                deliverySlidePointerId !==
                    event.pointerId
            ) {

                return;

            }


            const completed =
                deliverySlideProgress >=
                0.72;


            deliverySlidePointerId =
                null;


            markDeliveredButton.classList
                .remove(
                    "yb-slide-dragging"
                );


            if (
                completed
            ) {

                markDeliveredButton.classList
                    .add(
                        "yb-slide-complete"
                    );


                await markSelectedShipmentDelivered();

            }

            else {

                resetDeliverySlider();

            }

        };


    markDeliveredButton.addEventListener(
        "pointerup",
        finishSlide
    );


    markDeliveredButton.addEventListener(
        "pointercancel",
        function () {

            resetDeliverySlider();

        }
    );

}


setupDeliverySlider();

// =========================================================
// MARK FAILED
// =========================================================

if (
    markFailedButton
) {

    markFailedButton.addEventListener(

        "click",

        async function () {

            const shipment =
                getSelectedShipment();


            if (
                !shipment
            ) {

                return;

            }


            const reason =
                prompt(
                    "למה המשלוח לא נמסר?"
                );


            if (
                reason ===
                null
            ) {

                return;

            }


            const failedAt =
                new Date()
                    .toISOString();


            const {
                error
            } =
                await supabaseClient
                    .from(
                        "shipments"
                    )
                    .update(
                        {
                            status:
                                "לא נמסר",

                            failed_at:
                                failedAt,

                            failed_reason:
                                reason.trim(),

                            delivered_at:
                                null,

                            delivery_amount:
                                0
                        }
                    )
                    .eq(
                        "id",
                        shipment.id
                    )
                    .eq(
                        "driver_id",
                        currentProfile.id
                    );


            if (
                error
            ) {

                console.error(
                    "Failed marking shipment failed:",
                    error
                );

                alert(
                    "לא ניתן היה לעדכן את המשלוח."
                );

                return;

            }


            shipment.status =
                "לא נמסר";

            shipment.failed_at =
                failedAt;

            shipment.failed_reason =
                reason.trim();

            shipment.delivered_at =
                null;

            shipment.delivery_amount =
                0;


            await completeShipmentInActiveRoute(
                shipment.id,
                "FAILED",
                failedAt
            );


            closeShipmentDetails();


            renderDriverShipments();


            await loadActiveRouteFromDatabase();


            showDriverToast(
                "המשלוח סומן כלא נמסר"
            );


            await openNextRouteStopIfAvailable();

        }

    );

}

// =========================================================
// ROUTE RESULT STATE
// =========================================================

let optimizedRouteResult =
    null;


// =========================================================
// CREATE "START NOW" BUTTON
// =========================================================

let startRouteNowButton =
    null;


function createStartRouteNowButton() {

    if (
        startRouteNowButton
        ||
        !calculateRouteButton
    ) {

        return;

    }


    startRouteNowButton =
        document.createElement(
            "button"
        );


    startRouteNowButton.type =
        "button";


    startRouteNowButton.id =
        "startRouteNowButton";


    startRouteNowButton.className =
        "primary-action-button";


    startRouteNowButton.textContent =
        "▶ התחל עכשיו";


    startRouteNowButton.style.marginTop =
        "10px";


    startRouteNowButton.style.width =
        "100%";


    calculateRouteButton.insertAdjacentElement(
        "afterend",
        startRouteNowButton
    );


    startRouteNowButton.addEventListener(

        "click",

        startRouteNow

    );

}


// =========================================================
// ROUTE PLANNER TOGGLE
// =========================================================

if (
    toggleRoutePlannerButton
) {

    toggleRoutePlannerButton.addEventListener(

        "click",

        function () {

            if (
                routePlannerSection
            ) {

                routePlannerSection.classList
                    .toggle(
                        "hidden"
                    );

            }

        }

    );

}


// =========================================================
// ROUTE STORAGE KEY
// =========================================================

function getRouteStorageKey() {

    return currentProfile

        ? `${DRIVER_ROUTE_STORAGE_KEY}_${currentProfile.id}`

        : DRIVER_ROUTE_STORAGE_KEY;

}


// =========================================================
// LOCAL DATE / TIME HELPERS
// =========================================================

function getLocalDateValue(
    date = new Date()
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


function getLocalTimeValue(
    date = new Date()
) {

    const hours =
        String(
            date.getHours()
        )
            .padStart(
                2,
                "0"
            );


    const minutes =
        String(
            date.getMinutes()
        )
            .padStart(
                2,
                "0"
            );


    return `${hours}:${minutes}`;

}


// =========================================================
// LOAD ROUTE SETTINGS
// =========================================================

function loadRouteSettings() {

    const saved =
        localStorage.getItem(
            getRouteStorageKey()
        );


    if (
        !saved
    ) {

        if (
            routeDate
        ) {

            routeDate.value =
                getLocalDateValue();

        }


        if (
            routeStartTime
            &&
            !routeStartTime.value
        ) {

            routeStartTime.value =
                getLocalTimeValue();

        }


        return;

    }


    try {

        const settings =
            JSON.parse(
                saved
            );


        if (
            routeDate
        ) {

            routeDate.value =
                settings.date
                ||
                getLocalDateValue();

        }


        if (
            routeStartTime
        ) {

            routeStartTime.value =
                settings.startTime
                ||
                getLocalTimeValue();

        }


        if (
            routeStartAddress
        ) {

            routeStartAddress.value =
                settings.startAddress
                ||
                "";

        }


        if (
            routeEndAddress
        ) {

            routeEndAddress.value =
                settings.endAddress
                ||
                "";

        }

    }

    catch (
        error
    ) {

        console.error(
            "Failed loading route settings:",
            error
        );

    }

}


// =========================================================
// GET ROUTE SETTINGS
// =========================================================

function getCurrentRouteSettings() {

    return {

        date:
            routeDate
                ? routeDate.value
                : "",

        startTime:
            routeStartTime
                ? routeStartTime.value
                : "",

        startAddress:
            routeStartAddress
                ? routeStartAddress.value.trim()
                : "",

        endAddress:
            routeEndAddress
                ? routeEndAddress.value.trim()
                : ""

    };

}


// =========================================================
// SAVE ROUTE SETTINGS
// =========================================================

function saveCurrentRouteSettings() {

    if (
        !currentProfile
    ) {

        return;

    }


    localStorage.setItem(

        getRouteStorageKey(),

        JSON.stringify(
            getCurrentRouteSettings()
        )

    );

}


// =========================================================
// VALIDATE ROUTE
// =========================================================

function validateRouteSettings(
    settings
) {

    if (
        !settings.date
    ) {

        alert(
            "יש לבחור תאריך למסלול."
        );

        return false;

    }


    if (
        !settings.startTime
    ) {

        alert(
            "יש להזין שעת התחלה."
        );

        return false;

    }


    if (
        !settings.startAddress
    ) {

        alert(
            "יש להזין כתובת התחלה."
        );

        return false;

    }


    if (
        !settings.endAddress
    ) {

        alert(
            "יש להזין כתובת סיום."
        );

        return false;

    }


    const activeShipments =
        driverShipments.filter(

            shipment =>
                shipment.status !==
                    "נמסר"

                &&

                shipment.status !==
                    "לא נמסר"

        );


    if (
        activeShipments.length ===
        0
    ) {

        alert(
            "אין כרגע משלוחים פעילים לסידור מסלול."
        );

        return false;

    }


    return true;

}


// =========================================================
// SAVE SETTINGS BUTTON
// =========================================================

if (
    saveRouteSettingsButton
) {

    saveRouteSettingsButton.addEventListener(

        "click",

        function () {

            const settings =
                getCurrentRouteSettings();


            if (
                !validateRouteSettings(
                    settings
                )
            ) {

                return;

            }


            saveCurrentRouteSettings();


            if (
                routePlannerMessage
            ) {

                routePlannerMessage.textContent =
                    "הגדרות המסלול נשמרו.";

            }

        }

    );

}


// =========================================================
// BUILD START DATE/TIME
// =========================================================

function buildRouteStartIso(
    settings
) {

    const localDate =
        new Date(
            `${settings.date}T${settings.startTime}:00`
        );


    if (
        Number.isNaN(
            localDate.getTime()
        )
    ) {

        return null;

    }


    return localDate
        .toISOString();

}


// =========================================================
// FORMAT TIME
// =========================================================

function formatRouteTime(
    value
) {

    if (
        !value
    ) {

        return "--";

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

        return "--";

    }


    return date
        .toLocaleTimeString(
            "he-IL",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );

}


// =========================================================
// FORMAT DURATION
// =========================================================

function formatRouteDuration(
    seconds
) {

    const totalMinutes =
        Math.round(
            Number(
                seconds ||
                0
            )
            /
            60
        );


    const hours =
        Math.floor(
            totalMinutes /
            60
        );


    const minutes =
        totalMinutes %
        60;


    if (
        hours <=
        0
    ) {

        return `${minutes} דקות`;

    }


    if (
        minutes ===
        0
    ) {

        return `${hours} שעות`;

    }


    return `${hours} שעות ו-${minutes} דקות`;

}


// =========================================================
// FORMAT DISTANCE
// =========================================================

function formatRouteDistance(
    meters
) {

    const km =
        Number(
            meters ||
            0
        )
        /
        1000;


    return `${km.toFixed(1)} ק"מ`;

}


// =========================================================
// GEOCODE MISSING ACTIVE SHIPMENTS
// =========================================================

async function ensureActiveShipmentsGeocoded() {

    const missing =
        driverShipments.filter(

            shipment =>

                shipment.status !==
                    "נמסר"

                &&

                shipment.status !==
                    "לא נמסר"

                &&

                (
                    shipment.latitude ===
                        null

                    ||

                    shipment.longitude ===
                        null
                )

        );


    if (
        missing.length ===
        0
    ) {

        return true;

    }


    if (
        routePlannerMessage
    ) {

        routePlannerMessage.textContent =
            `מאתר ${missing.length} כתובות לפני חישוב המסלול...`;

    }


    for (
        const shipment
        of missing
    ) {

        const success =
            await geocodeDriverShipment(
                shipment.id
            );


        if (
            !success
        ) {

            alert(
                `לא הצלחנו לאתר את הכתובת של ${shipment.customer || "אחד המשלוחים"}.\nבדוק את העיר, הרחוב ומספר הבית.`
            );


            return false;

        }

    }


    await loadDriverShipments();


    return true;

}


// =========================================================
// SAVE CURRENT ROUTE RESULT IN MEMORY
// =========================================================

function saveOptimizedRoute(
    result
) {

    optimizedRouteResult =
        result;

}


// =========================================================
// LOAD ACTIVE ROUTE FROM DATABASE
// =========================================================

async function loadActiveRouteFromDatabase() {

    if (
        !currentProfile
    ) {

        return;

    }


    const route =
        await getCurrentDatabaseRoute();


    if (
        !route
    ) {

        setDriverWorkView(
            false
        );


        optimizedRouteResult =
            null;


        if (
            optimizedRouteList
        ) {

            optimizedRouteList.innerHTML =
                "";

        }


        if (
            routeSummarySection
        ) {

            routeSummarySection.classList
                .add(
                    "hidden"
                );

        }


        return;

    }


    setDriverWorkView(
        true
    );


    const {
        data: routeStops,
        error: stopsError
    } =
        await supabaseClient
            .from(
                "driver_route_stops"
            )
            .select(
                `
                id,
                route_id,
                shipment_id,
                stop_order,
                eta,
                travel_distance_meters,
                travel_duration_seconds,
                completed_at,
                completion_status
                `
            )
            .eq(
                "route_id",
                route.id
            )
            .is(
                "completed_at",
                null
            )
            .order(
                "stop_order",
                {
                    ascending:
                        true
                }
            );


    if (
        stopsError
    ) {

        console.error(
            "Failed loading active route stops:",
            stopsError
        );

        return;

    }


    const activeStops =
        routeStops || [];


    const shipmentIds =
        activeStops.map(
            stop =>
                stop.shipment_id
        );


    let shipmentsById =
        new Map();


    if (
        shipmentIds.length >
        0
    ) {

        const {
            data: routeShipments,
            error: shipmentsError
        } =
            await supabaseClient
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
                    latitude,
                    longitude,
                    google_place_id,
                    formatted_address
                    `
                )
                .in(
                    "id",
                    shipmentIds
                );


        if (
            shipmentsError
        ) {

            console.error(
                "Failed loading route shipments:",
                shipmentsError
            );

            return;

        }


        shipmentsById =
            new Map(
                (routeShipments || [])
                    .map(
                        shipment => [
                            shipment.id,
                            shipment
                        ]
                    )
            );

    }


    const stops =
        activeStops
            .map(
                (
                    stop,
                    index
                ) => {

                    const shipment =
                        shipmentsById.get(
                            stop.shipment_id
                        );


                    if (
                        !shipment
                    ) {

                        return null;

                    }


                    return {
                        order:
                            stop.stop_order,

                        original_order:
                            stop.stop_order,

                        shipment_id:
                            shipment.id,

                        shipment_number:
                            shipment.shipment_number,

                        customer:
                            shipment.customer,

                        phone:
                            shipment.phone,

                        city:
                            shipment.city,

                        street:
                            shipment.street,

                        house_number:
                            shipment.house_number,

                        entrance:
                            shipment.entrance,

                        floor:
                            shipment.floor,

                        apartment:
                            shipment.apartment,

                        building_code:
                            shipment.building_code,

                        address_notes:
                            shipment.address_notes,

                        delivery_instructions:
                            shipment.delivery_instructions,

                        notes:
                            shipment.notes,

                        latitude:
                            shipment.latitude,

                        longitude:
                            shipment.longitude,

                        google_place_id:
                            shipment.google_place_id,

                        formatted_address:
                            shipment.formatted_address,

                        eta:
                            stop.eta,

                        travel_distance_meters:
                            stop.travel_distance_meters ||
                            0,

                        travel_duration_seconds:
                            stop.travel_duration_seconds ||
                            0
                    };

                }
            )
            .filter(
                Boolean
            );


    const result = {
        success:
            true,

        route_id:
            route.id,

        route_status:
            route.status,

        start_address:
            route.start_address,

        end_address:
            route.end_address,

        vehicle_start_time:
            route.started_at ||
            route.planned_start_at,

        vehicle_end_time:
            route.estimated_end_at,

        total_duration_seconds:
            route.total_duration_seconds ||
            0,

        total_distance_meters:
            route.total_distance_meters ||
            0,

        stop_count:
            route.stop_count ||
            stops.length,

        remaining_stop_count:
            stops.length,

        stops:
            stops
    };


    saveOptimizedRoute(
        result
    );


    renderOptimizedRoute(
        result
    );

}


// =========================================================
// RENDER OPTIMIZED ROUTE
// =========================================================

function renderOptimizedRoute(
    result
) {

    if (
        !result
    ) {

        return;

    }


    setDriverWorkView(
        true
    );


    if (
        routeSummaryStartTime
    ) {

        routeSummaryStartTime.textContent =
            formatRouteTime(
                result.vehicle_start_time
            );

    }


    if (
        routeSummaryEndTime
    ) {

        routeSummaryEndTime.textContent =
            formatRouteTime(
                result.vehicle_end_time
            );

    }


    if (
        routeSummaryDuration
    ) {

        routeSummaryDuration.textContent =
            formatRouteDuration(
                result.total_duration_seconds
            );

    }


    if (
        routeSummaryDistance
    ) {

        routeSummaryDistance.textContent =
            formatRouteDistance(
                result.total_distance_meters
            );

    }


    if (
        optimizedRouteList
    ) {

        optimizedRouteList.innerHTML =
            "";

    }


    const stops =
        result.stops
        ||
        [];


    // כאשר יש מסלול פעיל, כרטיס "נשארו" צריך לשקף
    // את מספר התחנות שנותרו במסלול ולא את כל המשלוחים הפעילים.
    if (
        remainingShipmentsElement
    ) {

        remainingShipmentsElement.textContent =
            stops.length;

    }


    stops.forEach(

        stop => {

            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


            item.className =
                "driver-shipment-card";


            item.addEventListener(

                "click",

                function () {

                    openShipmentDetails(
                        stop.shipment_id
                    );


                    if (
                        deliveryEta
                    ) {

                        deliveryEta.textContent =
                            formatRouteTime(
                                stop.eta
                            );

                    }

                }

            );


            item.innerHTML = `

                <div class="shipment-card-top">

                    <div>

                        <div
                            style="
                                font-size:12px;
                                color:#64748b;
                                margin-bottom:4px;
                            "
                        >
                            תחנה ${stop.order}
                        </div>

                        <h3 class="shipment-card-customer">
                            ${stop.customer || "לקוח"}
                        </h3>

                    </div>


                    <span class="shipment-card-status status-assigned">

                        ETA
                        ${formatRouteTime(
                            stop.eta
                        )}

                    </span>

                </div>


                <div class="shipment-card-address">

                    📍
                    ${stop.street || ""}
                    ${stop.house_number || ""},
                    ${stop.city || ""}

                </div>


                <div class="shipment-card-phone">

                    📞
                    ${stop.phone || "ללא טלפון"}

                </div>


                <div class="shipment-card-footer">

                    <span class="shipment-card-eta">

                        ${
                            stop.travel_distance_meters
                                ?
                                formatRouteDistance(
                                    stop.travel_distance_meters
                                )
                                :
                                ""
                        }

                    </span>


                    <span class="shipment-open-text">

                        פרטים >

                    </span>

                </div>

            `;


            optimizedRouteList
                .appendChild(
                    item
                );

        }

    );


    if (
        routeSummarySection
    ) {

        routeSummarySection.classList
            .remove(
                "hidden"
            );

    }

}


// =========================================================
// SAVE ACTUAL ROUTE START TIME
// =========================================================

async function saveActualRouteStartTime(
    startedAt
) {

    if (
        !currentProfile
    ) {

        return false;

    }


    const activeIds =
        driverShipments
            .filter(

                shipment =>
                    shipment.status !==
                        "נמסר"

                    &&

                    shipment.status !==
                        "לא נמסר"

            )
            .map(
                shipment =>
                    shipment.id
            );


    if (
        activeIds.length ===
        0
    ) {

        return false;

    }


    const {
        error
    } =
        await supabaseClient
            .from(
                "shipments"
            )
            .update(
                {
                    route_started_at:
                        startedAt
                }
            )
            .eq(
                "driver_id",
                currentProfile.id
            )
            .in(
                "id",
                activeIds
            );


    if (
        error
    ) {

        console.error(
            "Failed saving route_started_at:",
            error
        );


        return false;

    }


    driverShipments.forEach(

        shipment => {

            if (
                activeIds.includes(
                    shipment.id
                )
            ) {

                shipment.route_started_at =
                    startedAt;

            }

        }

    );


    return true;

}


// =========================================================
// START ROUTE NOW
// =========================================================

async function startRouteNow() {

    const now =
        new Date();


    if (
        routeDate
    ) {

        routeDate.value =
            getLocalDateValue(
                now
            );

    }


    if (
        routeStartTime
    ) {

        routeStartTime.value =
            getLocalTimeValue(
                now
            );

    }


    const settings =
        getCurrentRouteSettings();


    if (
        !settings.startAddress
        ||
        !settings.endAddress
    ) {

        alert(
            "לפני התחלת המסלול יש להזין כתובת התחלה וכתובת סיום."
        );


        return;

    }


    if (
        !validateRouteSettings(
            settings
        )
    ) {

        return;

    }


    if (
        startRouteNowButton
    ) {

        startRouteNowButton.disabled =
            true;

        startRouteNowButton.textContent =
            "מתחיל מסלול...";

    }


    if (
        routePlannerMessage
    ) {

        routePlannerMessage.textContent =
            "שומר את שעת ההתחלה בפועל ומחשב מסלול מחדש...";

    }


    const startedAt =
        now.toISOString();


    const saved =
        await saveActualRouteStartTime(
            startedAt
        );


    if (
        !saved
    ) {

        if (
            startRouteNowButton
        ) {

            startRouteNowButton.disabled =
                false;

            startRouteNowButton.textContent =
                "▶ התחל עכשיו";

        }


        alert(
            "לא הצלחנו לשמור את שעת התחלת המסלול."
        );


        return;

    }


    saveCurrentRouteSettings();


    await calculateDriverRoute();


    if (
        startRouteNowButton
    ) {

        startRouteNowButton.disabled =
            false;

        startRouteNowButton.textContent =
            "▶ התחל עכשיו";

    }

}


// =========================================================
// CALCULATE REAL GOOGLE ROUTE
// =========================================================

async function calculateDriverRoute() {

    const settings =
        getCurrentRouteSettings();


    if (
        !validateRouteSettings(
            settings
        )
    ) {

        return;

    }


    saveCurrentRouteSettings();


    const startAt =
        buildRouteStartIso(
            settings
        );


    if (
        !startAt
    ) {

        alert(
            "שעת ההתחלה אינה תקינה."
        );


        return;

    }


    if (
        calculateRouteButton
    ) {

        calculateRouteButton.disabled =
            true;

        calculateRouteButton.textContent =
            "מחשב מסלול...";

    }


    if (
        recalculateRouteButton
    ) {

        recalculateRouteButton.disabled =
            true;

    }


    try {

        const geocodingReady =
            await ensureActiveShipmentsGeocoded();


        if (
            !geocodingReady
        ) {

            return;

        }


        if (
            routePlannerMessage
        ) {

            routePlannerMessage.textContent =
                "Google מסדר את התחנות ומחשב זמני הגעה...";

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "optimize-driver-route",
                    {
                        body: {

                            start_address:
                                settings.startAddress,

                            end_address:
                                settings.endAddress,

                            start_at:
                                startAt

                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                "Route optimization invoke failed:",
                error
            );


            alert(
                "לא הצלחנו לחשב את המסלול."
            );


            return;

        }


        if (
            !data
            ||
            data.success !==
                true
        ) {

            console.error(
                "Route optimization response:",
                data
            );


            alert(
                data?.error
                ||
                "לא הצלחנו לחשב את המסלול."
            );


            return;

        }


        saveOptimizedRoute(
            data
        );


        renderOptimizedRoute(
            data
        );


        clearRouteRecalculationWarning();


        if (
            routePlannerMessage
        ) {

            routePlannerMessage.textContent =
                `המסלול מוכן ✅ ${data.stop_count} תחנות • ${formatRouteDistance(
                    data.total_distance_meters
                )} • סיום משוער ${formatRouteTime(
                    data.vehicle_end_time
                )}`;

        }

    }

    catch (
        error
    ) {

        console.error(
            "calculateDriverRoute failed:",
            error
        );


        alert(
            "אירעה שגיאה בחישוב המסלול."
        );

    }

    finally {

        if (
            calculateRouteButton
        ) {

            calculateRouteButton.disabled =
                false;

            calculateRouteButton.textContent =
                "🧭 סדר לי מסלול";

        }


        if (
            recalculateRouteButton
        ) {

            recalculateRouteButton.disabled =
                false;

        }

    }

}


// =========================================================
// CALCULATE BUTTON
// =========================================================

if (
    calculateRouteButton
) {

    calculateRouteButton.addEventListener(

        "click",

        calculateDriverRoute

    );

}


// =========================================================
// RECALCULATE BUTTON
// =========================================================

if (
    recalculateRouteButton
) {

    recalculateRouteButton.addEventListener(

        "click",

        calculateDriverRoute

    );

}


// =========================================================
// REPORTS
// =========================================================

if (
    driverReportsButton
) {

    driverReportsButton.addEventListener(

        "click",

        function () {

            window.location.href =
                "driver-history.html";

        }

    );

}


// =========================================================
// INITIALIZE DRIVER APP
// =========================================================

async function initializeDriverApp() {

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


    initializeDriverHeader();


    createStartRouteNowButton();


    loadRouteSettings();


    await initializeGooglePlacesAutocomplete();


    await loadDriverShipments();


    await loadActiveRouteFromDatabase();

}


// =========================================================
// START DRIVER APP
// =========================================================

initializeDriverApp();