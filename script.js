let save = document.querySelector("#save");
let inputTitle = document.querySelector("#inputTitle");
let inputContent = document.querySelector("#inputContent");
let notesContainer = document.querySelector(".notes-container");
let searchBar = document.querySelector(".searchBar");
let noteCounter = document.querySelector("#noteCounter");
let timestamp = document.querySelector(".timestamp");

let notes = [];
let editIndex = null;
let searchWord = "";

function saveNote(title, content){

    if(title.trim()==="") title = "Untitled";
    
    let note = {
        title : title,
        content : content,
        createdAt : Date.now(),
        updatedAt : Date.now()
    }

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

save.addEventListener("click", ()=>{
    if(editIndex !== null){
        notes[editIndex].title = inputTitle.value;
        notes[editIndex].content = inputContent.value;
        notes[editIndex].updatedAt = Date.now();
        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes();
        inputTitle.value = "";
        inputContent.value = "";
        editIndex = null;
    }else{
    const title = inputTitle.value;
    const content = inputContent.value;
    saveNote(title,content);
    inputTitle.value = "";
    inputContent.value = "";
    renderNotes();
    }
}) 




function renderNotes(filteredNotes = notes){
    if(filteredNotes === null) return;
    notesContainer.replaceChildren();
    filteredNotes.forEach(note =>{
        let notesDiv = document.createElement("div");
        notesDiv.classList.add("notes");
        notesDiv.innerHTML = 
        `
            <h2>${note.title}</h2>
            <p>${note.content}</p>
            <div class="timestamp"> <i class="ri-time-line"></i>${timestampFunc(note)}</div>
            <div class="icons">
            <button class="edit"><i class="ri-edit-box-line "></i>Edit</button>
            <button class="deletebtn"><i class="ri-delete-bin-line"></i>Delete</button>
            </div>
        `
        notesContainer.append(notesDiv);
    })
    counterFunc();
}

notesContainer.addEventListener("click", (e)=>{
    if(e.target.closest(".deletebtn")) deleteFunc(e);
    if(e.target.closest(".edit")) editFunc(e);
})

function deleteFunc(e){
    let idx = iconIndex(e);
    notes.splice(idx, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
}

function iconIndex(e){
    let clickedchild = e.target.closest(".notes");
    let childarray = Array.from(notesContainer.children);
    let idx = childarray.indexOf(clickedchild);
    return idx;
}

function editFunc(e){
    editIndex = iconIndex(e);
    let editParent = e.target.closest(".notes");
    let h2Edit = notes[editIndex].title;
    let paraEdit = notes[editIndex].content;

    inputTitle.value = h2Edit;
    inputContent.value = paraEdit;
    inputTitle.focus();
}

function filtering(searchWord){
    let filtered = notes.filter(note => note.title.toLowerCase().includes(searchWord) || note.content.toLowerCase().includes(searchWord));
    renderNotes(filtered);
    return filtered;
}

searchBar.addEventListener("input", ()=>{
    let searchWord = searchBar.value;
    filtering(searchWord);
})


function counterFunc(){
    noteCounter.textContent = notes.length;
}

function timestampFunc(note){
    let createTime = (Date.now() - note.createdAt)/60000;
    let updateTime = (Date.now() - note.updatedAt)/60000;

    if(createTime === updateTime) return `Created ${formatTime(createTime)}`;
    else return `Edited ${formatTime(updateTime)}`

}

function formatTime(time){
     if(time<1) return `just now`;
     else if(time<60)return `${Math.floor(time)}m ago`;
     else if(time<1440)return `${Math.floor(time/60)}h ago`;
     else return `${Math.floor(time/24)}d ago`;
}


function loadnotes(){
    if(localStorage.getItem("notes") === null) return;
    notes = JSON.parse(localStorage.getItem("notes"));
    renderNotes();
}

loadnotes();