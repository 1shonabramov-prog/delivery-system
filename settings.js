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
            return role || "-";
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
// MONEY
// =========================================================

function settingsFormatMoney(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
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


    totalUsersCount.textContent =
        total;


    activeUsersCount.textContent =
        active;


    activeDriverUsersCount.textContent =
        activeDrivers;


    inactiveUsersCount.textContent =
        inactive;
}


// =========================================================
// FILTER USERS
// =========================================================

function getFilteredSettingsProfiles() {

    const search =
        userSearchInput
            .value
            .trim()
            .toLowerCase();


    const selectedRole =
        userRoleFilter.value;


    const selectedStatus =
        userStatusFilter.value;


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
// RENDER TABLE
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
                String(
                    profile.id
                )
                ===
                String(
                    settingsCurrentProfile.id
                );


            row.innerHTML = `

                <td>

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

userSearchInput.addEventListener(
    "input",
    renderSettingsUsersTable
);


userRoleFilter.addEventListener(
    "change",
    renderSettingsUsersTable
);


userStatusFilter.addEventListener(
    "change",
    renderSettingsUsersTable
);


// =========================================================
// DRIVER RATE
// =========================================================

function updateDriverRateVisibility() {

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


userRole.addEventListener(
    "change",
    updateDriverRateVisibility
);


// =========================================================
// CLOSE MODAL
// =========================================================

function closeSettingsUserModal() {

    userModal.classList.add(
        "hidden"
    );


    editingProfile =
        null;


    userForm.reset();


    userRole.disabled =
        false;


    userStatus.disabled =
        false;


    userEmail.required =
        false;


    userPassword.required =
        false;
}


// =========================================================
// EDIT USER
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
        !profile
    ) {

        return;
    }


    editingProfile =
        profile;


    editingUserId.value =
        profile.id;


    userFullName.value =
        profile.full_name ||
        "";


    userPhone.value =
        profile.phone ||
        "";


    userUsername.value =
        profile.username ||
        "";


    userRole.value =
        profile.role;


    userStatus.value =
        profile.status;


    userDeliveryRate.value =
        profile.driver_rate ??
        13;


    userNotes.value =
        profile.notes ||
        "";


    userEmailGroup.style.display =
        "none";


    userPasswordGroup.style.display =
        "none";


    userModalTitle.textContent =
        "עריכת משתמש";


    userModalSubtitle.textContent =
        profile.full_name ||
        profile.username ||
        "משתמש";


    userSecurityMessage.textContent =
        "השינויים יישמרו ישירות ב-Supabase.";


    const editingSelf =
        String(
            profile.id
        )
        ===
        String(
            settingsCurrentProfile.id
        );


    if (
        editingSelf
    ) {

        userRole.disabled =
            true;


        userStatus.disabled =
            true;


        userSecurityMessage.textContent =
            "לא ניתן לשנות לעצמך תפקיד או להפוך את המשתמש שמחובר כרגע ללא פעיל.";
    }

    else {

        userRole.disabled =
            false;


        userStatus.disabled =
            false;
    }


    updateDriverRateVisibility();


    userModal.classList.remove(
        "hidden"
    );

}


window.openSettingsEditUser =
    openSettingsEditUser;


// =========================================================
// NEW USER
// =========================================================

function openSettingsNewUserModal() {

    editingProfile =
        null;


    userForm.reset();


    editingUserId.value =
        "";


    userModalTitle.textContent =
        "משתמש חדש";


    userModalSubtitle.textContent =
        "יצירת עובד חדש במערכת";


    userEmailGroup.style.display =
        "";


    userPasswordGroup.style.display =
        "";


    userEmail.required =
        true;


    userPassword.required =
        true;


    userRole.disabled =
        false;


    userStatus.disabled =
        false;


    userRole.value =
        "DRIVER";


    userStatus.value =
        "פעיל";


    userDeliveryRate.value =
        13;


    userSecurityMessage.textContent =
        "המשתמש ייווצר ב-Supabase Auth ובטבלת profiles באופן אוטומטי.";


    updateDriverRateVisibility();


    userModal.classList.remove(
        "hidden"
    );

}


newUserButton.addEventListener(
    "click",
    openSettingsNewUserModal
);


// =========================================================
// CLOSE EVENTS
// =========================================================

closeUserModal.addEventListener(
    "click",
    closeSettingsUserModal
);


cancelUserButton.addEventListener(
    "click",
    closeSettingsUserModal
);


// =========================================================
// CREATE NEW USER
// =========================================================

async function createNewSystemUser() {

    const email =
        userEmail.value
            .trim()
            .toLowerCase();


    const password =
        userPassword.value;


    const username =
        userUsername.value
            .trim();


    const fullName =
        userFullName.value
            .trim();


    const phone =
        userPhone.value
            .trim();


    const role =
        userRole.value;


    const status =
        userStatus.value;


    const notes =
        userNotes.value
            .trim();


    const driverRate =
        role ===
            "DRIVER"

            ? Number(
                userDeliveryRate.value ||
                0
            )

            : null;


    if (
        !fullName
    ) {

        alert(
            "יש להזין שם מלא."
        );

        return false;
    }


    if (
        !username
    ) {

        alert(
            "יש להזין שם משתמש."
        );

        return false;
    }


    if (
        !email
    ) {

        alert(
            "יש להזין כתובת אימייל."
        );

        return false;
    }


    if (
        !password ||
        password.length < 6
    ) {

        alert(
            "הסיסמה חייבת להכיל לפחות 6 תווים."
        );

        return false;
    }


    saveUserButton.disabled =
        true;


    saveUserButton.textContent =
        "יוצר משתמש...";


    try {

        const {
            data,
            error
        } =
            await settingsSupabase
                .functions
                .invoke(
                    "create-user",
                    {
                        body: {

                            email:
                                email,

                            password:
                                password,

                            username:
                                username,

                            full_name:
                                fullName,

                            phone:
                                phone ||
                                null,

                            role:
                                role,

                            status:
                                status,

                            driver_rate:
                                driverRate,

                            notes:
                                notes ||
                                null

                        }
                    }
                );


        if (
            error
        ) {

            console.error(
                "create-user function error:",
                error
            );


            let message =
                error.message ||
                "יצירת המשתמש נכשלה.";


            if (
                error.context
            ) {

                try {

                    const responseBody =
                        await error.context.json();


                    if (
                        responseBody &&
                        responseBody.error
                    ) {

                        message =
                            responseBody.error;
                    }

                } catch (
                    contextError
                ) {

                    console.warn(
                        "Could not read function error response:",
                        contextError
                    );
                }

            }


            alert(
                "לא ניתן ליצור את המשתמש:\n" +
                message
            );


            return false;
        }


        if (
            !data ||
            data.success !==
            true
        ) {

            console.error(
                "Unexpected create-user response:",
                data
            );


            alert(
                "יצירת המשתמש לא הושלמה."
            );


            return false;
        }


        await loadSettingsProfiles();


        renderSettingsCounters();


        renderSettingsUsersTable();


        closeSettingsUserModal();


        alert(
            "המשתמש נוצר בהצלחה."
        );


        return true;

    }

    catch (
        error
    ) {

        console.error(
            "Unexpected create user error:",
            error
        );


        alert(
            "אירעה שגיאה ביצירת המשתמש."
        );


        return false;

    }

    finally {

        saveUserButton.disabled =
            false;


        saveUserButton.textContent =
            "שמור משתמש";
    }

}


// =========================================================
// UPDATE EXISTING USER
// =========================================================

async function updateExistingSystemUser(
    profileId
) {

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

        return false;
    }


    const editingSelf =
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

        return false;
    }


    if (
        !updateData.username
    ) {

        alert(
            "יש להזין שם משתמש."
        );

        return false;
    }


    saveUserButton.disabled =
        true;


    saveUserButton.textContent =
        "שומר...";


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


    saveUserButton.disabled =
        false;


    saveUserButton.textContent =
        "שמור משתמש";


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


        return false;
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


    return true;
}


// =========================================================
// FORM SUBMIT
// =========================================================

userForm.addEventListener(

    "submit",

    async function (
        event
    ) {

        event.preventDefault();


        const profileId =
            editingUserId.value;


        if (
            profileId
        ) {

            await updateExistingSystemUser(
                profileId
            );

            return;
        }


        await createNewSystemUser();

    }

);


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

                        navItem.classList.remove(
                            "active"
                        );

                    }

                );


                this.classList.add(
                    "active"
                );


                if (
                    section ===
                    "users"
                ) {

                    usersSection.classList.remove(
                        "hidden"
                    );


                    placeholderSection.classList.add(
                        "hidden"
                    );


                    return;
                }


                usersSection.classList.add(
                    "hidden"
                );


                placeholderSection.classList.remove(
                    "hidden"
                );


                placeholderTitle.textContent =
                    settingsSectionTitles[
                        section
                    ]
                    ||
                    "הגדרות";

            }

        );

    }

);


// =========================================================
// INITIALIZE
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