// 模拟数据
const mockTasks = [
    {
        id: 1,
        name: '申请户流转',
        description: '财税代理客户经营中心-深圳-中小企业客群经营中心',
        customerType: '单位客户',
        createTime: '2025-04-17 17:55:24',
        deadline: '2025-04-24 17:55:24',
        completeTime: '-',
        initiator: '华南-李经理',
        currentHandler: {
            name: '王经理',
            region: '华南',
            allHandlers: {
                '华南': ['王经理', '李总监'],
                '华东': ['张经理', '钱经理'],
                '西南': ['赵经理']
            }
        },
        status: 'pending',
        taskCategory: 'my',
        approvalStatus: 'pending'
    },
    {
        id: 2,
        name: '财税代理审批',
        description: '财税代理客户经营中心-广州-小企业客群经营中心',
        customerType: '单位客户',
        createTime: '2025-04-15 10:30:00',
        deadline: '2025-04-22 10:30:00',
        completeTime: '2025-04-16 15:20:30',
        initiator: '华南-张经理',
        currentHandler: {
            name: '李总监',
            region: '华南',
            allHandlers: {
                '华南': ['李总监', '王经理']
            }
        },
        status: 'completed',
        taskCategory: 'approve',
        approvalStatus: 'approved',
        successCount: 45,
        failCount: 3
    },
    {
        id: 3,
        name: '客户迁移申请',
        description: '中小企业客群经营中心-成都-代理记账中心',
        customerType: '个人客户',
        createTime: '2025-04-14 09:15:00',
        deadline: '2025-04-21 09:15:00',
        completeTime: '-',
        initiator: '西南-周经理',
        currentHandler: {
            name: '王经理',
            region: '华南',
            allHandlers: ['华南-王经理', '华东-张经理']
        },
        status: 'pending',
        taskCategory: 'approve',
        approvalStatus: 'pending'
    },
    {
        id: 4,
        name: '代理记账申请',
        description: '代理记账中心-深圳-小微企业服务中心',
        customerType: '单位客户',
        createTime: '2025-04-10 14:20:00',
        deadline: '2025-04-17 14:20:00',
        completeTime: '2025-04-16 16:30:00',
        initiator: '华南-刘经理',
        currentHandler: {
            name: '王经理',
            region: '华南',
            allHandlers: ['华南-王经理']
        },
        status: 'completed',
        taskCategory: 'approve',
        approvalStatus: 'rejected'
    },
    {
        id: 5,
        name: '企业年报提醒',
        description: '财税服务中心-北京-大企业服务部',
        customerType: '单位客户',
        createTime: '2025-04-16 09:00:00',
        deadline: '2025-04-23 09:00:00',
        completeTime: '-',
        initiator: '华北-赵经理',
        currentHandler: {
            name: '李经理',
            region: '华北',
            allHandlers: ['华北-李经理', '华北-王经理']
        },
        status: 'pending',
        taskCategory: 'my',
        approvalStatus: 'pending'
    },
    {
        id: 6,
        name: '税务稽查协助',
        description: '税务服务中心-上海-大企业税收管理部',
        customerType: '单位客户',
        createTime: '2025-04-15 11:30:00',
        deadline: '2025-04-22 11:30:00',
        completeTime: '2025-04-16 14:20:00',
        initiator: '华东-钱经理',
        currentHandler: {
            name: '张总监',
            region: '华东',
            allHandlers: ['华东-张总监', '华南-李总监']
        },
        status: 'completed',
        taskCategory: 'approve',
        approvalStatus: 'approved'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Bootstrap 工具提示
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // 初始化模态框实例
    const approvalDetailModal = new bootstrap.Modal(document.getElementById('approvalDetailModal'));
    const approvalConfirmModal = new bootstrap.Modal(document.getElementById('approvalConfirmModal'));
    
    // 初始化创建任务表单
    const createTaskForm = document.getElementById('createTaskForm');
    const fileUpload = document.getElementById('fileUpload');
    const uploadArea = document.querySelector('.upload-area');
    const fileList = document.getElementById('fileList');
    const fileItems = fileList.querySelector('.file-items');
    const parseResult = document.getElementById('parseResult');
    const uploadButton = document.getElementById('uploadButton');

    // 处理文件选择
    fileUpload.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleFiles(this.files);
        }
    });

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#1890ff';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#dee2e6';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#dee2e6';
        
        if (fileList.classList.contains('d-none')) {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFiles(files);
            }
        }
    });

    // 处理文件上传
    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        
        // 显示文件列表
        fileList.classList.remove('d-none');
        fileList.innerHTML = `
            <div class="file-item d-flex align-items-center p-2 bg-light rounded">
                <i class="bi bi-file-earmark-excel me-2 text-success"></i>
                <span class="file-name flex-grow-1">${file.name}</span>
                <button type="button" class="btn btn-link text-danger p-0" onclick="removeFile()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
        // 禁用上传按钮和区域
        uploadButton.disabled = true;
        uploadArea.style.opacity = '0.5';
        uploadArea.style.pointerEvents = 'none';
        
        // 模拟文件解析
        setTimeout(() => {
            // 显示解析结果
            parseResult.classList.remove('d-none');
            
            // 模拟解析数据
            const mockData = {
                regions: [
                    {
                        name: '河北大区客户',
                        successCount: 45,
                        failCount: 3,
                        approvers: [
                            { name: '王经理', title: '经理' },
                            { name: '李总监', title: '总监' }
                        ]
                    },
                    {
                        name: '江浙沪大区客户',
                        successCount: 38,
                        failCount: 2,
                        approvers: [
                            { name: '张经理', title: '经理' }
                        ]
                    },
                    {
                        name: '广东大区客户',
                        successCount: 42,
                        failCount: 1,
                        approvers: [
                            { name: '陈经理', title: '经理' },
                            { name: '黄总监', title: '总监' },
                            { name: '刘主管', title: '主管' }
                        ]
                    }
                ]
            };
            
            // 渲染解析结果
            parseResult.innerHTML = mockData.regions.map(region => `
                <div class="parse-region mb-4">
                    <h6 class="mb-3">${region.name}</h6>
                    <div class="bg-white p-4 rounded">
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="text-primary" style="font-size: 24px; font-weight: bold;">${region.successCount}</div>
                                <div class="text-muted">成功数量</div>
                            </div>
                            <div class="col">
                                <div class="text-danger" style="font-size: 24px; font-weight: bold;">${region.failCount}</div>
                                <div class="text-muted">失败数量</div>
                                <button class="btn btn-outline-danger btn-sm mt-2">
                                    <i class="bi bi-download"></i> 下载失败文件
                                </button>
                            </div>
                            <div class="col text-end">
                                <div class="mb-2">
                                    ${region.approvers.map(approver => 
                                        `<span class="badge bg-light text-dark me-1">${approver.name}</span>`
                                    ).join('')}
                                </div>
                                <div class="text-muted">审批人</div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            
        }, 1000);
    }

    // 处理表单提交
    createTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // TODO: 处理表单提交逻辑
        console.log('提交任务', Object.fromEntries(formData.entries()));
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));
        modal.hide();
        
        // 重置表单和文件列表
        this.reset();
        resetFileUpload();
    });
    
    // 监听筛选表单提交
    document.getElementById('filterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        // 这里可以添加筛选逻辑
        renderTaskList(mockTasks);
    });
    
    // 初始渲染任务列表
    renderTaskList(mockTasks);
});

