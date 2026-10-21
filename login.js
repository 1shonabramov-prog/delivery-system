// =========================================================
// LOGIN - SUPABASE AUTH
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
// STORAGE KEYS
// =========================================================

const CURRENT_USER_STORAGE_KEY =
    "delivery_system_current_user";

const REMEMBERED_USERNAME_KEY =
    "delivery_system_remembered_username";


// =========================================================
// DOM ELEMENTS
// =========================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );

const usernameInput =
    document.getElementById(
        "username"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const rememberMe =
    document.getElementById(
        "rememberMe"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const togglePasswordButton =
    document.getElementById(
        "togglePasswordButton"
    );


// =========================================================
// RESTORE REMEMBERED EMAIL
// =========================================================

function restoreRememberedUsername() {

    const remembered =
        localStorage.getItem(
            REMEMBERED_USERNAME_KEY
        );


    if (
        remembered &&
        usernameInput
    ) {

        usernameInput.value =
            remembered;


        if (
            rememberMe
        ) {

            rememberMe.checked =
                true;

        }

    }

}


// =========================================================
// SHOW MESSAGE
// =========================================================

function showLoginMessage(
    message,
    type = "error"
) {

    if (
        !loginMessage
    ) {

        return;

    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        "login-message";


    loginMessage.classList.add(
        type
    );

}


// =========================================================
// CLEAR MESSAGE
// =========================================================

function clearLoginMessage() {

    if (
        !loginMessage
    ) {

        return;

    }


    loginMessage.textContent =
        "";


    loginMessage.className =
        "login-message";

}


// =========================================================
// SHOW / HIDE PASSWORD
// =========================================================

if (
    togglePasswordButton &&
    passwordInput
) {

    togglePasswordButton
        .addEventListener(

            "click",

            function () {

                const isPassword =
                    passwordInput.type ===
                    "password";


                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";


                togglePasswordButton.textContent =
                    isPassword
                        ? "🙈"
                        : "👁";

            }

        );

}


// =========================================================
// LOAD PROFILE AFTER LOGIN
// =========================================================

async function loadProfile(
    userId
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "profiles"
            )
            .select(
                "id, username, full_name, phone, role, status, driver_rate, notes"
            )
            .eq(
                "id",
                userId
            )
            .single();


    if (
        error
    ) {

        console.error(
            "Profile load failed",
            error
        );


        return null;

    }


    return data;

}


// =========================================================
// SAVE CURRENT USER
// =========================================================

function saveCurrentUser(
    profile,
    authUser
) {

    const currentUser = {

        id:
            profile.id,

        driverId:
            profile.id,

        username:
            profile.username,

        fullName:
            profile.full_name,

        phone:
            profile.phone,

        role:
            profile.role,

        status:
            profile.status,

        driverRate:
            Number(
                profile.driver_rate ||
                0
            ),

        notes:
            profile.notes,

        email:
            authUser.email

    };


    sessionStorage.setItem(

        CURRENT_USER_STORAGE_KEY,

        JSON.stringify(
            currentUser
        )

    );

}


// =========================================================
// REDIRECT BY ROLE
// =========================================================

function redirectByRole(
    profile
) {

    switch (
        profile.role
    ) {

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
                "למשתמש אין תפקיד תקין במערכת."
            );

    }

}


// =========================================================
// LOGIN
// =========================================================

if (
    loginForm
) {

    loginForm
        .addEventListener(

            "submit",

            async function (
                event
            ) {

                event.preventDefault();


                clearLoginMessage();


                const email =
                    usernameInput
                        .value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput
                        .value;


                if (
                    !email ||
                    !password
                ) {

                    showLoginMessage(
                        "יש להזין אימייל וסיסמה."
                    );

                    return;

                }


                // =============================================
                // SUPABASE AUTH
                // =============================================

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signInWithPassword(
                            {
                                email:
                                    email,

                                password:
                                    password
                            }
                        );


                if (
                    error ||
                    !data.user
                ) {

                    console.error(
                        "Login failed",
                        error
                    );


                    showLoginMessage(
                        "האימייל או הסיסמה אינם נכונים."
                    );

                    return;

                }


                // =============================================
                // LOAD PROFILE
                // =============================================

                const profile =
                    await loadProfile(
                        data.user.id
                    );


                if (
                    !profile
                ) {

                    await supabaseClient
                        .auth
                        .signOut();


                    showLoginMessage(
                        "לא נמצא פרופיל משתמש במערכת."
                    );

                    return;

                }


                // =============================================
                // ACTIVE CHECK
                // =============================================

                if (
                    profile.status !==
                    "פעיל"
                ) {

                    await supabaseClient
                        .auth
                        .signOut();


                    showLoginMessage(
                        "המשתמש אינו פעיל במערכת."
                    );

                    return;

                }


                // =============================================
                // REMEMBER EMAIL
                // =============================================

                if (
                    rememberMe &&
                    rememberMe.checked
                ) {

                    localStorage.setItem(

                        REMEMBERED_USERNAME_KEY,

                        email

                    );

                }

                else {

                    localStorage.removeItem(
                        REMEMBERED_USERNAME_KEY
                    );

                }


                // =============================================
                // SAVE APP SESSION
                // =============================================

                saveCurrentUser(
                    profile,
                    data.user
                );


                showLoginMessage(
                    "התחברת בהצלחה.",
                    "success"
                );


                redirectByRole(
                    profile
                );

            }

        );

}


// =========================================================
// INITIALIZE
// =========================================================

restoreRememberedUsername();