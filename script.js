document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const studyTimeSelect = document.getElementById('study-time'); // New: Select element
    const timerEndSound = document.getElementById('timer-end-sound');

    let initialStudyMinutes = parseInt(studyTimeSelect.value); // Get initial value from dropdown
    let totalSeconds = initialStudyMinutes * 60;
    let interval;
    let isRunning = false;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(totalSeconds);
    }

    // Function to set the timer based on dropdown value
    function setTimerFromDropdown() {
        initialStudyMinutes = parseInt(studyTimeSelect.value);
        totalSeconds = initialStudyMinutes * 60;
        updateTimerDisplay();
    }

    function startTimer() {
        if (isRunning) return;

        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        studyTimeSelect.disabled = true; // Disable dropdown while timer is running

        interval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(interval);
                isRunning = false;
                timerEndSound.play();
                // Improved notification
                if (confirm('Time is up! Click OK to reset or Cancel to leave it stopped.')) {
                    resetTimer();
                } else {
                    // If user cancels, keep it stopped at 00:00 and enable start/reset
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    resetBtn.disabled = false;
                    studyTimeSelect.disabled = false;
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;

        clearInterval(interval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        studyTimeSelect.disabled = false; // Enable dropdown when paused
    }

    function resetTimer() {
        clearInterval(interval);
        isRunning = false;
        setTimerFromDropdown(); // Reset to the currently selected dropdown value
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        studyTimeSelect.disabled = false; // Enable dropdown
        timerEndSound.pause();
        timerEndSound.currentTime = 0; // Rewind sound
    }

    // Initial display update
    setTimerFromDropdown(); // Set initial time based on default dropdown value

    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    studyTimeSelect.addEventListener('change', setTimerFromDropdown); // New: Update timer when dropdown changes

    // Initialize button states
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
});

//...............................................................................................................
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
function todolist() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Function to load tasks from local storage
function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function (task) {
        addTaskToDOM(task.name, task.completed);
    });
}

// Function to add a task to the DOM
function addTaskToDOM(taskName, isCompleted) {
    var li = document.createElement("li");
    var t = document.createTextNode(taskName);
    li.appendChild(t);

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    if (isCompleted) {
        li.classList.add('checked'); // Add checked class if task is completed
    }

    document.getElementById("myUL").appendChild(li);

    // Add click event to close button
    span.onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
        removeTaskFromStorage(taskName);
    }

    // Add click event to toggle checked class
    li.onclick = function () {
        li.classList.toggle('checked');
        updateTaskInStorage(taskName, li.classList.contains('checked'));
    }
}

// Function to remove a task from local storage
function removeTaskFromStorage(taskName) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(function (task) {
        return task.name !== taskName;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to update task completion status in local storage
function updateTaskInStorage(taskName, isCompleted) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function (task) {
        if (task.name === taskName) {
            task.completed = isCompleted;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to add a new task
function newElement() {
    var inputValue = document.getElementById("myInput").value;
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        addTaskToDOM(inputValue, false);
        saveTaskToStorage(inputValue);
    }
    document.getElementById("myInput").value = "";
}

// Function to save a task to local storage
function saveTaskToStorage(taskName) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ name: taskName, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to filter tasks
function filterTasks(filter) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    document.getElementById("myUL").innerHTML = ""; // Clear the current list

    tasks.forEach(function (task) {
        if (filter === "all" || (filter === "completed" && task.completed) || (filter === "active" && !task.completed)) {
            addTaskToDOM(task.name, task.completed);
        }
    });
}

// Load tasks from local storage when the page loads
window.onload = loadTasks;

// Keyboard shortcuts
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        newElement(); // Add task on Enter key
    } else if (event.key === '1') {
        filterTasks('all'); // Show all tasks on '1'
    } else if (event.key === '2') {
        filterTasks('completed'); // Show completed tasks on '2'
    } else if (event.key === '3') {
        filterTasks('active'); // Show active tasks on '3'
    }
});

//....................................................................................................................................................
function flashcard() {
    document.getElementById("popup1").style.display = "flex";
}

function closePopup1() {
    document.getElementById("popup1").style.display = "none";
}

const container = document.querySelector(".flash");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");

let editBool = false;

addQuestion.addEventListener("click", () => {
    container.classList.add("hide");
    question.value = "";
    answer.value = "";
    addQuestionCard.classList.remove("hide");
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    editBool = false;
    disableButtons(false);
});

cardButton.addEventListener("click", () => {
    const tempQuestion = question.value.trim();
    const tempAnswer = answer.value.trim();
    if (!tempQuestion || !tempAnswer) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        container.classList.remove("hide");
        addQuestionCard.classList.add("hide");
        viewlist(tempQuestion, tempAnswer);
        question.value = "";
        answer.value = "";
        editBool = false;
    }
});

function viewlist(qText, aText) {
    const listCard = document.getElementsByClassName("card-list-container")[0];
    const div = document.createElement("div");
    div.classList.add("card");

    const qEl = document.createElement("p");
    qEl.className = "question-div";
    qEl.innerText = qText;
    div.appendChild(qEl);

    const displayAnswer = document.createElement("p");
    displayAnswer.className = "answer-div hide";
    displayAnswer.innerText = aText;

    const link = document.createElement("a");
    link.href = "#";
    link.className = "show-hide-btn";
    link.textContent = "Show/Hide";
    link.onclick = () => displayAnswer.classList.toggle("hide");

    div.appendChild(link);
    div.appendChild(displayAnswer);

    const buttonsCon = document.createElement("div");
    buttonsCon.className = "buttons-con";

    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.onclick = () => {
        editBool = true;
        question.value = qText;
        answer.value = aText;
        div.remove();
        addQuestionCard.classList.remove("hide");
        container.classList.add("hide");
        disableButtons(true);
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.onclick = () => div.remove();

    buttonsCon.append(editButton, deleteButton);
    div.appendChild(buttonsCon);
    listCard.appendChild(div);

    disableButtons(false);
}

function disableButtons(value) {
    const editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach(btn => btn.disabled = value);
}