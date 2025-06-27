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
    tasks.forEach(function(task) {
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
    span.onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
        removeTaskFromStorage(taskName);
    }

    // Add click event to toggle checked class
    li.onclick = function() {
        li.classList.toggle('checked');
        updateTaskInStorage(taskName, li.classList.contains('checked'));
    }
}

// Function to remove a task from local storage
function removeTaskFromStorage(taskName) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(function(task) {
        return task.name !== taskName;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to update task completion status in local storage
function updateTaskInStorage(taskName, isCompleted) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function(task) {
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

    tasks.forEach(function(task) {
        if (filter === "all" || (filter === "completed" && task.completed) || (filter === "active" && !task.completed)) {
            addTaskToDOM(task.name, task.completed);
        }
    });
}

// Load tasks from local storage when the page loads
window.onload = loadTasks;

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
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