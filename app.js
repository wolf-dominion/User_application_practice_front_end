userURL = "http://localhost:3000/users"

document.addEventListener('DOMContentLoaded', () => {
    getInitialUserData();
    eventListenerForCreateForm();
})

// display data
function displayUsers(users){
    users.forEach(user => {
        createUserCard(user);
    });
}
function createUserCard(user){
    const userCard = document.createElement('div')
    userCard.className = "user-card"
    userCard.id = user.id
    // console.log(userCard)
    // console.log(user)
    const name = document.createElement('h3')
    const username = document.createElement('p')
    const email = document.createElement('p')

    name.id = `${user.id}user-name`
    username.id = `${user.id}user-user-name`
    email.id = `${user.id}user-email`
    name.innerText = user.name
    username.innerText = user.username
    email.innerText = user.email

    userCard.append(name, username, email, createEditButton(user), createDeleteButton(user))
    //append child can only pass in one thing at a time vs append you can list all
    // document.body.append(userCard)
    const userCardContainer = document.getElementById('user-card-container')
    userCardContainer.append(userCard)

}
function updateUserCard(updateUser, generatedId){

    console.log('gen id', generatedId);
    
    console.log('updateUser', updateUser);
    console.log('element for name', document.getElementById(`${generatedId}-user-name`));
    

    let updatedName = document.getElementById(`${generatedId}user-name`)    
    updatedName.innerText = updateUser.name

    let updatedUserName = document.getElementById(`${generatedId}user-user-name`)
    updatedUserName.innerText = updateUser.username

    let updatedEmail = document.getElementById(`${generatedId}user-email`)
    updatedEmail.innerText = updateUser.email
    
}

// create forms
function CreateUserUpdateForm(user, generatedID){
    console.log('gen id: ', generatedID );
    
    const editUserForm = document.createElement('form')
    const nameInput = document.createElement('input')
    const userNameInput = document.createElement('input')
    const emailInput = document.createElement('input')
    const passwordInput = document.createElement('input')
    const editUserButton = document.createElement('button')
    nameInput.name = "name"
    nameInput.value = user.name
    userNameInput.name = "username"
    userNameInput.value = user.username
    emailInput.name = "email"
    emailInput.value = user.email
    passwordInput.name = "password"
    passwordInput.placeholder = "We didn't save your raw text password"
    editUserButton.innerText = "Update User Info"
    editUserButton.type = "Submit"
    editUserForm.append(nameInput, userNameInput, emailInput, passwordInput, editUserButton)
    editUserForm.addEventListener('submit', ()=> {
        event.preventDefault();
        getUpdateForm(user, editUserForm, generatedID)
        editUserForm.remove();
    })
    const formSection = document.getElementById('forms-section')
    formSection.append(editUserForm)
}

// Get form data
function getNewFormData(newUserForm){
    const formData = new FormData(newUserForm)

    const newName = formData.get('name')
    const newUserName = formData.get('username')
    const newEmail = formData.get('email')
    const newPassword = formData.get('password')
    const newUser = {
        user: 
        {name: newName, 
        username: newUserName,
        email: newEmail, 
        password: newPassword
        }}

    createUserCard(newUser.user)
    SaveNewUserToDB(newUser) //point at which id now exists, problem is button was created on previous line
}
function getUpdateForm(user, form, generatedID){
    console.log('gen id: ', generatedID );
    const formData = new FormData(form)
    const updateName = formData.get('name')
    const updateUserName = formData.get('username')
    const updateEmail = formData.get('email')
    const updatePassword = formData.get('password')
    const updateUser = {
        user: 
            {name: updateName, 
            username: updateUserName,
            email: updateEmail, 
            password: updatePassword
            }}
    updateUserCard(updateUser.user, generatedID)
    saveUserUpdateToDB(updateUser, generatedID)
    
}

// create buttons
function createEditButton(user, event){
    const editButton = document.createElement('button')
    editButton.id = `${user.id}-update-button`
    editButton.innerText = "edit user info"
    editButton.addEventListener('click', ()=>{
        let hasId = editButton.id
        let theID = hasId.substring(0, hasId.length - 14)
        console.log('theID', theID);
        console.log('edit user id:', editButton.id)
        CreateUserUpdateForm(user, theID) // the parameter is called generatedID
    })
    return editButton
}
function createDeleteButton(user, event){
    const deleteButton = document.createElement('button')
    deleteButton.id = `${user.id}-delete-button`
    deleteButton.innerText = "delete user info"
    deleteButton.addEventListener('click', ()=>{
        console.log(`delete button was clicked for ${user.name}`, user)
        deleteUserFromDB(user)
    })
    return deleteButton
}

// event listeners
function eventListenerForCreateForm(){
    const newUserForm = document.getElementById('add-new-user')
    const formSection = document.getElementById('forms-section')

    newUserForm.addEventListener("submit", event => {
        event.preventDefault();
        getNewFormData(newUserForm);
        })
}

// fetch
function getInitialUserData(){
    fetch(userURL)
    .then(parseJSON)
    .then(displayUsers)
}
function SaveNewUserToDB(newUser){
    fetch(userURL, {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify(newUser)})
    .then(parseJSON)
    .then(dynamicallyAppendID)
    //.then(getIdForUpdateButtonPath) // pass id to whatever is calling 
    //saveUserUpdateToDB < getUpdateForm < CreateUserUpdateForm < createEditButton < createUserCard 
    //< getNewFormData < eventListenerForCreateForm < document.addEventListener('DOMContentLoaded'
}
function saveUserUpdateToDB(user, generatedID){

    console.log('user:', user);
    console.log('id:', generatedID);
    
    fetch(userURL + "/" + generatedID, {
        method: "PATCH",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify(user)})
    .then(parseJSON)
    .then(result => console.log(result))
}

function deleteUserFromDB(user){
    const userCardContainer = document.getElementById('user-card-container')
    const userCard = document.getElementById(user.id)
    userCardContainer.removeChild(userCard)
    // alternative way: userCard.remove()
    fetch(userURL + "/" + user.id, 
        {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
}

// parse Json and extra
function parseJSON(response){
    return response.json()
}

function dynamicallyAppendID(user){

    console.log('user:', user);
    
    let newUndefined = document.getElementById('undefined')
    newUndefined.id = user.id

    let newUndefinedName = document.getElementById('undefineduser-name')    
    newUndefinedName.id = `${user.id}user-name`

    let newUndefinedUserName = document.getElementById('undefineduser-user-name')
    newUndefinedUserName.id = `${user.id}user-user-name`

    let newUndefinedEmail = document.getElementById('undefineduser-email')
    newUndefinedEmail.id = `${user.id}user-email`

    let undefinedUpdateButton = document.getElementById('undefined-update-button')
    undefinedUpdateButton.id = `${user.id}-update-button`

    let undefinedDeleteButton = document.getElementById('undefined-delete-button')
    undefinedDeleteButton.id = `${user.id}-delete-button`

    return user.id
}