// 任务状态映射
const STATUS_MAP = {
    'pending': { text: '未处理', class: 'badge bg-warning' },
    'completed': { text: '已处理', class: 'badge bg-success' },
    'overdue': { text: '逾期处理', class: 'badge bg-danger' }
};

function renderTaskList(tasks) {
    const tbody = document.getElementById('taskList');
    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.taskCategory === 'my' ? '我发起的' : '我审批的'}</td>
            <td>${task.name}</td>
            <td class="task-description" title="${task.description}">
                ${task.description}
            </td>
            <td>${task.createTime}</td>
            <td>${task.deadline}</td>
            <td>${task.completeTime || '-'}</td>
            <td>${task.initiator}</td>
            <td>
                <a href="javascript:void(0)" class="text-primary" style="text-decoration: none;" onclick="showHandlers(${task.id})">
                    点击查看
                </a>
            </td>
            <td>
                <span class="${STATUS_MAP[task.status].class}">
                    ${STATUS_MAP[task.status].text}
                </span>
            </td>
            <td>
                <a href="javascript:void(0)" class="text-primary" style="text-decoration: none;" onclick="showTaskDetail(${task.id})">
                    查看处理
                </a>
            </td>
        </tr>
    `).join('');

    // 初始化所有tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

function showTaskDetail(taskId) {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    const detailModal = new bootstrap.Modal(document.getElementById('approvalDetailModal'));
    
    // 更新模态框标题和描述
    document.getElementById('taskTitle').textContent = task.name;
    document.getElementById('taskDesc').textContent = task.description;
    
    const approvalResult = document.getElementById('approvalResult');
    const approvalContent = document.getElementById('approvalContent');
    
    if (task.status === 'completed') {
        // 已处理任务 - 显示审批结果
        approvalResult.style.display = 'block';
        approvalContent.style.display = 'none';
        
        if (task.approvalStatus === 'approved') {
            if (task.failCount > 0) {
                // 审批同意但有失败记录
                approvalResult.innerHTML = `
                    <div class="alert alert-warning">
                        <h6 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> 审批同意（部分失败）</h6>
                        <p class="mb-2">任务划分失败 ${task.failCount} 条记录。</p>
                        <button class="btn btn-warning btn-sm" onclick="downloadFailedRecords()">
                            <i class="bi bi-download"></i> 下载失败记录
                        </button>
                    </div>
                `;
            } else {
                // 审批同意且全部成功
                approvalResult.innerHTML = `
                    <div class="alert alert-success">
                        <h6 class="alert-heading"><i class="bi bi-check-circle"></i> 审批同意</h6>
                        <p class="mb-0">任务已成功划分。</p>
                    </div>
                `;
            }
        } else if (task.approvalStatus === 'rejected') {
            // 审批拒绝
            approvalResult.innerHTML = `
                <div class="alert alert-danger">
                    <h6 class="alert-heading"><i class="bi bi-x-circle"></i> 审批拒绝</h6>
                    <p class="mb-0">任务被拒绝。</p>
                </div>
            `;
        } else {
            // 正在审批中
            approvalResult.innerHTML = `
                <div class="alert alert-info">
                    <h6 class="alert-heading"><i class="bi bi-clock"></i> 正在审批中</h6>
                    <p class="mb-0">任务正在审批中，请耐心等待。</p>
                </div>
            `;
        }
    } else if (task.taskCategory === 'approve') {
        // 我审批的未处理任务 - 显示审批界面
        approvalResult.style.display = 'none';
        approvalContent.style.display = 'block';
        updateCustomerList(task);
        // 显示操作区
        document.getElementById('approvalActions').style.display = 'block';
    } else {
        // 我发起的未处理任务 - 显示审批中状态
        approvalResult.style.display = 'block';
        approvalContent.style.display = 'none';
        approvalResult.innerHTML = `
            <div class="alert alert-info">
                <h6 class="alert-heading"><i class="bi bi-clock"></i> 正在审批中</h6>
                <p class="mb-0">任务正在审批中，请耐心等待。</p>
            </div>
        `;
    }
    
    detailModal.show();
}

function showApprovalConfirm(action) {
    const approvalConfirmModal = new bootstrap.Modal(document.getElementById('approvalConfirmModal'));
    document.getElementById('approvalConfirmText').textContent = 
        `是否确认${action === 'approve' ? '同意' : '拒绝'}该任务？`;
    
    // 更新确认按钮的点击事件
    const confirmButton = document.querySelector('#approvalConfirmModal .btn-primary');
    confirmButton.onclick = () => {
        // 关闭确认模态框
        approvalConfirmModal.hide();
        
        // 显示第二次确认
        setTimeout(() => {
            const secondConfirmModal = new bootstrap.Modal(document.getElementById('approvalConfirmModal'));
            document.getElementById('approvalConfirmText').textContent = 
                `请再次确认是否${action === 'approve' ? '同意' : '拒绝'}该任务？`;
            
            confirmButton.onclick = () => {
                // 这里添加实际的审批处理逻辑
                secondConfirmModal.hide();
                // 关闭任务详情模态框
                const detailModal = bootstrap.Modal.getInstance(document.getElementById('taskDetailModal'));
                if (detailModal) {
                    detailModal.hide();
                }
                // 刷新任务列表
                renderTaskList(mockTasks);
            };
            
            secondConfirmModal.show();
        }, 500);
    };
    
    approvalConfirmModal.show();
}

function updateCustomerList(task) {
    const customerList = document.getElementById('customerList');
    // 模拟客户数据
    const customers = [
        {
            name: '深圳市某科技有限公司',
            taxId: '91440300MA5FXXXXX5R',
            manager: '张三'
        },
        {
            name: '广州市某贸易有限公司',
            taxId: '91440100MA5EXXXXX2M',
            manager: '李四'
        }
    ];
    
    customerList.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.taxId}</td>
            <td>${customer.manager}</td>
        </tr>
    `).join('');
}

