// =========================================================
// DELIVERY SYSTEM
// LOGIN
// =========================================================


// =========================================================
// STORAGE KEYS
// =========================================================

const USERS_STORAGE_KEY =
    "delivery_system_users";

const CURRENT_USER_STORAGE_KEY =
    "delivery_system_current_user";

const REMEMBERED_USERNAME_KEY =
    "delivery_system_remembered_username";


// =========================================================
// GET USERS
// =========================================================

function getUsers() {

    const savedUsers =
        localStorage.getItem(
            USERS_STORAGE_KEY
        );


    if (!savedUsers) {

        return [];

    }


    try {

        return JSON.parse(
            savedUsers
        );

    }

    catch (error) {

        console.error(
            "Failed loading users",
            error
        );

        return [];

    }

}


// =========================================================
// DOM ELEMENTS
// =========================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginUsername =
    document.getElementById(
        "loginUsername"
    );


const loginPassword =
    document.getElementById(
        "loginPassword"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const rememberUser =
    document.getElementById(
        "rememberUser"
    );


const togglePasswordButton =
    document.getElementById(
        "togglePasswordButton"
    );


// =========================================================
// SHOW MESSAGE
// =========================================================

function showLoginMessage(
    message,
    type
) {

    if (!loginMessage) {

        return;

    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        "login-message " +
        type;

}


// =========================================================
// HIDE MESSAGE
// =========================================================

function hideLoginMessage() {

    if (!loginMessage) {

        return;

    }


    loginMessage.className =
        "login-message hidden";


    loginMessage.textContent =
        "";

}


// =========================================================
// REDIRECT USER BY ROLE
// =========================================================

function redirectUserByRole(user) {

    switch (user.role) {


        case "ADMIN":

            window.location.href =
                "index.html";

            break;


        case "WAREHOUSE":

            window.location.href =
                "warehouse.html";

            break;


        case "DRIVER":

            window.location.href =
                "driver.html";

            break;


        default:

            showLoginMessage(
                "לתפקיד המשתמש אין הרשאה מוגדרת במערכת.",
                "error"
            );

            break;

    }

}


// =========================================================
// LOGIN
// =========================================================

function loginUser(
    username,
    password
) {

    const users =
        getUsers();


    const normalizedUsername =
        username
            .trim()
            .toLowerCase();


    const user =
        users.find(

            item =>

                item.username
                    .trim()
                    .toLowerCase()

                ===

                normalizedUsername

        );


    // =====================================================
    // USER NOT FOUND
    // =====================================================

    if (!user) {

        showLoginMessage(
            "שם המשתמש או הסיסמה אינם נכונים.",
            "error"
        );

        return;

    }


    // =====================================================
    // WRONG PASSWORD
    // =====================================================

    if (
        user.password !==
        password
    ) {

        showLoginMessage(
            "שם המשתמש או הסיסמה אינם נכונים.",
            "error"
        );

        return;

    }


    // =====================================================
    // INACTIVE USER
    // =====================================================

    if (
        user.status !==
        "פעיל"
    ) {

        showLoginMessage(
            "המשתמש אינו פעיל. יש לפנות למנהל המערכת.",
            "warning"
        );

        return;

    }


    // =====================================================
    // SAVE CURRENT SESSION
    // =====================================================

    const currentUser = {

        id:
            user.id,

        fullName:
            user.fullName,

        username:
            user.username,

        role:
            user.role,

        status:
            user.status,

        driverId:
            user.driverId || null,

        deliveryRate:
            user.deliveryRate || 0,

        loginAt:
            new Date()
                .toISOString()

    };


    sessionStorage.setItem(

        CURRENT_USER_STORAGE_KEY,

        JSON.stringify(
            currentUser
        )

    );


    // =====================================================
    // REMEMBER USERNAME
    // =====================================================

    if (
        rememberUser &&
        rememberUser.checked
    ) {

        localStorage.setItem(

            REMEMBERED_USERNAME_KEY,

            user.username

        );

    }

    else {

        localStorage.removeItem(
            REMEMBERED_USERNAME_KEY
        );

    }


    // =====================================================
    // SUCCESS
    // =====================================================

    showLoginMessage(
        "התחברת בהצלחה. מעביר אותך למערכת...",
        "success"
    );


    setTimeout(

        function () {

            redirectUserByRole(
                user
            );

        },

        500

    );

}


// =========================================================
// LOGIN FORM SUBMIT
// =========================================================

if (loginForm) {

    loginForm.addEventListener(

        "submit",

        function (event) {

            event.preventDefault();


            hideLoginMessage();


            const username =
                loginUsername
                    .value
                    .trim();


            const password =
                loginPassword
                    .value;


            if (
                username === ""
            ) {

                showLoginMessage(
                    "יש להזין שם משתמש.",
                    "error"
                );

                loginUsername.focus();

                return;

            }


            if (
                password === ""
            ) {

                showLoginMessage(
                    "יש להזין סיסמה.",
                    "error"
                );

                loginPassword.focus();

                return;

            }


            loginUser(
                username,
                password
            );

        }

    );

}


// =========================================================
// SHOW / HIDE PASSWORD
// =========================================================

if (togglePasswordButton) {

    togglePasswordButton.addEventListener(

        "click",

        function () {

            const isPassword =
                loginPassword.type ===
                "password";


            loginPassword.type =
                isPassword
                    ? "text"
                    : "password";


            togglePasswordButton.textContent =
                isPassword
                    ? "🙈"
                    : "👁️";

        }

    );

}


// =========================================================
// LOAD REMEMBERED USERNAME
// =========================================================

function loadRememberedUsername() {

    const rememberedUsername =
        localStorage.getItem(
            REMEMBERED_USERNAME_KEY
        );


    if (
        rememberedUsername
    ) {

        loginUsername.value =
            rememberedUsername;


        rememberUser.checked =
            true;


        loginPassword.focus();

    }

    else {

        loginUsername.focus();

    }

}


// =========================================================
// IF USER IS ALREADY LOGGED IN
// =========================================================

function checkExistingSession() {

    const currentUserData =
        sessionStorage.getItem(
            CURRENT_USER_STORAGE_KEY
        );


    if (
        !currentUserData
    ) {

        return false;

    }


    try {

        const currentUser =
            JSON.parse(
                currentUserData
            );


        if (
            currentUser &&
            currentUser.role &&
            currentUser.status ===
                "פעיל"
        ) {

            redirectUserByRole(
                currentUser
            );

            return true;

        }

    }

    catch (error) {

        sessionStorage.removeItem(
            CURRENT_USER_STORAGE_KEY
        );

    }


    return false;

}


// =========================================================
// INITIALIZE
// =========================================================

const redirected =
    checkExistingSession();


if (!redirected) {

    loadRememberedUsername();

}