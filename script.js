document.addEventListener('DOMContentLoaded', function() {
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks-list');
    const completedList = document.getElementById('completed-list');
    loadTasks();
    addTaskBtn.addEventListener('click', addTask);

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const taskItem = createTaskItem(taskText);
            tasksList.appendChild(taskItem);
            saveTasks();
            newTaskInput.value = '';
        }
    }

    function createTaskItem(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.addEventListener('click', () => completeTask(li));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(li));

        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(deleteBtn);
        li.appendChild(buttonsDiv);

        return li;
    }

    function completeTask(taskItem) {
        taskItem.classList.add('completed');
        completedList.appendChild(taskItem);
        saveTasks();
    }

    function deleteTask(taskItem) {
        taskItem.remove();
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        tasksList.querySelectorAll('li').forEach(task => {
            tasks.push({ text: task.childNodes[0].nodeValue, completed: false });
        });
        completedList.querySelectorAll('li').forEach(task => {
            tasks.push({ text: task.childNodes[0].nodeValue, completed: true });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text);
            if (task.completed) {
                taskItem.classList.add('completed');
                completedList.appendChild(taskItem);
            } else {
                tasksList.appendChild(taskItem);
            }
        });
    }

    async function fetchSampleTasks() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
            const sampleTasks = await response.json();
            sampleTasks.forEach(task => {
                const taskItem = createTaskItem(task.title);
                if (task.completed) {
                    taskItem.classList.add('completed');
                    completedList.appendChild(taskItem);
                } else {
                    tasksList.appendChild(taskItem);
                }
            });
            saveTasks();
        } catch (error) {
            console.error('Error fetching sample tasks:', error);
        }
    }

    fetchSampleTasks();
});
