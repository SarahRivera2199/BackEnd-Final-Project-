const API = "http://localhost:3000";
const token = localStorage.getItem("token");

let editingTaskId = null;

if (!token) {
    alert("You must log in first");
    window.location.href = "login.html";
}

window.onload = () => {
    loadTasks().catch(() => {});
};

//---- New Task Panel - Open & Close ----
function openPanel() {
    document.getElementById("create-panel").classList.add("open");
    document.getElementById("panel-title").textContent = "New Task";
    document.getElementById("submit-btn").textContent = "Add Task";

    //Clear Inputs & Messages
    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("task-status").value = "pending";
    document.getElementById("task-date").value = "";

    editingTaskId = null;
    clearMessages();
}

function closePanel() {
    document.getElementById("create-panel").classList.remove("open");
}

//---- Load Tasks ----
async function loadTasks() {
    try {
        //---- Read Filters ----
        const status = document.getElementById("filter-status")?.value;
        const date = document.getElementById("filter-date")?.value;

        let url = `${API}/api/tasks`;
        const params = [];

        if(status) params.push(`status=${status}`);
        if(date) params.push(`date=${date}`);

        if(params.length > 0) {
            url += "?" + params.join("&")
        }

        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const tasks = await res.json();

        const container = document.getElementById("task-list");
        container.innerHTML = "";

        if (tasks.length === 0) {
            container.innerHTML = "<p>No tasks yet.</p>";
            return;
        }

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task-card";

            div.innerHTML = `
                <strong>${task.title}</strong><br>
                ${task.task_description || ""}<br>
                <small>${task.task_status}</small><br>
                <small>Due: ${task.due_date ? task.due_date.split("T")[0] : "No date"}</small><br>
                <div class="task-acts">
                    <button class="task-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="task-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;

            container.appendChild(div);
        });

    } catch  {
        console.error("Error loading tasks", err);
    }
}

//---- Create Task ----
async function createTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const status = document.getElementById("task-status").value;
    const due_date = document.getElementById("task-date").value;

    clearMessages();

    if (!title) {
        setError("Title required");
        return;
    }

    try {
        const url = editingTaskId
            ? `${API}/api/tasks/${editingTaskId}` : `${API}/api/tasks`;

        const method = editingTaskId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, status, due_date })
        });

        if (res.status === 201 || res.status === 200) {
            setSuccess(editingTaskId ? "Task updated!" : "Task added!");
            editingTaskId = null;
            loadTasks();
            closePanel();
        } else {
            setError("Failed to save task");
        }

    } catch {
        setError("Server error");
    }
}

//---- Modify Tasks ----
async function editTask(id) {
    try {
        const res =  await fetch(`${API}/api/tasks/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const task = await res.json();

    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.task_description || "";
    document.getElementById("task-status").value = task.task_status;
    document.getElementById("task-date").value = task.due_date?.split("T")[0] || "";

    editingTaskId = id;

    document.getElementById("panel-title").textContent = "Edit Task";
    document.getElementById("submit-btn").textContent = "Update Task";
    document.getElementById("create-panel").classList.add("open");
    
    } catch (err) {
        console.error("Error loading task", err)
    }
}

//---- Delete Task ----
async function deleteTask(id) {
    await fetch(`${API}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadTasks();
}

function clearMessages() {
    document.getElementById('auth-error').textContent = '';
    document.getElementById('auth-success').textContent = '';
}

function setError(msg) {
    const el = document.getElementById('auth-error');
    if(!el) {
        console.warn("auth-error element not found");
        return;
    }
    el.textContent = msg;
}

function setSuccess(msg) {
    const el = document.getElementById('auth-success');
    if(!el) {
        console.warn("auth-success element not found");
        return
    }
    el.textContent = msg;
}