function downloadFailedRecords() {
    // 这里添加下载失败记录的逻辑
    alert('开始下载失败记录');
}

// 移除文件
function removeFile() {
    const fileList = document.getElementById('fileList');
    const parseResult = document.getElementById('parseResult');
    const fileUpload = document.getElementById('fileUpload');
    const uploadButton = document.getElementById('uploadButton');
    const uploadArea = document.querySelector('.upload-area');
    
    // 清空文件选择
    fileUpload.value = '';
    
    // 隐藏文件列表和解析结果
    fileList.classList.add('d-none');
    parseResult.classList.add('d-none');
    
    // 启用上传按钮和区域
    uploadButton.disabled = false;
    uploadArea.style.opacity = '';
    uploadArea.style.pointerEvents = '';
}

// 重置文件上传状态
function resetFileUpload() {
    const fileList = document.getElementById('fileList');
    const parseResult = document.getElementById('parseResult');
    const fileUpload = document.getElementById('fileUpload');
    const uploadButton = document.getElementById('uploadButton');
    const uploadArea = document.querySelector('.upload-area');
    
    // 清空文件选择
    fileUpload.value = '';
    
    // 隐藏文件列表和解析结果
    fileList.classList.add('d-none');
    parseResult.classList.add('d-none');
    
    // 清空内容
    fileList.querySelector('.file-items').innerHTML = '';
    
    // 启用上传按钮和区域
    uploadButton.disabled = false;
    uploadArea.style.opacity = '';
    uploadArea.style.pointerEvents = '';
}

