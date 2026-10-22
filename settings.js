// =========================================================
// DELIVERY SYSTEM
// SETTINGS / USERS MANAGEMENT - SUPABASE
// =========================================================


// =========================================================
// SUPABASE CLIENT
// =========================================================

const settingsSupabase =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================================
// GLOBAL STATE
// =========================================================

let settingsAuthUser =
    null;

let settingsCurrentProfile =
    null;

let settingsProfiles =
    [];

let editingProfile =
    null;


// =========================================================
// DOM - CURRENT USER
// =========================================================

const settingsUserAvatar =
    document.getElementById(
        "settingsUserAvatar"
    );


const settingsUserName =
    document.getElementById(
        "settingsUserName"
    );


const settingsUserRole =
    document.getElementById(
        "settingsUserRole"
    );


// =========================================================
// DOM - SETTINGS NAVIGATION
// =========================================================

const settingsNavItems =
    document.querySelectorAll(
        ".settings-nav-item"
    );


const usersSection =
    document.getElementById(
        "usersSection"
    );


const placeholderSection =
    document.getElementById(
        "placeholderSection"
    );


const placeholderTitle =
    document.getElementById(
        "placeholderTitle"
    );


// =========================================================
// DOM - USERS
// =========================================================

const totalUsersCount =
    document.getElementById(
        "totalUsersCount"
    );


const activeUsersCount =
    document.getElementById(
        "activeUsersCount"
    );


const activeDriverUsersCount =
    document.getElementById(
        "activeDriverUsersCount"
    );


const inactiveUsersCount =
    document.getElementById(
        "inactiveUsersCount"
    );


const userSearchInput =
    document.getElementById(
        "userSearchInput"
    );


const userRoleFilter =
    document.getElementById(
        "userRoleFilter"
    );


const userStatusFilter =
    document.getElementById(
        "userStatusFilter"
    );


const usersTableBody =
    document.getElementById(
        "usersTableBody"
    );


const newUserButton =
    document.getElementById(
        "newUserButton"
    );


// =========================================================
// DOM - MODAL
// =========================================================

const userModal =
    document.getElementById(
        "userModal"
    );


const userModalTitle =
    document.getElementById(
        "userModalTitle"
    );


const userModalSubtitle =
    document.getElementById(
        "userModalSubtitle"
    );


const closeUserModal =
    document.getElementById(
        "closeUserModal"
    );


const cancelUserButton =
    document.getElementById(
        "cancelUserButton"
    );


const userForm =
    document.getElementById(
        "userForm"
    );


const editingUserId =
    document.getElementById(
        "editingUserId"
    );


const userFullName =
    document.getElementById(
        "userFullName"
    );


const userPhone =
    document.getElementById(
        "userPhone"
    );


const userEmail =
    document.getElementById(
        "userEmail"
    );


const userEmailGroup =
    document.getElementById(
        "userEmailGroup"
    );


const userRole =
    document.getElementById(
        "userRole"
    );


const userUsername =
    document.getElementById(
        "userUsername"
    );


const userPassword =
    document.getElementById(
        "userPassword"
    );


const userPasswordGroup =
    document.getElementById(
        "userPasswordGroup"
    );


const driverRateGroup =
    document.getElementById(
        "driverRateGroup"
    );


const userDeliveryRate =
    document.getElementById(
        "userDeliveryRate"
    );


const userStatus =
    document.getElementById(
        "userStatus"
    );


const userNotes =
    document.getElementById(
        "userNotes"
    );


const userSecurityMessage =
    document.getElementById(
        "userSecurityMessage"
    );


const saveUserButton =
    document.getElementById(
        "saveUserButton"
    );


// =========================================================
// REDIRECT
// =========================================================

function settingsRedirectToLogin() {

    sessionStorage.removeItem(
        "delivery_system_current_user"
    );


    window.location.href =
        "login.html";

}


// =========================================================
// AUTH SESSION
// =========================================================

