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

const REMEMBERED_EMAIL_KEY =
    "delivery_system_remembered_email";


// =========================================================
// DOM ELEMENTS
// =========================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


const emailInput =
    document.getElementById(
        "loginEmail"
    );


const passwordInput =
    document.getElementById(
        "loginPassword"
    );


const rememberUser =
    document.getElementById(
        "rememberUser"
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

function restoreRememberedEmail() {

    const rememberedEmail =
        localStorage.getItem(
            REMEMBERED_EMAIL_KEY
        );


    if (
        rememberedEmail &&
        emailInput
    ) {

        emailInput.value =
            rememberedEmail;


        if (
            rememberUser
        ) {

            rememberUser.checked =
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
        "login-message hidden";

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

                const passwordIsHidden =
                    passwordInput.type ===
                    "password";


                passwordInput.type =
                    passwordIsHidden
                        ? "text"
                        : "password";


                togglePasswordButton.textContent =
                    passwordIsHidden
                        ? "🙈"
                        : "👁️";


                togglePasswordButton.setAttribute(

                    "aria-label",

                    passwordIsHidden
                        ? "הסתר סיסמה"
                        : "הצג סיסמה"

                );

            }

        );

}


// =========================================================
// LOAD PROFILE
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
                userId
            )
            .single();


    if (
        error
    ) {

        console.error(
            "Profile load failed:",
            error
        );


        return null;

    }


    return data;

}


// =========================================================
// SAVE CURRENT APP USER
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
            profile.username || "",

        fullName:
            profile.full_name || "",

        phone:
            profile.phone || "",

        role:
            profile.role || "",

        status:
            profile.status || "",

        driverRate:
            Number(
                profile.driver_rate ||
                0
            ),

        notes:
            profile.notes || "",

        email:
            authUser.email || ""

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

    loginForm.addEventListener(

        "submit",

        async function (
            event
        ) {

            event.preventDefault();


            clearLoginMessage();


            const email =
                emailInput
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
            // SUPABASE AUTH LOGIN
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
                !data ||
                !data.user
            ) {

                console.error(
                    "Login failed:",
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
            // ACTIVE USER CHECK
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
                rememberUser &&
                rememberUser.checked
            ) {

                localStorage.setItem(

                    REMEMBERED_EMAIL_KEY,

                    email

                );

            }

            else {

                localStorage.removeItem(
                    REMEMBERED_EMAIL_KEY
                );

            }


            // =============================================
            // SAVE LOCAL APP SESSION
            // =============================================

            saveCurrentUser(
                profile,
                data.user
            );


            showLoginMessage(
                "התחברת בהצלחה.",
                "success"
            );


            // =============================================
            // REDIRECT
            // =============================================

            redirectByRole(
                profile
            );

        }

    );

}


// =========================================================
// INITIALIZE
// =========================================================

restoreRememberedEmail();