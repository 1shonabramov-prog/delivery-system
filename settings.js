// =========================================================
// DELIVERY SYSTEM
// SETTINGS / USERS & PERMISSIONS
// =========================================================



// =========================================================
// STORAGE
// =========================================================

const USERS_STORAGE_KEY =
    "delivery_system_users";

const DRIVERS_STORAGE_KEY =
    "delivery_system_drivers";



// =========================================================
// GET USERS
// =========================================================

function getUsers() {

    const saved =
        localStorage.getItem(
            USERS_STORAGE_KEY
        );


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(
            saved
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
// SAVE USERS
// =========================================================

function saveUsers(users) {

    localStorage.setItem(

        USERS_STORAGE_KEY,

        JSON.stringify(
            users
        )

    );

}



// =========================================================
// GET DRIVERS
// =========================================================

function getDrivers() {

    const saved =
        localStorage.getItem(
            DRIVERS_STORAGE_KEY
        );


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(
            saved
        );

    }

    catch (error) {

        return [];

    }

}



// =========================================================
// SAVE DRIVERS
// =========================================================

function saveDrivers(drivers) {

    localStorage.setItem(

        DRIVERS_STORAGE_KEY,

        JSON.stringify(
            drivers
        )

    );

}



// =========================================================
// CREATE ID
// =========================================================

function createId(prefix) {

    return (

        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.floor(
            Math.random() * 100000
        )

    );

}



// =========================================================
// INITIAL ADMIN USER
// =========================================================

function initializeUsers() {

    const users =
        getUsers();


    if (
        users.length > 0
    ) {

        return;

    }


    const defaultAdmin = {

        id:
            createId(
                "user"
            ),

        fullName:
            "מנהל מערכת",

        phone:
            "050-0000000",

        email:
            "",

        username:
            "admin",

        password:
            "1234",

        role:
            "ADMIN",

        deliveryRate:
            0,

        status:
            "פעיל",

        notes:
            "",

        driverId:
            null,

        createdAt:
            new Date()
                .toISOString()

    };


    saveUsers(
        [
            defaultAdmin
        ]
    );

}



// =========================================================
// DOM ELEMENTS
// =========================================================

const usersTableBody =
    document.getElementById(
        "usersTableBody"
    );


const newUserButton =
    document.getElementById(
        "newUserButton"
    );


const userModal =
    document.getElementById(
        "userModal"
    );


const userForm =
    document.getElementById(
        "userForm"
    );


const closeUserModal =
    document.getElementById(
        "closeUserModal"
    );


const cancelUserButton =
    document.getElementById(
        "cancelUserButton"
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


const userRole =
    document.getElementById(
        "userRole"
    );


const driverRateGroup =
    document.getElementById(
        "driverRateGroup"
    );



// =========================================================
// ROLE NAME
// =========================================================

function getRoleName(role) {

    switch (role) {

        case "ADMIN":

            return "מנהל מערכת";


        case "WAREHOUSE":

            return "עובד מחסן";


        case "DRIVER":

            return "שליח";


        default:

            return role;

    }

}



// =========================================================
// ROLE CLASS
// =========================================================

function getRoleClass(role) {

    switch (role) {

        case "ADMIN":

            return "role-admin";


        case "WAREHOUSE":

            return "role-warehouse";


        case "DRIVER":

            return "role-driver";


        default:

            return "";

    }

}



// =========================================================
// FORMAT MONEY
// =========================================================

function formatMoney(value) {

    return (

        "₪" +

        Number(
            value || 0
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
// UPDATE COUNTERS
// =========================================================

function updateUserCounters() {

    const users =
        getUsers();


    const total =
        users.length;


    const drivers =
        users.filter(

            user =>
                user.role ===
                "DRIVER"

        ).length;


    const admins =
        users.filter(

            user =>
                user.role ===
                "ADMIN"

        ).length;


    const active =
        users.filter(

            user =>
                user.status ===
                "פעיל"

        ).length;


    document
        .getElementById(
            "totalUsersCount"
        )
        .textContent =
        total;


    document
        .getElementById(
            "driverUsersCount"
        )
        .textContent =
        drivers;


    document
        .getElementById(
            "adminUsersCount"
        )
        .textContent =
        admins;


    document
        .getElementById(
            "activeUsersCount"
        )
        .textContent =
        active;

}



// =========================================================
// RENDER USERS
// =========================================================

function renderUsers() {

    if (
        !usersTableBody
    ) {

        return;

    }


    const users =
        getUsers();


    const search =
        userSearchInput
            .value
            .trim()
            .toLowerCase();


    const selectedRole =
        userRoleFilter.value;


    const selectedStatus =
        userStatusFilter.value;



    const filtered =
        users.filter(

            user => {


                const searchable = [

                    user.fullName,

                    user.phone,

                    user.email,

                    user.username

                ]
                    .join(" ")
                    .toLowerCase();



                if (

                    search &&

                    !searchable
                        .includes(
                            search
                        )

                ) {

                    return false;

                }



                if (

                    selectedRole &&

                    user.role !==
                        selectedRole

                ) {

                    return false;

                }



                if (

                    selectedStatus &&

                    user.status !==
                        selectedStatus

                ) {

                    return false;

                }


                return true;

            }

        );



    usersTableBody.innerHTML =
        "";



    if (
        filtered.length === 0
    ) {

        usersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:45px;
                        color:#64748b;
                    "
                >

                    לא נמצאו משתמשים

                </td>

            </tr>

        `;


        return;

    }



    filtered.forEach(

        user => {


            const row =
                document
                    .createElement(
                        "tr"
                    );



            const rate =

                user.role ===
                "DRIVER"

                    ?

                    formatMoney(
                        user.deliveryRate
                    )

                    :

                    "-";



            row.innerHTML = `


                <td>

                    <strong>
                        ${user.fullName}
                    </strong>

                    ${
                        user.email

                            ?

                            `
                            <br>

                            <small
                                style="color:#64748b;"
                            >
                                ${user.email}
                            </small>
                            `

                            :

                            ""
                    }

                </td>



                <td>
                    ${user.phone}
                </td>



                <td>

                    <strong>
                        ${user.username}
                    </strong>

                </td>



                <td>

                    <span
                        class="
                            role-badge
                            ${getRoleClass(
                                user.role
                            )}
                        "
                    >

                        ${getRoleName(
                            user.role
                        )}

                    </span>

                </td>



                <td>
                    ${rate}
                </td>



                <td>

                    <span
                        class="
                            status
                            ${
                                user.status ===
                                "פעיל"

                                    ?

                                    "completed"

                                    :

                                    "waiting"
                            }
                        "
                    >

                        ${user.status}

                    </span>

                </td>



                <td>

                    <button
                        class="table-btn"
                        onclick="
                            editUser(
                                '${user.id}'
                            )
                        "
                    >

                        עריכה

                    </button>

                </td>


            `;



            usersTableBody
                .appendChild(
                    row
                );

        }

    );

}



// =========================================================
// ROLE CHANGE
// =========================================================

function updateRateVisibility() {

    if (
        userRole.value ===
        "DRIVER"
    ) {

        driverRateGroup
            .classList
            .remove(
                "hidden"
            );

    }

    else {

        driverRateGroup
            .classList
            .add(
                "hidden"
            );

    }

}



userRole
    .addEventListener(

        "change",

        updateRateVisibility

    );



// =========================================================
// OPEN NEW USER
// =========================================================

newUserButton
    .addEventListener(

        "click",

        function () {


            userForm.reset();


            document
                .getElementById(
                    "editingUserId"
                )
                .value =
                "";


            document
                .getElementById(
                    "userModalTitle"
                )
                .textContent =
                "משתמש חדש";


            userRole.value =
                "DRIVER";


            document
                .getElementById(
                    "userDeliveryRate"
                )
                .value =
                "13";


            document
                .getElementById(
                    "userStatus"
                )
                .value =
                "פעיל";


            updateRateVisibility();


            userModal
                .classList
                .remove(
                    "hidden"
                );

        }

    );



// =========================================================
// CLOSE MODAL
// =========================================================

function closeUserManagementModal() {

    userModal
        .classList
        .add(
            "hidden"
        );

}



closeUserModal
    .addEventListener(

        "click",

        closeUserManagementModal

    );



cancelUserButton
    .addEventListener(

        "click",

        closeUserManagementModal

    );



// =========================================================
// EDIT USER
// =========================================================

function editUser(userId) {

    const users =
        getUsers();


    const user =
        users.find(

            item =>
                item.id ===
                userId

        );


    if (
        !user
    ) {

        return;

    }



    document
        .getElementById(
            "editingUserId"
        )
        .value =
        user.id;



    document
        .getElementById(
            "userFullName"
        )
        .value =
        user.fullName;



    document
        .getElementById(
            "userPhone"
        )
        .value =
        user.phone;



    document
        .getElementById(
            "userEmail"
        )
        .value =
        user.email || "";



    document
        .getElementById(
            "userRole"
        )
        .value =
        user.role;



    document
        .getElementById(
            "userUsername"
        )
        .value =
        user.username;



    document
        .getElementById(
            "userPassword"
        )
        .value =
        user.password;



    document
        .getElementById(
            "userDeliveryRate"
        )
        .value =
        user.deliveryRate || 0;



    document
        .getElementById(
            "userStatus"
        )
        .value =
        user.status;



    document
        .getElementById(
            "userNotes"
        )
        .value =
        user.notes || "";



    document
        .getElementById(
            "userModalTitle"
        )
        .textContent =
        "עריכת משתמש";


    updateRateVisibility();


    userModal
        .classList
        .remove(
            "hidden"
        );

}



// =========================================================
// SAVE USER
// =========================================================

userForm
    .addEventListener(

        "submit",

        function (event) {


            event.preventDefault();



            const users =
                getUsers();


            const editingId =
                document
                    .getElementById(
                        "editingUserId"
                    )
                    .value;



            const fullName =
                document
                    .getElementById(
                        "userFullName"
                    )
                    .value
                    .trim();



            const phone =
                document
                    .getElementById(
                        "userPhone"
                    )
                    .value
                    .trim();



            const email =
                document
                    .getElementById(
                        "userEmail"
                    )
                    .value
                    .trim();



            const role =
                document
                    .getElementById(
                        "userRole"
                    )
                    .value;



            const username =
                document
                    .getElementById(
                        "userUsername"
                    )
                    .value
                    .trim();



            const password =
                document
                    .getElementById(
                        "userPassword"
                    )
                    .value;



            const deliveryRate =

                role ===
                "DRIVER"

                    ?

                    Number(

                        document
                            .getElementById(
                                "userDeliveryRate"
                            )
                            .value

                    )

                    :

                    0;



            const status =
                document
                    .getElementById(
                        "userStatus"
                    )
                    .value;



            const notes =
                document
                    .getElementById(
                        "userNotes"
                    )
                    .value
                    .trim();



            // =============================================
            // UNIQUE USERNAME
            // =============================================

            const usernameExists =
                users.some(

                    user =>

                        user.username
                            .toLowerCase()

                        ===

                        username
                            .toLowerCase()

                        &&

                        user.id !==
                            editingId

                );



            if (
                usernameExists
            ) {

                alert(
                    "שם המשתמש כבר קיים במערכת."
                );

                return;

            }



            // =============================================
            // EDIT USER
            // =============================================

            if (
                editingId
            ) {


                const index =
                    users.findIndex(

                        user =>
                            user.id ===
                            editingId

                    );


                if (
                    index === -1
                ) {

                    return;

                }



                const oldRole =
                    users[
                        index
                    ].role;



                const oldDriverId =
                    users[
                        index
                    ].driverId;



                users[
                    index
                ] = {

                    ...users[
                        index
                    ],

                    fullName:
                        fullName,

                    phone:
                        phone,

                    email:
                        email,

                    username:
                        username,

                    password:
                        password,

                    role:
                        role,

                    deliveryRate:
                        deliveryRate,

                    status:
                        status,

                    notes:
                        notes

                };



                // אם המשתמש הוא שליח
                // נעדכן גם את רשימת השליחים.

                if (
                    role ===
                    "DRIVER"
                ) {


                    let drivers =
                        getDrivers();



                    let driverId =
                        oldDriverId;



                    let driverIndex =
                        drivers.findIndex(

                            driver =>
                                driver.id ===
                                driverId

                        );



                    if (
                        driverIndex === -1
                    ) {


                        driverId =
                            createId(
                                "driver"
                            );


                        drivers.push({

                            id:
                                driverId,

                            userId:
                                editingId,

                            fullName:
                                fullName,

                            phone:
                                phone,

                            email:
                                email,

                            username:
                                username,

                            rate:
                                deliveryRate,

                            status:
                                status,

                            notes:
                                notes,

                            createdAt:
                                new Date()
                                    .toISOString()

                        });



                        users[
                            index
                        ].driverId =
                            driverId;

                    }


                    else {


                        drivers[
                            driverIndex
                        ] = {

                            ...drivers[
                                driverIndex
                            ],

                            fullName:
                                fullName,

                            phone:
                                phone,

                            email:
                                email,

                            username:
                                username,

                            rate:
                                deliveryRate,

                            status:
                                status,

                            notes:
                                notes

                        };

                    }



                    saveDrivers(
                        drivers
                    );

                }



                // אם הוא היה שליח ושונה לתפקיד אחר
                else if (
                    oldRole ===
                    "DRIVER"
                ) {


                    let drivers =
                        getDrivers();


                    drivers =
                        drivers.filter(

                            driver =>
                                driver.id !==
                                oldDriverId

                        );


                    saveDrivers(
                        drivers
                    );


                    users[
                        index
                    ].driverId =
                        null;

                }

            }



            // =============================================
            // CREATE NEW USER
            // =============================================

            else {


                const userId =
                    createId(
                        "user"
                    );


                let driverId =
                    null;



                if (
                    role ===
                    "DRIVER"
                ) {


                    driverId =
                        createId(
                            "driver"
                        );


                    const drivers =
                        getDrivers();



                    drivers.push({

                        id:
                            driverId,

                        userId:
                            userId,

                        fullName:
                            fullName,

                        phone:
                            phone,

                        email:
                            email,

                        username:
                            username,

                        rate:
                            deliveryRate,

                        status:
                            status,

                        notes:
                            notes,

                        createdAt:
                            new Date()
                                .toISOString()

                    });



                    saveDrivers(
                        drivers
                    );

                }



                users.push({

                    id:
                        userId,

                    fullName:
                        fullName,

                    phone:
                        phone,

                    email:
                        email,

                    username:
                        username,

                    password:
                        password,

                    role:
                        role,

                    deliveryRate:
                        deliveryRate,

                    status:
                        status,

                    notes:
                        notes,

                    driverId:
                        driverId,

                    createdAt:
                        new Date()
                            .toISOString()

                });

            }



            saveUsers(
                users
            );



            closeUserManagementModal();



            updateUserCounters();



            renderUsers();


        }

    );



// =========================================================
// FILTER EVENTS
// =========================================================

userSearchInput
    .addEventListener(

        "input",

        renderUsers

    );



userRoleFilter
    .addEventListener(

        "change",

        renderUsers

    );



userStatusFilter
    .addEventListener(

        "change",

        renderUsers

    );



// =========================================================
// SETTINGS NAVIGATION
// =========================================================

const navButtons =
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



const sectionTitles = {

    business:
        "פרטי העסק",

    salary:
        "תעריפים ושכר",

    barcode:
        "הגדרות ברקודים",

    routes:
        "הגדרות מסלולים",

    notifications:
        "התראות ללקוחות",

    integrations:
        "אינטגרציות"

};



navButtons.forEach(

    button => {


        button.addEventListener(

            "click",

            function () {


                navButtons.forEach(

                    item =>

                        item.classList
                            .remove(
                                "active"
                            )

                );


                button.classList
                    .add(
                        "active"
                    );



                const section =
                    button.dataset.section;



                if (
                    section ===
                    "users"
                ) {


                    usersSection
                        .classList
                        .remove(
                            "hidden"
                        );


                    placeholderSection
                        .classList
                        .add(
                            "hidden"
                        );

                }


                else {


                    usersSection
                        .classList
                        .add(
                            "hidden"
                        );


                    placeholderSection
                        .classList
                        .remove(
                            "hidden"
                        );


                    placeholderTitle
                        .textContent =

                        sectionTitles[
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
// INITIALIZE
// =========================================================

initializeUsers();


updateRateVisibility();


updateUserCounters();


renderUsers();