// 页面加载完成后显示任务列表
document.addEventListener('DOMContentLoaded', () => {
    renderTaskList(mockTasks);
});

function showHandlers(taskId) {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    const handlersModal = new bootstrap.Modal(document.getElementById('handlersModal'));
    const handlersContent = document.getElementById('handlersContent');
    
    handlersContent.innerHTML = Object.entries(task.currentHandler.allHandlers)
        .map(([region, handlers]) => `
            <div class="handlers-region mb-3">
                <div class="region-header mb-2">
                    <span class="region-badge">
                        ${region}
                    </span>
                </div>
                <div class="handlers-list">
                    ${handlers.map(handler => `
                        <div class="handler-item">
                            <i class="bi bi-person-circle me-2"></i>
                            ${handler}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    
    handlersModal.show();
}

// 获取状态样式类
function getStatusClass(status) {
    switch(status) {
        case 'pending':
            return 'status-pending';
        case 'completed':
            return 'status-completed';
        case 'overdue':
            return 'status-overdue';
        default:
            return '';
    }
}

// 获取状态文本
function getStatusText(status) {
    switch(status) {
        case 'pending':
            return '未处理';
        case 'completed':
            return '已处理';
        case 'overdue':
            return '逾期处理';
        default:
            return '';
    }
}

// 添加新的样式到页面
const style = document.createElement('style');
style.textContent = `
    .handlers-region {
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .region-badge {
        background: #f0f5ff;
        color: #1890ff;
        padding: 4px 12px;
        border-radius: 4px;
        font-weight: 500;
        font-size: 14px;
    }
    
    .handlers-list {
        margin-top: 12px;
    }
    
    .handler-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        color: #333;
        border-radius: 4px;
        transition: all 0.3s;
        margin-bottom: 4px;
    }
    
    .handler-item:hover {
        background: #f5f5f5;
    }
    
    .handler-item i {
        color: #666;
        font-size: 16px;
    }
    
    #handlersModal .modal-dialog {
        max-width: 400px;
    }
    
    #handlersModal .modal-header {
        border-bottom: 1px solid #f0f0f0;
        padding: 16px 24px;
    }
    
    #handlersModal .modal-body {
        padding: 20px;
    }
    
    #handlersModal .modal-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
    }
`;

document.head.appendChild(style); 