async function loadSettingsSession() {

    const {
        data,
        error
    } =
        await settingsSupabase
            .auth
            .getSession();


    if (
        error
    ) {

        console.error(
            "Failed loading settings session:",
            error
        );


        settingsRedirectToLogin();

        return false;

    }


    if (
        !data.session ||
        !data.session.user
    ) {

        settingsRedirectToLogin();

        return false;

    }


    settingsAuthUser =
        data.session.user;


    return true;

}


// =========================================================
// LOAD CURRENT PROFILE
// =========================================================

async function loadSettingsCurrentProfile() {

    if (
        !settingsAuthUser
    ) {

        return false;

    }


    const {
        data,
        error
    } =
        await settingsSupabase
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
                settingsAuthUser.id
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


    settingsCurrentProfile =
        data;


    if (
        !settingsCurrentProfile ||
        settingsCurrentProfile.status !==
            "פעיל"
    ) {

        await settingsSupabase
            .auth
            .signOut();


        settingsRedirectToLogin();

        return false;

    }


    // Settings / user management is ADMIN only

    if (
        settingsCurrentProfile.role !==
        "ADMIN"
    ) {

        if (
            settingsCurrentProfile.role ===
            "DRIVER"
        ) {

            window.location.href =
                "driver.html";

        }

        else {

            window.location.href =
                "index.html";

        }


        return false;

    }


    return true;

}


// =========================================================
// CURRENT USER DISPLAY
// =========================================================

function renderSettingsCurrentUser() {

    if (
        !settingsCurrentProfile
    ) {

        return;

    }


    const fullName =
        settingsCurrentProfile.full_name ||
        settingsCurrentProfile.username ||
        "מנהל מערכת";


    if (
        settingsUserName
    ) {

        settingsUserName.textContent =
            fullName;

    }


    if (
        settingsUserAvatar
    ) {

        settingsUserAvatar.textContent =
            fullName
                .trim()
                .charAt(
                    0
                )
            ||
            "מ";

    }


    if (
        settingsUserRole
    ) {

        settingsUserRole.textContent =
            "Administrator";

    }

}


// =========================================================
// LOAD ALL PROFILES
// =========================================================

