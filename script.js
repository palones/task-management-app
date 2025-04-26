// 处理上传的文件
function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // 显示文件列表
    fileList.innerHTML = '';
    fileList.classList.remove('d-none');
    
    // 创建文件项
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    
    const fileIcon = document.createElement('i');
    fileIcon.className = 'bi bi-file-earmark file-icon';
    
    fileName.appendChild(fileIcon);
    fileName.appendChild(document.createTextNode(file.name));
    
    // 添加删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-link text-danger p-0 ms-3';
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.onclick = function() {
        fileList.classList.add('d-none');
        fileList.innerHTML = '';
        fileUpload.value = '';
        dropArea.classList.remove('d-none');
        parseResult.classList.add('d-none');
        btnSubmit.disabled = true;
    };
    
    fileName.appendChild(deleteBtn);
    fileItem.appendChild(fileName);
    fileList.appendChild(fileItem);
    
    // 禁用上传区域
    dropArea.classList.add('d-none');
    
    // 显示加载状态
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.innerHTML = '<div class="text-center p-3"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">正在解析文件，请稍候...</p></div>';
    taskForm.appendChild(loadingDiv);
    
    // 模拟文件处理
    setTimeout(() => {
        document.getElementById('loadingIndicator').remove();
        
        // 显示解析结果
        parseResult.classList.remove('d-none');
        
        // 获取子任务容器
        const subTasksContainer = document.getElementById('subTasksContainer');
        subTasksContainer.innerHTML = '';
        
        // 模拟3个子任务
        const subTasks = [
            { 
                name: '河北大区客户', 
                success: 45, 
                fail: 3,
                approvers: ['王经理', '李总监']
            },
            { 
                name: '江浙沪大区客户', 
                success: 38, 
                fail: 2,
                approvers: ['张经理']
            },
            { 
                name: '广东大区客户', 
                success: 42, 
                fail: 1,
                approvers: ['陈经理', '黄总监', '刘主管']
            }
        ];
        
        // 为每个子任务创建结果卡片
        subTasks.forEach((task, index) => {
            const taskCard = document.createElement('div');
            taskCard.className = 'card mb-3';
            taskCard.innerHTML = `
                <div class="card-header">
                    <h6 class="mb-0">${task.name}</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="text-center">
                                <h2 class="text-primary mb-2">${task.success}</h2>
                                <p class="text-muted mb-0">成功数量</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <h2 class="text-danger mb-2">${task.fail}</h2>
                                <p class="text-muted mb-0">失败数量</p>
                                ${task.fail > 0 ? `
                                    <a href="#" class="btn btn-sm btn-outline-danger mt-2 download-failed-btn" data-task-index="${index}">
                                        <i class="bi bi-download"></i> 下载失败文件
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <div class="approver-container">
                                    ${task.approvers.map(approver => `
                                        <span class="approver-badge">
                                            <i class="bi bi-person-check"></i> ${approver}
                                        </span>
                                    `).join('')}
                                </div>
                                <p class="text-muted mb-0">审批人</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            subTasksContainer.appendChild(taskCard);
        });
        
        // 绑定下载失败文件按钮事件
        document.querySelectorAll('.download-failed-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const taskIndex = this.getAttribute('data-task-index');
                alert(`正在下载 ${subTasks[taskIndex].name} 的失败文件`);
            });
        });
        
        btnSubmit.disabled = false;
    }, 1500);
}

// 重置表单状态
function resetFormState() {
    taskForm.reset();
    fileList.classList.add('d-none');
    fileList.innerHTML = '';
    fileUpload.value = '';
    dropArea.classList.remove('d-none');
    parseResult.classList.add('d-none');
    btnSubmit.disabled = true;
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.getElementById('fileUpload');
    const dropArea = document.getElementById('dropArea');
    const fileList = document.getElementById('fileList');
    const btnSubmit = document.getElementById('btnSubmit');
    const parseResult = document.getElementById('parseResult');
    const taskForm = document.getElementById('taskForm');
    
    // 拖拽上传
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.style.borderColor = '#007bff';
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.style.borderColor = '#ced4da';
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.style.borderColor = '#ced4da';
        handleFiles(e.dataTransfer.files);
    });
    
    // 点击上传
    fileUpload.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // 表单提交
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('任务提交成功！');
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        
        // 重置表单
        resetFormState();
    });
});