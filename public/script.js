const input = document.querySelector(".input-box input");
const addBtn = document.querySelector(".input-box button");
const footerText = document.querySelector(".footer p");
const clearBtn = document.querySelector(".clear-btn");

const container = document.createElement("div");
container.classList.add("tasks");

document.querySelector(".footer").before(container);

let tasks = [];

function showTasks() {

    container.innerHTML = "";

    tasks.forEach((task, index) => {

        container.innerHTML += `
        
        <div class="task">
        
            <span>${task}</span>

            <button class="delete" onclick="deleteTask(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        `;
    });

    footerText.innerText = `You have ${tasks.length} pending tasks`;
}

function addTask() {

    if(input.value.trim() === "") return;

    tasks.push(input.value);

    input.value = "";

    showTasks();
}

function deleteTask(index) {

    tasks.splice(index, 1);

    showTasks();
}

function clearAll() {

    tasks = [];

    showTasks();
}

addBtn.addEventListener("click", addTask);

clearBtn.addEventListener("click", clearAll);

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        addTask();
    }
});