async function loadSettingsProfiles() {

    const {
        data,
        error
    } =
        await settingsSupabase
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
                notes,
                created_at
                `
            )
            .order(
                "full_name",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "Failed loading profiles:",
            error
        );


        settingsProfiles =
            [];


        showSettingsTableError(
            "לא ניתן לטעון את המשתמשים."
        );


        return false;

    }


    settingsProfiles =
        data ||
        [];


    return true;

}


// =========================================================
// TABLE ERROR
// =========================================================

function showSettingsTableError(
    message
) {

    if (
        !usersTableBody
    ) {

        return;

    }


    usersTableBody.innerHTML = `

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
// ROLE NAME
// =========================================================

function getSettingsRoleName(
    role
) {

    switch (
        role
    ) {

        case "ADMIN":

            return "מנהל מערכת";


        case "WAREHOUSE":

            return "עובד מחסן";


        case "DRIVER":

            return "שליח";


        default:

            return role ||
                "-";

    }

}


// =========================================================
// ROLE BADGE
// =========================================================

function getSettingsRoleBadge(
    role
) {

    const roleName =
        getSettingsRoleName(
            role
        );


    let className =
        "waiting";


    if (
        role ===
        "ADMIN"
    ) {

        className =
            "active";

    }


    if (
        role ===
        "DRIVER"
    ) {

        className =
            "completed";

    }


    return `

        <span class="status ${className}">
            ${roleName}
        </span>

    `;

}


// =========================================================
// STATUS BADGE
// =========================================================

function getSettingsStatusBadge(
    status
) {

    if (
        status ===
        "פעיל"
    ) {

        return `

            <span class="status completed">
                פעיל
            </span>

        `;

    }


    return `

        <span class="status failed">
            לא פעיל
        </span>

    `;

}


// =========================================================
// MONEY FORMAT
// =========================================================

function settingsFormatMoney(
    value
) {

    if (
        value ===
        null ||
        value ===
        undefined ||
        value ===
        ""
    ) {

        return "-";

    }


    return (

        "₪" +

        Number(
            value
        )
            .toLocaleString(
                "he-IL",
                {
                    minimumFractionDigits:
                        0,

                    maximumFractionDigits:
                        2
                }
            )

    );

}


// =========================================================
// COUNTERS
// =========================================================

function renderSettingsCounters() {

    const total =
        settingsProfiles.length;


    const active =
        settingsProfiles.filter(

            profile =>
                profile.status ===
                "פעיל"

        ).length;


    const activeDrivers =
        settingsProfiles.filter(

            profile =>

                profile.role ===
                    "DRIVER"

                &&

                profile.status ===
                    "פעיל"

        ).length;


    const inactive =
        settingsProfiles.filter(

            profile =>
                profile.status !==
                "פעיל"

        ).length;


    if (
        totalUsersCount
    ) {

        totalUsersCount.textContent =
            total;

    }


    if (
        activeUsersCount
    ) {

        activeUsersCount.textContent =
            active;

    }


    if (
        activeDriverUsersCount
    ) {

        activeDriverUsersCount.textContent =
            activeDrivers;

    }


    if (
        inactiveUsersCount
    ) {

        inactiveUsersCount.textContent =
            inactive;

    }

}


// =========================================================
// FILTER USERS
// =========================================================

function getFilteredSettingsProfiles() {

    const search =
        userSearchInput

            ? userSearchInput
                .value
                .trim()
                .toLowerCase()

            : "";


    const selectedRole =
        userRoleFilter

            ? userRoleFilter.value

            : "";


    const selectedStatus =
        userStatusFilter

            ? userStatusFilter.value

            : "";


    return settingsProfiles.filter(

        profile => {

            if (
                selectedRole &&
                profile.role !==
                    selectedRole
            ) {

                return false;

            }


            if (
                selectedStatus &&
                profile.status !==
                    selectedStatus
            ) {

                return false;

            }


            if (
                search
            ) {

                const searchText =
                    [

                        profile.full_name,

                        profile.phone,

                        profile.username,

                        profile.role,

                        profile.status

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
// RENDER USERS TABLE
// =========================================================

function renderSettingsUsersTable() {

    if (
        !usersTableBody
    ) {

        return;

    }


    const profiles =
        getFilteredSettingsProfiles();


    usersTableBody.innerHTML =
        "";


    if (
        profiles.length ===
        0
    ) {

        usersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    לא נמצאו משתמשים
                </td>

            </tr>

        `;


        return;

    }


    profiles.forEach(

        profile => {

            const row =
                document.createElement(
                    "tr"
                );


            const displayName =
                profile.full_name ||
                profile.username ||
                "משתמש";


            const rate =
                profile.role ===
                    "DRIVER"

                    ? settingsFormatMoney(
                        profile.driver_rate
                    )

                    : "-";


            const isCurrentUser =
                settingsCurrentProfile

                &&

                String(
                    profile.id
                )

                ===

                String(
                    settingsCurrentProfile.id
                );


            row.innerHTML = `

                <td>

                    <div>

                        <strong>
                            ${displayName}
                        </strong>

                        ${
                            isCurrentUser

                                ? `
                                    <div
                                        style="
                                            margin-top:4px;
                                            font-size:11px;
                                            color:#2563eb;
                                            font-weight:700;
                                        "
                                    >
                                        המשתמש שלך
                                    </div>
                                `

                                : ""
                        }

                    </div>

                </td>


                <td>
                    ${profile.phone || "-"}
                </td>


                <td>
                    ${profile.username || "-"}
                </td>


                <td>
                    ${getSettingsRoleBadge(
                        profile.role
                    )}
                </td>


                <td>
                    ${rate}
                </td>


                <td>
                    ${getSettingsStatusBadge(
                        profile.status
                    )}
                </td>


                <td>

                    <button
                        type="button"
                        class="table-btn"
                        onclick="
                            openSettingsEditUser(
                                '${profile.id}'
                            )
                        "
                    >
                        עריכה
                    </button>

                </td>

            `;


            usersTableBody.appendChild(
                row
            );

        }

    );

}


// =========================================================
// FILTER EVENTS
// =========================================================

if (
    userSearchInput
) {

    userSearchInput.addEventListener(

        "input",

        renderSettingsUsersTable

    );

}


if (
    userRoleFilter
) {

    userRoleFilter.addEventListener(

        "change",

        renderSettingsUsersTable

    );

}


if (
    userStatusFilter
) {

    userStatusFilter.addEventListener(

        "change",

        renderSettingsUsersTable

    );

}


// =========================================================
// DRIVER RATE VISIBILITY
// =========================================================

function updateDriverRateVisibility() {

    if (
        !driverRateGroup ||
        !userRole
    ) {

        return;

    }


    if (
        userRole.value ===
        "DRIVER"
    ) {

        driverRateGroup.style.display =
            "";

    }

    else {

        driverRateGroup.style.display =
            "none";

    }

}


if (
    userRole
) {

    userRole.addEventListener(

        "change",

        updateDriverRateVisibility

    );

}


// =========================================================
// CLOSE USER MODAL
// =========================================================

function closeSettingsUserModal() {

    if (
        !userModal
    ) {

        return;

    }


    userModal.classList
        .add(
            "hidden"
        );


    editingProfile =
        null;


    if (
        userForm
    ) {

        userForm.reset();

    }

}


// =========================================================
// OPEN EDIT USER
// =========================================================

function openSettingsEditUser(
    profileId
) {

    const profile =
        settingsProfiles.find(

            item =>
                String(
                    item.id
                )

                ===

                String(
                    profileId
                )

        );


    if (
        !profile ||
        !userModal
    ) {

        return;

    }


    editingProfile =
        profile;


    if (
        editingUserId
    ) {

        editingUserId.value =
            profile.id;

    }


    if (
        userFullName
    ) {

        userFullName.value =
            profile.full_name ||
            "";

    }


    if (
        userPhone
    ) {

        userPhone.value =
            profile.phone ||
            "";

    }


    if (
        userUsername
    ) {

        userUsername.value =
            profile.username ||
            "";

    }


    if (
        userRole
    ) {

        userRole.value =
            profile.role;

    }


    if (
        userStatus
    ) {

        userStatus.value =
            profile.status;

    }


    if (
        userDeliveryRate
    ) {

        userDeliveryRate.value =
            profile.driver_rate ??
            13;

    }


    if (
        userNotes
    ) {

        userNotes.value =
            profile.notes ||
            "";

    }


    // Email lives in Supabase Auth, not profiles.
    // We are not editing Auth email from frontend.

    if (
        userEmail
    ) {

        userEmail.value =
            "";

    }


    if (
        userEmailGroup
    ) {

        userEmailGroup.style.display =
            "none";

    }


    if (
        userPasswordGroup
    ) {

        userPasswordGroup.style.display =
            "none";

    }


    if (
        userModalTitle
    ) {

        userModalTitle.textContent =
            "עריכת משתמש";

    }


    if (
        userModalSubtitle
    ) {

        userModalSubtitle.textContent =
            profile.full_name ||
            profile.username ||
            "משתמש";

    }


    if (
        userSecurityMessage
    ) {

        userSecurityMessage.textContent =
            "השינויים יישמרו ישירות בפרופיל המשתמש ב-Supabase.";

    }


    const editingSelf =
        settingsCurrentProfile

        &&

        String(
            profile.id
        )

        ===

        String(
            settingsCurrentProfile.id
        );


    /*
        Safety:
        The logged-in admin may edit their name / phone / username /
        notes, but cannot accidentally deactivate themselves or change
        their own ADMIN role and lock themselves out.
    */

    if (
        editingSelf
    ) {

        if (
            userRole
        ) {

            userRole.disabled =
                true;

        }


        if (
            userStatus
        ) {

            userStatus.disabled =
                true;

        }


        if (
            userSecurityMessage
        ) {

            userSecurityMessage.textContent =
                "זה המשתמש שמחובר כרגע. ניתן לערוך פרטים, אך לא ניתן לשנות לעצמך תפקיד או להפוך את החשבון ללא פעיל.";

        }

    }

    else {

        if (
            userRole
        ) {

            userRole.disabled =
                false;

        }


        if (
            userStatus
        ) {

            userStatus.disabled =
                false;

        }

    }


    updateDriverRateVisibility();


    userModal.classList
        .remove(
            "hidden"
        );

}


// Make function available to inline button

window.openSettingsEditUser =
    openSettingsEditUser;


// =========================================================
// NEW USER BUTTON
// =========================================================

function openSettingsNewUserModal() {

    editingProfile =
        null;


    if (
        userForm
    ) {

        userForm.reset();

    }


    if (
        editingUserId
    ) {

        editingUserId.value =
            "";

    }


    if (
        userModalTitle
    ) {

        userModalTitle.textContent =
            "משתמש חדש";

    }


    if (
        userModalSubtitle
    ) {

        userModalSubtitle.textContent =
            "יצירת עובד חדש במערכת";

    }


    if (
        userEmailGroup
    ) {

        userEmailGroup.style.display =
            "";

    }


    if (
        userPasswordGroup
    ) {

        userPasswordGroup.style.display =
            "";

    }


    if (
        userEmail
    ) {

        userEmail.value =
            "";

        userEmail.required =
            true;

    }


    if (
        userPassword
    ) {

        userPassword.value =
            "";

        userPassword.required =
            true;

    }


    if (
        userRole
    ) {

        userRole.disabled =
            false;

        userRole.value =
            "DRIVER";

    }


    if (
        userStatus
    ) {

        userStatus.disabled =
            false;

        userStatus.value =
            "פעיל";

    }


    if (
        userDeliveryRate
    ) {

        userDeliveryRate.value =
            13;

    }


    if (
        userSecurityMessage
    ) {

        userSecurityMessage.textContent =
            "יצירת משתמש חדש תחובר בשלב הבא ל-Supabase Auth באמצעות פונקציית Backend מאובטחת.";

    }


    updateDriverRateVisibility();


    if (
        userModal
    ) {

        userModal.classList
            .remove(
                "hidden"
            );

    }

}


if (
    newUserButton
) {

    newUserButton.addEventListener(

        "click",

        openSettingsNewUserModal

    );

}


// =========================================================
// MODAL CLOSE EVENTS
// =========================================================

if (
    closeUserModal
) {

    closeUserModal.addEventListener(

        "click",

        closeSettingsUserModal

    );

}


if (
    cancelUserButton
) {

    cancelUserButton.addEventListener(

        "click",

        closeSettingsUserModal

    );

}


// =========================================================
// SAVE USER
// =========================================================

if (
    userForm
) {

    userForm.addEventListener(

        "submit",

        async function (
            event
        ) {

            event.preventDefault();


            const profileId =
                editingUserId
                    ? editingUserId.value
                    : "";


            // =================================================
            // NEW USER
            // =================================================

            if (
                !profileId
            ) {

                alert(
                    "יצירת משתמש חדש עדיין לא הופעלה. בשלב הבא נחבר את הכפתור ל-Supabase Auth באמצעות Edge Function מאובטחת."
                );


                return;

            }


            // =================================================
            // EXISTING USER
            // =================================================

            const existingProfile =
                settingsProfiles.find(

                    profile =>
                        String(
                            profile.id
                        )

                        ===

                        String(
                            profileId
                        )

                );


            if (
                !existingProfile
            ) {

                alert(
                    "המשתמש לא נמצא."
                );


                return;

            }


            const editingSelf =
                settingsCurrentProfile

                &&

                String(
                    profileId
                )

                ===

                String(
                    settingsCurrentProfile.id
                );


            let role =
                userRole.value;


            let status =
                userStatus.value;


            if (
                editingSelf
            ) {

                role =
                    settingsCurrentProfile.role;


                status =
                    settingsCurrentProfile.status;

            }


            const updateData = {

                full_name:
                    userFullName.value
                        .trim(),

                phone:
                    userPhone.value
                        .trim()
                    ||
                    null,

                username:
                    userUsername.value
                        .trim(),

                role:
                    role,

                status:
                    status,

                notes:
                    userNotes.value
                        .trim()
                    ||
                    null,

                driver_rate:
                    role ===
                        "DRIVER"

                        ? Number(
                            userDeliveryRate.value ||
                            0
                        )

                        : null

            };


            if (
                !updateData.full_name
            ) {

                alert(
                    "יש להזין שם מלא."
                );


                return;

            }


            if (
                !updateData.username
            ) {

                alert(
                    "יש להזין שם משתמש."
                );


                return;

            }


            if (
                saveUserButton
            ) {

                saveUserButton.disabled =
                    true;


                saveUserButton.textContent =
                    "שומר...";

            }


            const {
                data,
                error
            } =
                await settingsSupabase
                    .from(
                        "profiles"
                    )
                    .update(
                        updateData
                    )
                    .eq(
                        "id",
                        profileId
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
                        notes,
                        created_at
                        `
                    )
                    .single();


            if (
                saveUserButton
            ) {

                saveUserButton.disabled =
                    false;


                saveUserButton.textContent =
                    "שמור משתמש";

            }


            if (
                error
            ) {

                console.error(
                    "Profile update failed:",
                    error
                );


                alert(
                    "לא ניתן היה לעדכן את המשתמש."
                );


                return;

            }


            const index =
                settingsProfiles.findIndex(

                    profile =>
                        String(
                            profile.id
                        )

                        ===

                        String(
                            profileId
                        )

                );


            if (
                index !==
                -1
            ) {

                settingsProfiles[
                    index
                ] =
                    data;

            }


            if (
                editingSelf
            ) {

                settingsCurrentProfile =
                    data;


                renderSettingsCurrentUser();

            }


            renderSettingsCounters();


            renderSettingsUsersTable();


            closeSettingsUserModal();

        }

    );

}


// =========================================================
// SETTINGS NAVIGATION
// =========================================================

const settingsSectionTitles = {

    business:
        "פרטי העסק",

    salary:
        "תעריפים ושכר",

    barcode:
        "ברקודים",

    routes:
        "מסלולים",

    notifications:
        "התראות",

    integrations:
        "אינטגרציות"

};


settingsNavItems.forEach(

    item => {

        item.addEventListener(

            "click",

            function () {

                const section =
                    this.dataset.section;


                settingsNavItems.forEach(

                    navItem => {

                        navItem.classList
                            .remove(
                                "active"
                            );

                    }

                );


                this.classList
                    .add(
                        "active"
                    );


                if (
                    section ===
                    "users"
                ) {

                    if (
                        usersSection
                    ) {

                        usersSection.classList
                            .remove(
                                "hidden"
                            );

                    }


                    if (
                        placeholderSection
                    ) {

                        placeholderSection.classList
                            .add(
                                "hidden"
                            );

                    }


                    return;

                }


                if (
                    usersSection
                ) {

                    usersSection.classList
                        .add(
                            "hidden"
                        );

                }


                if (
                    placeholderSection
                ) {

                    placeholderSection.classList
                        .remove(
                            "hidden"
                        );

                }


                if (
                    placeholderTitle
                ) {

                    placeholderTitle.textContent =
                        settingsSectionTitles[
                            section
                        ]
                        ||
                        "הגדרות";

                }

            }

        );

    }

);


// =========================================================
// INITIALIZE SETTINGS
// =========================================================

async function initializeSettingsPage() {

    const authenticated =
        await loadSettingsSession();


    if (
        !authenticated
    ) {

        return;

    }


    const profileLoaded =
        await loadSettingsCurrentProfile();


    if (
        !profileLoaded
    ) {

        return;

    }


    renderSettingsCurrentUser();


    const profilesLoaded =
        await loadSettingsProfiles();


    if (
        !profilesLoaded
    ) {

        return;

    }


    renderSettingsCounters();


    renderSettingsUsersTable();

}


// =========================================================
// START
// =========================================================

initializeSettingsPage();